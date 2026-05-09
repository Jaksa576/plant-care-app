import type { SupabaseClient } from "@supabase/supabase-js";

import { getGoogleCalendarConfig } from "@/lib/env";
import {
  getGoogleCalendarConnection,
  deleteGoogleCalendarEventLinkForReminder,
  getGoogleCalendarEventLinkForReminder,
  updateGoogleCalendarConnectionSyncStatus,
  updateGoogleCalendarEventLinkStatus,
  upsertGoogleCalendarEventLink,
} from "@/lib/google-calendar/data";
import { decryptText } from "@/lib/google-calendar/crypto";
import {
  createGoogleCalendarEvent,
  deleteGoogleCalendarEvent,
  refreshGoogleAccessToken,
  updateGoogleCalendarEvent,
} from "@/lib/google-calendar/google";
import { getPlantPrimaryLabel } from "@/lib/plants/presenters";
import type { PlantRecord, WateringReminderRecord } from "@/lib/plants/types";

type CalendarSyncClient = SupabaseClient;

export type CalendarSyncResult = {
  status: "success" | "error" | "not_configured" | "not_connected" | "not_ready";
  message: string;
};

function getSafeError(error: string | null) {
  if (!error) {
    return "Google Calendar is unavailable right now.";
  }

  return error.length > 180 ? `${error.slice(0, 177)}...` : error;
}

async function getGoogleAccessTokenForConnection(
  supabase: CalendarSyncClient,
  userId: string,
): Promise<
  | { accessToken: string; calendarId: string; error: null }
  | { accessToken: null; calendarId: string | null; error: string }
> {
  const config = getGoogleCalendarConfig();

  if (!config) {
    return {
      accessToken: null,
      calendarId: null,
      error:
        "Google Calendar sync is not configured. Add the Google OAuth and token encryption environment variables on the server.",
    };
  }

  const connectionResult = await getGoogleCalendarConnection(supabase, userId);
  const connection = connectionResult.data;

  if (connectionResult.error || !connection) {
    return {
      accessToken: null,
      calendarId: null,
      error: "Connect Google Calendar before syncing this reminder.",
    };
  }

  let refreshToken: string;

  try {
    refreshToken = decryptText(
      connection.encrypted_refresh_token,
      connection.token_iv,
      connection.token_auth_tag,
      config.tokenEncryptionKey,
    );
  } catch {
    await updateGoogleCalendarConnectionSyncStatus(supabase, userId, {
      status: "error",
      error: "Stored Google token could not be read.",
    });

    return {
      accessToken: null,
      calendarId: connection.calendar_id,
      error: "Google Calendar needs to be reconnected before this reminder can sync.",
    };
  }

  const accessTokenResult = await refreshGoogleAccessToken(config, refreshToken);

  if (accessTokenResult.error || !accessTokenResult.data?.access_token) {
    const error = getSafeError(accessTokenResult.error);
    await updateGoogleCalendarConnectionSyncStatus(supabase, userId, {
      status: "error",
      error,
    });

    return {
      accessToken: null,
      calendarId: connection.calendar_id,
      error: "We couldn't update Google Calendar. Your Plant Care reminder is still saved.",
    };
  }

  return {
    accessToken: accessTokenResult.data.access_token,
    calendarId: connection.calendar_id,
    error: null,
  };
}

function getEventDescription() {
  return [
    "Created from Plant Care.",
    "Plant Care remains the source of truth for this watering reminder.",
  ].join("\n");
}

export async function syncWateringReminderToGoogleCalendar(
  supabase: CalendarSyncClient,
  userId: string,
  plant: PlantRecord,
  reminder: WateringReminderRecord | null,
): Promise<CalendarSyncResult> {
  const config = getGoogleCalendarConfig();

  if (!config) {
    return {
      status: "not_configured",
      message:
        "Google Calendar sync is not configured. Add the Google OAuth and token encryption environment variables on the server.",
    };
  }

  if (!reminder?.enabled || !reminder.next_reminder_date) {
    return {
      status: "not_ready",
      message: "Turn on a Plant Care watering reminder with a next date before syncing.",
    };
  }

  const accessTokenResult = await getGoogleAccessTokenForConnection(supabase, userId);

  if (accessTokenResult.error || !accessTokenResult.accessToken) {
    const message = accessTokenResult.error ?? "Google Calendar is unavailable right now.";

    return {
      status: message.startsWith("Connect") ? "not_connected" : "error",
      message,
    };
  }

  const linkResult = await getGoogleCalendarEventLinkForReminder(
    supabase,
    userId,
    reminder.id,
  );
  const existingLink = linkResult.data;
  const calendarId = existingLink?.calendar_id ?? accessTokenResult.calendarId ?? config.calendarId;
  const eventInput = {
    eventId: existingLink?.google_event_id,
    title: `Water ${getPlantPrimaryLabel(plant)}`,
    description: getEventDescription(),
    date: reminder.next_reminder_date,
  };
  const eventResult = existingLink
    ? await updateGoogleCalendarEvent(accessTokenResult.accessToken, calendarId, eventInput)
    : await createGoogleCalendarEvent(accessTokenResult.accessToken, calendarId, eventInput);

  if (eventResult.error || !eventResult.data?.id) {
    const error = getSafeError(eventResult.error);
    await updateGoogleCalendarConnectionSyncStatus(supabase, userId, {
      status: "error",
      error,
    });

    if (existingLink) {
      await updateGoogleCalendarEventLinkStatus(supabase, userId, reminder.id, {
        status: "error",
        error,
      });
    }

    return {
      status: "error",
      message: "We couldn't update Google Calendar. Your Plant Care reminder is still saved.",
    };
  }

  const upsertResult = await upsertGoogleCalendarEventLink(supabase, userId, {
    reminderId: reminder.id,
    eventId: eventResult.data.id,
    calendarId,
    status: "success",
    error: null,
  });

  if (upsertResult.error) {
    await updateGoogleCalendarConnectionSyncStatus(supabase, userId, {
      status: "error",
      error: upsertResult.error,
    });

    return {
      status: "error",
      message:
        "Google Calendar was updated, but Plant Care could not save the sync status.",
    };
  }

  await updateGoogleCalendarConnectionSyncStatus(supabase, userId, {
    status: "success",
    error: null,
  });

  return {
    status: "success",
    message: "Google Calendar updated from this Plant Care reminder.",
  };
}

export async function removeWateringReminderFromGoogleCalendar(
  supabase: CalendarSyncClient,
  userId: string,
  reminderId: string,
): Promise<CalendarSyncResult> {
  const linkResult = await getGoogleCalendarEventLinkForReminder(supabase, userId, reminderId);
  const link = linkResult.data;

  if (!link) {
    return {
      status: "success",
      message: "Google Calendar has no linked event for this reminder.",
    };
  }

  const accessTokenResult = await getGoogleAccessTokenForConnection(supabase, userId);

  if (accessTokenResult.error || !accessTokenResult.accessToken) {
    await updateGoogleCalendarEventLinkStatus(supabase, userId, reminderId, {
      status: "cleanup_warning",
      error: accessTokenResult.error ?? "Google Calendar is unavailable right now.",
    });

    return {
      status: "error",
      message:
        "Plant Care reminder changed, but Google Calendar cleanup needs another sync attempt.",
    };
  }

  const deleteResult = await deleteGoogleCalendarEvent(
    accessTokenResult.accessToken,
    link.calendar_id,
    link.google_event_id,
  );

  if (deleteResult.error) {
    await updateGoogleCalendarEventLinkStatus(supabase, userId, reminderId, {
      status: "cleanup_warning",
      error: getSafeError(deleteResult.error),
    });

    return {
      status: "error",
      message:
        "Plant Care reminder changed, but Google Calendar cleanup needs another sync attempt.",
    };
  }

  await deleteGoogleCalendarEventLinkForReminder(supabase, userId, reminderId);

  return {
    status: "success",
    message: "Linked Google Calendar event removed.",
  };
}

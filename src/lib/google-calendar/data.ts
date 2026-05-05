import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  GoogleCalendarConnectionRecord,
  GoogleCalendarEventLinkRecord,
} from "@/lib/plants/types";

type CalendarClient = SupabaseClient;

export type CalendarDataResult<T> = {
  data: T | null;
  error: string | null;
};

function getCalendarErrorMessage(fallback: string, error?: { message?: string } | null) {
  const message = error?.message?.trim();
  return message ? `${fallback} ${message}` : fallback;
}

export async function getGoogleCalendarConnection(
  supabase: CalendarClient,
  userId: string,
): Promise<CalendarDataResult<GoogleCalendarConnectionRecord | null>> {
  const { data, error } = await supabase
    .from("google_calendar_connections")
    .select("*")
    .eq("user_id", userId)
    .eq("provider", "google")
    .maybeSingle();

  if (error) {
    return {
      data: null,
      error: getCalendarErrorMessage("We couldn't load Google Calendar status.", error),
    };
  }

  return {
    data: (data as GoogleCalendarConnectionRecord | null) ?? null,
    error: null,
  };
}

export async function upsertGoogleCalendarConnection(
  supabase: CalendarClient,
  userId: string,
  input: {
    encryptedRefreshToken: string;
    tokenIv: string;
    tokenAuthTag: string;
    calendarId: string;
  },
): Promise<CalendarDataResult<GoogleCalendarConnectionRecord>> {
  const { data, error } = await supabase
    .from("google_calendar_connections")
    .upsert(
      {
        user_id: userId,
        provider: "google",
        encrypted_refresh_token: input.encryptedRefreshToken,
        token_iv: input.tokenIv,
        token_auth_tag: input.tokenAuthTag,
        calendar_id: input.calendarId,
        connected_at: new Date().toISOString(),
        last_sync_status: "idle",
        last_sync_error: null,
      },
      { onConflict: "user_id,provider" },
    )
    .select("*")
    .single();

  if (error) {
    return {
      data: null,
      error: getCalendarErrorMessage("We couldn't save Google Calendar connection.", error),
    };
  }

  return {
    data: data as GoogleCalendarConnectionRecord,
    error: null,
  };
}

export async function updateGoogleCalendarConnectionSyncStatus(
  supabase: CalendarClient,
  userId: string,
  input: {
    status: GoogleCalendarConnectionRecord["last_sync_status"];
    error: string | null;
  },
): Promise<CalendarDataResult<GoogleCalendarConnectionRecord | null>> {
  const { data, error } = await supabase
    .from("google_calendar_connections")
    .update({
      last_sync_status: input.status,
      last_sync_error: input.error,
      last_synced_at: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .eq("provider", "google")
    .select("*")
    .maybeSingle();

  if (error) {
    return {
      data: null,
      error: getCalendarErrorMessage("We couldn't update Google Calendar status.", error),
    };
  }

  return {
    data: (data as GoogleCalendarConnectionRecord | null) ?? null,
    error: null,
  };
}

export async function deleteGoogleCalendarConnection(
  supabase: CalendarClient,
  userId: string,
): Promise<CalendarDataResult<null>> {
  const { error } = await supabase
    .from("google_calendar_connections")
    .delete()
    .eq("user_id", userId)
    .eq("provider", "google");

  if (error) {
    return {
      data: null,
      error: getCalendarErrorMessage("We couldn't disconnect Google Calendar.", error),
    };
  }

  return {
    data: null,
    error: null,
  };
}

export async function getGoogleCalendarEventLinkForReminder(
  supabase: CalendarClient,
  userId: string,
  reminderId: string,
): Promise<CalendarDataResult<GoogleCalendarEventLinkRecord | null>> {
  const { data, error } = await supabase
    .from("google_calendar_event_links")
    .select("*")
    .eq("user_id", userId)
    .eq("reminder_id", reminderId)
    .maybeSingle();

  if (error) {
    return {
      data: null,
      error: getCalendarErrorMessage("We couldn't load Google Calendar event status.", error),
    };
  }

  return {
    data: (data as GoogleCalendarEventLinkRecord | null) ?? null,
    error: null,
  };
}

export async function listGoogleCalendarEventLinksForUser(
  supabase: CalendarClient,
  userId: string,
): Promise<CalendarDataResult<GoogleCalendarEventLinkRecord[]>> {
  const { data, error } = await supabase
    .from("google_calendar_event_links")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    return {
      data: null,
      error: getCalendarErrorMessage("We couldn't load Google Calendar event links.", error),
    };
  }

  return {
    data: (data as GoogleCalendarEventLinkRecord[]) ?? [],
    error: null,
  };
}

export async function upsertGoogleCalendarEventLink(
  supabase: CalendarClient,
  userId: string,
  input: {
    reminderId: string;
    eventId: string;
    calendarId: string;
    status: GoogleCalendarEventLinkRecord["last_sync_status"];
    error: string | null;
  },
): Promise<CalendarDataResult<GoogleCalendarEventLinkRecord>> {
  const { data, error } = await supabase
    .from("google_calendar_event_links")
    .upsert(
      {
        user_id: userId,
        reminder_id: input.reminderId,
        google_event_id: input.eventId,
        calendar_id: input.calendarId,
        last_sync_status: input.status,
        last_sync_error: input.error,
        last_synced_at: new Date().toISOString(),
      },
      { onConflict: "user_id,reminder_id" },
    )
    .select("*")
    .single();

  if (error) {
    return {
      data: null,
      error: getCalendarErrorMessage("We couldn't save Google Calendar event status.", error),
    };
  }

  return {
    data: data as GoogleCalendarEventLinkRecord,
    error: null,
  };
}

export async function updateGoogleCalendarEventLinkStatus(
  supabase: CalendarClient,
  userId: string,
  reminderId: string,
  input: {
    status: GoogleCalendarEventLinkRecord["last_sync_status"];
    error: string | null;
  },
): Promise<CalendarDataResult<GoogleCalendarEventLinkRecord | null>> {
  const { data, error } = await supabase
    .from("google_calendar_event_links")
    .update({
      last_sync_status: input.status,
      last_sync_error: input.error,
      last_synced_at: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .eq("reminder_id", reminderId)
    .select("*")
    .maybeSingle();

  if (error) {
    return {
      data: null,
      error: getCalendarErrorMessage("We couldn't update Google Calendar event status.", error),
    };
  }

  return {
    data: (data as GoogleCalendarEventLinkRecord | null) ?? null,
    error: null,
  };
}

export async function deleteGoogleCalendarEventLinksForUser(
  supabase: CalendarClient,
  userId: string,
): Promise<CalendarDataResult<null>> {
  const { error } = await supabase
    .from("google_calendar_event_links")
    .delete()
    .eq("user_id", userId);

  if (error) {
    return {
      data: null,
      error: getCalendarErrorMessage("We couldn't clear Google Calendar event links.", error),
    };
  }

  return {
    data: null,
    error: null,
  };
}

export async function deleteGoogleCalendarEventLinkForReminder(
  supabase: CalendarClient,
  userId: string,
  reminderId: string,
): Promise<CalendarDataResult<null>> {
  const { error } = await supabase
    .from("google_calendar_event_links")
    .delete()
    .eq("user_id", userId)
    .eq("reminder_id", reminderId);

  if (error) {
    return {
      data: null,
      error: getCalendarErrorMessage("We couldn't clear Google Calendar event status.", error),
    };
  }

  return {
    data: null,
    error: null,
  };
}

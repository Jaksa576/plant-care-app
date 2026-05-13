"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getAuthState } from "@/lib/auth";
import { getGoogleCalendarConfig } from "@/lib/env";
import {
  deleteGoogleCalendarConnection,
  deleteGoogleCalendarEventLinksForUser,
  getGoogleCalendarConnection,
  listGoogleCalendarEventLinksForUser,
} from "@/lib/google-calendar/data";
import { decryptText } from "@/lib/google-calendar/crypto";
import { deleteGoogleCalendarEvent, refreshGoogleAccessToken } from "@/lib/google-calendar/google";
import { syncWateringReminderToGoogleCalendar } from "@/lib/google-calendar/sync";
import { getPlantForUser } from "@/lib/plants/data";
import { getWateringReminderForPlant } from "@/lib/reminders/data";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type GoogleCalendarActionState = {
  status: "idle" | "success" | "error" | "warning";
  message: string | null;
};

async function getSignedInCalendarContext() {
  const authState = await getAuthState();

  if (!authState.supabaseConfigured) {
    redirect("/login?missingEnv=1");
  }

  if (!authState.user) {
    redirect("/login");
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    redirect("/login?missingEnv=1");
  }

  return {
    supabase,
    user: authState.user,
  };
}

export async function syncGoogleCalendarReminderAction(
  plantId: string,
  previousState: GoogleCalendarActionState,
  formData?: FormData,
): Promise<GoogleCalendarActionState> {
  void previousState;
  void formData;
  const { supabase, user } = await getSignedInCalendarContext();
  const plantResult = await getPlantForUser(supabase, user.id, plantId);
  const plant = plantResult.data;

  if (plantResult.error || !plant || plant.archived_at) {
    return {
      status: "error",
      message: "Could not sync this plant reminder. Please refresh and try again.",
    };
  }

  const reminderResult = await getWateringReminderForPlant(supabase, user.id, plant.id);
  const syncResult = await syncWateringReminderToGoogleCalendar(
    supabase,
    user.id,
    plant,
    reminderResult.data,
  );

  revalidatePath(`/app/plants/${plant.id}`);

  return {
    status: syncResult.status === "success" ? "success" : "error",
    message: syncResult.message,
  };
}

export async function disconnectGoogleCalendarAction(
  previousState: GoogleCalendarActionState,
  formData?: FormData,
): Promise<GoogleCalendarActionState> {
  void previousState;
  void formData;
  const config = getGoogleCalendarConfig();
  const { supabase, user } = await getSignedInCalendarContext();
  const connectionResult = await getGoogleCalendarConnection(supabase, user.id);
  const connection = connectionResult.data;
  let cleanupWarning: string | null = null;

  if (config && connection) {
    try {
      const refreshToken = decryptText(
        connection.encrypted_refresh_token,
        connection.token_iv,
        connection.token_auth_tag,
        config.tokenEncryptionKey,
      );
      const accessTokenResult = await refreshGoogleAccessToken(config, refreshToken);
      const linksResult = await listGoogleCalendarEventLinksForUser(supabase, user.id);

      if (accessTokenResult.data?.access_token && linksResult.data) {
        for (const link of linksResult.data) {
          const deleteResult = await deleteGoogleCalendarEvent(
            accessTokenResult.data.access_token,
            link.calendar_id,
            link.google_event_id,
          );

          if (deleteResult.error) {
            cleanupWarning =
              "Google Calendar disconnected, but one or more linked events may need manual cleanup.";
          }
        }
      } else if (linksResult.data?.length) {
        cleanupWarning =
          "Google Calendar disconnected, but linked events may need manual cleanup.";
      }
    } catch {
      cleanupWarning =
        "Google Calendar disconnected, but linked events may need manual cleanup.";
    }
  }

  const linksDeleteResult = await deleteGoogleCalendarEventLinksForUser(supabase, user.id);
  const connectionDeleteResult = await deleteGoogleCalendarConnection(supabase, user.id);

  revalidatePath("/app");
  revalidatePath("/app/settings");

  if (connectionDeleteResult.error) {
    return {
      status: "error",
      message: connectionDeleteResult.error,
    };
  }

  if (linksDeleteResult.error || cleanupWarning) {
    return {
      status: "warning",
      message:
        cleanupWarning ??
        "Google Calendar disconnected, but local sync cleanup may need another try.",
    };
  }

  return {
    status: "success",
    message: "Google Calendar disconnected. Plant Care reminders are unchanged.",
  };
}

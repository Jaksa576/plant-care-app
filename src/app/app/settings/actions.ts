"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getAuthState } from "@/lib/auth";
import {
  archivePlantRoomForUser,
  createPlantRoomForUser,
  renamePlantRoomForUser,
} from "@/lib/rooms/data";
import { updateDefaultNewPlantRemindersForUser } from "@/lib/user-preferences/data";
import { createSupabaseServerClient } from "@/lib/supabase/server";

async function getSignedInSettingsContext() {
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

function normalizeRoomName(formData: FormData) {
  const value = formData.get("name");
  return typeof value === "string" ? value.trim() : "";
}

function getRoomId(formData: FormData) {
  const value = formData.get("roomId");
  return typeof value === "string" ? value.trim() : "";
}

function redirectWithRoomStatus(status: string) {
  redirect(`/app/settings?rooms=${encodeURIComponent(status)}`);
}

export async function createRoomAction(formData: FormData) {
  const name = normalizeRoomName(formData);

  if (!name) {
    redirectWithRoomStatus("name-required");
  }

  const { supabase, user } = await getSignedInSettingsContext();
  const result = await createPlantRoomForUser(supabase, user.id, { name });

  if (result.error) {
    redirectWithRoomStatus("duplicate");
  }

  revalidatePath("/app/settings");
  redirectWithRoomStatus("created");
}

export async function renameRoomAction(formData: FormData) {
  const roomId = getRoomId(formData);
  const name = normalizeRoomName(formData);

  if (!roomId || !name) {
    redirectWithRoomStatus("name-required");
  }

  const { supabase, user } = await getSignedInSettingsContext();
  const result = await renamePlantRoomForUser(supabase, user.id, roomId, name);

  if (result.error) {
    redirectWithRoomStatus("duplicate");
  }

  revalidatePath("/app/settings");
  redirectWithRoomStatus("renamed");
}

export async function archiveRoomAction(formData: FormData) {
  const roomId = getRoomId(formData);

  if (!roomId) {
    redirectWithRoomStatus("archive-error");
  }

  const { supabase } = await getSignedInSettingsContext();
  const result = await archivePlantRoomForUser(supabase, roomId);

  if (result.error) {
    redirectWithRoomStatus("archive-error");
  }

  revalidatePath("/app");
  revalidatePath("/app/plants");
  revalidatePath("/app/settings");
  redirectWithRoomStatus("archived");
}


function redirectWithReminderPreferenceStatus(status: string) {
  redirect(`/app/settings?reminders=${encodeURIComponent(status)}`);
}

export async function updateReminderDefaultPreferenceAction(formData: FormData) {
  const enabled = formData.get("defaultNewPlantReminders") === "on";
  const { supabase, user } = await getSignedInSettingsContext();
  const result = await updateDefaultNewPlantRemindersForUser(supabase, user.id, enabled);

  if (result.error) {
    redirectWithReminderPreferenceStatus("error");
  }

  revalidatePath("/app/settings");
  revalidatePath("/app/plants/new");
  redirectWithReminderPreferenceStatus(enabled ? "on" : "off");
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getAuthState } from "@/lib/auth";
import { createPlantRoomForUser, listPlantRoomsForUser } from "@/lib/rooms/data";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { completeOnboardingForUser } from "@/lib/user-preferences/data";

function getRedirectPath(value: FormDataEntryValue | null) {
  if (value === "/app/plants/new" || value === "/app/plants/new?start=photo") {
    return value;
  }

  return "/app";
}

function normalizeRoomName(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
}

function getRequestedRoomNames(formData: FormData) {
  const requestedNames = [
    ...formData.getAll("roomName").map(normalizeRoomName),
    ...normalizeRoomName(formData.get("customRoomNames"))
      .split(",")
      .map((name) => name.trim().replace(/\s+/g, " ")),
  ].filter(Boolean);
  const normalizedNames = new Set<string>();
  const roomNames: string[] = [];

  for (const name of requestedNames) {
    const normalizedName = name.toLocaleLowerCase();

    if (normalizedNames.has(normalizedName)) {
      continue;
    }

    normalizedNames.add(normalizedName);
    roomNames.push(name);
  }

  return roomNames;
}

export async function completeOnboardingAction(formData: FormData) {
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

  const redirectTo = getRedirectPath(formData.get("redirectTo"));
  const requestedRoomNames = getRequestedRoomNames(formData);

  if (requestedRoomNames.length > 0) {
    const roomsResult = await listPlantRoomsForUser(supabase, authState.user.id);

    if (roomsResult.error) {
      redirect(`/app/onboarding?error=rooms&redirectTo=${encodeURIComponent(redirectTo)}`);
    }

    const existingRoomNames = new Set(
      (roomsResult.data ?? []).map((room) => room.name.trim().toLocaleLowerCase()),
    );

    for (const roomName of requestedRoomNames) {
      const normalizedRoomName = roomName.toLocaleLowerCase();

      if (existingRoomNames.has(normalizedRoomName)) {
        continue;
      }

      const roomResult = await createPlantRoomForUser(supabase, authState.user.id, {
        name: roomName,
      });

      if (roomResult.error) {
        redirect(`/app/onboarding?error=rooms&redirectTo=${encodeURIComponent(redirectTo)}`);
      }

      existingRoomNames.add(normalizedRoomName);
    }
  }

  const result = await completeOnboardingForUser(supabase, authState.user.id);

  if (result.error) {
    redirect(`/app/onboarding?error=save&redirectTo=${encodeURIComponent(redirectTo)}`);
  }

  revalidatePath("/app");
  revalidatePath("/app/plants/new");
  revalidatePath("/app/settings");
  redirect(redirectTo);
}

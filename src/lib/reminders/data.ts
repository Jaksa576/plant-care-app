import type { SupabaseClient } from "@supabase/supabase-js";

import type { PlantQueryResult } from "@/lib/plants/data";
import type { WateringReminderRecord } from "@/lib/plants/types";

type ReminderClient = SupabaseClient;

export type WateringReminderInput = {
  enabled: boolean;
  reminder_mode?: WateringReminderRecord["reminder_mode"];
  next_reminder_date: string | null;
  reminder_time?: string | null;
};

function getReminderErrorMessage(fallback: string, error?: { message?: string } | null) {
  if (!error) {
    return fallback;
  }

  const message = error.message?.trim();
  return message ? `${fallback} ${message}` : fallback;
}

export async function getWateringReminderForPlant(
  supabase: ReminderClient,
  userId: string,
  plantId: string,
): Promise<PlantQueryResult<WateringReminderRecord | null>> {
  const { data, error } = await supabase
    .from("watering_reminders")
    .select("*")
    .eq("user_id", userId)
    .eq("plant_id", plantId)
    .eq("reminder_type", "watering")
    .maybeSingle();

  if (error) {
    return {
      data: null,
      error: getReminderErrorMessage("We couldn't load this reminder right now.", error),
    };
  }

  return {
    data: (data as WateringReminderRecord | null) ?? null,
    error: null,
  };
}

export async function upsertWateringReminderForPlant(
  supabase: ReminderClient,
  userId: string,
  plantId: string,
  input: WateringReminderInput,
): Promise<PlantQueryResult<WateringReminderRecord>> {
  const { data, error } = await supabase
    .from("watering_reminders")
    .upsert(
      {
        user_id: userId,
        plant_id: plantId,
        reminder_type: "watering",
        reminder_mode: input.reminder_mode ?? "after_watering",
        enabled: input.enabled,
        next_reminder_date: input.next_reminder_date,
        reminder_time: input.reminder_time ?? null,
      },
      { onConflict: "user_id,plant_id,reminder_type" },
    )
    .select("*")
    .single();

  if (error) {
    return {
      data: null,
      error: getReminderErrorMessage("We couldn't save this reminder right now.", error),
    };
  }

  return {
    data: data as WateringReminderRecord,
    error: null,
  };
}

export async function updateWateringReminderAfterWatered(
  supabase: ReminderClient,
  userId: string,
  plantId: string,
  nextReminderDate: string,
): Promise<PlantQueryResult<WateringReminderRecord | null>> {
  const { data, error } = await supabase
    .from("watering_reminders")
    .update({
      next_reminder_date: nextReminderDate,
    })
    .eq("user_id", userId)
    .eq("plant_id", plantId)
    .eq("reminder_type", "watering")
    .eq("reminder_mode", "after_watering")
    .eq("enabled", true)
    .select("*")
    .maybeSingle();

  if (error) {
    return {
      data: null,
      error: getReminderErrorMessage("Watering was recorded, but the reminder did not update.", error),
    };
  }

  return {
    data: (data as WateringReminderRecord | null) ?? null,
    error: null,
  };
}

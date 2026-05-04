import type { SupabaseClient } from "@supabase/supabase-js";

import type { PlantQueryResult } from "@/lib/plants/data";
import type { WateringEventRecord } from "@/lib/plants/types";

type WateringClient = SupabaseClient;

function getWateringErrorMessage(fallback: string, error?: { message?: string } | null) {
  if (!error) {
    return fallback;
  }

  const message = error.message?.trim();
  return message ? `${fallback} ${message}` : fallback;
}

export async function getLatestWateringEventForPlant(
  supabase: WateringClient,
  userId: string,
  plantId: string,
): Promise<PlantQueryResult<WateringEventRecord | null>> {
  const { data, error } = await supabase
    .from("watering_events")
    .select("*")
    .eq("user_id", userId)
    .eq("plant_id", plantId)
    .order("watered_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    return {
      data: null,
      error: getWateringErrorMessage("We couldn't load watering state right now.", error),
    };
  }

  return {
    data: (data as WateringEventRecord | null) ?? null,
    error: null,
  };
}

export async function listWateringEventsForPlant(
  supabase: WateringClient,
  userId: string,
  plantId: string,
): Promise<PlantQueryResult<WateringEventRecord[]>> {
  const { data, error } = await supabase
    .from("watering_events")
    .select("*")
    .eq("user_id", userId)
    .eq("plant_id", plantId)
    .order("watered_at", { ascending: false });

  if (error) {
    return {
      data: null,
      error: getWateringErrorMessage("We couldn't load watering history right now.", error),
    };
  }

  return {
    data: (data ?? []) as WateringEventRecord[],
    error: null,
  };
}

export async function listWateringEventsForUser(
  supabase: WateringClient,
  userId: string,
): Promise<PlantQueryResult<WateringEventRecord[]>> {
  const { data, error } = await supabase
    .from("watering_events")
    .select("*")
    .eq("user_id", userId)
    .order("watered_at", { ascending: false });

  if (error) {
    return {
      data: null,
      error: getWateringErrorMessage("We couldn't load watering state right now.", error),
    };
  }

  return {
    data: (data ?? []) as WateringEventRecord[],
    error: null,
  };
}

export async function createWateringEventForPlant(
  supabase: WateringClient,
  userId: string,
  plantId: string,
): Promise<PlantQueryResult<WateringEventRecord>> {
  const { data, error } = await supabase
    .from("watering_events")
    .insert({
      plant_id: plantId,
      user_id: userId,
    })
    .select("*")
    .single();

  if (error) {
    return {
      data: null,
      error: getWateringErrorMessage("Could not record watering. Please try again.", error),
    };
  }

  return {
    data: data as WateringEventRecord,
    error: null,
  };
}

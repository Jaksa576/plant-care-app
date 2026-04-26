import type { SupabaseClient } from "@supabase/supabase-js";

import type { PlantInput, PlantRecord } from "@/lib/plants/types";

type PlantClient = SupabaseClient;

export type PlantQueryResult<T> =
  | { data: T; error: null }
  | { data: null; error: string };

function getPlantErrorMessage(fallback: string, error?: { message?: string } | null) {
  if (!error) {
    return fallback;
  }

  const message = error.message?.trim();
  return message ? `${fallback} ${message}` : fallback;
}

export async function listPlantsForUser(
  supabase: PlantClient,
  userId: string,
): Promise<PlantQueryResult<PlantRecord[]>> {
  const { data, error } = await supabase
    .from("plants")
    .select("*")
    .eq("user_id", userId)
    .is("archived_at", null)
    .order("created_at", { ascending: false });

  if (error) {
    return {
      data: null,
      error: getPlantErrorMessage("We couldn't load your plants right now.", error),
    };
  }

  return {
    data: (data ?? []) as PlantRecord[],
    error: null,
  };
}

export async function getPlantForUser(
  supabase: PlantClient,
  userId: string,
  plantId: string,
): Promise<PlantQueryResult<PlantRecord | null>> {
  const { data, error } = await supabase
    .from("plants")
    .select("*")
    .eq("user_id", userId)
    .eq("id", plantId)
    .maybeSingle();

  if (error) {
    return {
      data: null,
      error: getPlantErrorMessage("We couldn't open that plant right now.", error),
    };
  }

  return {
    data: (data as PlantRecord | null) ?? null,
    error: null,
  };
}

export async function createPlantForUser(
  supabase: PlantClient,
  userId: string,
  plant: PlantInput,
): Promise<PlantQueryResult<PlantRecord>> {
  const { data, error } = await supabase
    .from("plants")
    .insert({
      ...plant,
      user_id: userId,
    })
    .select("*")
    .single();

  if (error) {
    return {
      data: null,
      error: getPlantErrorMessage("We couldn't save this plant yet.", error),
    };
  }

  return {
    data: data as PlantRecord,
    error: null,
  };
}

export async function updatePlantForUser(
  supabase: PlantClient,
  userId: string,
  plantId: string,
  plant: PlantInput,
): Promise<PlantQueryResult<PlantRecord>> {
  const { data, error } = await supabase
    .from("plants")
    .update(plant)
    .eq("id", plantId)
    .eq("user_id", userId)
    .is("archived_at", null)
    .select("*")
    .maybeSingle();

  if (error || !data) {
    return {
      data: null,
      error: getPlantErrorMessage("We couldn't update this plant right now.", error),
    };
  }

  return {
    data: data as PlantRecord,
    error: null,
  };
}

export async function archivePlantForUser(
  supabase: PlantClient,
  userId: string,
  plantId: string,
): Promise<PlantQueryResult<PlantRecord>> {
  const { data, error } = await supabase
    .from("plants")
    .update({
      archived_at: new Date().toISOString(),
    })
    .eq("id", plantId)
    .eq("user_id", userId)
    .is("archived_at", null)
    .select("*")
    .maybeSingle();

  if (error || !data) {
    return {
      data: null,
      error: getPlantErrorMessage("We couldn't archive this plant right now.", error),
    };
  }

  return {
    data: data as PlantRecord,
    error: null,
  };
}

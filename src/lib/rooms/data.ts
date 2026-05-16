import type { SupabaseClient } from "@supabase/supabase-js";

import type { PlantRoomInput, PlantRoomRecord } from "@/lib/rooms/types";

type RoomClient = SupabaseClient;

export type PlantRoomQueryResult<T> =
  | { data: T; error: null }
  | { data: null; error: string };

function getRoomErrorMessage(fallback: string, error?: { message?: string } | null) {
  if (!error) {
    return fallback;
  }

  const message = error.message?.trim();
  return message ? `${fallback} ${message}` : fallback;
}

export async function listPlantRoomsForUser(
  supabase: RoomClient,
  userId: string,
  options: { includeArchived?: boolean } = {},
): Promise<PlantRoomQueryResult<PlantRoomRecord[]>> {
  let query = supabase
    .from("plant_rooms")
    .select("*")
    .eq("user_id", userId)
    .order("sort_order", { ascending: true, nullsFirst: false })
    .order("name", { ascending: true });

  if (!options.includeArchived) {
    query = query.is("archived_at", null);
  }

  const { data, error } = await query;

  if (error) {
    return {
      data: null,
      error: getRoomErrorMessage("We couldn't load your rooms right now.", error),
    };
  }

  return {
    data: (data ?? []) as PlantRoomRecord[],
    error: null,
  };
}

export async function getPlantRoomForUser(
  supabase: RoomClient,
  userId: string,
  roomId: string,
): Promise<PlantRoomQueryResult<PlantRoomRecord | null>> {
  const { data, error } = await supabase
    .from("plant_rooms")
    .select("*")
    .eq("id", roomId)
    .eq("user_id", userId)
    .is("archived_at", null)
    .maybeSingle();

  if (error) {
    return {
      data: null,
      error: getRoomErrorMessage("We couldn't open that room right now.", error),
    };
  }

  return {
    data: (data as PlantRoomRecord | null) ?? null,
    error: null,
  };
}

export async function createPlantRoomForUser(
  supabase: RoomClient,
  userId: string,
  room: PlantRoomInput,
): Promise<PlantRoomQueryResult<PlantRoomRecord>> {
  const { data, error } = await supabase
    .from("plant_rooms")
    .insert({
      user_id: userId,
      name: room.name,
      sort_order: room.sort_order ?? null,
    })
    .select("*")
    .single();

  if (error) {
    return {
      data: null,
      error: getRoomErrorMessage("We couldn't save this room yet.", error),
    };
  }

  return {
    data: data as PlantRoomRecord,
    error: null,
  };
}

export async function renamePlantRoomForUser(
  supabase: RoomClient,
  userId: string,
  roomId: string,
  name: string,
): Promise<PlantRoomQueryResult<PlantRoomRecord>> {
  const { data, error } = await supabase
    .from("plant_rooms")
    .update({ name })
    .eq("id", roomId)
    .eq("user_id", userId)
    .is("archived_at", null)
    .select("*")
    .maybeSingle();

  if (error || !data) {
    return {
      data: null,
      error: getRoomErrorMessage("We couldn't rename this room right now.", error),
    };
  }

  return {
    data: data as PlantRoomRecord,
    error: null,
  };
}

export async function archivePlantRoomForUser(
  supabase: RoomClient,
  roomId: string,
): Promise<PlantRoomQueryResult<PlantRoomRecord>> {
  const { data, error } = await supabase.rpc("archive_plant_room", {
    p_room_id: roomId,
  });

  if (error || !data) {
    return {
      data: null,
      error: getRoomErrorMessage(
        "We couldn't archive this room right now. Plants were not changed.",
        error,
      ),
    };
  }

  return {
    data: data as PlantRoomRecord,
    error: null,
  };
}

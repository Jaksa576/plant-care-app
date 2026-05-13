import type { PlantRecord } from "@/lib/plants/types";
import type { PlantRoomRecord } from "@/lib/rooms/types";

export function getPlantPrimaryLabel(plant: Pick<PlantRecord, "nickname" | "common_name">) {
  return plant.nickname?.trim() || plant.common_name?.trim() || "Unnamed plant";
}

export function getPlantSecondaryLabel(plant: Pick<PlantRecord, "nickname" | "common_name">) {
  if (plant.nickname?.trim() && plant.common_name?.trim()) {
    return plant.common_name.trim();
  }

  return null;
}

export function getWateringIntervalLabel(
  plant: Pick<PlantRecord, "watering_interval_days">,
) {
  if (!plant.watering_interval_days) {
    return null;
  }

  return `About every ${plant.watering_interval_days} day${
    plant.watering_interval_days === 1 ? "" : "s"
  }`;
}

export function createRoomNameMap(rooms: PlantRoomRecord[]) {
  return new Map(rooms.map((room) => [room.id, room.name.trim()]));
}

export function getPlantRoomLabel(
  plant: Pick<PlantRecord, "room_id" | "location">,
  roomNames: Map<string, string>,
) {
  if (plant.room_id) {
    const roomName = roomNames.get(plant.room_id)?.trim();

    if (roomName) {
      return roomName;
    }
  }

  return plant.location?.trim() || "Unassigned";
}

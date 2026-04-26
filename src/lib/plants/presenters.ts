import type { PlantRecord } from "@/lib/plants/types";

export function getPlantPrimaryLabel(plant: Pick<PlantRecord, "nickname" | "common_name">) {
  return plant.nickname?.trim() || plant.common_name?.trim() || "Unnamed plant";
}

export function getPlantSecondaryLabel(plant: Pick<PlantRecord, "nickname" | "common_name">) {
  if (plant.nickname?.trim() && plant.common_name?.trim()) {
    return plant.common_name.trim();
  }

  return null;
}

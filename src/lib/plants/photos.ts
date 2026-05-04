import type { SupabaseClient } from "@supabase/supabase-js";

import type { PlantRecord } from "@/lib/plants/types";

export const PLANT_PHOTO_BUCKET = "plant-photos";
export const PLANT_PHOTO_MAX_BYTES = 5 * 1024 * 1024;
export const PLANT_PHOTO_ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

const SIGNED_PHOTO_URL_SECONDS = 60 * 60;

export type PlantPhotoUrlMap = Record<string, string>;

export function getPlantPhotoExtension(fileType: string) {
  if (fileType === "image/png") {
    return "png";
  }

  if (fileType === "image/webp") {
    return "webp";
  }

  return "jpg";
}

export function getPlantPhotoPath(userId: string, plantId: string, fileType: string) {
  const extension = getPlantPhotoExtension(fileType);

  return `${userId}/${plantId}/primary-${crypto.randomUUID()}.${extension}`;
}

export function getPlantPhotoValidationError(file: File | null) {
  if (!file || file.size === 0) {
    return "Choose a plant photo before uploading.";
  }

  if (!PLANT_PHOTO_ALLOWED_TYPES.includes(file.type as (typeof PLANT_PHOTO_ALLOWED_TYPES)[number])) {
    return "Use a JPG, PNG, or WebP image.";
  }

  if (file.size > PLANT_PHOTO_MAX_BYTES) {
    return "Use an image under 5 MB.";
  }

  return null;
}

export async function createPlantPhotoUrlMap(
  supabase: SupabaseClient,
  plants: PlantRecord[],
): Promise<PlantPhotoUrlMap> {
  const entries = await Promise.all(
    plants.map(async (plant) => {
      if (!plant.primary_photo_path) {
        return null;
      }

      const { data, error } = await supabase.storage
        .from(PLANT_PHOTO_BUCKET)
        .createSignedUrl(plant.primary_photo_path, SIGNED_PHOTO_URL_SECONDS);

      if (error || !data?.signedUrl) {
        return null;
      }

      return [plant.id, data.signedUrl] as const;
    }),
  );

  return Object.fromEntries(entries.filter((entry): entry is readonly [string, string] => Boolean(entry)));
}

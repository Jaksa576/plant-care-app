"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getAuthState } from "@/lib/auth";
import type { MarkWateredState } from "@/components/mark-watered-form";
import {
  archivePlantForUser,
  createPlantForUser,
  getPlantForUser,
  updatePlantPrimaryPhotoForUser,
  updatePlantForUser,
} from "@/lib/plants/data";
import { createPlantFormErrorState, parsePlantFormData } from "@/lib/plants/forms";
import {
  getPlantPhotoPath,
  getPlantPhotoValidationError,
  PLANT_PHOTO_BUCKET,
} from "@/lib/plants/photos";
import { emptyPlantFormState, type PlantFormState } from "@/lib/plants/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createWateringEventForPlant } from "@/lib/watering/data";

export type PlantPhotoState = {
  status: "idle" | "success" | "error";
  message: string | null;
};

async function getSignedInPlantContext() {
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

export async function createPlantAction(
  previousState: PlantFormState = emptyPlantFormState,
  formData: FormData,
): Promise<PlantFormState> {
  void previousState;
  const parsed = parsePlantFormData(formData);

  if (!parsed.success) {
    return parsed.state;
  }

  const { supabase, user } = await getSignedInPlantContext();
  const result = await createPlantForUser(supabase, user.id, parsed.plantInput);

  if (result.error || !result.data) {
    return createPlantFormErrorState(
      parsed.values,
      result.error ?? "We couldn't save this plant yet.",
    );
  }

  revalidatePath("/app");
  redirect(`/app/plants/${result.data.id}?created=1`);
}

export async function updatePlantAction(
  plantId: string,
  previousState: PlantFormState = emptyPlantFormState,
  formData: FormData,
): Promise<PlantFormState> {
  void previousState;
  const parsed = parsePlantFormData(formData);

  if (!parsed.success) {
    return parsed.state;
  }

  const { supabase, user } = await getSignedInPlantContext();
  const result = await updatePlantForUser(supabase, user.id, plantId, parsed.plantInput);

  if (result.error || !result.data) {
    return createPlantFormErrorState(
      parsed.values,
      result.error ?? "We couldn't update this plant right now.",
    );
  }

  revalidatePath("/app");
  revalidatePath(`/app/plants/${plantId}`);
  redirect(`/app/plants/${plantId}?updated=1`);
}

export async function archivePlantAction(
  plantId: string,
  errorRedirectPath?: string,
) {
  const { supabase, user } = await getSignedInPlantContext();
  const result = await archivePlantForUser(supabase, user.id, plantId);

  if (result.error) {
    redirect(errorRedirectPath ?? `/app/plants/${plantId}/edit?archiveError=1`);
  }

  revalidatePath("/app");
  revalidatePath(`/app/plants/${plantId}`);
  redirect("/app?archived=1");
}

export async function markWateredAction(
  plantId: string,
  previousState: MarkWateredState,
): Promise<MarkWateredState> {
  void previousState;
  const { supabase, user } = await getSignedInPlantContext();
  const plantResult = await getPlantForUser(supabase, user.id, plantId);

  if (plantResult.error || !plantResult.data || plantResult.data.archived_at) {
    return {
      status: "error",
      message: "Could not record watering. Please try again.",
    };
  }

  const result = await createWateringEventForPlant(supabase, user.id, plantId);

  if (result.error || !result.data) {
    return {
      status: "error",
      message: result.error ?? "Could not record watering. Please try again.",
    };
  }

  revalidatePath("/app");
  revalidatePath(`/app/plants/${plantId}`);

  return {
    status: "success",
    message: plantResult.data.watering_interval_days
      ? "Watering recorded. Next watering updated from today."
      : "Watering recorded. Add an interval later to see a next date.",
  };
}

export async function uploadPlantPhotoAction(
  plantId: string,
  previousState: PlantPhotoState,
  formData: FormData,
): Promise<PlantPhotoState> {
  void previousState;
  const file = formData.get("photo");

  if (!(file instanceof File)) {
    return {
      status: "error",
      message: "Choose a plant photo before uploading.",
    };
  }

  const validationError = getPlantPhotoValidationError(file);

  if (validationError) {
    return {
      status: "error",
      message: validationError,
    };
  }

  const { supabase, user } = await getSignedInPlantContext();
  const plantResult = await getPlantForUser(supabase, user.id, plantId);
  const plant = plantResult.data;

  if (plantResult.error || !plant || plant.archived_at) {
    return {
      status: "error",
      message: "Could not update this plant photo. Please refresh and try again.",
    };
  }

  const photoPath = getPlantPhotoPath(user.id, plant.id, file.type);
  const uploadResult = await supabase.storage.from(PLANT_PHOTO_BUCKET).upload(photoPath, file, {
    cacheControl: "3600",
    contentType: file.type,
  });

  if (uploadResult.error) {
    return {
      status: "error",
      message: "Photo upload failed. Please try a smaller image or try again later.",
    };
  }

  const updateResult = await updatePlantPrimaryPhotoForUser(supabase, user.id, plant.id, photoPath);

  if (updateResult.error || !updateResult.data) {
    await supabase.storage.from(PLANT_PHOTO_BUCKET).remove([photoPath]);

    return {
      status: "error",
      message: updateResult.error ?? "Photo uploaded, but the plant record was not updated.",
    };
  }

  if (plant.primary_photo_path) {
    await supabase.storage.from(PLANT_PHOTO_BUCKET).remove([plant.primary_photo_path]);
  }

  revalidatePath("/app");
  revalidatePath(`/app/plants/${plant.id}`);

  return {
    status: "success",
    message: "Photo saved. This plant will now show its primary photo.",
  };
}

export async function removePlantPhotoAction(
  plantId: string,
  previousState: PlantPhotoState,
): Promise<PlantPhotoState> {
  void previousState;
  const { supabase, user } = await getSignedInPlantContext();
  const plantResult = await getPlantForUser(supabase, user.id, plantId);
  const plant = plantResult.data;

  if (plantResult.error || !plant || plant.archived_at) {
    return {
      status: "error",
      message: "Could not remove this plant photo. Please refresh and try again.",
    };
  }

  if (!plant.primary_photo_path) {
    return {
      status: "success",
      message: "This plant does not have a photo yet.",
    };
  }

  const updateResult = await updatePlantPrimaryPhotoForUser(supabase, user.id, plant.id, null);

  if (updateResult.error || !updateResult.data) {
    return {
      status: "error",
      message: updateResult.error ?? "Could not clear this plant photo right now.",
    };
  }

  const removeResult = await supabase.storage
    .from(PLANT_PHOTO_BUCKET)
    .remove([plant.primary_photo_path]);

  if (removeResult.error) {
    return {
      status: "error",
      message:
        "The plant no longer points to this photo, but storage cleanup may need another try.",
    };
  }

  revalidatePath("/app");
  revalidatePath(`/app/plants/${plant.id}`);

  return {
    status: "success",
    message: "Photo removed. The calm fallback is back for this plant.",
  };
}

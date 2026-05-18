"use server";

import type { SupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getAuthState } from "@/lib/auth";
import type { MarkWateredState } from "@/components/mark-watered-form";
import { findCareProfileMatch, MINIMAL_CARE_PROFILES } from "@/lib/care-profiles";
import { listCareProfiles } from "@/lib/care-profiles/data";
import type {
  CareProfileMatchType,
  CareProfileWithAliases,
} from "@/lib/care-profiles/types";
import { getPlantNetConfig } from "@/lib/env";
import {
  removeWateringReminderFromGoogleCalendar,
  syncWateringReminderToGoogleCalendar,
} from "@/lib/google-calendar/sync";
import { identifyPlantWithPlantNet } from "@/lib/plant-identification/plantnet";
import type {
  PlantIdentificationCandidate,
  PlantIdentificationStatus,
} from "@/lib/plant-identification/types";
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
import {
  addReminderDaysToDateValue,
  getDerivedNextReminderDate,
  getTodayDateInputValue,
} from "@/lib/reminders/schedule";
import {
  getWateringReminderForPlant,
  updateWateringReminderAfterWatered,
  upsertWateringReminderForPlant,
} from "@/lib/reminders/data";
import {
  createPlantRoomForUser,
  getPlantRoomForUser,
} from "@/lib/rooms/data";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createWateringEventForPlant } from "@/lib/watering/data";

export type PlantPhotoState = {
  status: "idle" | "success" | "error";
  message: string | null;
};

export type PlantIdentificationState = {
  status: PlantIdentificationStatus;
  message: string | null;
  candidates: PlantIdentificationCandidate[];
};

export type SavePlantIdentificationState = {
  status: "idle" | "success" | "error";
  message: string | null;
  careProfilePreview?: CareProfilePreview | null;
};

export type CareProfilePreview =
  | {
      status: "matched";
      matchType: CareProfileMatchType;
      displayName: string;
      cadenceDays: number;
      cadenceDaysMin: number | null;
      cadenceDaysMax: number | null;
      drynessPreference: string;
      wateringGuidance: string;
    }
  | {
      status: "ambiguous";
      matchType: CareProfileMatchType;
      matchedAlias: string;
      options: Array<{
        displayName: string;
        drynessPreference: string;
      }>;
    }
  | {
      status: "no_match";
    };

export type WateringReminderState = {
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

async function getCareProfilePreview(
  supabase: SupabaseClient,
  scientificName: string,
  commonName: string,
): Promise<CareProfilePreview> {
  const profileResult = await listCareProfiles(supabase);
  const profiles = profileResult.data ?? MINIMAL_CARE_PROFILES;
  const match = findCareProfileMatch(
    {
      scientificName,
      commonName,
    },
    profiles as CareProfileWithAliases[],
  );

  if (match.status === "matched") {
    return {
      status: "matched",
      matchType: match.matchType,
      displayName: match.profile.display_name,
      cadenceDays: match.profile.watering_interval_days_default,
      cadenceDaysMin: match.profile.watering_interval_days_min,
      cadenceDaysMax: match.profile.watering_interval_days_max,
      drynessPreference: match.profile.dryness_preference,
      wateringGuidance: match.profile.watering_guidance,
    };
  }

  if (match.status === "ambiguous") {
    return {
      status: "ambiguous",
      matchType: match.matchType,
      matchedAlias: match.matchedAlias,
      options: match.profiles.map((profile) => ({
        displayName: profile.display_name,
        drynessPreference: profile.dryness_preference,
      })),
    };
  }

  return {
    status: "no_match",
  };
}

async function resolvePlantRoomFromForm(
  supabase: SupabaseClient,
  userId: string,
  parsed: ReturnType<typeof parsePlantFormData> & { success: true },
) {
  const inlineRoomName = parsed.values.newRoomName.trim();

  if (inlineRoomName && parsed.plantInput.room_id) {
    return {
      error: "Choose an existing room or add a new room, not both.",
      roomId: null,
    };
  }

  if (inlineRoomName) {
    const roomResult = await createPlantRoomForUser(supabase, userId, {
      name: inlineRoomName,
    });

    if (roomResult.error || !roomResult.data) {
      return {
        error:
          "We couldn't add that room. Use an existing room or choose a different room name.",
        roomId: null,
      };
    }

    return {
      error: null,
      roomId: roomResult.data.id,
    };
  }

  if (!parsed.plantInput.room_id) {
    return {
      error: null,
      roomId: null,
    };
  }

  const roomResult = await getPlantRoomForUser(supabase, userId, parsed.plantInput.room_id);

  if (roomResult.error || !roomResult.data) {
    return {
      error: "Choose one of your active rooms, add a new room, or leave this plant Unassigned.",
      roomId: null,
    };
  }

  return {
    error: null,
    roomId: roomResult.data.id,
  };
}

function getOptionalInitialPhoto(formData: FormData) {
  const file = formData.get("initialPhoto");

  if (!(file instanceof File) || file.size === 0) {
    return null;
  }

  return file;
}

async function saveInitialPlantPhoto(
  supabase: SupabaseClient,
  userId: string,
  plantId: string,
  file: File,
) {
  const photoPath = getPlantPhotoPath(userId, plantId, file.type);
  const uploadResult = await supabase.storage.from(PLANT_PHOTO_BUCKET).upload(photoPath, file, {
    cacheControl: "3600",
    contentType: file.type,
  });

  if (uploadResult.error) {
    return false;
  }

  const updateResult = await updatePlantPrimaryPhotoForUser(supabase, userId, plantId, photoPath);

  if (updateResult.error || !updateResult.data) {
    await supabase.storage.from(PLANT_PHOTO_BUCKET).remove([photoPath]);
    return false;
  }

  return true;
}

export async function createPlantAction(
  previousState: PlantFormState = emptyPlantFormState,
  formData: FormData,
): Promise<PlantFormState> {
  void previousState;
  const parsed = parsePlantFormData(formData);
  const initialPhoto = getOptionalInitialPhoto(formData);

  if (!parsed.success) {
    return parsed.state;
  }

  if (initialPhoto) {
    const photoValidationError = getPlantPhotoValidationError(initialPhoto);

    if (photoValidationError) {
      return createPlantFormErrorState(parsed.values, photoValidationError);
    }
  }

  const { supabase, user } = await getSignedInPlantContext();
  const roomResult = await resolvePlantRoomFromForm(supabase, user.id, parsed);

  if (roomResult.error) {
    return createPlantFormErrorState(parsed.values, roomResult.error, {
      roomId: roomResult.error,
    });
  }

  const result = await createPlantForUser(supabase, user.id, {
    ...parsed.plantInput,
    room_id: roomResult.roomId,
  });

  if (result.error || !result.data) {
    return createPlantFormErrorState(
      parsed.values,
      result.error ?? "We couldn't save this plant yet.",
    );
  }

  revalidatePath("/app");

  if (initialPhoto) {
    const photoSaved = await saveInitialPlantPhoto(supabase, user.id, result.data.id, initialPhoto);

    revalidatePath(`/app/plants/${result.data.id}`);
    redirect(`/app/plants/${result.data.id}?created=1&photo=${photoSaved ? "saved" : "failed"}`);
  }

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
  const roomResult = await resolvePlantRoomFromForm(supabase, user.id, parsed);

  if (roomResult.error) {
    return createPlantFormErrorState(parsed.values, roomResult.error, {
      roomId: roomResult.error,
    });
  }

  const result = await updatePlantForUser(supabase, user.id, plantId, {
    ...parsed.plantInput,
    room_id: roomResult.roomId,
  });

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

  const nextReminderDate = getDerivedNextReminderDate(plantResult.data, result.data);

  if (nextReminderDate) {
    const reminderUpdateResult = await updateWateringReminderAfterWatered(
      supabase,
      user.id,
      plantId,
      nextReminderDate,
    );

    if (reminderUpdateResult.data) {
      await syncWateringReminderToGoogleCalendar(
        supabase,
        user.id,
        plantResult.data,
        reminderUpdateResult.data,
      );
    }
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

export async function identifyPlantPhotoAction(
  plantId: string,
  previousState: PlantIdentificationState,
  formData?: FormData,
): Promise<PlantIdentificationState> {
  void previousState;
  void formData;
  const { supabase, user } = await getSignedInPlantContext();
  const plantResult = await getPlantForUser(supabase, user.id, plantId);
  const plant = plantResult.data;

  if (plantResult.error || !plant || plant.archived_at) {
    return {
      status: "error",
      message: "This plant is not available for identification right now.",
      candidates: [],
    };
  }

  if (!plant.primary_photo_path) {
    return {
      status: "error",
      message: "Add a photo before asking for identification help.",
      candidates: [],
    };
  }

  const plantNetConfig = getPlantNetConfig();

  if (!plantNetConfig) {
    return {
      status: "error",
      message:
        "Plant identification is not configured. Add PLANTNET_API_KEY on the server to enable this helper.",
      candidates: [],
    };
  }

  const photoResult = await supabase.storage
    .from(PLANT_PHOTO_BUCKET)
    .download(plant.primary_photo_path);

  if (photoResult.error || !photoResult.data) {
    return {
      status: "error",
      message: "Identification is unavailable right now. Your plant details are still editable.",
      candidates: [],
    };
  }

  const identifyResult = await identifyPlantWithPlantNet(plantNetConfig, photoResult.data);

  if (identifyResult.error || !identifyResult.data) {
    return {
      status: "error",
      message:
        identifyResult.error ??
        "Identification is unavailable right now. Your plant details are still editable.",
      candidates: [],
    };
  }

  if (identifyResult.data.length === 0) {
    return {
      status: "no-candidates",
      message:
        "No clear plant match came back. Try a brighter leaf photo or keep editing manually.",
      candidates: [],
    };
  }

  return {
    status: "success",
    message: "Review these possible matches. Scores are match signals, not certainty.",
    candidates: identifyResult.data,
  };
}

export async function identifyInitialPlantPhotoAction(
  previousState: PlantIdentificationState,
  formData: FormData,
): Promise<PlantIdentificationState> {
  void previousState;
  const file = getOptionalInitialPhoto(formData);

  if (!file) {
    return {
      status: "error",
      message: "Choose a photo before asking for identification help.",
      candidates: [],
    };
  }

  const validationError = getPlantPhotoValidationError(file);

  if (validationError) {
    return {
      status: "error",
      message: validationError,
      candidates: [],
    };
  }

  await getSignedInPlantContext();

  const plantNetConfig = getPlantNetConfig();

  if (!plantNetConfig) {
    return {
      status: "error",
      message:
        "Plant identification is not configured. Add PLANTNET_API_KEY on the server to enable this helper.",
      candidates: [],
    };
  }

  const identifyResult = await identifyPlantWithPlantNet(plantNetConfig, file);

  if (identifyResult.error || !identifyResult.data) {
    return {
      status: "error",
      message:
        identifyResult.error ??
        "Identification is unavailable right now. Your plant details are still editable.",
      candidates: [],
    };
  }

  if (identifyResult.data.length === 0) {
    return {
      status: "no-candidates",
      message:
        "No clear plant match came back. Try a brighter leaf photo or keep editing manually.",
      candidates: [],
    };
  }

  return {
    status: "success",
    message: "Review these possible matches. Scores are match signals, not certainty.",
    candidates: identifyResult.data,
  };
}

export async function savePlantIdentificationSuggestionAction(
  plantId: string,
  previousState: SavePlantIdentificationState,
  formData: FormData,
): Promise<SavePlantIdentificationState> {
  void previousState;
  const commonNameValue = formData.get("commonName");
  const scientificNameValue = formData.get("scientificName");
  const commonName = typeof commonNameValue === "string" ? commonNameValue.trim() : "";
  const scientificName =
    typeof scientificNameValue === "string" ? scientificNameValue.trim() : "";

  if (!commonName && !scientificName) {
    return {
      status: "error",
      message: "Keep at least one suggested name before saving.",
    };
  }

  const { supabase, user } = await getSignedInPlantContext();
  const plantResult = await getPlantForUser(supabase, user.id, plantId);
  const plant = plantResult.data;

  if (plantResult.error || !plant || plant.archived_at) {
    return {
      status: "error",
      message: "Could not save this suggestion. Please refresh and try again.",
    };
  }

  if (!commonName && !plant.nickname) {
    return {
      status: "error",
      message: "Keep a nickname or common name so this plant has a clear label.",
    };
  }

  const updateResult = await updatePlantForUser(supabase, user.id, plant.id, {
    nickname: plant.nickname,
    common_name: commonName || null,
    scientific_name: scientificName || null,
    location: plant.location,
    room_id: plant.room_id,
    notes: plant.notes,
    watering_interval_days: plant.watering_interval_days,
    watering_guidance: plant.watering_guidance,
  });

  if (updateResult.error || !updateResult.data) {
    return {
      status: "error",
      message: updateResult.error ?? "Could not save this suggestion right now.",
    };
  }

  revalidatePath("/app");
  revalidatePath(`/app/plants/${plant.id}`);
  revalidatePath(`/app/plants/${plant.id}/edit`);

  return {
    status: "success",
    message: "Suggested names saved. You can keep editing this plant any time.",
    careProfilePreview: await getCareProfilePreview(supabase, scientificName, commonName),
  };
}

export async function saveWateringReminderAction(
  plantId: string,
  previousState: WateringReminderState,
  formData: FormData,
): Promise<WateringReminderState> {
  void previousState;
  const { supabase, user } = await getSignedInPlantContext();
  const plantResult = await getPlantForUser(supabase, user.id, plantId);
  const plant = plantResult.data;

  if (plantResult.error || !plant || plant.archived_at) {
    return {
      status: "error",
      message: "Could not save this reminder. Please refresh and try again.",
    };
  }

  const dateValue = formData.get("nextReminderDate");
  const modeValue = formData.get("reminderMode");
  const nextReminderDate = typeof dateValue === "string" ? dateValue.trim() : "";
  const reminderMode =
    modeValue === "fixed_schedule" ? "fixed_schedule" : "after_watering";

  if (!nextReminderDate) {
    return {
      status: "error",
      message: "Choose a next reminder date before turning this on.",
    };
  }

  if (nextReminderDate < getTodayDateInputValue()) {
    return {
      status: "error",
      message: "Choose today or a future date for the next reminder.",
    };
  }

  if (reminderMode === "after_watering" && !plant.watering_interval_days) {
    return {
      status: "error",
      message: "Add a watering interval before using reminders that recalculate after watering.",
    };
  }

  const result = await upsertWateringReminderForPlant(supabase, user.id, plant.id, {
    enabled: true,
    reminder_mode: reminderMode,
    next_reminder_date: nextReminderDate,
  });

  if (result.error || !result.data) {
    return {
      status: "error",
      message: result.error ?? "Could not save this reminder right now.",
    };
  }

  await syncWateringReminderToGoogleCalendar(supabase, user.id, plant, result.data);

  revalidatePath("/app");
  revalidatePath(`/app/plants/${plant.id}`);

  return {
    status: "success",
    message: "Watering reminder saved in Plant Care.",
  };
}

export async function disableWateringReminderAction(
  plantId: string,
  previousState: WateringReminderState,
): Promise<WateringReminderState> {
  void previousState;
  const { supabase, user } = await getSignedInPlantContext();
  const plantResult = await getPlantForUser(supabase, user.id, plantId);
  const plant = plantResult.data;

  if (plantResult.error || !plant || plant.archived_at) {
    return {
      status: "error",
      message: "Could not pause this reminder. Please refresh and try again.",
    };
  }

  const reminderResult = await getWateringReminderForPlant(supabase, user.id, plant.id);
  const result = await upsertWateringReminderForPlant(supabase, user.id, plant.id, {
    enabled: false,
    reminder_mode: reminderResult.data?.reminder_mode ?? "after_watering",
    next_reminder_date: null,
  });

  if (result.error || !result.data) {
    return {
      status: "error",
      message: result.error ?? "Could not pause this reminder right now.",
    };
  }

  await removeWateringReminderFromGoogleCalendar(supabase, user.id, result.data.id);

  revalidatePath("/app");
  revalidatePath(`/app/plants/${plant.id}`);

  return {
    status: "success",
    message: "Watering reminder paused. Your plant details and watering history are unchanged.",
  };
}

export async function snoozeWateringReminderAction(
  plantId: string,
  previousState: WateringReminderState,
  formData: FormData,
): Promise<WateringReminderState> {
  void previousState;
  const { supabase, user } = await getSignedInPlantContext();
  const plantResult = await getPlantForUser(supabase, user.id, plantId);
  const plant = plantResult.data;

  if (plantResult.error || !plant || plant.archived_at) {
    return {
      status: "error",
      message: "Could not snooze this reminder. Please refresh and try again.",
    };
  }

  const reminderResult = await getWateringReminderForPlant(supabase, user.id, plant.id);
  const reminder = reminderResult.data;
  const snoozeValue = formData.get("snoozeDays");
  const snoozeDays = snoozeValue === "3" ? 3 : 1;

  if (!reminder?.enabled || !reminder.next_reminder_date) {
    return {
      status: "error",
      message: "Turn on this reminder before snoozing it.",
    };
  }

  const nextReminderDate = addReminderDaysToDateValue(
    reminder.next_reminder_date,
    snoozeDays,
  );
  const result = await upsertWateringReminderForPlant(supabase, user.id, plant.id, {
    enabled: true,
    reminder_mode: reminder.reminder_mode,
    next_reminder_date: nextReminderDate,
  });

  if (result.error || !result.data) {
    return {
      status: "error",
      message: result.error ?? "Could not snooze this reminder right now.",
    };
  }

  await syncWateringReminderToGoogleCalendar(supabase, user.id, plant, result.data);

  revalidatePath("/app");
  revalidatePath(`/app/plants/${plant.id}`);

  return {
    status: "success",
    message: `Snoozed until ${nextReminderDate}.`,
  };
}

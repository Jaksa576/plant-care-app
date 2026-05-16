import {
  emptyPlantFormValues,
  type PlantFormState,
  type PlantFormValues,
  type PlantInput,
} from "@/lib/plants/types";

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function normalizeText(value: string) {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeLongText(value: string) {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function getValues(formData: FormData): PlantFormValues {
  return {
    nickname: readString(formData, "nickname"),
    commonName: readString(formData, "commonName"),
    scientificName: readString(formData, "scientificName"),
    location: readString(formData, "location"),
    roomId: readString(formData, "roomId"),
    newRoomName: readString(formData, "newRoomName"),
    notes: readString(formData, "notes"),
    wateringIntervalDays: readString(formData, "wateringIntervalDays"),
    wateringGuidance: readString(formData, "wateringGuidance"),
  };
}

export function createPlantFormErrorState(
  values: PlantFormValues,
  message: string,
  fieldErrors: PlantFormState["fieldErrors"] = {},
): PlantFormState {
  return {
    status: "error",
    message,
    fieldErrors,
    values,
  };
}

export function parsePlantFormData(formData: FormData) {
  const values = getValues(formData);
  const fieldErrors: PlantFormState["fieldErrors"] = {};

  const nickname = normalizeText(values.nickname);
  const common_name = normalizeText(values.commonName);
  const scientific_name = normalizeText(values.scientificName);
  const location = normalizeText(values.location);
  const room_id = normalizeText(values.roomId);
  const notes = normalizeLongText(values.notes);
  const watering_guidance = normalizeLongText(values.wateringGuidance);

  if (!nickname) {
    fieldErrors.nickname = "Add a nickname so this plant has a clear label.";
  }

  let watering_interval_days: number | null = null;

  if (values.wateringIntervalDays.trim().length > 0) {
    const parsed = Number.parseInt(values.wateringIntervalDays, 10);

    if (!Number.isInteger(parsed) || parsed <= 0) {
      fieldErrors.wateringIntervalDays =
        "Enter a whole number of days or leave this blank for now.";
    } else {
      watering_interval_days = parsed;
    }
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false as const,
      state: createPlantFormErrorState(
        values,
        "Please fix the highlighted fields before saving this plant.",
        fieldErrors,
      ),
    };
  }

  return {
    success: true as const,
    values,
    plantInput: {
      nickname,
      common_name,
      scientific_name,
      location,
      room_id,
      notes,
      watering_interval_days,
      watering_guidance,
    } satisfies PlantInput,
  };
}

export function toPlantFormValues(input?: Partial<PlantInput> | null): PlantFormValues {
  if (!input) {
    return emptyPlantFormValues;
  }

  return {
    nickname: input.nickname ?? "",
    commonName: input.common_name ?? "",
    scientificName: input.scientific_name ?? "",
    location: input.location ?? "",
    roomId: input.room_id ?? "",
    newRoomName: "",
    notes: input.notes ?? "",
    wateringIntervalDays:
      typeof input.watering_interval_days === "number"
        ? String(input.watering_interval_days)
        : "",
    wateringGuidance: input.watering_guidance ?? "",
  };
}

export type PlantRecord = {
  id: string;
  user_id: string;
  nickname: string | null;
  common_name: string | null;
  scientific_name: string | null;
  location: string | null;
  notes: string | null;
  watering_interval_days: number | null;
  watering_guidance: string | null;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
};

export type PlantInput = {
  nickname: string | null;
  common_name: string | null;
  scientific_name: string | null;
  location: string | null;
  notes: string | null;
  watering_interval_days: number | null;
  watering_guidance: string | null;
};

export type PlantFormValues = {
  nickname: string;
  commonName: string;
  scientificName: string;
  location: string;
  notes: string;
  wateringIntervalDays: string;
  wateringGuidance: string;
};

export type PlantFormState = {
  status: "idle" | "error";
  message: string | null;
  fieldErrors: Partial<Record<keyof PlantFormValues, string>>;
  values: PlantFormValues;
};

export const emptyPlantFormValues: PlantFormValues = {
  nickname: "",
  commonName: "",
  scientificName: "",
  location: "",
  notes: "",
  wateringIntervalDays: "",
  wateringGuidance: "",
};

export const emptyPlantFormState: PlantFormState = {
  status: "idle",
  message: null,
  fieldErrors: {},
  values: emptyPlantFormValues,
};

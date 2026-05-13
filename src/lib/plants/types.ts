export type PlantRecord = {
  id: string;
  user_id: string;
  nickname: string | null;
  common_name: string | null;
  scientific_name: string | null;
  location: string | null;
  room_id: string | null;
  notes: string | null;
  watering_interval_days: number | null;
  watering_guidance: string | null;
  primary_photo_path: string | null;
  primary_photo_uploaded_at: string | null;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
};

export type WateringEventRecord = {
  id: string;
  plant_id: string;
  user_id: string;
  watered_at: string;
  created_at: string;
};

export type WateringReminderRecord = {
  id: string;
  user_id: string;
  plant_id: string;
  reminder_type: "watering";
  reminder_mode: "after_watering" | "fixed_schedule";
  enabled: boolean;
  next_reminder_date: string | null;
  reminder_time: string | null;
  created_at: string;
  updated_at: string;
};

export type GoogleCalendarConnectionRecord = {
  id: string;
  user_id: string;
  provider: "google";
  encrypted_refresh_token: string;
  token_iv: string;
  token_auth_tag: string;
  calendar_id: string;
  connected_at: string;
  last_sync_status: "idle" | "success" | "error" | "cleanup_warning";
  last_sync_error: string | null;
  last_synced_at: string | null;
  created_at: string;
  updated_at: string;
};

export type GoogleCalendarEventLinkRecord = {
  id: string;
  user_id: string;
  reminder_id: string;
  google_event_id: string;
  calendar_id: string;
  last_sync_status: "idle" | "success" | "error" | "cleanup_warning";
  last_sync_error: string | null;
  last_synced_at: string | null;
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

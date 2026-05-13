export type PlantRoomRecord = {
  id: string;
  user_id: string;
  name: string;
  sort_order: number | null;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
};

export type PlantRoomInput = {
  name: string;
  sort_order?: number | null;
};

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getAuthState } from "@/lib/auth";
import type { MarkWateredState } from "@/components/mark-watered-form";
import {
  archivePlantForUser,
  createPlantForUser,
  getPlantForUser,
  updatePlantForUser,
} from "@/lib/plants/data";
import { createPlantFormErrorState, parsePlantFormData } from "@/lib/plants/forms";
import { emptyPlantFormState, type PlantFormState } from "@/lib/plants/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createWateringEventForPlant } from "@/lib/watering/data";

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

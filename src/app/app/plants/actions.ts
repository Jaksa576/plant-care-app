"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getAuthState } from "@/lib/auth";
import {
  archivePlantForUser,
  createPlantForUser,
  updatePlantForUser,
} from "@/lib/plants/data";
import { createPlantFormErrorState, parsePlantFormData } from "@/lib/plants/forms";
import { emptyPlantFormState, type PlantFormState } from "@/lib/plants/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

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

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getAuthState } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { completeOnboardingForUser } from "@/lib/user-preferences/data";

function getRedirectPath(value: FormDataEntryValue | null) {
  return value === "/app/plants/new" ? "/app/plants/new" : "/app";
}

export async function completeOnboardingAction(formData: FormData) {
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

  const result = await completeOnboardingForUser(supabase, authState.user.id);
  const redirectTo = getRedirectPath(formData.get("redirectTo"));

  if (result.error) {
    redirect(`/app/onboarding?error=save&redirectTo=${encodeURIComponent(redirectTo)}`);
  }

  revalidatePath("/app");
  revalidatePath("/app/settings");
  redirect(redirectTo);
}

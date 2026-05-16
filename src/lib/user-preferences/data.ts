import type { SupabaseClient } from "@supabase/supabase-js";

type PreferencesClient = SupabaseClient;

export type UserAppPreferencesRecord = {
  id: string;
  user_id: string;
  onboarding_completed_at: string | null;
  setup_checklist_dismissed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type UserAppPreferencesQueryResult<T> =
  | { data: T; error: null }
  | { data: null; error: string };

function getPreferencesErrorMessage(fallback: string, error?: { message?: string } | null) {
  if (!error) {
    return fallback;
  }

  const message = error.message?.trim();
  return message ? `${fallback} ${message}` : fallback;
}

export async function getUserAppPreferencesForUser(
  supabase: PreferencesClient,
  userId: string,
): Promise<UserAppPreferencesQueryResult<UserAppPreferencesRecord | null>> {
  const { data, error } = await supabase
    .from("user_app_preferences")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    return {
      data: null,
      error: getPreferencesErrorMessage("We couldn't load setup preferences right now.", error),
    };
  }

  return {
    data: (data as UserAppPreferencesRecord | null) ?? null,
    error: null,
  };
}

export async function completeOnboardingForUser(
  supabase: PreferencesClient,
  userId: string,
): Promise<UserAppPreferencesQueryResult<UserAppPreferencesRecord>> {
  const completedAt = new Date().toISOString();
  const { data, error } = await supabase
    .from("user_app_preferences")
    .upsert(
      {
        user_id: userId,
        onboarding_completed_at: completedAt,
      },
      { onConflict: "user_id" },
    )
    .select("*")
    .single();

  if (error) {
    return {
      data: null,
      error: getPreferencesErrorMessage("We couldn't save setup preferences right now.", error),
    };
  }

  return {
    data: data as UserAppPreferencesRecord,
    error: null,
  };
}

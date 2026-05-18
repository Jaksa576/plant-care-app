import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  CareProfileAliasRecord,
  CareProfileRecord,
  CareProfileWithAliases,
} from "@/lib/care-profiles/types";

type CareProfileClient = SupabaseClient;

export type CareProfileQueryResult<T> =
  | { data: T; error: null }
  | { data: null; error: string };

export async function listCareProfiles(
  supabase: CareProfileClient,
): Promise<CareProfileQueryResult<CareProfileWithAliases[]>> {
  const { data: profiles, error: profilesError } = await supabase
    .from("care_profiles")
    .select("*")
    .order("profile_level", { ascending: true })
    .order("display_name", { ascending: true });

  if (profilesError) {
    return {
      data: null,
      error: "We couldn't load care profiles right now.",
    };
  }

  const { data: aliases, error: aliasesError } = await supabase
    .from("care_profile_aliases")
    .select("*")
    .order("priority", { ascending: true });

  if (aliasesError) {
    return {
      data: null,
      error: "We couldn't load care profile aliases right now.",
    };
  }

  const aliasesByProfileId = new Map<string, CareProfileAliasRecord[]>();

  for (const alias of (aliases ?? []) as CareProfileAliasRecord[]) {
    const profileAliases = aliasesByProfileId.get(alias.care_profile_id) ?? [];
    profileAliases.push(alias);
    aliasesByProfileId.set(alias.care_profile_id, profileAliases);
  }

  return {
    data: ((profiles ?? []) as CareProfileRecord[]).map((profile) => ({
      ...profile,
      aliases: aliasesByProfileId.get(profile.id) ?? [],
    })),
    error: null,
  };
}

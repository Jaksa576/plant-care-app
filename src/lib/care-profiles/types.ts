export type CareProfileLevel = "species" | "genus" | "care_group" | "fallback";

export type DrynessPreference =
  | "dry_fully"
  | "dry_mostly"
  | "dry_top_half"
  | "dry_top_inch"
  | "lightly_moist"
  | "evenly_moist"
  | "special_medium"
  | "unknown_conservative";

export type CareProfileMatchConfidence = "high" | "medium" | "low";

export type CareProfileReviewStatus = "draft" | "reviewed" | "needs_review";

export type CareProfileAliasType =
  | "scientific"
  | "synonym"
  | "common"
  | "normalized_common"
  | "genus"
  | "group";

export type CareProfileRecord = {
  id: string;
  profile_key: string;
  profile_level: CareProfileLevel;
  display_name: string;
  accepted_scientific_name: string | null;
  accepted_common_name: string;
  taxon_rank: string | null;
  watering_interval_days_default: number;
  watering_interval_days_min: number | null;
  watering_interval_days_max: number | null;
  dryness_preference: DrynessPreference;
  watering_guidance: string;
  light_guidance: string | null;
  soil_pot_drainage_guidance: string | null;
  humidity_guidance: string | null;
  seasonal_note: string | null;
  beginner_note: string | null;
  toxicity_note: string | null;
  match_confidence: CareProfileMatchConfidence;
  review_status: CareProfileReviewStatus;
  source_summary: string | null;
  source_links: unknown;
  last_reviewed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type CareProfileAliasRecord = {
  id: string;
  care_profile_id: string;
  alias: string;
  normalized_alias: string;
  alias_type: CareProfileAliasType;
  priority: number;
  created_at: string;
};

export type CareProfileWithAliases = CareProfileRecord & {
  aliases: CareProfileAliasRecord[];
};

export type CareProfileMatchInput = {
  scientificName?: string | null;
  commonName?: string | null;
  careGroupAlias?: string | null;
};

export type CareProfileMatchType =
  | "scientific"
  | "synonym"
  | "common"
  | "genus"
  | "care_group"
  | "fallback";

export type CareProfileMatchResult =
  | {
      status: "matched";
      matchType: CareProfileMatchType;
      profile: CareProfileWithAliases;
      matchedAlias: string | null;
    }
  | {
      status: "ambiguous";
      matchType: CareProfileMatchType;
      matchedAlias: string;
      profiles: CareProfileWithAliases[];
    }
  | {
      status: "no_match";
    };

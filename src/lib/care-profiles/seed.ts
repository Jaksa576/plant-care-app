import {
  CARE_PROFILE_FIXTURES,
  careProfileFixtureAliasRows,
} from "@/lib/care-profiles/fixtures";
import type { CareProfileAliasRecord, CareProfileWithAliases } from "@/lib/care-profiles/types";

const now = "2026-05-18T00:00:00.000Z";

function profileFromFixture(fixture: (typeof CARE_PROFILE_FIXTURES)[number]): CareProfileWithAliases {
  const id = fixture.profileKey;
  const aliases = careProfileFixtureAliasRows()
    .filter((profileAlias) => profileAlias.profileKey === fixture.profileKey)
    .map<CareProfileAliasRecord>((profileAlias, index) => ({
      id: `${id}-alias-${index + 1}`,
      care_profile_id: id,
      alias: profileAlias.alias,
      normalized_alias: profileAlias.normalizedAlias,
      alias_type: profileAlias.aliasType,
      priority: profileAlias.priority,
      created_at: now,
    }));

  return {
    id,
    profile_key: fixture.profileKey,
    profile_level: fixture.profileLevel,
    display_name: fixture.displayName,
    accepted_scientific_name: fixture.acceptedScientificName,
    accepted_common_name: fixture.acceptedCommonName,
    taxon_rank: fixture.taxonRank,
    watering_interval_days_default: fixture.wateringIntervalDaysDefault,
    watering_interval_days_min: fixture.wateringIntervalDaysMin,
    watering_interval_days_max: fixture.wateringIntervalDaysMax,
    dryness_preference: fixture.drynessPreference,
    watering_guidance: fixture.wateringGuidance,
    light_guidance: null,
    soil_pot_drainage_guidance: null,
    humidity_guidance: null,
    seasonal_note: null,
    beginner_note: fixture.beginnerNote,
    toxicity_note: null,
    match_confidence: fixture.matchConfidence,
    review_status: fixture.reviewStatus,
    source_summary: fixture.sourceSummary,
    source_links: null,
    last_reviewed_at: null,
    created_at: now,
    updated_at: now,
    aliases,
  };
}

export const MINIMAL_CARE_PROFILES: CareProfileWithAliases[] =
  CARE_PROFILE_FIXTURES.map(profileFromFixture);

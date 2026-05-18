export { listCareProfiles } from "@/lib/care-profiles/data";
export { findCareProfileMatch, getFallbackCareProfile } from "@/lib/care-profiles/lookup";
export { getNormalizedGenus, normalizeCareProfileName } from "@/lib/care-profiles/normalize";
export { MINIMAL_CARE_PROFILES } from "@/lib/care-profiles/seed";
export type {
  CareProfileAliasRecord,
  CareProfileAliasType,
  CareProfileLevel,
  CareProfileMatchConfidence,
  CareProfileMatchInput,
  CareProfileMatchResult,
  CareProfileMatchType,
  CareProfileRecord,
  CareProfileReviewStatus,
  CareProfileWithAliases,
  DrynessPreference,
} from "@/lib/care-profiles/types";

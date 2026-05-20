import {
  getNormalizedGenus,
  getScientificNameCandidates,
  normalizeCareProfileName,
} from "@/lib/care-profiles/normalize";
import { MINIMAL_CARE_PROFILES } from "@/lib/care-profiles/seed";
import type {
  CareProfileAliasType,
  CareProfileMatchInput,
  CareProfileMatchResult,
  CareProfileMatchType,
  CareProfileWithAliases,
} from "@/lib/care-profiles/types";

const matchTypeAliasTypes: Record<CareProfileMatchType, CareProfileAliasType[]> = {
  scientific: ["scientific"],
  synonym: ["synonym"],
  common: ["common", "normalized_common"],
  genus: ["genus"],
  care_group: ["group"],
  fallback: ["group"],
};

function uniqueProfiles(profiles: CareProfileWithAliases[]) {
  const profilesByKey = new Map<string, CareProfileWithAliases>();

  for (const profile of profiles) {
    profilesByKey.set(profile.profile_key, profile);
  }

  return [...profilesByKey.values()];
}

function sortProfilesByAliasPriority(
  profiles: CareProfileWithAliases[],
  normalizedAlias: string,
  allowedAliasTypes: CareProfileAliasType[],
) {
  return [...profiles].sort((profileA, profileB) => {
    const priorityA =
      profileA.aliases.find(
        (alias) =>
          alias.normalized_alias === normalizedAlias && allowedAliasTypes.includes(alias.alias_type),
      )?.priority ?? 1000;
    const priorityB =
      profileB.aliases.find(
        (alias) =>
          alias.normalized_alias === normalizedAlias && allowedAliasTypes.includes(alias.alias_type),
      )?.priority ?? 1000;

    return priorityA - priorityB || profileA.display_name.localeCompare(profileB.display_name);
  });
}

function findProfilesByAlias(
  profiles: CareProfileWithAliases[],
  normalizedAlias: string,
  matchType: CareProfileMatchType,
) {
  const allowedAliasTypes = matchTypeAliasTypes[matchType];
  const matchingProfiles = profiles.filter((profile) =>
    profile.aliases.some(
      (alias) =>
        alias.normalized_alias === normalizedAlias && allowedAliasTypes.includes(alias.alias_type),
    ),
  );

  return sortProfilesByAliasPriority(uniqueProfiles(matchingProfiles), normalizedAlias, allowedAliasTypes);
}

function findProfilesByAcceptedScientificName(
  profiles: CareProfileWithAliases[],
  normalizedScientificName: string,
) {
  return profiles.filter(
    (profile) =>
      profile.accepted_scientific_name &&
      normalizeCareProfileName(profile.accepted_scientific_name) === normalizedScientificName,
  );
}

function toMatchResult(
  profiles: CareProfileWithAliases[],
  matchType: CareProfileMatchType,
  matchedAlias: string,
): CareProfileMatchResult {
  if (profiles.length === 0) {
    return { status: "no_match" };
  }

  if (profiles.length === 1) {
    return {
      status: "matched",
      matchType,
      profile: profiles[0],
      matchedAlias,
    };
  }

  return {
    status: "ambiguous",
    matchType,
    matchedAlias,
    profiles,
  };
}

function matchNormalizedName(
  profiles: CareProfileWithAliases[],
  normalizedName: string,
  matchType: CareProfileMatchType,
): CareProfileMatchResult {
  if (!normalizedName) {
    return { status: "no_match" };
  }

  return toMatchResult(findProfilesByAlias(profiles, normalizedName, matchType), matchType, normalizedName);
}

export function findCareProfileMatch(
  input: CareProfileMatchInput,
  profiles: CareProfileWithAliases[] = MINIMAL_CARE_PROFILES,
): CareProfileMatchResult {
  const scientificNameCandidates = getScientificNameCandidates(input.scientificName);

  for (const normalizedScientificName of scientificNameCandidates) {
    const exactScientificMatch = toMatchResult(
      findProfilesByAcceptedScientificName(profiles, normalizedScientificName),
      "scientific",
      normalizedScientificName,
    );

    if (exactScientificMatch.status !== "no_match") {
      return exactScientificMatch;
    }
  }

  for (const normalizedScientificName of scientificNameCandidates) {
    const scientificAliasMatch = matchNormalizedName(profiles, normalizedScientificName, "scientific");

    if (scientificAliasMatch.status !== "no_match") {
      return scientificAliasMatch;
    }
  }

  for (const normalizedScientificName of scientificNameCandidates) {
    const synonymMatch = matchNormalizedName(profiles, normalizedScientificName, "synonym");

    if (synonymMatch.status !== "no_match") {
      return synonymMatch;
    }
  }

  const normalizedCommonName = normalizeCareProfileName(input.commonName);
  const commonMatch = matchNormalizedName(profiles, normalizedCommonName, "common");

  if (commonMatch.status !== "no_match") {
    return commonMatch;
  }

  const genusMatch = matchNormalizedName(profiles, getNormalizedGenus(input.scientificName), "genus");

  if (genusMatch.status !== "no_match") {
    return genusMatch;
  }

  const careGroupMatch = matchNormalizedName(
    profiles,
    normalizeCareProfileName(input.careGroupAlias),
    "care_group",
  );

  if (careGroupMatch.status !== "no_match") {
    return careGroupMatch;
  }

  return { status: "no_match" };
}

export function getFallbackCareProfile(
  profiles: CareProfileWithAliases[] = MINIMAL_CARE_PROFILES,
) {
  return profiles.find((profile) => profile.profile_level === "fallback") ?? null;
}

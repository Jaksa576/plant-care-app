import { normalizeCareProfileName } from "@/lib/care-profiles/normalize";
import type {
  CareProfileAliasType,
  CareProfileLevel,
  CareProfileMatchConfidence,
  CareProfileReviewStatus,
  DrynessPreference,
} from "@/lib/care-profiles/types";

export type CareProfileAliasFixture = {
  alias: string;
  aliasType: CareProfileAliasType;
  priority?: number;
  allowAmbiguous?: boolean;
};

export type CareProfileFixture = {
  profileKey: string;
  profileLevel: CareProfileLevel;
  displayName: string;
  acceptedScientificName: string | null;
  acceptedCommonName: string;
  taxonRank: string | null;
  wateringIntervalDaysDefault: number;
  wateringIntervalDaysMin: number | null;
  wateringIntervalDaysMax: number | null;
  drynessPreference: DrynessPreference;
  wateringGuidance: string;
  beginnerNote: string;
  matchConfidence: CareProfileMatchConfidence;
  reviewStatus: CareProfileReviewStatus;
  sourceSummary: string;
  aliases: CareProfileAliasFixture[];
};

const sourceSummary =
  "Wave 1 conservative starter profile compiled for Plant Care setup; concise copy should be reviewed during user-facing QA.";

function alias(
  value: string,
  aliasType: CareProfileAliasType,
  priority = 50,
  allowAmbiguous = false,
): CareProfileAliasFixture {
  return {
    alias: value,
    aliasType,
    priority,
    allowAmbiguous,
  };
}

function species(
  profileKey: string,
  displayName: string,
  scientificName: string,
  commonName: string,
  wateringIntervalDaysDefault: number,
  range: [number, number],
  drynessPreference: DrynessPreference,
  wateringGuidance: string,
  aliases: CareProfileAliasFixture[],
): CareProfileFixture {
  return {
    profileKey,
    profileLevel: "species",
    displayName,
    acceptedScientificName: scientificName,
    acceptedCommonName: commonName,
    taxonRank: "species",
    wateringIntervalDaysDefault,
    wateringIntervalDaysMin: range[0],
    wateringIntervalDaysMax: range[1],
    drynessPreference,
    wateringGuidance,
    beginnerNote: "Common houseplant starter profile for editable watering setup.",
    matchConfidence: "medium",
    reviewStatus: "needs_review",
    sourceSummary,
    aliases: [alias(scientificName, "scientific", 10), alias(commonName, "common", 10), ...aliases],
  };
}

function genus(
  profileKey: string,
  displayName: string,
  wateringIntervalDaysDefault: number,
  range: [number, number],
  drynessPreference: DrynessPreference,
  wateringGuidance: string,
  aliases: CareProfileAliasFixture[] = [],
): CareProfileFixture {
  return {
    profileKey,
    profileLevel: "genus",
    displayName,
    acceptedScientificName: displayName,
    acceptedCommonName: displayName,
    taxonRank: "genus",
    wateringIntervalDaysDefault,
    wateringIntervalDaysMin: range[0],
    wateringIntervalDaysMax: range[1],
    drynessPreference,
    wateringGuidance,
    beginnerNote: "Genus-level starter for cases where exact species is uncertain.",
    matchConfidence: "medium",
    reviewStatus: "needs_review",
    sourceSummary,
    aliases: [alias(displayName, "genus", 10), ...aliases],
  };
}

function genusCommon(
  profileKey: string,
  displayName: string,
  scientificGenus: string,
  commonName: string,
  wateringIntervalDaysDefault: number,
  range: [number, number],
  drynessPreference: DrynessPreference,
  wateringGuidance: string,
  aliases: CareProfileAliasFixture[] = [],
): CareProfileFixture {
  return {
    profileKey,
    profileLevel: "genus",
    displayName,
    acceptedScientificName: scientificGenus,
    acceptedCommonName: commonName,
    taxonRank: "genus",
    wateringIntervalDaysDefault,
    wateringIntervalDaysMin: range[0],
    wateringIntervalDaysMax: range[1],
    drynessPreference,
    wateringGuidance,
    beginnerNote: "Common houseplant starter profile for editable watering setup.",
    matchConfidence: "medium",
    reviewStatus: "needs_review",
    sourceSummary,
    aliases: [
      alias(scientificGenus, "genus", 10),
      alias(commonName, "common", 10),
      ...aliases,
    ],
  };
}

function careGroup(
  profileKey: string,
  displayName: string,
  wateringIntervalDaysDefault: number,
  range: [number, number],
  drynessPreference: DrynessPreference,
  wateringGuidance: string,
  aliases: CareProfileAliasFixture[],
  profileLevel: CareProfileLevel = "care_group",
): CareProfileFixture {
  return {
    profileKey,
    profileLevel,
    displayName,
    acceptedScientificName: null,
    acceptedCommonName: displayName,
    taxonRank: null,
    wateringIntervalDaysDefault,
    wateringIntervalDaysMin: range[0],
    wateringIntervalDaysMax: range[1],
    drynessPreference,
    wateringGuidance,
    beginnerNote: "Care-group starter for conservative setup when identity is broad or uncertain.",
    matchConfidence: "low",
    reviewStatus: "needs_review",
    sourceSummary,
    aliases,
  };
}

export const CARE_PROFILE_FIXTURES: CareProfileFixture[] = [
  species(
    "species-dracaena-trifasciata",
    "Snake plant",
    "Dracaena trifasciata",
    "Snake plant",
    21,
    [14, 28],
    "dry_fully",
    "Check when the soil has dried through most or all of the pot, then water thoroughly and drain.",
    [alias("Sansevieria trifasciata", "synonym", 20), alias("Mother-in-law's tongue", "common", 30)],
  ),
  species(
    "species-epipremnum-aureum",
    "Pothos",
    "Epipremnum aureum",
    "Pothos",
    10,
    [7, 14],
    "dry_top_half",
    "Check when the top half of the soil feels dry and the pot feels lighter.",
    [alias("Devil's ivy", "common", 20), alias("Golden pothos", "common", 20), alias("Money plant", "common", 90, true)],
  ),
  species(
    "species-monstera-deliciosa",
    "Monstera",
    "Monstera deliciosa",
    "Monstera",
    10,
    [7, 14],
    "dry_top_inch",
    "Check when the top inch or two feels dry; water deeply and let extra water drain.",
    [alias("Swiss cheese plant", "common", 20)],
  ),
  genusCommon(
    "genus-spathiphyllum",
    "Peace lily",
    "Spathiphyllum",
    "Peace lily",
    7,
    [5, 10],
    "lightly_moist",
    "Check often and water when the surface starts to dry, before the plant wilts hard.",
    [],
  ),
  species(
    "species-zamioculcas-zamiifolia",
    "ZZ plant",
    "Zamioculcas zamiifolia",
    "ZZ plant",
    21,
    [14, 30],
    "dry_fully",
    "Check that the mix is fully dry before watering; this plant stores water and dislikes soggy soil.",
    [alias("Zanzibar gem", "common", 20)],
  ),
  species(
    "species-chlorophytum-comosum",
    "Spider plant",
    "Chlorophytum comosum",
    "Spider plant",
    7,
    [7, 14],
    "dry_top_inch",
    "Check weekly and water when the top inch feels dry.",
    [],
  ),
  species(
    "species-aloe-vera",
    "Aloe vera",
    "Aloe vera",
    "Aloe vera",
    21,
    [14, 30],
    "dry_fully",
    "Let the potting mix dry fully before watering again, then drain well.",
    [alias("Aloe", "common", 20)],
  ),
  species(
    "species-crassula-ovata",
    "Jade plant",
    "Crassula ovata",
    "Jade plant",
    21,
    [14, 30],
    "dry_fully",
    "Check that the mix is dry before watering; thick leaves usually prefer a cautious cadence.",
    [],
  ),
  species(
    "species-ficus-elastica",
    "Rubber plant",
    "Ficus elastica",
    "Rubber plant",
    10,
    [7, 14],
    "dry_top_half",
    "Check when the top half of the soil has dried; avoid leaving the pot in standing water.",
    [alias("Rubber tree", "common", 20)],
  ),
  species(
    "species-ficus-lyrata",
    "Fiddle leaf fig",
    "Ficus lyrata",
    "Fiddle leaf fig",
    10,
    [7, 14],
    "dry_top_half",
    "Check when the top half of the soil is dry; water evenly and let the pot drain.",
    [],
  ),
  species(
    "species-pilea-peperomioides",
    "Chinese money plant",
    "Pilea peperomioides",
    "Chinese money plant",
    7,
    [7, 10],
    "dry_top_inch",
    "Check when the top inch feels dry, then water and drain fully.",
    [alias("Money plant", "common", 90, true), alias("Pancake plant", "common", 20)],
  ),
  species(
    "species-nephrolepis-exaltata",
    "Boston fern",
    "Nephrolepis exaltata",
    "Boston fern",
    5,
    [3, 7],
    "evenly_moist",
    "Check every few days and keep the soil evenly moist, not soggy.",
    [],
  ),
  species(
    "species-philodendron-hederaceum",
    "Heartleaf philodendron",
    "Philodendron hederaceum",
    "Heartleaf philodendron",
    10,
    [7, 14],
    "dry_top_half",
    "Check when the top half of the soil feels dry; this is a forgiving starter cadence.",
    [],
  ),
  genusCommon(
    "genus-phalaenopsis",
    "Moth orchid",
    "Phalaenopsis",
    "Orchid",
    7,
    [5, 10],
    "special_medium",
    "Check the bark or moss mix; water when it is nearly dry, then let water drain completely.",
    [alias("Phalaenopsis orchid", "common", 20), alias("Moth orchid", "common", 20)],
  ),
  genusCommon(
    "genus-saintpaulia",
    "African violet",
    "Saintpaulia",
    "African violet",
    7,
    [5, 10],
    "lightly_moist",
    "Check when the surface starts to dry and water carefully without soaking the leaves.",
    [alias("Streptocarpus sect. Saintpaulia", "synonym", 20)],
  ),
  species(
    "species-hedera-helix",
    "English ivy",
    "Hedera helix",
    "English ivy",
    7,
    [5, 10],
    "dry_top_inch",
    "Check when the top inch dries; avoid letting the pot stay soggy.",
    [],
  ),
  genus("genus-philodendron", "Philodendron", 10, [7, 14], "dry_top_half", "Check when the top half of the soil has dried; avoid soggy soil."),
  genus("genus-dracaena", "Dracaena", 14, [10, 21], "dry_mostly", "Check when most of the soil has dried; many dracaenas prefer a cautious cadence."),
  genus("genus-peperomia", "Peperomia", 10, [7, 14], "dry_top_half", "Check when the top half is dry; water lightly and drain well."),
  genus("genus-ficus", "Ficus", 10, [7, 14], "dry_top_half", "Check when the upper soil has dried; keep the cadence steady and avoid soggy roots."),
  genus("genus-hoya", "Hoya", 14, [10, 21], "dry_mostly", "Check that most of the potting mix is dry before watering."),
  careGroup("care-group-succulent-like", "Succulent-like houseplant", 21, [14, 30], "dry_fully", "Start cautiously: check that the mix is fully dry before watering.", [
    alias("Succulent", "group", 10),
    alias("Succulent-like", "group", 20),
  ]),
  careGroup("care-group-cactus", "Cactus / very dry houseplant", 28, [21, 35], "dry_fully", "Check infrequently and water only after the mix has fully dried.", [
    alias("Cactus", "group", 10),
  ]),
  careGroup("care-group-moderate-tropical", "Moderate tropical houseplant", 7, [7, 14], "dry_top_inch", "Start by checking weekly and water when the top inch feels dry.", [
    alias("Tropical houseplant", "group", 10),
  ]),
  careGroup("care-group-moisture-loving-tropical", "Moisture-loving tropical houseplant", 5, [3, 7], "lightly_moist", "Check often and keep lightly moist, but do not leave the pot soggy.", [
    alias("Moisture-loving tropical", "group", 10),
  ]),
  careGroup("care-group-fern", "Fern / evenly moist houseplant", 5, [3, 7], "evenly_moist", "Check often and keep evenly moist with good drainage.", [
    alias("Fern", "group", 10),
  ]),
  careGroup("care-group-orchid-bark", "Orchid in bark mix", 7, [5, 10], "special_medium", "Check the bark mix and water when it is nearly dry, then drain completely.", [
    alias("Orchid in bark", "group", 10),
  ]),
  careGroup("care-group-palm", "Palm houseplant", 7, [7, 14], "dry_top_inch", "Check when the top inch dries and water evenly through the pot.", [
    alias("Palm", "group", 10),
  ]),
  careGroup("fallback-unknown-conservative", "Unknown conservative starter", 7, [5, 10], "unknown_conservative", "Start by checking every week and water only when the top inch feels dry; adjust after you learn the plant.", [
    alias("Unknown houseplant", "group", 10),
  ], "fallback"),
];

export function careProfileFixtureAliasRows() {
  return CARE_PROFILE_FIXTURES.flatMap((profile) =>
    profile.aliases.map((profileAlias) => ({
      profileKey: profile.profileKey,
      alias: profileAlias.alias,
      normalizedAlias: normalizeCareProfileName(profileAlias.alias),
      aliasType: profileAlias.aliasType,
      priority: profileAlias.priority ?? 50,
      allowAmbiguous: profileAlias.allowAmbiguous ?? false,
    })),
  );
}

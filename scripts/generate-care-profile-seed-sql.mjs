import fs from "node:fs";
import { createRequire } from "node:module";
import Module from "node:module";
import path from "node:path";
import process from "node:process";

import ts from "typescript";

const rootDir = process.cwd();
const oldResolve = Module._resolveFilename;

Module._resolveFilename = function resolveAlias(request, parent, isMain, options) {
  if (request.startsWith("@/")) {
    return oldResolve.call(this, path.join(rootDir, "src", request.slice(2)), parent, isMain, options);
  }

  return oldResolve.call(this, request, parent, isMain, options);
};

Module._extensions[".ts"] = function loadTypeScript(module, filename) {
  const source = fs.readFileSync(filename, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;

  module._compile(output, filename);
};

const require = createRequire(import.meta.url);
const { CARE_PROFILE_FIXTURES, careProfileFixtureAliasRows } = require(
  "../src/lib/care-profiles/fixtures.ts",
);

function sql(value) {
  if (value === null || value === undefined) {
    return "null";
  }

  if (typeof value === "number") {
    return String(value);
  }

  return `'${String(value).replaceAll("'", "''")}'`;
}

const profileRows = CARE_PROFILE_FIXTURES.map((profile) => `  (${[
  profile.profileKey,
  profile.profileLevel,
  profile.displayName,
  profile.acceptedScientificName,
  profile.acceptedCommonName,
  profile.taxonRank,
  profile.wateringIntervalDaysDefault,
  profile.wateringIntervalDaysMin,
  profile.wateringIntervalDaysMax,
  profile.drynessPreference,
  profile.wateringGuidance,
  profile.beginnerNote,
  profile.matchConfidence,
  profile.reviewStatus,
  profile.sourceSummary,
].map(sql).join(", ")})`).join(",\n");

const aliasRows = careProfileFixtureAliasRows().map((alias) => `  (${[
  alias.profileKey,
  alias.alias,
  alias.normalizedAlias,
  alias.aliasType,
  alias.priority,
].map(sql).join(", ")})`).join(",\n");

const output = `-- Generated from src/lib/care-profiles/fixtures.ts.
-- Regenerate with: node scripts/generate-care-profile-seed-sql.mjs

insert into public.care_profiles (
  profile_key,
  profile_level,
  display_name,
  accepted_scientific_name,
  accepted_common_name,
  taxon_rank,
  watering_interval_days_default,
  watering_interval_days_min,
  watering_interval_days_max,
  dryness_preference,
  watering_guidance,
  beginner_note,
  match_confidence,
  review_status,
  source_summary
)
values
${profileRows}
on conflict (profile_key) do update
set
  profile_level = excluded.profile_level,
  display_name = excluded.display_name,
  accepted_scientific_name = excluded.accepted_scientific_name,
  accepted_common_name = excluded.accepted_common_name,
  taxon_rank = excluded.taxon_rank,
  watering_interval_days_default = excluded.watering_interval_days_default,
  watering_interval_days_min = excluded.watering_interval_days_min,
  watering_interval_days_max = excluded.watering_interval_days_max,
  dryness_preference = excluded.dryness_preference,
  watering_guidance = excluded.watering_guidance,
  beginner_note = excluded.beginner_note,
  match_confidence = excluded.match_confidence,
  review_status = excluded.review_status,
  source_summary = excluded.source_summary;

with alias_seed(profile_key, alias, normalized_alias, alias_type, priority) as (
  values
${aliasRows}
)
insert into public.care_profile_aliases (
  care_profile_id,
  alias,
  normalized_alias,
  alias_type,
  priority
)
select
  care_profiles.id,
  alias_seed.alias,
  alias_seed.normalized_alias,
  alias_seed.alias_type,
  alias_seed.priority
from alias_seed
join public.care_profiles
  on care_profiles.profile_key = alias_seed.profile_key
on conflict (care_profile_id, normalized_alias, alias_type) do update
set
  alias = excluded.alias,
  priority = excluded.priority;
`;

fs.writeFileSync(path.join(rootDir, "supabase", "seed_care_profiles.sql"), output);
console.log("Wrote supabase/seed_care_profiles.sql");

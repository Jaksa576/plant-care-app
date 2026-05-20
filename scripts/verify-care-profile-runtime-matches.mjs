import fs from "node:fs";
import { createRequire } from "node:module";
import Module from "node:module";
import path from "node:path";
import process from "node:process";

import { createClient } from "@supabase/supabase-js";
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

function loadDotEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);

    if (!match) {
      continue;
    }

    const [, key, rawValue] = match;

    if (process.env[key]) {
      continue;
    }

    process.env[key] = rawValue.trim().replace(/^['"]|['"]$/g, "");
  }
}

loadDotEnvFile(path.join(rootDir, ".env.local"));

const require = createRequire(import.meta.url);
const { listCareProfiles } = require("../src/lib/care-profiles/data.ts");
const { findCareProfileMatch } = require("../src/lib/care-profiles/lookup.ts");
const { MINIMAL_CARE_PROFILES } = require("../src/lib/care-profiles/seed.ts");
const { careProfileFixtureAliasRows } = require("../src/lib/care-profiles/fixtures.ts");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL plus SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY.",
  );
  process.exit(1);
}

const fixtureProfileCount = MINIMAL_CARE_PROFILES.length;
const fixtureAliasCount = careProfileFixtureAliasRows().length;

function aliasCount(profiles) {
  return profiles.reduce((total, profile) => total + profile.aliases.length, 0);
}

function summarizeMatch(result) {
  if (result.status !== "matched") {
    return {
      status: result.status,
      matchType: result.matchType ?? null,
      matchedAlias: result.matchedAlias ?? null,
      profileKey: null,
      displayName: null,
    };
  }

  return {
    status: result.status,
    matchType: result.matchType,
    matchedAlias: result.matchedAlias,
    profileKey: result.profile.profile_key,
    displayName: result.profile.display_name,
  };
}

function verifyCases(profiles) {
  return [
    {
      label: "Spider plant / Chlorophytum capense",
      input: {
        commonName: "Spider plant",
        scientificName: "Chlorophytum capense",
      },
      expectedProfileKey: "species-chlorophytum-comosum",
    },
    {
      label: "Moth Orchid / Phalaenopsis × singuliflora",
      input: {
        commonName: "Moth Orchid",
        scientificName: "Phalaenopsis × singuliflora",
      },
      expectedProfileKey: "genus-phalaenopsis",
    },
    {
      label: "Corn plant / Dracaena fragrans",
      input: {
        commonName: "Corn plant",
        scientificName: "Dracaena fragrans",
      },
      expectedProfileKey: "species-dracaena-fragrans",
    },
  ].map((testCase) => {
    const match = summarizeMatch(findCareProfileMatch(testCase.input, profiles));

    return {
      label: testCase.label,
      expectedProfileKey: testCase.expectedProfileKey,
      ...match,
      passed: match.status === "matched" && match.profileKey === testCase.expectedProfileKey,
    };
  });
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
  },
});

const profileResult = await listCareProfiles(supabase);

if (profileResult.error || !profileResult.data) {
  console.error(
    JSON.stringify(
      {
        status: "error",
        message: profileResult.error ?? "Unable to load runtime care profiles.",
        usedServiceRoleKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
      },
      null,
      2,
    ),
  );
  process.exit(1);
}

const dbProfiles = profileResult.data;
const dbProfileCount = dbProfiles.length;
const dbAliasCount = aliasCount(dbProfiles);
const hasDatabaseProfiles = dbProfileCount > 0;
const isStaleDatabase =
  hasDatabaseProfiles && (dbProfileCount < fixtureProfileCount || dbAliasCount < fixtureAliasCount);
const effectiveProfiles = hasDatabaseProfiles && !isStaleDatabase ? dbProfiles : MINIMAL_CARE_PROFILES;
const dbMatches = verifyCases(dbProfiles);
const effectiveRuntimeMatches = verifyCases(effectiveProfiles);
const seedRequired = !hasDatabaseProfiles || isStaleDatabase || dbMatches.some((match) => !match.passed);

const report = {
  status: effectiveRuntimeMatches.every((match) => match.passed) ? "passed" : "failed",
  usedServiceRoleKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
  dbProfileCount,
  dbAliasCount,
  fixtureProfileCount,
  fixtureAliasCount,
  hasDatabaseProfiles,
  isStaleDatabase,
  seedRequired,
  dbMatches,
  effectiveRuntimeSource: hasDatabaseProfiles && !isStaleDatabase ? "database" : "validated-fixtures",
  effectiveRuntimeMatches,
};

console.log(JSON.stringify(report, null, 2));

if (report.status !== "passed") {
  process.exit(1);
}

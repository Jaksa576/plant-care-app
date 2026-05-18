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

const errors = [];
const warnings = [];
const profileKeys = new Set();
const aliasOwners = new Map();

function requireText(value, label, profileKey) {
  if (typeof value !== "string" || value.trim().length === 0) {
    errors.push(`${profileKey}: ${label} is required`);
  }
}

for (const profile of CARE_PROFILE_FIXTURES) {
  if (profileKeys.has(profile.profileKey)) {
    errors.push(`${profile.profileKey}: duplicate profile key`);
  }

  profileKeys.add(profile.profileKey);
  requireText(profile.profileKey, "profileKey", profile.profileKey);
  requireText(profile.displayName, "displayName", profile.profileKey);
  requireText(profile.acceptedCommonName, "acceptedCommonName", profile.profileKey);
  requireText(profile.wateringGuidance, "wateringGuidance", profile.profileKey);
  requireText(profile.sourceSummary, "sourceSummary", profile.profileKey);

  if (!profile.aliases.length) {
    errors.push(`${profile.profileKey}: at least one alias is required`);
  }

  if (profile.wateringIntervalDaysDefault <= 0) {
    errors.push(`${profile.profileKey}: default cadence must be positive`);
  }

  if (
    profile.wateringIntervalDaysMin !== null &&
    profile.wateringIntervalDaysMax !== null &&
    profile.wateringIntervalDaysMin > profile.wateringIntervalDaysMax
  ) {
    errors.push(`${profile.profileKey}: cadence min cannot be greater than max`);
  }

  if (
    profile.wateringIntervalDaysMin !== null &&
    profile.wateringIntervalDaysDefault < profile.wateringIntervalDaysMin
  ) {
    errors.push(`${profile.profileKey}: default cadence is below min`);
  }

  if (
    profile.wateringIntervalDaysMax !== null &&
    profile.wateringIntervalDaysDefault > profile.wateringIntervalDaysMax
  ) {
    errors.push(`${profile.profileKey}: default cadence is above max`);
  }
}

for (const alias of careProfileFixtureAliasRows()) {
  const ownerKey = `${alias.normalizedAlias}::${alias.aliasType}`;
  const owners = aliasOwners.get(ownerKey) ?? [];
  owners.push(alias);
  aliasOwners.set(ownerKey, owners);
}

for (const [ownerKey, owners] of aliasOwners) {
  const profileKeysForAlias = new Set(owners.map((owner) => owner.profileKey));

  if (profileKeysForAlias.size <= 1) {
    continue;
  }

  if (owners.every((owner) => owner.allowAmbiguous)) {
    warnings.push(`${ownerKey} intentionally maps to ${[...profileKeysForAlias].join(", ")}`);
    continue;
  }

  errors.push(`${ownerKey} maps to multiple profiles without allowAmbiguous`);
}

const summary = {
  profiles: CARE_PROFILE_FIXTURES.length,
  aliases: careProfileFixtureAliasRows().length,
  warnings,
};

console.log(JSON.stringify(summary, null, 2));

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

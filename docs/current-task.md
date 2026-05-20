# Current Task

## Current Status

- Next.js + TypeScript + Tailwind scaffold is implemented.
- Supabase email auth, protected signed-in app shell, sign-out, middleware session refresh, and Home / Plants / Settings navigation are implemented.
- User-owned plant CRUD is implemented with persisted plant records, RLS ownership policies, and soft archive behavior.
- Plant detail/profile, watering state, mark-watered behavior, watering history, reminders, reminder-aware urgency, and one-way Google Calendar sync are implemented.
- Primary plant photo upload is implemented with private Supabase Storage and user-owned display/fallback behavior.
- AI-assisted plant identification is implemented as an optional Pl@ntNet-backed helper from owned plant photos and Add Plant transient photo uploads.
- Onboarding, rooms, Settings-managed Google Calendar setup, and photo-first Add Plant are implemented and merged to `main`.
- AI Care Setup is completed and merged to `main`, including internal care profiles, care profile aliases, validated seed fixtures, generated seed SQL, safer identification recommendations, Add/Edit Plant watering starting point suggestions, basic profile fallback selection, optional reminder handoff, and final pre-merge UX patches.

## Active Campaign

None.

Completed campaign archive: [AI Care Setup](campaigns/archived/ai-care-setup.md).

## Active Slice

Internal care profile QA patch for failed spider plant, moth orchid, and corn plant matches.

Status: implemented and validating on `codex/care-profile-qa-scientific-fix`; no new campaign.

## Completed Work

- Patched Add Plant photo-first setup to offer explicit JPG/PNG `Choose from library` and `Take a photo` choices while preserving one selected photo, one preview, optional pre-save identification, and final primary-photo save behavior.
- Patched plant profile photo replace to offer the same explicit library/camera choices without submitting two same-name file inputs.
- Kept the user-facing photo max at 12 MB and raised the Next server action/proxy body limit to 16 MB for multipart overhead.
- Hardened profile and Add Plant identification so storage/download/provider surprises return calm inline errors instead of hard page failures, with safe diagnostics only.
- Hardened the Pl@ntNet boundary around multipart construction, provider fetch, JSON parsing, response shape, and PNG/JPG filename selection.
- Added app-owned `care_profiles` and `care_profile_aliases` reference tables with RLS read policies for authenticated users.
- Added care profile levels: `species`, `genus`, `care_group`, and `fallback`.
- Added care profile normalization, alias lookup, ambiguity-safe matching helpers, typed fixtures, seed validation, seed SQL generation, and `supabase/seed_care_profiles.sql`.
- Expanded coverage through Waves 1, 2, and 3 to 56 profiles and 146 aliases, with intentional ambiguity warnings for unsafe common-name collisions.
- Expanded the internal care profile library to 111 profiles and 344 aliases, adding practical common houseplant coverage across aroids, hoyas, peperomias, succulents, ferns, palms, upright foliage, flowering plants, and conservative special-medium carnivorous plants.
- Regenerated `supabase/seed_care_profiles.sql` from `src/lib/care-profiles/fixtures.ts`.
- Expanded gap-first coverage to 123 profiles and 407 aliases.
- Added spider plant aliases to the existing `Chlorophytum comosum` profile, including airplane plant, ribbon plant, spider ivy, variegated spider plant, Bonnie spider plant, and common cultivar names.
- Strengthened orchid matching by keeping Phalaenopsis as the beginner/default orchid profile, adding grocery/supermarket orchid aliases, and adding conservative special-medium starters for Dendrobium, Oncidium, Cattleya, Paphiopedilum, and Cymbidium.
- Strengthened corn plant coverage on the existing `Dracaena fragrans` profile with cornstalk dracaena, mass cane, cane plant, happy plant, and Massangeana aliases plus more cautious cane/root sogginess guidance.
- Added missing common profiles for money tree, lucky bamboo, Norfolk Island pine, Triostar stromanthe, Ctenanthe, Ming aralia, and false aralia.
- Patched three failed QA care-profile cases: spider plant / `Chlorophytum capense`, moth orchid / `Phalaenopsis x singuliflora`, and corn plant / `Dracaena fragrans`.
- Added exact scientific aliases for `Chlorophytum capense`, `Phalaenopsis × singuliflora`, `Phalaenopsis x singuliflora`, and `Phalaenopsis singuliflora`.
- Hardened scientific-name matching by deriving safe normalized candidates for full scientific names, hybrid-marker-cleaned names, and genus/species binomials before falling back to genus matching; no broad fuzzy lookup or common-name similarity matching was added.
- Final care profile coverage is 123 profiles and 411 aliases.
- Diagnosed the app/fixture mismatch: local lookup verification used validated fixture data, while the actual app runtime prefers Supabase-backed care profiles whenever database coverage is non-empty.
- Added runtime stale-seed hardening so empty or stale Supabase care-profile coverage logs a diagnostic and falls back to the validated fixture library rather than silently returning no match.
- Added `scripts/verify-care-profile-runtime-matches.mjs` to query configured Supabase care-profile tables, compare DB coverage with fixture coverage, and verify the three QA cases against both direct DB data and the effective runtime source.
- Improved Pl@ntNet identification clarity with percentages, conservative confidence labels, same-common-name grouping, alternate scientific details, and safer retry/manual copy.
- Added reviewed-identity care matching for exact species, synonym, common name, genus, care group, ambiguous, and no-match states.
- Added Add/Edit Plant watering setup suggestions from matched care profiles or basic profile fallback selection before save.
- Applying a suggestion updates only `plants.watering_interval_days` and `plants.watering_guidance`, with overwrite confirmation for existing user-entered watering basics.
- Added optional reminder handoff after applying care basics without auto-creating reminders or changing Google Calendar source-of-truth behavior.
- Preserved manual setup, optional photo/AI/care/reminder paths, private photo handling, route protection, and user-owned data boundaries.
- Merged final pre-merge QA patches for safer identification diagnostics, JPG/PNG photo format clarity, mobile library photo selection, no duplicate profile care setup after Add Plant save, compact calendar status placement, and Add/Edit stepped-form scroll-to-top behavior.

## Operational Deployment Notes

- Apply Supabase migration `supabase/migrations/20260518_slice_ai_care_setup_1_care_profiles.sql` in production before relying on database-backed care profile lookup.
- Apply or confirm `supabase/seed_care_profiles.sql` in production after the migration.
- Run `npm run validate:care-profiles` before changing care profile fixtures or regenerating seed SQL.
- Verify production Add/Edit Plant care suggestion flow after deployment, including matched names, no-match basic profile fallback, no-name basic profile fallback, apply/skip, overwrite confirmation, and manual setup.

## Validation Results

Mobile photo identification patch validation:

- `npm run validate:care-profiles`: passed with intentional `money plant`, `prayer plant`, and `elephant ear` ambiguity warnings.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm run build`: passed via `npm run check` and `.\scripts\validate.ps1`.
- `npm run check`: passed.
- `.\scripts\validate.ps1`: passed.
- `npm test`: no `test` script is defined.
- Targeted source checks confirmed explicit Add Plant/profile `Choose from library` and `Take a photo` controls, `capture="environment"` only on camera inputs, no duplicate same-name file inputs in the patched forms, and 16 MB Next body/proxy limits.

Final merged `main` validation:

- `npm run validate:care-profiles`: passed with intentional `money plant`, `prayer plant`, and `elephant ear` ambiguity warnings.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm run build`: passed.
- `npm run check`: passed.
- `.\scripts\validate.ps1`: passed.

Care profile library expansion validation on `codex/care-profile-library-expansion`:

- `npm run validate:care-profiles`: passed with intentional `money plant`, `prayer plant`, `angel wing begonia`, `elephant ear`, and `zebra plant` ambiguity warnings.
- `npm run generate:care-profile-seed`: passed and regenerated `supabase/seed_care_profiles.sql`.
- Second `npm run validate:care-profiles`: passed with the same intentional ambiguity warnings.
- `.\scripts\validate.ps1`: passed, including `npm run typecheck`, `npm run lint`, and `npm run build`.
- `npm test`: no `test` script is defined.

Care profile gap-first patch validation on `codex/care-profile-gap-patch`:

- Baseline `npm run validate:care-profiles`: passed at 111 profiles / 344 aliases with intentional `money plant`, `prayer plant`, `angel wing begonia`, `elephant ear`, and `zebra plant` ambiguity warnings.
- `npm run validate:care-profiles`: passed at 123 profiles / 407 aliases with intentional `money plant`, `prayer plant`, `angel wing begonia`, `elephant ear`, and `zebra plant` ambiguity warnings.
- `npm run generate:care-profile-seed`: passed and regenerated `supabase/seed_care_profiles.sql`.
- Second `npm run validate:care-profiles`: passed with the same intentional ambiguity warnings.
- `.\scripts\validate.ps1`: passed, including `npm run typecheck`, `npm run lint`, and `npm run build`.
- `npm test`: no `test` script is defined.

Care profile QA scientific-name patch validation on `codex/care-profile-qa-scientific-fix`:

- `npm run validate:care-profiles`: passed at 123 profiles / 411 aliases with intentional `money plant`, `prayer plant`, `angel wing begonia`, `elephant ear`, and `zebra plant` ambiguity warnings.
- Targeted local verification passed: spider plant / `Chlorophytum capense` matched `species-chlorophytum-comosum`; moth orchid / `Phalaenopsis × singuliflora` matched `genus-phalaenopsis`; corn plant / `Dracaena fragrans` matched `species-dracaena-fragrans`.
- `npm run generate:care-profile-seed`: passed and regenerated `supabase/seed_care_profiles.sql`.
- Second `npm run validate:care-profiles`: passed with the same intentional ambiguity warnings.
- `.\scripts\validate.ps1`: passed, including `npm run typecheck`, `npm run lint`, and `npm run build`.
- `npm test`: no `test` script is defined.

Care profile runtime DB verification and stale-seed hardening patch on `codex/care-profile-qa-scientific-fix`:

- Confirmed `getCareProfilePreview` previously used Supabase-backed profiles whenever `listCareProfiles` returned any database profiles.
- Confirmed previous targeted verification used the fixture-backed `MINIMAL_CARE_PROFILES` path, not Supabase-backed runtime data.
- `npm run validate:care-profiles`: passed at 123 profiles / 411 aliases with the existing intentional ambiguity warnings.
- `npm run generate:care-profile-seed`: passed and regenerated `supabase/seed_care_profiles.sql`.
- Second `npm run validate:care-profiles`: passed with the same intentional ambiguity warnings.
- `node scripts/verify-care-profile-runtime-matches.mjs`: passed for the effective runtime source. Observed DB coverage was 0 profiles / 0 aliases with no `SUPABASE_SERVICE_ROLE_KEY` configured, so the direct DB match checks returned no match and the effective runtime source was `validated-fixtures`.
- `.\scripts\validate.ps1`: passed, including `npm run typecheck`, `npm run lint`, and `npm run build`.
- `npm test`: no `test` script is defined.
- Fixture coverage remains 123 profiles / 411 aliases.
- The configured QA/preview database still needs `supabase/seed_care_profiles.sql` applied or verified with service-role access so authenticated runtime DB coverage reaches 123 profiles / 411 aliases.

Most recent reviewed branch validation before merge:

- `npm run validate:care-profiles`: passed with intentional `money plant`, `prayer plant`, and `elephant ear` ambiguity warnings.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm run build`: passed.
- `npm run check`: passed.
- `.\scripts\validate.ps1`: passed.
- `.\scripts\verify-branch-pushed.ps1`: passed on `codex/ai-care-setup-premerge-qa`.

## Manual QA Needed

- Android Pixel / real mobile browser QA remains needed for OS camera/library picker behavior because local Browser plugin automation failed in this Windows sandbox and the protected app requires an authenticated browser session.
- Local dev server smoke check: `http://localhost:3000/login` returned 200 OK, and protected Add Plant route redirected to login when unauthenticated.
- Required real-device checks: Add Plant library photo preview, Add Plant camera photo preview, Identify from photo for both paths, save plant for both paths, existing profile replace from library, existing profile replace from camera, profile identification from each replaced photo, unsupported type, oversized file, provider unavailable/missing config, and missing profile photo.
- Add Plant with matching name shows watering suggestion during watering step.
- Add Plant with no match offers basic plant profile fallback during watering step.
- Add Plant with no common/scientific name offers basic plant profile fallback.
- Edit Plant shows matched/basic profile options during care basics.
- Saving a plant does not show duplicate optional care setup on the profile.
- Profile identification still works when explicitly triggered from plant profile.
- Applying suggestions updates watering interval/guidance only.
- Manual setup still works.
- Reminder handoff remains optional.
- Dashboard next-date uses applied interval.

## Next Recommended Action

Review the runtime stale-seed hardening patch, apply or verify `supabase/seed_care_profiles.sql` in the QA/preview database, and rerun `node scripts/verify-care-profile-runtime-matches.mjs` with `SUPABASE_SERVICE_ROLE_KEY` available to confirm DB-backed coverage reaches 123 profiles / 411 aliases.

## Validation Expectations

- `npm run validate:care-profiles`.
- `npm run typecheck`.
- `npm test` if present.
- `npm run build`.
- `npm run lint`.
- `npm run check`.
- `.\scripts\validate.ps1` if available.

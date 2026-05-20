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

Post-merge production/mobile QA patch: mobile photo source choices and photo identification crash hardening.

Status: implemented and validated on `codex/mobile-photo-identification-patch`; no new campaign.

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

Push `main`, verify production migration/seed deployment, run the manual QA spot checks, and then select the next campaign.

## Validation Expectations

- `npm run validate:care-profiles`.
- `npm run typecheck`.
- `npm test` if present.
- `npm run build`.
- `npm run lint`.
- `npm run check`.
- `.\scripts\validate.ps1` if available.

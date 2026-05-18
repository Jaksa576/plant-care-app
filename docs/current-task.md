# Current Task

## Current Status

- Next.js + TypeScript + Tailwind scaffold is implemented.
- Supabase email auth, protected signed-in app shell, sign-out, middleware session refresh, and Home / Plants / Settings navigation are implemented.
- User-owned plant CRUD is implemented with persisted plant records, RLS ownership policies, and soft archive behavior.
- Plant detail/profile, watering state, mark-watered behavior, watering history, reminders, reminder-aware urgency, and one-way Google Calendar sync are implemented.
- Primary plant photo upload is implemented with private Supabase Storage and user-owned display/fallback behavior.
- AI-assisted plant identification is implemented as an optional Pl@ntNet-backed helper from an owned primary photo.
- Skippable first-run onboarding, user-owned rooms, Settings room management, room-aware Add/Edit Plant, Settings-managed Google Calendar integration, and photo-first Add Plant are implemented.
- Pre-save Pl@ntNet identification from the selected Add Plant photo is implemented as transient names-only suggestions with explicit review.
- AI Care Setup Slice 0 is complete: campaign docs are normalized and hot-path docs identify AI Care Setup as active.
- AI Care Setup Slice 1 is complete: `care_profiles` and `care_profile_aliases` are added as app-owned reference tables with minimal seed data and conservative lookup helpers.
- AI Care Setup Slice 2 is complete: Wave 1 care profile fixtures, validation, duplicate/ambiguous alias detection, and generated Supabase seed SQL are implemented.

## Active Campaign

AI Care Setup.

Campaign source of truth: [AI Care Setup](campaigns/ai-care-setup.md).

Product-owner selected implementation sequence:

1. Slice 0: Campaign Doc Rewrite and Source-of-Truth Alignment.
2. Slice 1: Care Profile Data Foundation.
3. Slice 2: Seed Workflow and Coverage Wave 1.
4. Slice 3: Identification Confidence and Grouped Recommendations.
5. Slice 4: Care Profile Match After Accepted Identity.
6. Slice 5: Reviewable Watering Starting Point UI.
7. Slice 6: Fallback Watering Setup Questions.
8. Slice 7: Optional Reminder Handoff.
9. Slice 8: Add Plant / Photo-First Integration.
10. Slice 9: Coverage Wave 2 Expansion.
11. Slice 10: Coverage Wave 3 Broad Coverage and QA Hardening.

## Active Slice

Slice 3: Identification Confidence and Grouped Recommendations.

Status: ready to start.

Slice 2 status: completed.

Completed work:

- Added typed Wave 1 fixtures in `src/lib/care-profiles/fixtures.ts`.
- Expanded practical starter coverage to 29 profiles and 60 aliases across species, genus, care-group, and fallback profile levels.
- Added `npm run validate:care-profiles` for required fields, cadence ranges, duplicate aliases, and intentionally ambiguous aliases.
- Added `npm run generate:care-profile-seed` to regenerate `supabase/seed_care_profiles.sql` from the fixture source.
- Refactored in-app seed records to derive from the same Wave 1 fixture source.
- Generated `supabase/seed_care_profiles.sql` for repeatable Supabase seed application.
- Preserved no-UI/no-apply scope: care suggestions are still not shown to users and no plant watering fields are changed.

## Slice 3 Scope

Goal:

Make identification suggestions easier for beginners to understand and choose from.

Scope:

- Display Pl@ntNet match scores as percentages.
- Use conservative match labels: `Strong match`, `Possible match`, and `Low-confidence match`.
- Group duplicate/similar candidates with the same normalized common name when safe.
- Show alternate scientific names in compact details.
- Improve retry/manual copy for low-confidence and no-result cases.
- Preserve edit/reject/manual flows.
- Keep raw provider responses transient by default.

Non-goals:

- No care profile matching UI yet.
- No watering suggestion UI.
- No automatic care application.
- No reminders created or changed.
- No diagnosis, pest, disease, treatment, or encyclopedia browsing.

## Validation Results

Slice 2:

- `npm run validate:care-profiles`: passed with 29 profiles and 60 aliases; reported intentional `money plant` ambiguity.
- `npm run lint`: passed.
- `npm run build`: passed.
- `npm run typecheck`: not run; no script exists.
- `npm test`: not run; no script exists.
- Seed workflow review: fixtures are the source for in-app records and generated Supabase seed SQL.
- Duplicate alias detection: passed; intentional ambiguous aliases must be marked with `allowAmbiguous`.

## Next Recommended Action

Start Slice 3 on a dedicated branch/worktree from this Slice 2 branch: improve Pl@ntNet confidence display, conservative labels, safe candidate grouping, alternate scientific details, and low-confidence/no-result copy without changing care profile application.

## Validation Expectations

For future implementation slices, run the scripts that exist in `package.json`:

- `npm run validate:care-profiles` when care profile fixtures change.
- `npm run typecheck` if present.
- `npm test` if present.
- `npm run build`.
- `npm run lint`.

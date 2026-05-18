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
- The Onboarding, Rooms, Settings, and Photo-First Add Plant Foundation campaign is completed and merged to `main`.
- AI Care Setup Slice 0 is complete: campaign docs are normalized and hot-path docs identify AI Care Setup as active.
- AI Care Setup Slice 1 is complete: `care_profiles` and `care_profile_aliases` are added as app-owned reference tables with minimal seed data and conservative lookup helpers.

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

Slice 2: Seed Workflow and Coverage Wave 1.

Status: ready to start.

Slice 1 status: completed.

Completed work:

- Added additive migration `20260518_slice_ai_care_setup_1_care_profiles.sql`.
- Added app-owned `care_profiles` reference table with profile levels `species`, `genus`, `care_group`, and `fallback`.
- Added app-owned `care_profile_aliases` reference table with scientific, synonym, common, normalized common, genus, and group alias types.
- Enabled RLS on care profile tables with authenticated read policies only; no browser insert/update/delete policies were added.
- Seeded a minimal foundation set for snake plant, pothos, Chinese money plant, Philodendron genus, succulent-like care group, moderate tropical care group, and unknown conservative fallback.
- Added `src/lib/care-profiles` helpers for normalization, genus extraction, DB record loading, in-repo seed fixtures, and ambiguity-safe matching.
- Preserved `plants` without schema changes and did not expose care suggestions in the UI.

## Slice 2 Scope

Goal:

Create repeatable seed tooling and add the first meaningful coverage wave.

Scope:

- Add structured seed source or equivalent repeatable seed workflow.
- Add seed validation for required profile fields.
- Add duplicate alias detection.
- Add Coverage Wave 1 profiles, genus profiles, and care groups.
- Include source/review metadata.
- Keep care copy concise and beginner-friendly.
- Do not add admin UI.

Non-goals:

- No user-facing care suggestion UI yet.
- No automatic care application.
- No reminders created or changed.
- No diagnosis, pest, disease, treatment, or encyclopedia browsing.

## Validation Results

Slice 1:

- `npm run lint`: passed.
- `npm run build`: passed.
- `npm run typecheck`: not run; no script exists.
- `npm test`: not run; no script exists.
- Targeted lookup smoke check: passed for scientific, synonym, common-name, genus, care-group, ambiguous, and fallback paths.
- Migration/RLS review: additive tables only; no `plants` changes; RLS enabled; authenticated users can read reference data; browser clients have no write policies.
- Seed review: minimal draft starter data only; intended as foundation data before Slice 2 coverage validation.

## Next Recommended Action

Start Slice 2 on a dedicated branch/worktree from this Slice 1 branch: add repeatable seed fixtures/workflow, seed validation, duplicate alias detection, and Coverage Wave 1 profiles/aliases.

## Validation Expectations

For future implementation slices, run the scripts that exist in `package.json`:

- `npm run typecheck` if present.
- `npm test` if present.
- `npm run build`.
- `npm run lint` if present.

For migration/RLS slices, also validate migrations and owner-scoped access wherever local tooling is available.

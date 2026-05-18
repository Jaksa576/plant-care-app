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
- The UI Redesign UX Overhaul campaign is completed, merged to `main`, and archived.
- The public landing page redesign, concise login-page UX refresh, and installable app icon support are merged to `main`.
- AI Care Setup is now the active autonomous campaign.

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

Slice 1: Care Profile Data Foundation.

Status: ready to start.

Slice 0 status: completed in docs only.

Completed work:

- Created `docs/campaigns/ai-care-setup.md` as the normalized campaign source of truth from the enhanced AI Care Setup campaign draft.
- Confirmed `main` includes completed onboarding, rooms, Settings, and photo-first Add Plant foundation work.
- Aligned roadmap and current task docs so AI Care Setup is the active campaign instead of stale onboarding campaign work.
- Preserved the campaign thesis, profile levels, matching behavior, coverage waves 1-3, validation expectations, stop conditions, and non-goals.
- Kept Slice 0 docs-only with no app code changes.

## Slice 1 Scope

Goal:

Add the internal care profile reference data model and lookup helpers without changing user-facing flows.

Scope:

- Add `care_profiles`.
- Add `care_profile_aliases`.
- Support profile levels: `species`, `genus`, `care_group`, and `fallback`.
- Add normalization and lookup helpers.
- Add ambiguity-safe matching behavior.
- Add minimal reference seed data only.
- Do not change `plants`.
- Do not change Pl@ntNet UI.
- Do not expose care suggestions yet.

Non-goals:

- No AI-generated care data shown directly to users.
- No watering fields applied from care profiles.
- No reminders created or changed.
- No Add Plant flow integration yet.
- No diagnosis, pest, disease, toxicity decision support, or treatment guidance.
- No encyclopedia-style plant browsing.

## Validation Results

Slice 0:

- Targeted doc consistency searches: passed for hot-path active campaign status.
- Targeted stale active campaign search: no hot-path docs list the completed onboarding campaign as active.
- Targeted AI Care Setup source-of-truth search: normalized campaign doc exists at `docs/campaigns/ai-care-setup.md`.
- `npm run build`: skipped because Slice 0 changed docs only.
- `npm run lint`: skipped because Slice 0 changed docs only.
- `npm run typecheck`: skipped because Slice 0 changed docs only.
- `npm test`: skipped because Slice 0 changed docs only.

## Next Recommended Action

Start Slice 1 on a dedicated branch/worktree from updated `main`: add the additive care profile reference tables, normalization/lookup helpers, ambiguity-safe matching behavior, minimal seed data, and architecture/current-task/campaign doc updates.

## Validation Expectations

For future implementation slices, run the scripts that exist in `package.json`:

- `npm run typecheck` if present.
- `npm test` if present.
- `npm run build`.
- `npm run lint` if present.

For migration/RLS slices, also validate migrations and owner-scoped access wherever local tooling is available.

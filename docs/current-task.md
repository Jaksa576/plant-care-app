# Current Task

## Current Status

- Next.js + TypeScript + Tailwind scaffold is implemented.
- Supabase email auth, protected signed-in app shell, sign-out, middleware session refresh, and Home / Plants / Settings navigation are implemented.
- User-owned plant CRUD is implemented with persisted plant records, RLS ownership policies, and soft archive behavior.
- Plant detail/profile, watering state, mark-watered behavior, watering history, reminders, reminder-aware urgency, and one-way Google Calendar sync are implemented.
- Primary plant photo upload is implemented with private Supabase Storage and user-owned display/fallback behavior.
- AI-assisted plant identification is implemented as an optional Pl@ntNet-backed helper from an owned primary photo.
- AI Care Setup Slices 0-3 are complete: campaign docs, care profile foundation, Wave 1 seed workflow, and clearer Pl@ntNet recommendation UI are implemented.
- AI Care Setup Slice 4 is complete: reviewed identity saves now attempt internal care profile matching and show read-only matched, ambiguous, or no-match preview states.

## Active Campaign

AI Care Setup.

Campaign source of truth: [AI Care Setup](campaigns/ai-care-setup.md).

## Active Slice

Slice 5: Reviewable Watering Starting Point UI.

Status: ready to start.

Slice 4 status: completed.

Completed work:

- Added care profile preview state to reviewed identification saves.
- After a user saves reviewed common/scientific names from the plant profile, the server attempts internal care profile lookup.
- Matching supports exact scientific, scientific alias, synonym, common-name alias, genus, ambiguous, and no-match states through existing care profile helpers.
- The plant profile identification panel shows preview-only matched, ambiguous, or no-match care states.
- Matched previews include profile name, check cadence/range, dryness preference, and watering guidance.
- Ambiguous previews list possible care profile options without auto-selecting.
- No watering basics are applied, no `plants` care fields are changed, and no reminders are created.

## Slice 5 Scope

Goal:

Show a concise care suggestion card after profile match and let users explicitly apply editable watering basics.

Scope:

- Show suggested check cadence, optional min/max range, dryness preference, watering guidance, and home-condition caveat.
- Add actions: `Use these care basics`, `Edit first`, and `Skip for now`.
- Apply only `plants.watering_interval_days` and `plants.watering_guidance`.
- Protect existing user-entered values from silent overwrite.
- Do not create reminders.

Non-goals:

- No automatic care application.
- No reminder creation.
- No Add Plant care suggestion integration yet.
- No diagnosis, pest, disease, treatment, or encyclopedia browsing.

## Validation Results

Slice 4:

- `npm run lint`: passed.
- `npm run build`: passed.
- `npm run typecheck`: not run; no script exists.
- `npm test`: not run; no script exists.
- `npm run validate:care-profiles`: not run; care profile fixtures did not change.
- Manual browser QA: still needed for exact species, synonym, common-name, genus, ambiguous, and no-match preview states.

## Next Recommended Action

Start Slice 5 on a dedicated branch/worktree from this Slice 4 branch: convert matched previews into a reviewable care suggestion card with explicit apply/edit/skip actions, while protecting existing watering basics from silent overwrite.

## Validation Expectations

For future implementation slices, run the scripts that exist in `package.json`:

- `npm run validate:care-profiles` when care profile fixtures change.
- `npm run typecheck` if present.
- `npm test` if present.
- `npm run build`.
- `npm run lint`.

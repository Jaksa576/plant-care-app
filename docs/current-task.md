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
- AI Care Setup Slice 5 is complete: matched care profiles can be reviewed, applied, edited first, or skipped without silent overwrite.
- AI Care Setup Slice 6 is complete: no-match care states can offer lightweight fallback watering questions mapped to reviewed care-group or conservative fallback profiles.
- AI Care Setup Slice 7 is complete: after applying care basics, users can optionally jump to setup or review the existing app-owned watering reminder.
- AI Care Setup Slice 8 is complete: Add Plant can carry reviewed names into optional post-save care profile review without requiring AI, care suggestions, reminders, or successful photo upload.
- Repo workflow helper optimization is complete as an infrastructure/docs patch and available on this branch.

## Active Campaign

AI Care Setup.

Campaign source of truth: [AI Care Setup](campaigns/ai-care-setup.md).

## Active Slice

Slice 9: Coverage Wave 2 Expansion.

Status: ready to start after Slice 8 branch review.

Slice 8 status: completed.

Completed work:

- Added care profile preview state to reviewed identification saves.
- After a user saves reviewed common/scientific names from the plant profile, the server attempts internal care profile lookup.
- Matching supports exact scientific, scientific alias, synonym, common-name alias, genus, ambiguous, and no-match states through existing care profile helpers.
- The plant profile identification panel shows preview-only matched, ambiguous, or no-match care states.
- Matched previews include profile name, check cadence/range, dryness preference, and watering guidance.
- Ambiguous previews list possible care profile options without auto-selecting.
- Matched care suggestions show check cadence, optional range, dryness preference, watering guidance, and a home-conditions caveat.
- Users can apply suggested care basics, edit first, or skip for now.
- Applying updates only `plants.watering_interval_days` and `plants.watering_guidance`.
- Existing watering basics require explicit overwrite confirmation before replacement.
- No-match care states now offer a short fallback question form based on visible watering traits.
- Fallback answers are mapped server-side to reviewed care-group or conservative fallback profiles.
- Fallback suggestions use the same reviewable apply/edit/skip care suggestion UI and do not identify the plant.
- Applying care basics now offers an optional link to set up or review the existing watering reminder panel.
- Reminder handoff does not auto-create reminders and does not change Google Calendar source-of-truth behavior.
- Add Plant redirects new plants with reviewed common or scientific names into optional post-save care profile review.
- Manual Add Plant, photo-optional setup, failed AI, and failed photo upload remain non-blocking.
- No reminders are created.

## Slice 9 Scope

Goal:

Expand care profile coverage through Coverage Wave 2.

Scope:

- Expand to roughly 75-100 total practical profiles/aliases.
- Add common retail names, messy aliases, and more genus profiles.
- Improve ambiguity handling from Wave 1 QA.
- Keep care copy concise and beginner-friendly.

Non-goals:

- No broad encyclopedia browsing.
- No live third-party care API dependency in the user-critical setup path.
- No LLM-generated production care data shown directly to users.
- No schema or UI expansion beyond coverage data/tooling needed for Wave 2.
- No diagnosis, pest, disease, treatment, or encyclopedia browsing.

## Validation Results

Workflow helper patch:

- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm run build`: passed.
- `npm run check`: passed.
- `.\scripts\validate.ps1`: passed.
- `.\scripts\verify-branch-pushed.ps1`: passed on `codex/workflow-helpers`.

Slice 4:

- `npm run lint`: passed.
- `npm run build`: passed.
- `npm run typecheck`: not run; no script existed at the time.
- `npm test`: not run; no script exists.
- `npm run validate:care-profiles`: not run; care profile fixtures did not change.
- Manual browser QA: still needed for exact species, synonym, common-name, genus, ambiguous, and no-match preview states.

Slice 5:

- `npm run validate:care-profiles`: passed with the existing intentional `money plant` ambiguity warning.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm run build`: passed.
- `npm run check`: passed.
- `.\scripts\validate.ps1`: passed.
- `npm test`: not run; no script exists.
- Manual browser QA: still needed for empty fields, existing fields, apply, skip, edit after apply, mark watered, dashboard next date, and mobile layout.

Slice 6:

- `npm run validate:care-profiles`: passed with the existing intentional `money plant` ambiguity warning.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm run build`: passed.
- `npm run check`: passed.
- `.\scripts\validate.ps1`: passed.
- `npm test`: not run; no script exists.
- Manual browser QA: still needed for no-match fallback, low-confidence identity, succulent, tropical, fern/moisture-loving, orchid, skip fallback, and mobile layout.

Slice 7:

- `npm run validate:care-profiles`: passed with the existing intentional `money plant` ambiguity warning.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm run build`: passed.
- `npm run check`: passed.
- `.\scripts\validate.ps1`: passed.
- `npm test`: not run; no script exists.
- Manual browser QA: still needed for no existing reminder, existing after-watering reminder, existing fixed schedule reminder, Google Calendar connected/disconnected, decline handoff, and mobile layout.

Slice 8:

- `npm run validate:care-profiles`: passed with the existing intentional `money plant` ambiguity warning.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm run build`: passed.
- `npm run check`: passed.
- `.\scripts\validate.ps1`: passed.
- `npm test`: not run; no script exists.
- Manual browser QA: still needed for manual Add Plant, photo selected/no AI, high-confidence AI, low-confidence AI, provider error, care apply/skip, photo upload failure, and mobile layout.

## Next Recommended Action

Validate, commit, push, and verify `codex/ai-care-setup-s8`, then start Slice 9 on a dedicated branch/worktree from this Slice 8 branch.

## Validation Expectations

- `npm run validate:care-profiles` when care profile fixtures change.
- `npm run typecheck`.
- `npm test` if present.
- `npm run build`.
- `npm run lint`.
- `npm run check`.
- `.\scripts\validate.ps1`.

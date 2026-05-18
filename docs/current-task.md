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
- AI Care Setup Slice 9 is complete: Coverage Wave 2 expands validated care profile coverage to 41 profiles and 101 aliases.
- AI Care Setup Slice 10 is complete: Coverage Wave 3 expands validated care profile coverage to 56 profiles and 146 aliases and finalizes campaign docs for manual QA.
- Repo workflow helper optimization is complete as an infrastructure/docs patch and available on this branch.

## Active Campaign

AI Care Setup.

Campaign source of truth: [AI Care Setup](campaigns/ai-care-setup.md).

## Active Slice

AI Care Setup campaign manual QA and merge review.

Status: implementation complete; manual QA pending.

Slice 10 status: completed.

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
- Coverage Wave 2 adds common retail plants, messy aliases, additional species profiles, and genus fallbacks.
- Seed validation now reports `money plant` and `prayer plant` as intentional ambiguous aliases.
- Coverage Wave 3 adds broad retail coverage, additional genus fallbacks, common misidentification aliases, and `elephant ear` as an intentional ambiguous alias.
- Generated seed SQL is current with fixtures.
- No reminders are created.

## Remaining Scope

Goal:

Manually QA the full AI Care Setup branch stack and merge reviewed slices in order.

Scope:

- QA existing plant/profile identification, Add Plant integration, care matching, fallback questions, care apply/skip, overwrite protection, reminder handoff, dashboard date behavior, route protection, and mobile/desktop layouts.
- Review and merge branches from `codex/workflow-helpers` and AI Care Setup slices in order.

Non-goals:

- No broad encyclopedia browsing.
- No live third-party care API dependency in the user-critical setup path.
- No LLM-generated production care data shown directly to users.
- No additional schema or UI expansion unless QA finds a blocking defect.
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

Slice 9:

- `npm run validate:care-profiles`: passed with intentional `money plant` and `prayer plant` ambiguity warnings.
- `npm run generate:care-profile-seed`: passed.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm run build`: passed.
- `npm run check`: passed.
- `.\scripts\validate.ps1`: passed.
- `npm test`: not run; no script exists.
- Manual browser QA: still needed for Wave 2 exact/common/genus/ambiguous/fallback examples.

Slice 10:

- `npm run validate:care-profiles`: passed with intentional `money plant`, `prayer plant`, and `elephant ear` ambiguity warnings.
- `npm run generate:care-profile-seed`: passed.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm run build`: passed.
- `npm run check`: passed.
- `.\scripts\validate.ps1`: passed.
- `npm test`: not run; no script exists.
- Manual browser QA: still needed for the full campaign matrix.

## Next Recommended Action

Validate, commit, push, and verify `codex/ai-care-setup-s10`, then run manual campaign QA and merge reviewed branches in order.

## Validation Expectations

- `npm run validate:care-profiles` when care profile fixtures change.
- `npm run typecheck`.
- `npm test` if present.
- `npm run build`.
- `npm run lint`.
- `npm run check`.
- `.\scripts\validate.ps1`.

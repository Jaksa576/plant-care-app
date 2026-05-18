# Current Task

## Current Status

- Next.js + TypeScript + Tailwind scaffold is implemented.
- Supabase email auth, protected signed-in app shell, sign-out, middleware session refresh, and Home / Plants / Settings navigation are implemented.
- User-owned plant CRUD is implemented with persisted plant records, RLS ownership policies, and soft archive behavior.
- Plant detail/profile, watering state, mark-watered behavior, watering history, reminders, reminder-aware urgency, and one-way Google Calendar sync are implemented.
- Primary plant photo upload is implemented with private Supabase Storage and user-owned display/fallback behavior.
- AI-assisted plant identification is implemented as an optional Pl@ntNet-backed helper from an owned primary photo.
- Skippable first-run onboarding, user-owned rooms, Settings room management, room-aware Add/Edit Plant, Settings-managed Google Calendar integration, and photo-first Add Plant are implemented.
- AI Care Setup Slice 0 is complete: campaign docs are normalized and hot-path docs identify AI Care Setup as active.
- AI Care Setup Slice 1 is complete: `care_profiles` and `care_profile_aliases` are added as app-owned reference tables with minimal seed data and conservative lookup helpers.
- AI Care Setup Slice 2 is complete: Wave 1 care profile fixtures, validation, duplicate/ambiguous alias detection, and generated Supabase seed SQL are implemented.
- AI Care Setup Slice 3 is complete: Pl@ntNet scores show as percentages with conservative labels, same-common-name candidates are grouped, alternate scientific names are compact, and retry/manual copy is clearer.

## Active Campaign

AI Care Setup.

Campaign source of truth: [AI Care Setup](campaigns/ai-care-setup.md).

## Active Slice

Slice 4: Care Profile Match After Accepted Identity.

Status: ready to start.

Slice 3 status: completed.

Completed work:

- Updated Pl@ntNet confidence labels to `strong`, `possible`, and `low`.
- Displayed candidate match scores as percentages with `Strong match`, `Possible match`, and `Low-confidence match` labels.
- Grouped candidates that share the same normalized common name, keeping the highest-scoring scientific name primary.
- Added compact alternate scientific-name details to grouped recommendation cards.
- Improved no-result, low-confidence, retry-photo, and manual-edit copy without claiming certainty.
- Preserved review/edit/save, reject, retry, skip, and manual paths.
- Kept raw provider responses transient and did not add care suggestions or watering field updates.

## Slice 4 Scope

Goal:

Connect accepted plant identity to internal care profile matching.

Scope:

- After user accepts or edits identity, attempt care profile lookup.
- Match by scientific name, synonym, common name, alias, genus, and care group.
- Return exact profile match, genus match, care-group match, ambiguous match, or no match.
- Add conservative user-facing copy for each state.
- Do not apply watering fields yet unless included as preview-only.
- Do not create reminders.

Non-goals:

- No watering suggestion application.
- No reminder creation.
- No Add Plant integration beyond existing identity save behavior unless needed for preview-only matching.
- No diagnosis, pest, disease, treatment, or encyclopedia browsing.

## Validation Results

Slice 3:

- `npm run lint`: passed.
- `npm run build`: passed.
- `npm run typecheck`: not run; no script exists.
- `npm test`: not run; no script exists.
- `npm run validate:care-profiles`: not run; care profile fixtures did not change.
- Manual browser QA: still needed for high-confidence, low-confidence, duplicate common-name candidates, different common-name candidates, no-candidate result, provider error, edit before save, reject/manual path, and mobile viewport.

## Next Recommended Action

Start Slice 4 on a dedicated branch/worktree from this Slice 3 branch: wire accepted or edited identity to care profile matching and display conservative match/no-match/ambiguous preview states without applying watering fields or creating reminders.

## Validation Expectations

For future implementation slices, run the scripts that exist in `package.json`:

- `npm run validate:care-profiles` when care profile fixtures change.
- `npm run typecheck` if present.
- `npm test` if present.
- `npm run build`.
- `npm run lint`.

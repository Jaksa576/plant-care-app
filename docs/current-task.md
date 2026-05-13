# Current Task

## Current Status

- Next.js + TypeScript + Tailwind scaffold is implemented.
- Supabase email auth at `/login` is implemented.
- `/app` is protected for signed-in users.
- Signed-in shell, sign-out, middleware-based session refresh, and Home / Plants / Settings navigation are implemented.
- User-owned plant CRUD is implemented with persisted plant records, RLS ownership policies, and soft archive behavior.
- Plant detail/profile, watering state, mark-watered behavior, watering history, reminders, and reminder-aware urgency are implemented.
- Primary plant photo upload is implemented with private Supabase Storage and user-owned display/fallback behavior.
- AI-assisted plant identification is implemented as an optional Pl@ntNet-backed helper from an owned primary photo.
- Google Calendar sync is implemented as a one-way reflection of app-owned watering reminders when server OAuth configuration is present.
- Skippable first-run onboarding with per-user completion state is implemented on Slice 1.
- User-owned room data model, nullable plant room assignments, and legacy `plants.location` backfill are implemented on Slice 2.
- Settings room management is implemented on Slice 3.
- Room dropdown in Add/Edit Plant and room-aware Home/Plants grouping are implemented on Slice 4.
- Settings-managed Google Calendar integration is implemented on Slice 5.
- Photo-first Add Plant foundation is implemented on Slice 6.
- Pre-save Pl@ntNet identification is implemented on Slice 7.
- Onboarding room/photo integration polish is implemented on Slice 8.
- The UI Redesign UX Overhaul campaign is completed, merged to `main`, and archived.
- The public landing page redesign, concise login-page UX refresh, and installable app icon support are merged to `main`.

## Active Campaign

Onboarding, Rooms, Settings, and Photo-First Add Plant Foundation.

Product-owner selected implementation sequence:

1. Onboarding shell and first-run routing.
2. Room data model and migration.
3. Room management in Settings.
4. Room dropdown in Add/Edit Plant.
5. Settings-managed Google Calendar integration.
6. Photo-first Add Plant foundation.
7. Pre-save Pl@ntNet identification.
8. Onboarding room/photo integration polish.

## Active Slice

Slice 8: Onboarding room/photo integration polish.

Status: implemented on branch `campaign/onboarding-rooms-s8-onboarding-polish`; awaiting review/merge.

Completed work:

- Added optional room collection to onboarding with suggested room chips and comma-separated custom room names.
- Onboarding now routes to Today, manual Add Plant, or photo-first Add Plant after completion.
- Room names submitted during onboarding are created as user-owned `plant_rooms`; duplicate active names are skipped.
- Existing users remain protected from onboarding loops, and Settings can still revisit setup.
- Settings now includes a state-derived setup checklist for first plant, room, reminder, photo, and Google Calendar connection.
- Today's empty state offers manual and photo-first Add Plant paths.

Room/photo behavior:

- Room creation in onboarding derives `user_id` from the signed-in server session.
- Onboarding room setup is optional and can be skipped without blocking Today or Add Plant.
- Photo-first routing uses the existing `/app/plants/new?start=photo` path and does not require photo upload or AI identification.

Non-goals preserved:

- No `care_profiles`.
- No AI-generated watering fields.
- No diagnosis, disease, pest, toxicity, or treatment guidance.
- No public storage, staged photo table, or draft plant records.
- No mandatory onboarding, room setup, photo upload, AI identification, reminder setup, or calendar connection.
- No deletion of `plants.location`.

## Validation Results

- `npm run lint`: passed.
- `npm run build`: passed.
- `npm run typecheck`: not run; no script exists.
- `npm test`: not run; no script exists.
- Supabase migrations: product owner reported Slice 2 room migrations were run successfully before Slice 4 resumed.
- Migration/RLS review: no schema changes in Slice 8. Onboarding room creation uses existing user-owned room helpers and RLS-backed `plant_rooms` behavior.

## Next Recommended Action

Product-owner QA should review the completed campaign branch stack in slice order, then merge when satisfied.

## Validation Expectations

For future implementation slices, run the scripts that exist in `package.json`:

- `npm run typecheck` if present.
- `npm test` if present.
- `npm run build`.
- `npm run lint` if present.

For migration/RLS slices, also validate migrations and owner-scoped access wherever local tooling is available.

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
- The Onboarding, Rooms, Settings, and Photo-First Add Plant Foundation campaign is completed and merged to `main`.
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

Status: completed and merged to `main`.

Pre-merge QA patch status: implemented and merged to `main`.

Completed work:

- Added optional room collection to onboarding with suggested room chips and comma-separated custom room names.
- Onboarding now routes to Today, manual Add Plant, or photo-first Add Plant after completion.
- Room names submitted during onboarding are created as user-owned `plant_rooms`; duplicate active names are skipped.
- Existing users remain protected from onboarding loops, and Settings can still revisit setup.
- Today now includes a state-derived setup checklist for first plant, room, reminder, photo, and Google Calendar connection when setup is incomplete.
- Today's empty state offers manual and photo-first Add Plant paths.
- Renamed room migrations so fresh applies run the room data model before the archive function.
- Added immediate photo preview in photo-first Add Plant.
- The selected photo is retained through pre-save identification and final plant save so the user does not upload the same file twice.
- Raised the photo upload limit to 12 MB and configured Server Action/proxy body size for typical mobile photos.
- Made nickname required in UI and server validation; common/scientific names remain optional.
- Changed the review step CTA to `Review and save`.
- Moved the full Getting Started checklist emphasis to Today; Settings now keeps a lightweight setup review entry.
- Fixed the watering reminder regression so fixed schedule reminders can be saved without a watering interval, while after-watering reminders still require an interval.
- Simplified Add Plant into a sequential photo-first setup flow with progress: optional photo, identity, room, watering basics, and review.
- Fixed stepped Add/Edit Plant form submission so the review step submits all controlled plant values, including nickname and preserved legacy location.
- Combined photo selection, pre-save identification, and plant name fields into the first Add Plant step.
- Simplified the room step to choose one path at a time: Unassigned, existing room, or add new room.
- Removed the user-facing legacy location note field while preserving existing `plants.location` values through hidden form state.

Room/photo behavior:

- Room creation in onboarding derives `user_id` from the signed-in server session.
- Onboarding room setup is optional and can be skipped without blocking Today or Add Plant.
- Add Plant now defaults to the same skippable photo-first sequence for `/app/plants/new` and `/app/plants/new?start=photo`; the legacy query path remains compatible but no longer creates a separate choice-card fork.
- The review step submits controlled hidden fields for plant details because the visible fields are split across steps.
- Photo-first preview uses a browser-local object URL. The file is not uploaded until the signed-in server creates the owned plant record.
- Pre-save Pl@ntNet still receives only transient file bytes server-side and does not persist raw provider responses.
- Fixed schedule watering reminders require a next reminder date only. After-watering reminders require a user-entered watering interval because they recalculate from watering history.

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
- `npx supabase migration list --linked`: attempted as a safe read-only check, but `SUPABASE_ACCESS_TOKEN` was missing in the environment.
- Supabase migrations: product owner reported Slice 2 room migrations were run successfully before Slice 4 resumed.
- Migration/RLS review: no SQL behavior changes in the pre-merge patch. Room migration files were renamed to `20260512_01_slice_room_data_model.sql` and `20260512_02_slice_room_archive_function.sql` for deterministic fresh apply ordering. Onboarding room creation uses existing user-owned room helpers and RLS-backed `plant_rooms` behavior.

## Next Recommended Action

Run manual production verification of the merged `main` experience, then select the next planned campaign when ready.

## Validation Expectations

For future implementation slices, run the scripts that exist in `package.json`:

- `npm run typecheck` if present.
- `npm test` if present.
- `npm run build`.
- `npm run lint` if present.

For migration/RLS slices, also validate migrations and owner-scoped access wherever local tooling is available.

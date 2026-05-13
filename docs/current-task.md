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

Slice 2: Room data model and migration.

Status: implemented on branch `campaign/onboarding-rooms-s2-room-model`; awaiting review/merge.

Completed work:

- Added user-owned `plant_rooms` table with active per-user case-insensitive room-name uniqueness.
- Added nullable `plants.room_id` referencing `plant_rooms`.
- Backfilled room records from existing non-empty `plants.location` values per user.
- Backfilled `plants.room_id` for matching legacy locations while preserving `plants.location`.
- Added owner-scoped RLS policies for selecting, inserting, and updating rooms.
- Added a database trigger that blocks assigning a plant to a room owned by another user or to an archived room.
- Added typed server data helpers for listing and creating user-owned rooms.
- Updated plant record typing to include nullable `room_id`.

Non-goals preserved:

- No Settings room-management UI yet.
- No Add/Edit Plant room dropdown yet.
- No Home or Plants grouping changes yet.
- No deletion or cleanup of `plants.location`.
- No room floorplan, room reminders, AI, photo, or calendar changes.

## Validation Results

- `.env.local` copied into the worktree; required Supabase, PlantNet, and Google key names are present without printing secret values.
- `npm run lint`: passed.
- `npm run build`: passed.
- `npm run typecheck`: not run; no script exists.
- `npm test`: not run; no script exists.
- Supabase CLI migration apply: not run; `supabase` CLI is not installed in this environment.
- Migration/RLS review: additive table/column, `plants.location` preserved, room backfill uses non-empty trimmed legacy locations, RLS constrains room rows with `auth.uid() = user_id`, and plant room assignment trigger enforces same-user active rooms.

## Next Recommended Action

After Slice 2 is reviewed and merged, start Slice 3: Room management in Settings on a new branch from the latest appropriate base.

## Validation Expectations

For future implementation slices, run the scripts that exist in `package.json`:

- `npm run typecheck` if present.
- `npm test` if present.
- `npm run build`.
- `npm run lint` if present.

For migration/RLS slices, also validate migrations and owner-scoped access wherever local tooling is available.

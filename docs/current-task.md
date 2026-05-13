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

Slice 3: Room management in Settings.

Status: implemented on branch `campaign/onboarding-rooms-s3-room-settings`; awaiting review/merge.

Completed work:

- Added Settings Rooms section.
- Listed active rooms with active assigned plant counts.
- Added room creation form.
- Added room rename forms that preserve plant assignments because room ids stay stable.
- Added archive action for rooms.
- Added database `archive_plant_room` function so archiving a room and moving assigned plants to Unassigned happen together.
- Added duplicate/blank/error status handling through Settings query-state messages.
- Preserved `plants.location` and plant records during room archive.

Safe archive behavior:

- Room records are soft-archived with `archived_at`.
- Plants assigned to the archived room are preserved and moved to Unassigned by setting `plants.room_id` to null.
- Legacy `plants.location` is not deleted or rewritten.

Non-goals preserved:

- No Add/Edit Plant room dropdown yet.
- No Home or Plants grouping changes yet.
- No room restore UI.
- No room sorting/reordering UI.
- No deletion of `plants.location`.
- No room floorplan, room reminders, AI, photo, or calendar changes.

## Validation Results

- `.env.local` copied into the worktree; required Supabase, PlantNet, and Google key names are present without printing secret values.
- `npm run lint`: passed.
- `npm run build`: passed.
- `npm run typecheck`: not run; no script exists.
- `npm test`: not run; no script exists.
- Supabase CLI migration apply: not run; `supabase` CLI is not installed in this environment.
- Migration/RLS review: room archive function uses `auth.uid()`, room helpers scope mutations by signed-in `user_id`, active room uniqueness handles duplicate names, and archive preserves plant records while clearing assigned `room_id`.

## Next Recommended Action

After Slice 3 is reviewed and merged, start Slice 4: Room dropdown in Add/Edit Plant on a new branch from the latest appropriate base.

## Validation Expectations

For future implementation slices, run the scripts that exist in `package.json`:

- `npm run typecheck` if present.
- `npm test` if present.
- `npm run build`.
- `npm run lint` if present.

For migration/RLS slices, also validate migrations and owner-scoped access wherever local tooling is available.

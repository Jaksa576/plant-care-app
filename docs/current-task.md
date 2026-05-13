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

Slice 6: Photo-first Add Plant foundation.

Status: implemented on branch `campaign/onboarding-rooms-s6-photo-first-add`; awaiting review/merge.

Completed work:

- Added Add Plant path choices for manual setup and photo-first setup.
- Added optional photo input to Add Plant before final save.
- Preserved manual plant creation without photo, rooms, AI, reminders, or calendar setup.
- On save with a photo, the server creates the owned plant record first, then uploads the photo to the existing owner-scoped private Storage path and saves it as the primary photo.
- If the optional photo upload fails, the plant remains saved and the profile shows a recoverable photo message.
- Abandoning Add Plant before save creates no staged photo object and requires no cleanup.

Photo behavior:

- Photos remain private in the existing `plant-photos` bucket.
- Optional initial photos reuse the same post-save owner/plant-scoped Storage path as profile photo uploads.
- No public storage, draft plant records, or staged photo table were introduced in Slice 6.

Non-goals preserved:

- No room restore UI.
- No room sorting/reordering UI.
- No deletion of `plants.location`.
- No Pl@ntNet pre-save identification yet.
- No AI care suggestions.
- No `care_profiles`.
- No AI-generated watering fields.
- No draft plant records.
- No staged photo table because Slice 6 avoids pre-save uploads.

## Validation Results

- `npm run lint`: passed.
- `npm run build`: passed.
- `npm run typecheck`: not run; no script exists.
- `npm test`: not run; no script exists.
- Supabase migrations: product owner reported Slice 2 room migrations were run successfully before Slice 4 resumed.
- Environment note: `.env.local` was not copied into the Slice 6 worktree because the copy command was blocked by the approval layer; build/lint do not print secrets and can still validate code paths.
- Migration/RLS review: no schema changes in Slice 6. Initial photo upload happens only after creating a signed-in user-owned plant, then uses the existing owner/plant-scoped private Storage path and existing Storage RLS assumptions.

## Next Recommended Action

After Slice 6 is reviewed and merged, start Slice 7: Pre-save Pl@ntNet identification on a new branch from the latest appropriate base.

## Validation Expectations

For future implementation slices, run the scripts that exist in `package.json`:

- `npm run typecheck` if present.
- `npm test` if present.
- `npm run build`.
- `npm run lint` if present.

For migration/RLS slices, also validate migrations and owner-scoped access wherever local tooling is available.

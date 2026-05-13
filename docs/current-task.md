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

Slice 1: Onboarding shell and first-run routing.

Status: implemented on branch `campaign/onboarding-rooms-s1-onboarding`; awaiting review/merge.

Completed work:

- Added user-owned `user_app_preferences` table for onboarding completion state.
- Added owner-scoped RLS policies for selecting, inserting, and updating app preferences.
- Added `/app/onboarding` as a protected, skippable onboarding route.
- Redirected signed-in users with no plants and no completed onboarding state from Today to onboarding.
- Preserved existing users by not redirecting users who already have plants.
- Added skip/complete actions that persist completion and route to Today or Add Plant.
- Added Settings entry point to revisit setup without re-triggering onboarding loops.

Non-goals preserved:

- No room data model yet.
- No photo-first Add Plant changes.
- No AI behavior changes.
- No Google Calendar behavior changes.

## Validation Results

- `.env.local` copied into the worktree; required Supabase, PlantNet, and Google key names are present without printing secret values.
- `npm run lint`: passed.
- `npm run build`: passed.
- `npm run typecheck`: not run; no script exists.
- `npm test`: not run; no script exists.
- Supabase CLI migration apply: not run; `supabase` CLI is not installed in this environment.
- Migration/RLS review: additive table, per-user unique preference row, RLS enabled, and policies constrain access with `auth.uid() = user_id`.

## Next Recommended Action

After Slice 1 is reviewed and merged, start Slice 2: Room data model and migration on a new branch from latest `main`.

## Validation Expectations

For future implementation slices, run the scripts that exist in `package.json`:

- `npm run typecheck` if present.
- `npm test` if present.
- `npm run build`.
- `npm run lint` if present.

For migration/RLS slices, also validate migrations and owner-scoped access wherever local tooling is available.

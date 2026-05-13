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

Slice 7: Pre-save Pl@ntNet identification.

Status: implemented on branch `campaign/onboarding-rooms-s7-presave-plantnet`; awaiting review/merge.

Completed work:

- Added optional Pl@ntNet identification from the selected Add Plant photo before final save.
- Kept identification transient: the server reads the submitted photo bytes directly from the form, calls Pl@ntNet server-side, and stores no draft photo, public URL, signed URL, or raw provider response.
- Shows names-only suggestions with conservative uncertainty labels.
- Requires user action to copy a suggestion into editable common/scientific name fields.
- Allows users to reject suggestions and continue manually.
- Preserves manual plant creation without photo, rooms, AI, reminders, or calendar setup.

AI/photo behavior:

- Photos remain private in the existing `plant-photos` bucket after plant save.
- Pre-save identification does not upload staged photos and leaves no abandoned storage object.
- Accepted suggestions only fill editable plant name fields before the user saves the plant.
- No watering interval, watering guidance, care profile, diagnosis, treatment, or care truth is generated or saved by AI.

Non-goals preserved:

- No `care_profiles`.
- No AI-generated watering fields.
- No diagnosis, disease, pest, toxicity, or treatment guidance.
- No public storage, staged photo table, or draft plant records.
- No deletion of `plants.location`.

## Validation Results

- `npm run lint`: passed.
- `npm run build`: passed.
- `npm run typecheck`: not run; no script exists.
- `npm test`: not run; no script exists.
- Supabase migrations: product owner reported Slice 2 room migrations were run successfully before Slice 4 resumed.
- Migration/RLS review: no schema changes in Slice 7. Pre-save identification verifies a signed-in user and sends only the submitted image bytes to Pl@ntNet from the server. It does not create staged storage objects or expose provider credentials.

## Next Recommended Action

After Slice 7 is reviewed and merged, start Slice 8: Onboarding room/photo integration polish on a new branch from the latest appropriate base.

## Validation Expectations

For future implementation slices, run the scripts that exist in `package.json`:

- `npm run typecheck` if present.
- `npm test` if present.
- `npm run build`.
- `npm run lint` if present.

For migration/RLS slices, also validate migrations and owner-scoped access wherever local tooling is available.

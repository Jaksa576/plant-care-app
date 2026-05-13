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

Slice 5: Settings-managed Google Calendar integration.

Status: implemented on branch `campaign/onboarding-rooms-s5-calendar-settings`; awaiting review/merge.

Completed work:

- Added Settings-level Google Calendar connect/disconnect/status controls under Reminders & Calendar.
- Settings shows configured/disconnected/connected state, mirrored reminder count, last sync/status metadata, and sync issues where existing records provide them.
- Google OAuth missing-config, success, cancellation, and error statuses now return to Settings.
- Removed the heavy plant-detail Google Calendar setup panel.
- Plant detail now shows only lightweight calendar status when relevant and links to Settings for integration management.
- Plant-level reminder panels remain responsible for reminder state; app reminders remain the source of truth.

Calendar behavior:

- Google Calendar remains a one-way reflection of enabled app-owned watering reminders.
- Disconnecting Google preserves app reminders and attempts provider cleanup of known app-managed events.
- Missing Google server configuration degrades to a Settings warning without affecting reminders.

Non-goals preserved:

- No room restore UI.
- No room sorting/reordering UI.
- No deletion of `plants.location`.
- No bidirectional calendar sync.
- No Outlook sync.
- No calendar-owned reminders.
- No recurring Google events or non-watering calendar events.
- No reminder model redesign.

## Validation Results

- `npm run lint`: passed.
- `npm run build`: passed.
- `npm run typecheck`: not run; no script exists.
- `npm test`: not run; no script exists.
- Supabase migrations: product owner reported Slice 2 room migrations were run successfully before Slice 4 resumed.
- Migration/RLS review: no schema changes in Slice 5. Google Calendar connection/event-link reads and disconnect cleanup stay scoped by signed-in `user_id`; existing reminder-to-calendar sync still starts from user-owned plants and reminders.

## Next Recommended Action

After Slice 5 is reviewed and merged, start Slice 6: Photo-first Add Plant foundation on a new branch from the latest appropriate base.

## Validation Expectations

For future implementation slices, run the scripts that exist in `package.json`:

- `npm run typecheck` if present.
- `npm test` if present.
- `npm run build`.
- `npm run lint` if present.

For migration/RLS slices, also validate migrations and owner-scoped access wherever local tooling is available.

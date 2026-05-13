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

Slice 4: Room dropdown in Add/Edit Plant.

Status: implemented on branch `campaign/onboarding-rooms-s4-room-plant-forms`; awaiting review/merge.

Completed work:

- Add Plant and Edit Plant now load active user-owned rooms.
- Plant forms include a managed room dropdown, Unassigned option, inline Add room field, and legacy location note.
- Plant create/update verifies selected rooms server-side and creates inline rooms under the signed-in user before saving the plant.
- Home and Plants grouping use active managed room names first, then legacy `plants.location`, then Unassigned.
- Plant profile room display uses the same managed-room-first fallback.
- Accepted Pl@ntNet name updates preserve existing `room_id`.

Transition behavior:

- `plants.location` is still preserved and editable as a legacy location note.
- Plants can remain Unassigned with `room_id = null`.
- Inline room creation is optional; selecting an existing room or leaving Unassigned remains low-friction.

Non-goals preserved:

- No room restore UI.
- No room sorting/reordering UI.
- No deletion of `plants.location`.
- No room floorplan, room reminders, AI, photo, or calendar changes.

## Validation Results

- `npm run lint`: passed.
- `npm run build`: passed.
- `npm run typecheck`: not run; no script exists.
- `npm test`: not run; no script exists.
- Supabase migrations: product owner reported Slice 2 room migrations were run successfully before Slice 4 resumed.
- Migration/RLS review: plant form actions verify selected rooms through user-scoped room queries; inline room creation derives `user_id` from the signed-in session; the database trigger from Slice 2 still blocks cross-user or archived-room plant assignments.

## Next Recommended Action

After Slice 4 is reviewed and merged, start Slice 5: Settings-managed Google Calendar integration on a new branch from the latest appropriate base.

## Validation Expectations

For future implementation slices, run the scripts that exist in `package.json`:

- `npm run typecheck` if present.
- `npm test` if present.
- `npm run build`.
- `npm run lint` if present.

For migration/RLS slices, also validate migrations and owner-scoped access wherever local tooling is available.

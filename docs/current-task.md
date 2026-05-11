# Current Task

## Current Status

- Next.js + TypeScript + Tailwind scaffold is implemented.
- Supabase email auth at `/login` is implemented.
- `/app` is protected for signed-in users.
- Signed-in shell, sign-out, and middleware-based session refresh are implemented.
- User-owned plant CRUD is implemented with a persisted `plants` table, RLS ownership policies, and soft archive behavior.
- A dedicated, protected plant detail/profile view is implemented for user-owned plant records.
- Plant-level watering state and mark-watered behavior are implemented with durable watering events and reminder-aware next-date display.
- A reminder-aware watering dashboard with overdue, due today, upcoming, and recently watered sections is implemented.
- Plant-level watering history is implemented from the durable watering event model.
- Primary plant photo upload is implemented with private Supabase Storage, one optional photo per owned plant, profile display, dashboard thumbnails, replace/remove actions, and calm no-photo fallbacks.
- AI-assisted plant identification is implemented with a deliberate Pl@ntNet-backed helper from an owned primary photo. Suggestions are transient, names-only, reviewable, editable, rejectable, and saved only after user acceptance into normal plant fields.
- App-owned watering reminders are implemented with a watering-only reminder model, enabled/disabled state, date-first next reminder, plant profile panel, owner-scoped RLS, and mark-watered updates when an interval exists.
- Google Calendar sync is implemented as a one-way reflection of app-owned watering reminders when server OAuth configuration is present.
- Reminder flexibility is implemented with after-watering mode, fixed schedule mode, snooze controls, predictable watered-early behavior, and profile/dashboard urgency that reflects enabled reminder dates.

## Active Slice

UI Redesign UX Overhaul Campaign is active.

Current branch:

```txt
ui-redesign/05-add-edit-polish
```

Slice 05 polishes Add Plant and Edit Plant flows using the shared redesign system. It preserves manual setup, optional photo timing, partial/simple saves, editable care guidance, and safe archive handling.

## Why This Is Next

The v1 watering, photo, AI-assisted identification, app-owned reminder, and Google Calendar sync stack is implemented on `main`. The approved active campaign is the UI Redesign UX Overhaul. Slice 05 follows the Plant Detail redesign so setup and editing feel consistent with the new inspector and collection surfaces.

## Scope

- Polish the shared Add/Edit plant form with the new visual system.
- Group identity, room/location, watering guidance, and notes clearly.
- Keep photo optional and discoverable after save.
- Preserve manual setup and partial/simple saves.
- Preserve editable care guidance.
- Keep archive/destructive action secondary and safe.
- Preserve existing auth, ownership, reminder, AI, calendar, and schema behavior.

## Non-Goals

- Do not implement Outlook, bidirectional sync, calendar-owned reminder truth, generic tasks, notification delivery, AI scheduling, health diagnosis, or broad scheduler settings without a new approved slice.
- Do not change schema, make room/location mandatory, make AI-first setup, or change watering/reminder/calendar semantics in Slice 05.
- Do not change dependencies, schema, auth/session handling, RLS assumptions, AI behavior, reminder behavior, or calendar sync behavior.

## Acceptance Criteria

- Add Plant remains beginner-friendly and manual.
- Edit Plant remains user-owned and safe.
- User can save simple/partial info.
- Care basics remain editable guidance.
- Photo and room/location are optional and discoverable.
- Archive remains a secondary safe destructive path.
- Empty/error states remain calm and recoverable.
- Validation gates pass.

## Validation Expectations

For implementation slices, run:

- `npm run typecheck` if a typecheck script exists.
- `npm test` if a test script exists.
- `npm run build`.
- `npm run lint` if present.

Stop if review finds ownership, migration, provider, or validation issues.

## Next Recommended Action

Create the next stacked branch from `ui-redesign/05-add-edit-polish`:

```txt
ui-redesign/06-supporting-features
```

Then polish reminders, Google Calendar sync, photo/identification, empty/loading/error states, accessibility basics, and desktop sanity without adding new feature semantics.

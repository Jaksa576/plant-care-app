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
ui-redesign/04-plant-detail
```

Slice 04 redesigns the plant detail route as a calm inspector-style view. It preserves existing user-owned reads and actions while promoting photo/identity, Water now, Snooze, Reminder, care basics, and care history.

## Why This Is Next

The v1 watering, photo, AI-assisted identification, app-owned reminder, and Google Calendar sync stack is implemented on `main`. The approved active campaign is the UI Redesign UX Overhaul. Slice 04 follows the Home and Plants redesigns so opening a plant feels consistent with the new watering-first surfaces.

## Scope

- Redesign `/app/plants/[plantId]` as an inspector-style plant detail view.
- Show large plant photo/fallback, identity, room, and watering status.
- Keep Water now primary and Snooze/Reminder secondary.
- Show care basics as clean rows.
- Show care history near the top.
- Keep photo/identification, reminder, Google Calendar, edit, and archive access findable.
- Preserve existing auth, ownership, reminder, AI, calendar, and schema behavior.

## Non-Goals

- Do not implement Outlook, bidirectional sync, calendar-owned reminder truth, generic tasks, notification delivery, AI scheduling, health diagnosis, or broad scheduler settings without a new approved slice.
- Do not redesign Add/Edit, reminder internals, AI semantics, or calendar sync semantics in Slice 04.
- Do not change dependencies, schema, auth/session handling, RLS assumptions, AI behavior, reminder behavior, or calendar sync behavior.

## Acceptance Criteria

- `/app/plants/[plantId]` remains protected and user-scoped.
- Existing Water, Snooze, Reminder, Photo, AI identification, Calendar, Edit, and Archive actions remain available.
- Water is primary in the top action surface.
- Snooze and Reminder are secondary.
- Care basics and care history use the new visual system.
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

Create the next stacked branch from `ui-redesign/04-plant-detail`:

```txt
ui-redesign/05-add-edit-polish
```

Then polish Add Plant and Edit Plant flows with the shared visual system while preserving manual setup and editable care guidance.

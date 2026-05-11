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
ui-redesign/03-plants-collection
```

Slice 03 implements the redesigned Plants tab collection surface. It uses existing user-scoped plant, watering, and reminder reads to show the full active collection grouped by room, with Unassigned handling, Add Plant access, and plant detail navigation.

## Why This Is Next

The v1 watering, photo, AI-assisted identification, app-owned reminder, and Google Calendar sync stack is implemented on `main`. The approved active campaign is the UI Redesign UX Overhaul. Slice 03 follows the Home / Today redesign so users can browse the full collection outside the daily care queue.

## Scope

- Implement `/app/plants` as the full Plants tab collection surface.
- Show the full active plant collection independent of Home.
- Group by room/location and show Unassigned for missing room/location.
- Keep Add Plant obvious.
- Preserve plant detail navigation.
- Show calm empty/error states.
- Preserve existing auth, ownership, reminder, AI, calendar, and schema behavior.

## Non-Goals

- Do not implement Outlook, bidirectional sync, calendar-owned reminder truth, generic tasks, notification delivery, AI scheduling, health diagnosis, or broad scheduler settings without a new approved slice.
- Do not redesign Plant Detail, Add/Edit, reminder, AI, or calendar surfaces in Slice 03.
- Do not change dependencies, schema, auth/session handling, RLS assumptions, AI behavior, reminder behavior, or calendar sync behavior.

## Acceptance Criteria

- `/app/plants` is protected and user-scoped.
- User can browse all active plants outside Home.
- Room chapters use plant `location`.
- Missing room/location appears as Unassigned.
- Add Plant and plant detail links are visible.
- Watering status labels reuse existing reminder-aware schedule logic.
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

Create the next stacked branch from `ui-redesign/03-plants-collection`:

```txt
ui-redesign/04-plant-detail
```

Then redesign the plant detail route as the approved inspector-style view while preserving existing watering, reminder, photo, AI, calendar, edit, and archive behavior.

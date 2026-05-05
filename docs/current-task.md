# Current Task

## Current Status

- Next.js + TypeScript + Tailwind scaffold is implemented.
- Supabase email auth at `/login` is implemented.
- `/app` is protected for signed-in users.
- Signed-in shell, sign-out, and middleware-based session refresh are implemented.
- User-owned plant CRUD is implemented with a persisted `plants` table, RLS ownership policies, and soft archive behavior.
- A dedicated, protected plant detail/profile view is implemented for user-owned plant records.
- Plant-level watering state and mark-watered behavior are implemented with durable watering events.
- A watering dashboard with overdue, due today, upcoming, and recently watered sections is implemented.
- Plant-level watering history is implemented from the durable watering event model.
- Primary plant photo upload is implemented with private Supabase Storage, one optional photo per owned plant, profile display, dashboard thumbnails, replace/remove actions, and calm no-photo fallbacks.
- AI-assisted plant identification is implemented with a deliberate Pl@ntNet-backed helper from an owned primary photo. Suggestions are transient, names-only, reviewable, editable, rejectable, and saved only after user acceptance into normal plant fields.
- App-owned watering reminders are implemented with a watering-only reminder model, enabled/disabled state, date-first next reminder, plant profile panel, owner-scoped RLS, and mark-watered updates when an interval exists.
- Google Calendar sync is implemented as a one-way reflection of app-owned watering reminders when server OAuth configuration is present.
- Reminder flexibility is implemented with after-watering mode, fixed schedule mode, snooze controls, and predictable watered-early behavior.

## Active Slice

The Photo Identification + Reminder Sync Campaign is active.

Slice 5.3: Reminder flexibility is implemented. The Photo Identification + Reminder Sync Campaign is complete pending review, preview QA, and ordered branch merges.

## Why This Is Next

The v1 photo, identification, reminder, and Google Calendar stack is now implemented as a stacked campaign. The next work should be QA, review, and merge sequencing rather than new feature scope.

## Scope

- QA the stacked campaign branches in order.
- Apply Supabase migrations in a preview environment.
- Verify Google Calendar configuration in a safe preview environment before merging the calendar slice.

## Non-Goals

- Do not implement Outlook, bidirectional sync, calendar-owned reminder truth, generic tasks, notification delivery, AI scheduling, health diagnosis, or broad scheduler settings without a new approved slice.

## Acceptance Criteria

- Branches remain unmerged to main until product owner review.
- Manual QA covers reminders, Google sync, RLS/ownership, and mobile profile controls.
- Deferred roadmap items stay deferred unless reprioritized.

## Validation Expectations

For implementation slices, run:

- `npm run typecheck` if a typecheck script exists.
- `npm test` if a test script exists.
- `npm run build`.
- `npm run lint` if present.

Stop if review finds ownership, migration, provider, or validation issues.

## Next Recommended Action

Open/review the stacked branches in order, starting with Slice 4.1, then 4.2, 5.1, 5.2, and 5.3.

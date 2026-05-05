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

## Active Slice

The Photo Identification + Reminder Sync Campaign is active.

Slice 5.2: Google Calendar sync is implemented. The next planned product slice is Slice 5.3: Reminder flexibility.

## Why This Is Next

Google Calendar can now mirror active Plant Care watering reminders without becoming the source of truth. Reminder flexibility is next so users can choose the practical reminder behavior that matches their watering routine.

## Scope

- Add focused watering reminder controls for after-watering and fixed schedule behavior.
- Add snooze controls.
- Keep Google Calendar event linkage updated from app reminder changes when sync is connected.

## Non-Goals

- Do not implement Outlook, bidirectional sync, calendar-owned reminder truth, generic tasks, notification delivery, AI scheduling, health diagnosis, or broad scheduler settings.

## Acceptance Criteria

- User can choose reminder behavior in plain language.
- Snooze moves the next reminder without changing plant care basics.
- Mark-watered behavior remains predictable.
- Calendar sync remains one-way from app reminders if connected.

## Validation Expectations

For implementation slices, run:

- `npm run typecheck` if a typecheck script exists.
- `npm test` if a test script exists.
- `npm run build`.
- `npm run lint` if present.

Stop if reminder semantics are ambiguous, calendar sync cannot stay aligned, or validation fails.

## Next Recommended Action

Start Slice 5.3 on a new branch/worktree stacked on Slice 5.2.

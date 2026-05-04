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
- There is no reminder system or calendar sync yet.

## Active Slice

The Photo Identification + Reminder Sync Campaign is active.

Slice 4.2: AI-assisted plant identification is implemented. The next planned product slice is Slice 5.1: Internal reminder model.

## Why This Is Next

The app now supports visual plant records and conservative name suggestions without making AI authoritative. App-owned watering reminders are next because reminders must exist inside Plant Care before any Google Calendar sync.

## Scope

- Add app-owned reminder state scoped to the signed-in user and owned plant.
- Keep reminder type constrained to watering for v1.
- Add enabled/disabled state and a next reminder date or datetime.
- Show a plain-language reminder panel on plant profile.
- Ensure reminder behavior works without Google Calendar.

## Non-Goals

- Do not implement Google Calendar sync, Outlook sync, notification delivery, generic tasks, diagnosis, encyclopedia content, AI scheduling, or calendar-defined reminder truth.
- Do not claim push/email/SMS notifications exist unless an actual channel is implemented.

## Acceptance Criteria

- Reminder state is scoped to signed-in user and owned plant.
- Reminder behavior is app-owned and works without Google Calendar.
- Reminder language stays watering-specific and plain.
- Manual plant setup and watering remain useful without reminders.

## Validation Expectations

For implementation slices, run:

- `npm run typecheck` if a typecheck script exists.
- `npm test` if a test script exists.
- `npm run build`.
- `npm run lint` if present.

Stop if reminder semantics are ambiguous or validation fails.

## Next Recommended Action

Start Slice 5.1: Internal reminder model on a new branch/worktree after reviewing the updated docs.

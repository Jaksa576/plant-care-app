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
ui-redesign/06-supporting-features
```

Slice 06 polishes supporting feature surfaces so the UI redesign is coherent across reminders, Google Calendar sync, photo upload, AI-assisted identification, loading states, and supporting controls.

## Why This Is Next

The v1 watering, photo, AI-assisted identification, app-owned reminder, and Google Calendar sync stack is implemented on `main`. The UI Redesign UX Overhaul campaign is complete locally through the stacked `ui-redesign/06-supporting-features` branch. Branches have not been pushed because the app safety reviewer rejected export to the configured GitHub remote without explicit approval.

## Scope

- Polish reminder, Google Calendar, photo, and identification supporting surfaces.
- Keep AI and calendar secondary to watering.
- Preserve conservative AI/calendar copy and user-owned truth.
- Improve loading state styling and control tap/focus treatment.
- Preserve existing auth, ownership, reminder, AI, calendar, and schema behavior.

## Non-Goals

- Do not implement Outlook, bidirectional sync, calendar-owned reminder truth, generic tasks, notification delivery, AI scheduling, health diagnosis, or broad scheduler settings without a new approved slice.
- Do not add a new calendar provider, Health Check, AI diagnosis, broad automation, schema/RLS changes, or calendar-first behavior in Slice 06.
- Do not change dependencies, schema, auth/session handling, RLS assumptions, AI behavior, reminder behavior, or calendar sync behavior.

## Acceptance Criteria

- Supporting panels match the shared redesign tokens and icon treatment.
- AI and calendar remain contextual and secondary.
- Copy remains conservative and user-owned.
- Loading state matches the redesigned surface language.
- Tap targets and focus treatment are improved on supporting controls.
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

Recommended next action: review the stacked branches in order, approve the GitHub push/export if remote preview branches are desired, then use Vercel previews for manual QA before merging.

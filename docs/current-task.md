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
ui-redesign/02-home-today
```

Slice 02 redesigns the signed-in Home route as the approved Today care surface. It keeps the existing reminder-aware plant/watering data flow while presenting Needs water, By room, and Recent care with icon-led Water and secondary Snooze actions.

## Why This Is Next

The v1 watering, photo, AI-assisted identification, app-owned reminder, and Google Calendar sync stack is implemented on `main`. The approved active campaign is the UI Redesign UX Overhaul. Slice 02 follows the completed shell foundation so the Home screen can become the watering-first Today surface before the full Plants collection redesign.

## Scope

- Replace the old dashboard-card Home presentation with Today/date language.
- Show overdue and due-today plants first under Needs water.
- Keep Water as the primary icon-led action.
- Show Snooze as secondary where current reminder state supports it.
- Show By room grouping, including Unassigned for missing room/location.
- Show Recent care as a lightweight watering log.
- Keep Add Plant visible as a quick action.
- Preserve existing auth, ownership, reminder, AI, calendar, and schema behavior.

## Non-Goals

- Do not implement Outlook, bidirectional sync, calendar-owned reminder truth, generic tasks, notification delivery, AI scheduling, health diagnosis, or broad scheduler settings without a new approved slice.
- Do not redesign Plants, Plant Detail, Add/Edit, reminder, AI, or calendar surfaces in Slice 02.
- Do not change dependencies, schema, auth/session handling, RLS assumptions, AI behavior, reminder behavior, or calendar sync behavior.

## Acceptance Criteria

- Home uses Today/date copy rather than dashboard language.
- Needs water includes overdue and due-today plants.
- Water remains wired to existing mark-watered behavior.
- Snooze remains wired to existing reminder snooze behavior where supported.
- By room groups plants by location and treats missing locations as Unassigned.
- Recent care shows watering events as a log.
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

Create the next stacked branch from `ui-redesign/02-home-today`:

```txt
ui-redesign/03-plants-collection
```

Then implement the full Plants collection surface using the approved Plants tab mockup and the shared shell/tokens from earlier slices.

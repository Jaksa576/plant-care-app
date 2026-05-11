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
ui-redesign/01-foundation-shell
```

Slice 01 adds the shared visual foundation and protected signed-in shell navigation for the UI redesign. It introduces warm design tokens, Nunito Sans font loading, local inline SVG icon primitives, Home / Plants / Settings bottom app bar navigation, and minimal protected Plants and Settings route surfaces.

## Why This Is Next

The v1 watering, photo, AI-assisted identification, app-owned reminder, and Google Calendar sync stack is implemented on `main`. The approved active campaign is the UI Redesign UX Overhaul. Slice 01 follows the completed docs reference package so later Home, Plants, and Plant Detail slices can reuse one visual foundation.

## Scope

- Add or refine reusable visual tokens.
- Apply the softer Nunito Sans typography direction through the existing font strategy.
- Add local icon primitives without adding an icon dependency.
- Add signed-in bottom app bar navigation for Home, Plants, and Settings.
- Keep Add Plant discoverable.
- Add protected minimal Plants and Settings route surfaces needed for shell navigation.
- Preserve Supabase auth/session redirects and user-owned data behavior.

## Non-Goals

- Do not implement Outlook, bidirectional sync, calendar-owned reminder truth, generic tasks, notification delivery, AI scheduling, health diagnosis, or broad scheduler settings without a new approved slice.
- Do not redesign the full Home, Plants, Plant Detail, Add/Edit, reminder, AI, or calendar surfaces in Slice 01.
- Do not change dependencies, schema, auth/session handling, RLS assumptions, AI behavior, reminder behavior, or calendar sync behavior.

## Acceptance Criteria

- Reusable design tokens and icon primitives exist.
- Nunito Sans is loaded through the current `next/font/google` strategy.
- Home / Plants / Settings bottom navigation is present on the signed-in app shell.
- Add Plant remains visible in the signed-in shell.
- `/app/plants` and `/app/settings` are protected and preserve signed-in route behavior.
- Existing plant data reads remain user-scoped.
- Validation gates pass.

## Validation Expectations

For implementation slices, run:

- `npm run typecheck` if a typecheck script exists.
- `npm test` if a test script exists.
- `npm run build`.
- `npm run lint` if present.

Stop if review finds ownership, migration, provider, or validation issues.

## Next Recommended Action

Create the next stacked branch from `ui-redesign/01-foundation-shell`:

```txt
ui-redesign/02-home-today
```

Then implement the Home / Today redesign using the existing reminder-aware dashboard data flow and the approved Home mockup. Keep watering primary, Snooze secondary where supported, and avoid schema, AI, or calendar behavior changes.

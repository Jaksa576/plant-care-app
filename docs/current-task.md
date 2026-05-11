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
ui-redesign/00-docs-reference
```

Slice 00 adds the missing brand reference companion doc for the approved UI redesign reference package. No app code, route, dependency, schema, auth, or RLS behavior changes are in scope for this slice.

## Why This Is Next

The v1 watering, photo, AI-assisted identification, app-owned reminder, and Google Calendar sync stack is implemented on `main`. The approved next campaign is the UI Redesign UX Overhaul, starting with a docs reference package readiness fix because `docs/design/plant-care-brand-reference.md` was referenced by the campaign docs but missing from the repo.

## Scope

- Add `docs/design/plant-care-brand-reference.md` as a concise text companion to `docs/design/plant-care-approved-brand-reference-sheet.png`.
- Confirm required UI redesign reference docs and mockups exist.
- Keep app code unchanged.
- Prepare for Slice 01: Design System And Shell Foundation.

## Non-Goals

- Do not implement Outlook, bidirectional sync, calendar-owned reminder truth, generic tasks, notification delivery, AI scheduling, health diagnosis, or broad scheduler settings without a new approved slice.
- Do not change app code, dependencies, routes, schema, auth/session handling, RLS assumptions, AI behavior, reminder behavior, or calendar sync behavior in Slice 00.

## Acceptance Criteria

- `docs/design/plant-care-brand-reference.md` exists.
- Existing UI redesign visual and implementation references exist.
- Final mockups exist under `docs/design/mockups/`.
- Campaign doc references the completed docs readiness slice and points to Slice 01 next.
- Build validation is skipped because no app code changed.

## Validation Expectations

For implementation slices, run:

- `npm run typecheck` if a typecheck script exists.
- `npm test` if a test script exists.
- `npm run build`.
- `npm run lint` if present.

Stop if review finds ownership, migration, provider, or validation issues.

## Next Recommended Action

Create the next stacked branch from `ui-redesign/00-docs-reference`:

```txt
ui-redesign/01-foundation-shell
```

Then implement the design system and signed-in shell foundation without changing data ownership, auth/session behavior, schema, AI semantics, reminder semantics, or calendar sync semantics.

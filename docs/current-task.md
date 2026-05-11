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
ui-redesign/07-qa-polish
```

Slice 07 applies a narrow QA polish patch on top of the completed UI Redesign UX Overhaul stack. It fixes visible manual-review issues without changing schema, RLS, auth/session behavior, AI semantics, reminder semantics, or calendar semantics.

## Why This Is Next

The v1 watering, photo, AI-assisted identification, app-owned reminder, and Google Calendar sync stack is implemented on `main`. The UI Redesign UX Overhaul campaign is complete through the stacked `ui-redesign/07-qa-polish` branch, with this branch intended for final preview before merge.

## Scope

- Fix primary button contrast and disabled-state clarity.
- Remove duplicate Home Add Plant affordance.
- Show Home By room plants inline under textual room chapters.
- Improve plant detail photo crop/display.
- Remove duplicated plant detail care/basic information.
- Clarify Add/Edit required-name fields and validation errors.
- Confirm photo upload and Pl@ntNet identification remain discoverable on owned plant detail.
- Use approved logo/icon asset in visible app surfaces without over-branding.
- Preserve existing auth, ownership, reminder, AI, calendar, and schema behavior.

## Non-Goals

- Do not implement Outlook, bidirectional sync, calendar-owned reminder truth, generic tasks, notification delivery, AI scheduling, health diagnosis, or broad scheduler settings without a new approved slice.
- Do not add onboarding, room management settings, persistent room schema, room dropdown data model, Health Check, landing page overhaul, Google Calendar relocation, pre-save PlantNet identification, AI diagnosis, calendar-first reminder behavior, schema changes, RLS changes, or new dependencies in Slice 07.
- Do not change dependencies, schema, auth/session handling, RLS assumptions, AI behavior, reminder behavior, or calendar sync behavior.

## Acceptance Criteria

- Primary buttons are readable.
- Home top area has one Add Plant entry point.
- Home By room shows plants inline under room chapters, including Unassigned.
- Water early and Snooze use existing actions only.
- Plant detail uploaded photos display cleanly on desktop and mobile.
- Care basics appear once on plant detail.
- Required Add/Edit fields are visibly marked and validation errors are understandable.
- Photo upload and AI-assisted identification remain reachable from owned plant detail.
- Approved brand asset is used in visible app surfaces without replacing plant content as the focus.
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

Recommended next action: push `ui-redesign/07-qa-polish` for Vercel preview, manually QA the checklist in the branch report, then merge the stacked UI redesign branches in order only after review.

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

No implementation slice or v1 feature campaign is currently active.

The Photo Identification + Reminder Sync Campaign is complete and merged to `main`. Its historical campaign doc is archived at [Photo Identification + Reminder Sync Campaign](campaigns/archived/photo-identification-reminder-sync.md).

## Why This Is Next

The v1 watering, photo, AI-assisted identification, app-owned reminder, and Google Calendar sync stack is implemented on `main`. The next work should be product-owner production-readiness review and a decision on the next approved campaign.

## Scope

- Verify production or main-preview environment variables for Pl@ntNet and Google Calendar before broad release.
- Confirm Supabase migrations are applied in the deployment Supabase project.
- Perform product-owner QA on the merged main experience: photos, AI review flow, reminders, Google sync, profile/dashboard reminder dates, ownership boundaries, and mobile layout.
- Decide the next product campaign before starting new implementation work.

## Non-Goals

- Do not implement Outlook, bidirectional sync, calendar-owned reminder truth, generic tasks, notification delivery, AI scheduling, health diagnosis, or broad scheduler settings without a new approved slice.

## Acceptance Criteria

- Hot-path docs agree that the Photo Identification + Reminder Sync Campaign is implemented on `main`.
- Manual QA covers photos, AI suggestions, reminders, profile/dashboard grouping, Google sync, RLS/ownership, and mobile profile controls.
- Deployment environments have required server-only provider configuration before shipping provider-backed flows.
- Deferred roadmap items stay deferred unless reprioritized.

## Validation Expectations

For implementation slices, run:

- `npm run typecheck` if a typecheck script exists.
- `npm test` if a test script exists.
- `npm run build`.
- `npm run lint` if present.

Stop if review finds ownership, migration, provider, or validation issues.

## Next Recommended Action

Run a production-readiness review of the merged `main` app, then choose the next campaign or leave the roadmap in maintenance mode until the product owner approves new scope.

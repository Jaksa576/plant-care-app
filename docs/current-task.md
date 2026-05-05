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
- There is no Google Calendar sync yet.

## Active Slice

The Photo Identification + Reminder Sync Campaign is active.

Slice 5.1: Internal reminder model is implemented. The next planned product slice is Slice 5.2: Google Calendar sync.

## Why This Is Next

Watering reminders now exist in Plant Care without depending on an external provider. Google Calendar sync is next only if OAuth credentials, redirect URL strategy, scopes, token storage, and token encryption can be represented safely server-side.

## Scope

- Inspect whether Google Calendar OAuth and token handling can be implemented securely.
- If safe configuration exists, add one-way sync from app-owned watering reminders to Google Calendar.
- Keep Plant Care reminders authoritative if sync fails.

## Non-Goals

- Do not implement Outlook, bidirectional sync, calendar-owned reminder truth, generic calendar tasks, notification delivery, AI scheduling, health diagnosis, or broad calendar settings.

## Acceptance Criteria

- Slice 5.2 starts only after the Google readiness gate passes.
- Provider secrets and refresh tokens are not exposed to browser code.
- App reminders remain the source of truth.
- Sync failure preserves app reminder state.

## Validation Expectations

For implementation slices, run:

- `npm run typecheck` if a typecheck script exists.
- `npm test` if a test script exists.
- `npm run build`.
- `npm run lint` if present.

Stop if Google OAuth/token handling cannot be implemented safely or validation fails.

## Next Recommended Action

Start Slice 5.2 readiness review on a new branch/worktree stacked on Slice 5.1.

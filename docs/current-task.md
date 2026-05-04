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
- There is no AI identification, reminder system, or calendar sync yet.

## Active Slice

The Photo Identification + Reminder Sync Campaign is active.

Slice 4.1: plant photo upload is implemented. The next planned product slice is Slice 4.2: AI-assisted plant identification.

## Why This Is Next

Plant photos now make the owned collection more visual without changing the watering-first loop. AI-assisted identification is next only if provider, credentials, request/response shape, and data-handling expectations are documented or explicitly approved.

## Scope

- Inspect whether the repo documents an AI identification provider boundary and required configuration.
- If those decisions exist, implement a deliberate `Help identify this plant` flow from an owned primary photo.
- Keep suggestions uncertain, reviewable, editable, rejectable, and manually overrideable.

## Non-Goals

- Do not invent AI provider details, credentials, API shape, request shape, response shape, or retention expectations.
- Do not implement reminders, notification delivery, Google Calendar sync, Outlook sync, diagnosis, encyclopedia content, generic tasks, galleries, or AI-controlled care truth.

## Acceptance Criteria

- Slice 4.2 starts only after the provider readiness gate passes.
- Accepted AI values land in normal editable plant fields.
- Unreviewed AI output does not become plant truth.
- Manual plant setup and watering remain useful without AI.

## Validation Expectations

For implementation slices, run:

- `npm run typecheck` if a typecheck script exists.
- `npm test` if a test script exists.
- `npm run build`.

If provider decisions are missing for Slice 4.2, stop and report the needed product/architecture decisions instead of changing code.

## Next Recommended Action

Start Slice 4.2 readiness review on a new branch/worktree. Stop before implementation if AI provider details are missing.

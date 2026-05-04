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
- There is no image upload, AI identification, watering history timeline, reminder system, or calendar sync yet.

## Active Slice

Slice 3.3: watering care history timeline.

This is the next active slice in the [Plant Profile + Watering Foundation Campaign](campaigns/plant-profile-watering-foundation.md).

## Why This Is Next

Slice 3.2 turned plant watering state into a scannable dashboard. Slice 3.3 should add plant-level watering history so users can trust and review the records created by mark-watered actions.

## Scope

- Add a plant-level watering history section to the profile.
- Show watering events ordered newest first.
- Include a calm empty history state.
- Keep last-watered/dashboard state consistent with the existing watering event model.
- Preserve server-derived ownership checks and RLS-backed data boundaries.

## Non-Goals

- No photo upload or Supabase Storage work.
- No AI identification or AI care suggestions.
- No reminders, notifications, Google Calendar sync, or Outlook sync.
- No health diagnosis, encyclopedia content, or generalized task behavior.

## Acceptance Criteria

- A signed-in user can review recent watering events for a plant.
- Events are ordered newest first.
- Empty history state is clear and calm.
- Mark-watered creates history consistently.
- Last-watered and dashboard state remain consistent with history.
- Another signed-in user cannot view or mutate another user's watering history.
- No photos, AI, reminders, calendar sync, schema drift beyond the scoped need, or unrelated UI changes are introduced.

## Validation Expectations

For Slice 3.3, run:

- `npm run typecheck` if a typecheck script exists.
- `npm test` if a test script exists.
- `npm run build`.

Also manually verify empty history, one-event history, multi-event history, mark-watered history updates, refresh persistence, mobile layout, dashboard/profile consistency, protected route behavior, and cross-user ownership/RLS in a Supabase-backed environment.

## Next Recommended Action

Implement Slice 3.3 in a dedicated branch and worktree. Reuse the existing watering event model and avoid broad activity-feed behavior.

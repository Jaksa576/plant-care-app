# Current Task

## Current Status

- Next.js + TypeScript + Tailwind scaffold is implemented.
- Supabase email auth at `/login` is implemented.
- `/app` is protected for signed-in users.
- Signed-in shell, sign-out, and middleware-based session refresh are implemented.
- User-owned plant CRUD is implemented with a persisted `plants` table, RLS ownership policies, and soft archive behavior.
- A dedicated, protected plant detail/profile view is implemented for user-owned plant records.
- There is no image upload, AI identification, watering workflow, reminder system, or calendar sync yet.

## Active Slice

Slice 3.1: watering state and mark-watered action.

This is the next active slice in the [Plant Profile + Watering Foundation Campaign](campaigns/plant-profile-watering-foundation.md).

## Why This Is Next

Slice 2.2 made manual plant records easier to review from a durable plant profile. Slice 3.1 should add the first watering state and mark-watered action so the app starts supporting the core watering loop.

## Scope

- Add watering state display on the plant profile.
- Add a mark-watered action.
- Track last-watered state and derive next-watering state or an explicitly documented equivalent.
- Allow early watering and handle missing intervals calmly.
- Preserve server-derived ownership checks and RLS-backed data boundaries.

## Non-Goals

- No photo upload or Supabase Storage work.
- No AI identification or AI care suggestions.
- No dashboard grouping beyond the plant-level watering state.
- No reminders, notifications, Google Calendar sync, or Outlook sync.
- No health diagnosis, encyclopedia content, or generalized task behavior.

## Acceptance Criteria

- A signed-in user can mark one of their own plants as watered.
- Last-watered state updates predictably and persists after refresh.
- Next-watering state updates predictably when enough interval data exists.
- Missing watering interval does not break the UI.
- Early watering is allowed and handled calmly.
- Another signed-in user cannot view or mutate watering state for a plant they do not own.
- No photos, AI, dashboard grouping, reminders, calendar sync, schema drift beyond the scoped need, or unrelated UI changes are introduced.

## Validation Expectations

For Slice 3.1, run:

- `npm run typecheck` if a typecheck script exists.
- `npm test` if a test script exists.
- `npm run build`.

Also manually verify mark-watered behavior, refresh persistence, early watering, missing interval behavior, mobile layout, protected route behavior, and cross-user ownership/RLS in a Supabase-backed environment.

## Next Recommended Action

Implement Slice 3.1 in a dedicated branch and worktree. Preserve the dedicated plant profile as the plant-level surface for watering state and actions.

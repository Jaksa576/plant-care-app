# Current Task

## Current Status

- Next.js + TypeScript + Tailwind scaffold is implemented.
- Supabase email auth at `/login` is implemented.
- `/app` is protected for signed-in users.
- Signed-in shell, sign-out, and middleware-based session refresh are implemented.
- User-owned plant CRUD is implemented with a persisted `plants` table, RLS ownership policies, and soft archive behavior.
- There is no dedicated plant detail/profile view yet.
- There is no image upload, AI identification, watering workflow, reminder system, or calendar sync yet.

## Active Slice

Slice 2.2: plant detail/profile view refinement.

This is the first active slice in the [Plant Profile + Watering Foundation Campaign](campaigns/plant-profile-watering-foundation.md).

## Why This Is Next

Slice 2.1 proved authenticated, user-owned manual plant records. Slice 2.2 makes those records easier to review before watering state, photos, AI, reminders, or calendar sync attach to them.

## Scope

- Add a dedicated plant detail/profile view.
- Present existing plant fields clearly, especially on mobile.
- Keep edit and archive paths coherent from the plant-level experience.
- Preserve server-derived ownership checks and RLS-backed data boundaries.

## Non-Goals

- No photo upload or Supabase Storage work.
- No AI identification or AI care suggestions.
- No watering state, mark-watered action, next watering calculation, or dashboard due logic.
- No reminders, notifications, Google Calendar sync, or Outlook sync.
- No health diagnosis, encyclopedia content, or generalized task behavior.

## Acceptance Criteria

- A signed-in user can open a dedicated plant detail/profile view from the collection.
- The view presents current plant fields clearly on mobile.
- Edit and archive behavior remains coherent with existing CRUD.
- Archived plants remain hidden from the default collection.
- Another signed-in user cannot access or mutate the plant.
- No photos, AI, watering workflow, reminders, calendar sync, schema drift beyond the scoped need, or unrelated UI changes are introduced.

## Validation Expectations

For Slice 2.2, run:

- `npm run typecheck` if a typecheck script exists.
- `npm test` if a test script exists.
- `npm run build`.

Also manually verify profile navigation, mobile layout, edit/archive behavior, protected route behavior, and cross-user ownership/RLS in a Supabase-backed environment.

## Next Recommended Action

Implement Slice 2.2 in a dedicated branch and worktree. After Slice 2.2 is merged, the next recommended slice is Slice 3.1: watering state and mark-watered action.

# Current Task

## Current Status

- Next.js + TypeScript + Tailwind scaffold is implemented.
- Supabase email auth at `/login` is implemented.
- `/app` is protected for signed-in users.
- Signed-in shell, sign-out, and middleware-based session refresh are implemented.
- User-owned plant CRUD is implemented with a persisted `plants` table, RLS ownership policies, and soft archive behavior.
- A dedicated, protected plant detail/profile view is implemented for user-owned plant records.
- Plant-level watering state and mark-watered behavior are implemented with durable watering events.
- There is no image upload, AI identification, watering dashboard, reminder system, or calendar sync yet.

## Active Slice

Slice 3.2: watering dashboard basics.

This is the next active slice in the [Plant Profile + Watering Foundation Campaign](campaigns/plant-profile-watering-foundation.md).

## Why This Is Next

Slice 3.1 added durable watering events and a mark-watered action on the plant profile. Slice 3.2 should turn that watering state into a scannable dashboard so users can see what needs attention today without opening every plant.

## Scope

- Add dashboard sections for overdue, due today, upcoming, and recently watered plants.
- Keep dashboard cards mobile-first and linked to plant profiles.
- Include mark-watered access from dashboard where appropriate.
- Show calm empty states for missing or empty watering groups.
- Preserve server-derived ownership checks and RLS-backed data boundaries.

## Non-Goals

- No photo upload or Supabase Storage work.
- No AI identification or AI care suggestions.
- No reminders, notifications, Google Calendar sync, or Outlook sync.
- No health diagnosis, encyclopedia content, or generalized task behavior.

## Acceptance Criteria

- Dashboard separates plants into overdue, due today, upcoming, and recently watered sections.
- Section membership matches the Slice 3.1 date semantics.
- Completing watering moves plants to the correct state after refresh or revalidation.
- Empty sections are understandable and calm.
- Dashboard cards link to the relevant plant profile.
- Users only see their own plants and watering state.
- No photos, AI, reminders, calendar sync, schema drift beyond the scoped need, or unrelated UI changes are introduced.

## Validation Expectations

For Slice 3.2, run:

- `npm run typecheck` if a typecheck script exists.
- `npm test` if a test script exists.
- `npm run build`.

Also manually verify dashboard grouping, empty states, dashboard mark-watered behavior, profile links, mobile layout, protected route behavior, and cross-user ownership/RLS in a Supabase-backed environment.

## Next Recommended Action

Implement Slice 3.2 in a dedicated branch and worktree. Reuse the Slice 3.1 watering event model and centralized date helpers.

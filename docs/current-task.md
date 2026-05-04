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
- There is no image upload, AI identification, reminder system, or calendar sync yet.

## Active Slice

The Plant Profile + Watering Foundation Campaign is complete through Slice 3.3.

The next planned product slice is Slice 4.1: plant photo upload, pending bulk manual QA and user approval to begin the follow-on campaign.

## Why This Is Next

The completed campaign now supports manual plant records, plant profiles, mark-watered behavior, watering dashboard sections, and plant-level watering history. Manual QA should review the stacked branches before starting photo upload or AI work.

## Scope

- Review and merge the stacked Plant Profile + Watering Foundation branches.
- Manually verify profile, watering, dashboard, history, mobile, protected-route, and cross-user ownership behavior.
- Decide whether to start Slice 4.1: plant photo upload.

## Non-Goals

- Do not start photo upload, Supabase Storage, AI identification, reminders, notifications, Google Calendar sync, or Outlook sync until approved.
- Do not broaden into health diagnosis, encyclopedia content, or generalized task behavior.

## Acceptance Criteria

- Stacked branches are reviewed in order.
- Manual QA covers the campaign-level matrix in the campaign doc.
- Docs identify Slice 4.1 or the follow-on campaign only after user approval.

## Validation Expectations

For the completed campaign stack, verify each implementation branch ran:

- `npm run typecheck` if a typecheck script exists.
- `npm test` if a test script exists.
- `npm run build`.

Manual QA should verify empty history, one-event history, multi-event history, mark-watered history updates, refresh persistence, mobile layout, dashboard/profile consistency, protected route behavior, and cross-user ownership/RLS in a Supabase-backed environment.

## Next Recommended Action

Review the stacked branches through Vercel previews and manual QA. After approval, start Slice 4.1: plant photo upload in a new branch/worktree.

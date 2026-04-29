# Current Task

## Active slice

Slice 2.2: plant detail/profile view refinement.

This slice is the first slice in the [Plant Profile + Watering Foundation Campaign](campaigns/plant-profile-watering-foundation.md).

## Completed slice note

- Slice 1.1, real auth plus protected app shell, is implemented.
- Slice 2.1, first user-owned plant collection and manual plant CRUD, is implemented.
- Manual QA passed with no issues found.
- Verified behavior includes auth entry, protected `/app`, signed-in access, session persistence across refresh and navigation, sign-out, blocked post-sign-out access to `/app`, and a non-placeholder signed-in shell.

## Current state

- The initial Next.js + TypeScript + Tailwind scaffold is present.
- The public landing page at `/` exists.
- `/login` renders a real Supabase email auth entry page with sign-in and sign-up modes.
- `/app` has middleware and server-side protection plus a minimal signed-in shell.
- Supabase environment handling plus browser and server session helpers exist.
- Middleware-based Supabase session refresh is part of the auth path.
- The app now includes a persisted `plants` table with user ownership, RLS, manual create/edit flows, a protected collection view, and soft archive behavior.
- There is no image upload yet.
- There is no AI identification yet.
- There is no watering workflow yet.
- There is no reminder system yet.
- There is no calendar sync yet.

## Goal

Refine the plant experience with a dedicated plant detail/profile view now that the first user-owned collection and manual CRUD foundation exists.

## Why This Slice Is Next

- Slice 2.1 proved the first product data model and protected ownership path without mixing in watering workflow, reminders, or AI.
- The next improvement can make each plant record feel more complete and easier to review without widening scope into due dates or care events.
- A dedicated detail/profile view can cleanly build on the existing list and edit routes.

## Non-goals

- Do not add image upload or photo storage yet.
- Do not implement AI identification.
- Do not add watering tasks, last watered state, or next watering calculations.
- Do not add reminders, dashboard due logic, or calendar sync.
- Do not expand the next slice into health diagnosis or generalized task behavior.

## Acceptance criteria

- A signed-in user can open a dedicated plant detail/profile view from the collection.
- The detail/profile view presents the current basic plant fields clearly on mobile.
- The detail/profile view works cleanly with the existing manual CRUD and soft archive behavior.
- The slice still avoids photos, AI, watering workflow, reminders, and calendar sync.

## Verification steps

1. Run available repo checks such as `npm run lint`.
2. Open a plant from the signed-in collection into its dedicated profile/detail experience.
3. Confirm plant details render clearly on mobile-sized layouts.
4. Confirm edit and archive paths still behave correctly from that plant-level experience.
5. Confirm a different signed-in user still cannot access another user’s plant record.

## Recommended next slice after this one

- Build Slice 3.1: watering state and mark-watered action.
- Keep photo upload, AI identification, reminders, dashboard grouping, and calendar sync out of Slice 3.1.

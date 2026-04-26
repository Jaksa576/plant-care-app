# Current Task

## Active slice

Slice 2.1: first user-owned plant collection and manual plant CRUD.

## Completed slice note

- Slice 1.1, real auth plus protected app shell, is implemented.
- Manual QA passed with no issues found.
- Verified behavior includes auth entry, protected `/app`, signed-in access, session persistence across refresh and navigation, sign-out, blocked post-sign-out access to `/app`, and a non-placeholder signed-in shell.

## Current state

- The initial Next.js + TypeScript + Tailwind scaffold is present.
- The public landing page at `/` exists.
- `/login` renders a real Supabase email auth entry page with sign-in and sign-up modes.
- `/app` has middleware and server-side protection plus a minimal signed-in shell.
- Supabase environment handling plus browser and server session helpers exist.
- Middleware-based Supabase session refresh is part of the auth path.
- There is no plant CRUD yet.
- There is no image upload yet.
- There is no AI identification yet.
- There is no watering workflow yet.
- There is no reminder system yet.
- There is no calendar sync yet.

## Goal

Introduce the first user-owned plant collection so a signed-in user can manually create and manage basic plant records without relying on photos, AI, or watering logic.

## Why This Slice Is Next

- The product is personal, so the first plant records should be scoped to the signed-in user from the start.
- Manual plant records prove the core data model before adding photo upload, AI identification, or watering behavior.
- This keeps the next slice small, additive, and migration-safe while making forward progress on the watering-first product.

## Non-goals

- Do not add image upload.
- Do not implement AI identification.
- Do not add watering tasks, last watered state, or next watering calculations.
- Do not add reminders, dashboard logic, or calendar sync.
- Do not expand this slice into broader onboarding or plant health features.

## Acceptance criteria

- A signed-in user can create a plant record manually.
- A signed-in user can view their existing plant records.
- A signed-in user can edit their plant record fields.
- If delete or archive is included, it works only for that user's own plants.
- Plant data is scoped to the authenticated user and is not exposed across accounts.
- The manual plant record fields stay limited to basic profile data:
  - nickname
  - common name
  - optional scientific name
  - room/location
  - notes
  - editable watering guidance or interval
- The signed-in shell remains usable even when the plant collection is empty.

## Verification steps

1. Run available repo checks such as `npm run lint`.
2. Create a plant while signed in and confirm it appears in the signed-in user's collection.
3. Refresh and navigate within the signed-in app and confirm the plant record persists.
4. Edit the plant and confirm updated fields render correctly.
5. If delete or archive is included, confirm the record is removed or hidden as intended.
6. Confirm a different signed-in user cannot access or modify another user's plant records.
7. Confirm the empty state is clear when a signed-in user has no plants.

## Recommended next slice after this one

- Add the first plant detail/profile view refinement if still needed after CRUD.
- Keep photo upload, AI identification, watering workflow, reminders, dashboard logic, and calendar sync out of this slice.

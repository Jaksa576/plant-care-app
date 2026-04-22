# Current Task

## Active slice

Slice 1: real auth, protected app access, and signed-in shell/onboarding state.

## Current state

- The initial Next.js + TypeScript + Tailwind scaffold is present.
- The public landing page at `/` exists and is usable as a placeholder.
- `/login` exists, but it is still a placeholder route.
- `/app` exists, but it is still a placeholder route and is not protected.
- Supabase environment handling plus browser/server session helpers exist.
- There is no verified production auth flow yet.
- There is no plant CRUD yet.
- There is no image upload yet.
- There is no AI identification yet.
- There is no watering workflow yet.
- There is no reminder system yet.
- There is no calendar sync yet.

## Goal

Implement the first real authenticated slice:

- add a working Supabase Auth entry flow
- protect app access for signed-in users
- replace the current app placeholder framing with a minimal signed-in shell or first-run onboarding state

## Why This Slice Is Next

- The product is personal, so plant data should belong to a real signed-in user before plant records are introduced.
- Auth and protected access unlock every later MVP slice without forcing plant, upload, or reminder decisions too early.
- Keeping this slice focused reduces risk and avoids mixing account concerns with the plant domain.

## Non-goals

- Do not add plant CRUD.
- Do not build image upload pipelines.
- Do not implement AI identification.
- Do not add watering tasks or reminder logic.
- Do not add calendar sync.
- Do not expand onboarding into plant setup beyond what is required to enter the signed-in shell cleanly.

## Acceptance criteria

- A working sign-in path exists using Supabase Auth.
- Anonymous users cannot use `/app` directly.
- Signed-in users can reach `/app`.
- The signed-in shell clearly differs from the current placeholder-only state.
- Logged-out and logged-in states are easy to understand.
- The onboarding state, if needed, stays minimal and only helps the user reach the signed-in app shell.

## Verification steps

1. Run `npm run lint`.
2. Run the app locally with `npm run dev`.
3. Verify that an anonymous visitor who opens `/app` is redirected or blocked appropriately.
4. Verify that sign-in succeeds and the session persists across navigation.
5. Verify that a signed-in user can reach the app shell.
6. Verify that signing out returns the user to the correct logged-out state.

# Agent Handoff

## Current status summary

- `implemented`: Next.js + TypeScript + Tailwind scaffold
- `implemented`: public landing page at `/`
- `implemented`: placeholder routes for `/login` and `/app`
- `implemented`: Supabase environment handling and browser/server session helpers
- `implemented`: initial project docs
- `placeholder only`: login page UX
- `placeholder only`: app area shell and signed-in experience framing
- `still open`: real auth flow, protected routes, persisted data model, image upload, AI identification, watering workflows, reminders, and calendar sync

## Confirmed product boundaries

- The app is a personal plant care web app for houseplants.
- The MVP is watering-first: identify the plant, know when it needs water, and track whether watering happened.
- AI is assistive only and should not be presented as authoritative.
- Care guidance should remain editable by the user.
- Plant health diagnosis is not a core v1 feature and should not be overclaimed.
- Calendar sync is not part of the immediate next slice.

## Known assumptions and risks

- A Supabase project and credentials may not be fully provisioned yet outside local placeholders.
- Auth middleware and cookie refresh behavior still need implementation choices during the auth slice.
- Onboarding should stay intentionally light so it does not spill into plant setup or profile design.
- The current repo should still be treated as an early scaffold, not as a partially built product workflow.

## Recommended next slice

Implement real auth only:

- add a working Supabase Auth sign-in flow
- protect `/app`
- introduce a real signed-in shell
- keep onboarding minimal and tied to entering the signed-in experience

## Follow-up after that slice

- add the first user-owned plant collection model
- add plant creation with photo, nickname, and room/location
- add the first plant profile with watering fields
- add watering completion tracking and basic dashboard visibility

## Verification note

- `npm run lint` passes in the current repo state.
- The next coding agent should rerun lint after changes and manually verify the auth flow locally, including anonymous access protection, sign-in, session persistence, and sign-out behavior.

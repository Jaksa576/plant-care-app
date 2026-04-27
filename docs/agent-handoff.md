# Agent Handoff

## Current status summary

- `implemented`: Next.js + TypeScript + Tailwind scaffold
- `implemented`: public landing page at `/`
- `implemented`: Supabase Auth entry at `/login`
- `implemented`: protected `/app` access for signed-in users
- `implemented`: signed-in app shell with user-owned plant collection, empty state, and manual add/edit flows
- `implemented`: sign-out flow
- `implemented`: Supabase environment handling and browser/server session helpers
- `implemented`: Supabase middleware session refresh for auth-sensitive routes
- `implemented`: persisted `plants` table with RLS ownership policies and soft archive support
- `verified`: manual QA passed for auth entry, `/app` protection, signed-in access, refresh persistence, navigation persistence, sign-out, blocked `/app` access after sign-out, and plant CRUD happy paths
- `not yet implemented`: photo upload, AI identification, watering workflows, dashboard logic, reminders, and calendar sync

## Confirmed product boundaries

- The app is a personal plant care web app for houseplants.
- The MVP is watering-first: identify the plant, know when it needs water, and track whether watering happened.
- AI is assistive only and should not be presented as authoritative.
- Care guidance should remain editable by the user.
- Plant health diagnosis is not a core v1 feature and should not be overclaimed.
- Google Calendar comes later, after the in-app reminder model is established.

## Recommended next slice

Build Slice 2.2 around a dedicated plant detail/profile experience:

- add a cleaner single-plant profile/detail view on top of the new collection model
- keep plant editing coherent between list and detail experiences
- avoid widening into watering workflow, reminders, or AI setup

Keep this slice out of scope for:

- photo upload
- AI identification
- watering workflow
- dashboard logic
- reminders
- calendar sync

## Pre-execution setup

Before starting any slice:

1. Create a dedicated branch.
2. Create a dedicated git worktree for that branch.
3. Copy `.env.local` from the root repo into the worktree.
4. Run `npm install` in the worktree.

## Execution loop

Codex must:

1. Implement only the scoped slice.
2. Run validation:
   - `npm run typecheck`
   - `npm test` if present
   - `npm run build`
3. If all validation passes, commit and push the branch.
4. Stop and report.

If validation fails, stop and report the errors without continuing.

## Constraints

- Do not modify unrelated files.
- Do not expand scope.
- Do not skip validation.
- Do not merge branches.

## Known assumptions and risks for the next slice

- Product data is now scoped to the authenticated user via both app queries and database RLS, so future slices should preserve that pattern.
- The current edit experience is route-based rather than a dedicated detail/profile page, which is the main UX gap for the next slice.
- Soft archive hides plants from the default collection view but does not yet include restore UX.
- Care guidance remains user-editable rather than hardcoded as plant truth.

## Verification note

- Auth QA has been completed manually with no issues found.
- Plant CRUD verification should include create, list, edit, persistence, archive hiding, protected route access, and guided missing-env handling.
- Cross-user RLS enforcement should be re-checked in a Supabase-backed environment whenever schema or route behavior changes.
- The next active slice is Slice 2.2 plant detail/profile view refinement.

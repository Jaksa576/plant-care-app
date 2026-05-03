# Legacy Agent Handoff

This file is archived for historical context only. It is not part of the active repo-doc hot path.

Current source-of-truth docs are:

- `AGENTS.md`
- `docs/product.md`
- `docs/architecture.md`
- `docs/roadmap.md`
- `docs/current-task.md`
- active `docs/campaigns/*.md`

## Archived Context

At the time this handoff was retired:

- Next.js + TypeScript + Tailwind scaffold was implemented.
- Public landing page at `/` was implemented.
- Supabase Auth entry at `/login` was implemented.
- Protected `/app` access for signed-in users was implemented.
- Signed-in app shell, sign-out, Supabase environment handling, browser/server helpers, and middleware session refresh were implemented.
- User-owned plant collection and manual add/edit flows were implemented.
- Persisted `plants` table existed with RLS ownership policies and soft archive support.
- Manual QA had passed for auth entry, `/app` protection, signed-in access, refresh persistence, navigation persistence, sign-out, blocked `/app` access after sign-out, and plant CRUD happy paths.
- Photo upload, AI identification, watering workflows, dashboard logic, reminders, and calendar sync were not implemented.

The recommended next slice was Slice 2.2: plant detail/profile view refinement, part of the Plant Profile + Watering Foundation Campaign.

Important legacy guidance preserved in active docs:

- The app remains watering-first.
- AI is assistive only and not authoritative.
- Care guidance remains editable by the user.
- Plant health diagnosis is outside v1 core scope.
- Google Calendar comes after a stable in-app reminder model.
- Product data should remain scoped to the authenticated user through app queries and RLS.
- Soft archive hides plants from the default collection but restore UX is not implemented.

# Architecture

This document describes implemented technical shape and architectural boundaries. Product direction lives in [Product](product.md).

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth
- Supabase Postgres
- Supabase Storage
- Vercel

## Implemented App Shape

- `/` is a public landing page.
- `/login` provides Supabase email sign-in and sign-up.
- `/app` is the protected signed-in app area.
- The signed-in shell includes sign-out and the current plant collection experience.
- Manual plant create, edit, list, and archive flows are implemented.
- There is not yet a dedicated plant detail/profile view.
- There is no image upload, AI identification, watering workflow, reminder system, or calendar sync yet.

## Auth And Session Pattern

- Client components use the browser Supabase helper for sign-in, sign-up, and sign-out.
- Middleware refreshes Supabase auth cookies for auth-sensitive routes before route decisions.
- Server components use the server Supabase helper plus `supabase.auth.getUser()` before rendering user-specific UI.
- Protected routes should keep middleware redirects plus server-side user checks.
- Missing client environment values should degrade to a guided setup state instead of a blank page or crash.

## Ownership And RLS Rules

- User-owned data must derive `user_id` from the authenticated Supabase user on the server.
- Client input must not be trusted for ownership.
- RLS must stay enabled on user-owned tables.
- App queries and database policies should agree on ownership boundaries.
- Cross-user access checks are required whenever routes, queries, mutations, or schema touch user-owned data.

## Data Model Direction

### Users

- Account identity comes from Supabase Auth.
- Product data is scoped to the signed-in user.

### Plants

The implemented `plants` model stores:

- `id`
- `user_id`
- `nickname`
- `common_name`
- optional `scientific_name`
- optional `location`
- optional `notes`
- optional `watering_interval_days`
- optional `watering_guidance`
- optional `archived_at`
- `created_at`
- `updated_at`

Application validation plus a database check require at least one user-friendly label through `nickname` or `common_name`.

Watering interval and watering guidance are user-entered guidance only. They do not yet drive next-watering calculations and must not be treated as botanical truth.

Archived plants are soft-hidden from the default collection by filtering `archived_at is null`. Restore UX is not implemented.

### Care Events

Care events are future work. The first event type should be watering. The model should be able to expand later without forcing non-watering event types into v1.

### Reminders

Reminder records or equivalent derived schedule state are future work. Reminder behavior should support watering before expanding into advanced scheduling.

### Calendar Linkage

Calendar linkage is future work. When introduced, it should map app-owned reminders to provider-specific event IDs without making calendar sync a prerequisite for reminders. Google Calendar comes before Outlook.

### Photos And AI

Plant photos are future Supabase Storage work. AI-assisted identification should use photos to reduce setup friction while preserving user review, uncertainty, edit, reject, and manual override paths.

## Integration Boundaries

- Calendar sync follows the in-app reminder model; it does not define the core data model.
- AI suggestions are assistive and editable.
- Health diagnosis is a later phase and should not influence v1 data shape unless explicitly scoped.
- Avoid premature generalization into an encyclopedia, generic task engine, or automation platform.

## Implementation Guidance

- Prefer additive, migration-safe schema changes.
- Keep slices small and reviewable.
- Keep auth/session concerns separate from plant-domain changes where practical.
- Preserve route protection and RLS together.
- Keep mobile-first watering workflows fast and clear as product complexity grows.

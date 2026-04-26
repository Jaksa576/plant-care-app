# Architecture

## Stack

- Next.js
- TypeScript
- Tailwind CSS
- Supabase Auth
- Supabase Postgres
- Supabase Storage
- Vercel

## Product boundaries

- This is a personal plant care web app for keeping houseplants alive with as little friction as possible.
- The MVP is watering-first: identify the plant, store basic care info, remind the user when care is due, and let the user track completed care.
- AI is assistive only. It can help identify plants or surface likely health issues later, but it should not be framed as authoritative.
- Care guidance stays editable by the user so the app can support overrides and real-world adjustments.
- Plant health diagnosis is not a core v1 responsibility.
- Google Calendar is the first calendar target later on. Outlook support comes after that.
- Calendar sync should follow a stable in-app reminder model, not lead it.

## Current implementation state

- The repo currently contains a Next.js App Router scaffold with TypeScript and Tailwind.
- `/` is a public landing page.
- Supabase Auth is implemented through the real email-based `/login` entry route.
- `/app` protection is implemented and only intended for signed-in users.
- A minimal signed-in shell is implemented, including sign-out and an empty-state experience.
- Supabase environment handling exists.
- Browser and server Supabase helpers exist.
- Middleware-based session refresh exists for auth-sensitive routes.
- The first persisted product data model now exists for user-owned plant records.
- Manual QA has verified auth entry, route protection, session persistence, sign-out behavior, and the basic plant CRUD path.

## Auth and session pattern

- Client components use the browser Supabase helper for sign-in, sign-up, and sign-out actions.
- Middleware refreshes Supabase auth cookies on `/app` and `/login` before route decisions are made.
- Server components use the server Supabase helper plus `supabase.auth.getUser()` to gate protected rendering.
- Protected routes should keep both layers:
  - middleware for redirects and cookie refresh
  - server-side checks as a second guard before rendering user-specific UI
- Missing client env should degrade to a guided auth/setup state, not a blank page or crash.

## High-level data model direction

### Users

- Account identity comes from Supabase Auth.
- Product data should be scoped to the signed-in user from the start.

### Plants

- Each plant belongs to one user.
- The first implemented `plants` model stores:
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
- The model requires at least one user-friendly label through application validation plus a database check on `nickname` or `common_name`.
- Watering interval and watering guidance are user-entered guidance only in this slice. They are not treated as botanical truth and they do not drive next-watering calculations yet.
- Archived plants are soft-hidden from the default collection view by filtering `archived_at is null`.
- Plant identification, confidence information, and user override remain future concerns and should still avoid locking users into an AI guess.

### Care events

- Care events should record actions taken for a plant over time.
- The earliest event type is expected to be watering.
- The model should stay flexible enough to expand later to issue detected, treatment applied, and repotted without forcing that complexity into v1.

### Reminders and schedule state

- The app will need either reminder records or equivalent derived schedule state for next watering date and scheduling basis.
- Reminder behavior should support the core watering loop first before expanding into more advanced scheduling options.

### Calendar linkage

- Calendar linkage is future work.
- When introduced, it should map in-app reminders to provider-specific event identifiers without making calendar sync a prerequisite for reminders.
- Google Calendar should be supported before Outlook.

## Implementation guidance

- Prefer additive, migration-safe schema changes.
- Keep auth concerns separate from plant-domain slices where possible.
- Enforce plant ownership on the server by deriving `user_id` from the authenticated Supabase user rather than trusting client input.
- Keep row-level security enabled on user-owned tables so database access matches route-level protection.
- Avoid premature generalization into a plant encyclopedia, a generic task engine, or a diagnosis-heavy product.
- Choose small, understandable slices that a junior or intermediate developer can follow.
- Preserve user control over plant identity and care guidance when AI-assisted features are added later.

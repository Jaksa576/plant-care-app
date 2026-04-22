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
- `/login` is a placeholder login route.
- `/app` is a placeholder app route and is not protected yet.
- Supabase environment handling exists.
- Browser and server Supabase helpers exist.
- Server-side session lookup groundwork exists.
- No persisted product data model has been implemented yet.
- No completed auth flow, plant workflow, upload flow, reminder system, or calendar sync exists yet.

## High-level data model direction

### Users

- Account identity comes from Supabase Auth.
- Product data should be scoped to the signed-in user from the start.

### Plants

- Each plant belongs to one user.
- Expected early fields include nickname, identified/common/species name, photo reference, room or location, notes, and basic watering guidance.
- Plant identification should support confidence information and user override rather than locking the user into an AI guess.

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
- Avoid premature generalization into a plant encyclopedia, a generic task engine, or a diagnosis-heavy product.
- Choose small, understandable slices that a junior or intermediate developer can follow.
- Preserve user control over plant identity and care guidance when AI-assisted features are added later.

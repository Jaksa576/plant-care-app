# Plant Care App Roadmap

This roadmap is intentionally short and practical. The goal is to ship a dependable v1 in small slices rather than design a large system upfront.

## Slice 0: Foundation

- Create the Next.js + TypeScript + Tailwind + Supabase-ready repository setup.
- Add a public landing page and a placeholder future app area.
- Establish docs that keep future work grounded and easy to hand off.

## Slice 1: Authentication and onboarding

- Implement Supabase Auth with a simple email-based sign-in flow.
- Protect the future app area and add the first signed-in app shell state.
- Create a minimal onboarding step for the owner of the app.

## Slice 2: Plant collection

- Add the first persisted plant model and CRUD flow.
- Keep the initial schema small and easy to reason about.
- Prioritize one clean happy path over many optional fields.

## Slice 3: Care logs

- Add watering and care-event logging.
- Show recent activity in the app area.
- Keep reminder logic manual or lightweight at first.

## Slice 4: Reminders and routines

- Add simple reminder configuration for recurring care.
- Prefer clear defaults and understandable scheduling over a complex rules engine.

## Deferred until after v1 foundation is stable

- AI plant identification
- Calendar sync
- Broad automation workflows
- Heavy analytics or multi-user collaboration

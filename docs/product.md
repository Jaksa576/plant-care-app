# Product

## Vision

Plant Care App helps people keep houseplants alive with a calm, low-friction watering workflow. The product should feel personal, practical, visual, and mobile-first.

## Core Loop

1. Add a plant.
2. Identify it from a photo when helpful.
3. Store editable care basics.
4. Track watering.
5. Show a clear care dashboard.
6. Sync reminders later, after the in-app reminder model is stable.

## V1 Goal

Help a signed-in user build a personal plant collection, understand when each plant needs water, record watering, and see what needs attention today.

## V1 Must-Haves

- User account and protected app shell.
- User-owned plant collection with manual add, edit, and archive flows.
- Plant profile with nickname, common name, optional scientific name, room/location, notes, editable watering guidance, and watering state.
- Low-friction mark-watered action.
- Dashboard sections for overdue, due today, upcoming, and recently watered plants.
- Basic watering history.
- Plant photo support.
- AI-assisted identification with user review, uncertainty, edit, reject, and manual override paths.
- Internal reminder model before external calendar sync.
- Google Calendar sync after in-app reminders are stable.

## Non-Goals

- Generic plant encyclopedia.
- Generic household task manager.
- Authoritative pest, disease, or health diagnosis.
- AI-controlled care truth that users cannot edit.
- Calendar-sync-first architecture.
- Google and Outlook sync in the same v1 integration slice.
- Gamification, streaks, or motivational scoring in v1.

## AI And Care Guardrails

- AI is assistive only.
- AI identification should never be treated as authoritative.
- Suggested plant names, care basics, or future issue guidance must be reviewable and editable.
- Manual setup must remain useful without AI.
- Care guidance should reflect user preferences and real-world adjustments, not hardcoded plant truth.
- Health support is a later phase and must not overclaim certainty.

## Success Criteria

- A signed-in user can create and manage only their own plants.
- The primary watering loop is fast on mobile.
- Dashboard urgency is clear without extra configuration.
- Users can recover from empty, loading, and error states without confusion.
- Route protection and RLS preserve user-owned data boundaries.
- Photos and AI reduce setup friction without blocking or overriding manual control.
- Calendar sync follows the app-owned reminder model instead of defining it.

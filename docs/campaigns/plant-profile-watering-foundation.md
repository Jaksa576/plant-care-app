# Plant Profile + Watering Foundation Campaign

## Current Status

This is the active campaign. Slice 2.1 is implemented, and Slice 2.2 is the active slice. Stable product guardrails live in [Product](../product.md), and the current active-slice packet lives in [Current Task](../current-task.md).

## Campaign Goal

Make the app feel like a real plant care product by turning manual plant records into usable plant profiles and then adding the core watering loop.

## Why This Campaign Is Next

- Slice 2.1 proved authenticated user-owned plant records.
- Slice 2.2 gives each plant a durable profile surface.
- Watering workflow is the core product value.
- Dashboard and care history should follow once watering state exists.
- Photos and AI should wait until the manual plant/watering loop is useful without AI.

## Campaign Scope

This campaign groups several PR-sized slices under one product objective while preserving one implementation slice per PR. Each slice should still use its own branch, worktree, validation pass, review, and merge.

## Included Slices

### Slice 2.2: Plant Detail/Profile View Refinement

**Goal:** Give each plant a clear, durable profile surface now that manual CRUD exists.

**Scope:** Dedicated plant detail/profile route, mobile-friendly display of existing plant fields, coherent edit/archive paths, and clear empty/missing-field presentation.

**Non-goals:** Photo upload, AI identification, watering state, next watering calculations, reminders, dashboard due logic, and calendar sync.

**Acceptance criteria:** A signed-in user can open a plant profile from the collection; existing fields render clearly on mobile; edit and archive behavior still work; another user cannot access the plant.

**Validation expectations:** Run `npm run typecheck`, `npm test` if present, and `npm run build`; manually verify profile navigation, mobile layout, edit/archive paths, and ownership protections in a Supabase-backed environment.

**Completion criteria:** Dedicated plant detail/profile view is merged, current docs move the active slice to Slice 3.1, and no photos, AI, watering, reminders, or calendar sync are introduced as part of Slice 2.2.

**Risks:** The existing edit route could become confusing if profile and edit flows are not clearly connected; ownership checks must stay server-derived and RLS-backed.

**Likely files or areas to change:** App Router routes under the signed-in app area, plant query/actions utilities, plant collection links, shared plant display components, and related docs.

### Slice 3.1: Watering State And Mark-Watered Action

**Goal:** Add the first real watering loop so users can record care.

**Scope:** Last watered state, next watering state or equivalent derived value, mark-watered action, recalculation after watering, and graceful support for watering early.

**Non-goals:** Dashboard grouping, full history timeline, reminders, Google Calendar sync, Outlook sync, AI care recommendations, and generalized task behavior.

**Acceptance criteria:** A signed-in user can mark a plant as watered; last watered and next watering state update predictably; watering behavior remains scoped to the signed-in user's plants.

**Validation expectations:** Run `npm run typecheck`, `npm test` if present, and `npm run build`; manually test date updates, early watering, persistence, RLS/ownership behavior, and empty/missing watering guidance cases.

**Risks:** Date semantics can become inconsistent if stored state and derived state are not clearly defined; avoid introducing a broad task system when only watering is needed.

**Likely files or areas to change:** Plant schema or related migration, watering actions, plant profile display, server-side ownership checks, and focused tests if the repo has a test pattern.

### Slice 3.2: Watering Dashboard Basics

**Goal:** Turn watering state into a clear daily dashboard.

**Scope:** Dashboard sections for overdue, due today, upcoming, and recently watered plants; mobile-first scanning; clear empty/loading/error states; low-friction access to mark-watered behavior.

**Non-goals:** Reminder notifications, calendar sync, AI-generated schedules, room filters unless explicitly scoped, and non-watering tasks.

**Acceptance criteria:** The dashboard separates overdue, due today, upcoming, and recently watered plants; completing watering moves plants into the correct state; users only see their own plants.

**Validation expectations:** Run `npm run typecheck`, `npm test` if present, and `npm run build`; manually verify date boundaries, empty dashboard states, mobile layout, and completion behavior.

**Risks:** Dashboard clarity can degrade if too many secondary fields are added; date boundary handling should be predictable around today versus overdue.

**Likely files or areas to change:** Signed-in app dashboard route, plant/watering queries, dashboard section components, empty/loading/error states, and docs.

### Slice 3.3: Watering Care History Timeline

**Goal:** Let users review basic watering history and create a foundation for future care events.

**Scope:** Watering event history, plant-level timeline display, simple event ordering, and future-compatible naming that does not force non-watering care into v1.

**Non-goals:** Treatment history, repotting history, health diagnosis records, analytics, streaks, generalized activity feed, reminders, and calendar sync.

**Acceptance criteria:** A signed-in user can review recent watering events for a plant; history is tied to user-owned plants; the timeline has a useful empty state; future event expansion remains possible without overbuilding now.

**Validation expectations:** Run `npm run typecheck`, `npm test` if present, and `npm run build`; manually verify history creation, ordering, empty state, ownership, and profile integration.

**Risks:** Care history can accidentally become a broad activity system; keep the first timeline focused on watering events only.

**Likely files or areas to change:** Watering event schema or migration, plant profile history section, server queries/actions, ownership checks, and docs.

## Campaign-Level Non-Goals

- No photo upload.
- No AI identification.
- No AI care recommendations.
- No reminder notifications.
- No Google Calendar sync.
- No Outlook sync.
- No health diagnosis.
- No generalized task system.
- No broad encyclopedia content.

## Campaign Exit Criteria

The campaign is complete when:

- users can open a clear plant profile
- users can record watering
- the app can show last watered and next watering state
- dashboard separates due today, overdue, upcoming, and recently watered plants
- users can review basic watering history
- all behavior remains scoped to the signed-in user
- RLS and route protection remain intact
- photos, AI, reminders, and calendar sync remain deferred to later phases

## Follow-On Campaign Preview

Recommended next campaign: **Photo + Identification Setup Campaign**.

Likely slices:

- plant photo upload
- image display across collection/detail
- AI-assisted identification
- confidence-aware review and manual override

Do not create this follow-on campaign doc until it is explicitly requested.

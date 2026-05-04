# Roadmap

This document tracks product sequencing and slice status. Stable product direction lives in [Product](product.md).

## Status Legend

- **implemented**: present in the repo and intended to work now.
- **active**: the current implementation slice or immediate planning target.
- **planned**: agreed and sequenced, but not built yet.
- **deferred**: intentionally postponed until a later phase.
- **out of scope for v1**: not part of the first usable version.

## Current Implementation State

### Implemented

- Next.js + TypeScript + Tailwind scaffold.
- Public landing page at `/`.
- Supabase email auth at `/login`.
- Protected `/app` route and signed-in shell.
- Sign-out flow.
- Supabase environment handling.
- Browser and server Supabase helpers.
- Middleware-based Supabase session refresh.
- User-owned plant collection with manual add, edit, and archive flows.
- Persisted `plants` table with RLS ownership policies and soft archive support.
- Dedicated protected plant detail/profile view for user-owned plant records.
- Plant-level watering state and mark-watered behavior backed by durable watering events.
- Watering dashboard basics with overdue, due today, upcoming, and recently watered sections.

### Active

- Slice 3.3: watering care history timeline.

### Planned

- Plant photo upload.
- AI-assisted plant identification.
- Internal reminder model.
- Google Calendar sync.
- Reminder flexibility.

### Deferred

- Outlook Calendar sync.
- Plant health support and issue suggestions.
- Richer plant knowledge beyond watering-first v1.
- Adaptive watering adjustments and seasonal automation.

### Not Yet Implemented

- Image upload.
- AI identification.
- Watering workflow.
- Reminder system.
- Calendar sync.

## Campaigns

Current active campaign:

- [Plant Profile + Watering Foundation Campaign](campaigns/plant-profile-watering-foundation.md)

## Phase 0: Foundation

**Status:** implemented.

**Goal:** Establish the initial repo, docs, Next.js app shell, TypeScript, Tailwind, placeholder pages, and Supabase-ready helper structure.

**Slice:** Slice 0.1: App Scaffold And Docs.

**Non-goals:** Real auth, persistent product data, watering workflow, photos, AI, reminders, and calendar sync.

## Phase 1: Auth And Signed-In Shell

**Status:** implemented.

**Goal:** Make the app usable as a real signed-in product shell.

**Slice:** Slice 1.1: Real Auth + Protected App Shell.

**Scope completed:** Supabase email sign-up/sign-in, sign-out, protected `/app`, signed-out redirects, middleware session refresh, and minimal signed-in shell.

**Non-goals:** Plant CRUD, image upload, AI identification, watering workflow, reminders, and calendar sync.

## Phase 2: Core Plant Records And Plant Profiles

**Status:** implemented.

**Goal:** Let a signed-in user create, manage, and review plant records without AI dependency.

**Why it matters:** User-owned plant records must be trustworthy before watering state, photos, AI, or reminders attach to them.

### Slice 2.1: Manual Plant CRUD

**Status:** implemented.

**Scope completed:** Manual create/edit/archive flows, protected collection view, empty collection state, persisted `plants` table, RLS ownership policies, and soft archive support.

**Non-goals:** Photos, AI identification, watering events, next watering calculations, reminders, dashboard due logic, and calendar sync.

### Slice 2.2: Plant Detail/Profile View

**Status:** implemented.

**Scope completed:** Dedicated protected plant detail/profile page, collection-to-profile navigation, clear display of existing plant fields, coherent edit/archive paths, missing-field presentation, and mobile-friendly presentation.

**Non-goals:** Photo upload, AI identification, watering tasks, last watered state, next watering calculations, reminders, dashboard due logic, and calendar sync.

**Acceptance criteria:** A signed-in user can open a dedicated plant detail/profile view from the collection; the view presents existing plant fields clearly on mobile; edit and archive behavior remains coherent; user ownership remains protected.

## Phase 3: Watering Workflow And Dashboard

**Status:** active.

**Goal:** Make the app genuinely useful for keeping plants alive.

### Slice 3.1: Watering State And Actions

**Status:** implemented.

**Scope completed:** Durable watering events, plant-profile watering state, last-watered display, derived next-watering display, mark-watered action, early watering support, and missing interval handling.

**Non-goals:** Dashboard grouping, full care history timeline, reminders, calendar sync, AI recommendations, and non-watering task types.

### Slice 3.2: Watering Dashboard Basics

**Status:** implemented.

**Scope completed:** Dashboard sections for overdue, due today, upcoming, and recently watered plants; empty states; mobile-first cards; profile links; and mark-watered access for actionable sections.

**Non-goals:** Calendar sync, notification delivery, AI-generated scheduling, and generalized task management.

### Slice 3.3: Watering Care History Timeline

**Status:** active.

**Scope:** Watering event history, plant-level history display, simple timeline model, and future-compatible naming without overbuilding non-watering care.

**Non-goals:** Treatment history, repotting history, diagnosis records, analytics, streaks, and broad activity feeds.

## Phase 4: Photo Support And AI-Assisted Identification

**Status:** planned.

**Goal:** Make plant setup more visual and convenient after the manual plant/watering loop is useful.

### Slice 4.1: Plant Photo Upload

**Status:** planned.

**Scope:** Upload or capture plant image, store image in Supabase Storage, display image in collection and detail views, and preserve ownership/security expectations.

### Slice 4.2: AI-Assisted Plant Identification

**Status:** planned.

**Scope:** Submit a plant photo for identification, show likely names plus confidence or uncertainty, store accepted suggestions, and allow manual override/edit.

**Guardrail:** AI supports setup but does not become authoritative plant truth.

## Phase 5: Reminders And Google Calendar Sync

**Status:** planned.

**Goal:** Help users remember watering outside the app without letting calendar sync define the core model.

### Slice 5.1: Internal Reminder Model

**Status:** planned.

**Scope:** App-owned reminder state tied to watering and groundwork for external provider sync.

### Slice 5.2: Google Calendar Sync

**Status:** planned.

**Scope:** Connect Google account, create/update watering reminder events, store provider linkage, and keep sync app-owned for v1.

### Slice 5.3: Reminder Flexibility

**Status:** planned.

**Scope:** Fixed schedule reminders, last-watered based reminders, snooze, and watered-early support.

### Outlook Sync

**Status:** deferred.

Outlook support comes after Google Calendar and the in-app reminder model are stable.

## Later Phases

### Phase 6: Plant Health Support

**Status:** deferred.

Health support can help users respond to problems later, but it must not distort watering-first v1 or overclaim diagnosis certainty.

### Phase 7: Richer Plant Knowledge

**Status:** deferred.

Care knowledge may expand later, but it should support action, stay editable, and avoid encyclopedia drift.

### Phase 8: Smarter Automation

**Status:** deferred.

Automation can reduce friction after the app has reliable user behavior and care history. It should not hide important care decisions or let AI control schedules without review.

## Recommended Implementation Order

1. Slice 3.3: watering care history timeline.
2. Slice 4.1: plant photo upload.
3. Slice 4.2: AI-assisted plant identification.
4. Slice 5.1: internal reminder model.
5. Slice 5.2: Google Calendar sync.
6. Slice 5.3: reminder flexibility.
7. Later: health support, richer knowledge, smarter automation, and Outlook sync.

This order keeps the manual plant and watering loop useful before photos, AI, reminders, and calendar integrations.

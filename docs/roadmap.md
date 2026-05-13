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
- Protected `/app/plants` redesigned collection tab and `/app/settings` utility route stub.
- Sign-out flow.
- Supabase environment handling.
- Browser and server Supabase helpers.
- Middleware-based Supabase session refresh.
- User-owned plant collection with manual add, edit, and archive flows.
- Persisted `plants` table with RLS ownership policies and soft archive support.
- Dedicated protected plant detail/profile view for user-owned plant records.
- Plant-level watering state and mark-watered behavior backed by durable watering events.
- Watering dashboard basics with overdue, due today, upcoming, and recently watered sections.
- Plant-level watering history timeline.
- Primary plant photo upload with private Supabase Storage, profile display, dashboard thumbnails, replace/remove actions, and calm no-photo fallbacks.
- AI-assisted plant identification with Pl@ntNet, transient names-only suggestions, user review/edit/reject flow, and accepted updates to normal plant fields.
- App-owned watering reminders with watering-only reminder records, enabled/disabled state, date-first next reminder, profile panel, owner-scoped RLS, and mark-watered date updates when an interval exists.
- Google Calendar sync with server-side OAuth, encrypted refresh-token storage, primary-calendar event creation/update, app-owned reminder linkage, disconnect cleanup, and one-way app-to-calendar behavior.
- Reminder flexibility with after-watering mode, fixed schedule mode, snooze controls, reminder-aware dashboard urgency, plain-language next reminder previews, and calendar sync updates from app reminder changes.
- UI redesign shell foundation with warm design tokens, Nunito Sans font loading, local SVG icon primitives, persistent Add Plant access, and Home / Plants / Settings bottom app bar.
- UI redesign Home / Today surface with Needs water, By room, Recent care, icon-led Water, and secondary Snooze where app reminder state supports it.
- UI redesign Plants tab with full active collection browsing, room chapters, Unassigned grouping, Add Plant access, plant detail links, and reminder-aware watering status labels.
- UI redesign Plant Detail inspector with large photo/fallback, identity/status, Water now, Snooze, Reminder, care basics rows, care history, photo/identification, reminder, Google Calendar, edit, and archive access.
- UI redesign Add/Edit Plant form polish with grouped identity, room, watering guidance, notes, photo-after-save affordance, and softened review step.
- UI redesign supporting feature polish for reminders, Google Calendar sync, photo upload, identification helper, loading states, tap targets, and conservative AI/calendar copy.
- Skippable first-run onboarding shell with per-user completion state and a Settings revisit entry point.
- User-owned room data model with nullable plant room assignments and safe legacy location backfill.

### Active

- Onboarding, Rooms, Settings, and Photo-First Add Plant Foundation campaign.
- Slice 2: Room data model and migration is implemented on branch `campaign/onboarding-rooms-s2-room-model`; awaiting review/merge.

### Planned

- Slice 3: Room management in Settings.
- Slice 4: Room dropdown in Add/Edit Plant.
- Slice 5: Settings-managed Google Calendar integration.
- Slice 6: Photo-first Add Plant foundation.
- Slice 7: Pre-save Pl@ntNet identification.
- Slice 8: Onboarding room/photo integration polish.

### Deferred

- Outlook Calendar sync.
- Plant health support and issue suggestions.
- Richer plant knowledge beyond watering-first v1.
- Adaptive watering adjustments and seasonal automation.

## Campaigns

Active campaign:

- [Onboarding, Rooms, Settings, and Photo-First Add Plant](campaigns/onboarding-rooms-settings-photo-first-ai.md)

Completed campaigns:

- [UI Redesign UX Overhaul Campaign](campaigns/archived/ui-redesign-ux-overhaul.md)
- [Plant Profile + Watering Foundation Campaign](campaigns/archived/plant-profile-watering-foundation.md)
- [Photo Identification + Reminder Sync Campaign](campaigns/archived/photo-identification-reminder-sync.md)

Draft / candidate campaigns:

- AI Care Setup remains a later candidate and must not overlap this campaign's identity-only pre-save Pl@ntNet scope.

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

**Status:** implemented.

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

**Status:** implemented.

**Scope completed:** Plant-level watering history display from durable watering events, newest-first ordering, empty history state, and consistency with mark-watered/dashboard state.

**Non-goals:** Treatment history, repotting history, diagnosis records, analytics, streaks, and broad activity feeds.

## Phase 4: Photo Support And AI-Assisted Identification

**Status:** implemented.

**Goal:** Make plant setup more visual and convenient after the manual plant/watering loop is useful.

### Slice 4.1: Plant Photo Upload

**Status:** implemented.

**Scope completed:** Upload or capture plant image where supported by the browser/device, store one primary photo in private Supabase Storage, keep a durable plant photo reference, display photos on plant profile and dashboard cards, provide calm no-photo fallbacks, and support replace/remove actions with ownership checks.

### Slice 4.2: AI-Assisted Plant Identification

**Status:** implemented.

**Scope completed:** Submit an owned primary plant photo to Pl@ntNet from a deliberate profile action, show up to three uncertainty-labeled names-only suggestions, allow review/edit/reject/manual override, and save only accepted common/scientific names into normal editable plant fields.

**Guardrail:** AI supports setup but does not become authoritative plant truth.

## Phase 5: Reminders And Google Calendar Sync

**Status:** implemented.

**Goal:** Help users remember watering outside the app without letting calendar sync define the core model.

### Slice 5.1: Internal Reminder Model

**Status:** implemented.

**Scope completed:** App-owned watering reminder state tied to signed-in user and owned plant, watering-only type constraint, enabled/disabled state, date-first next reminder, plant profile panel, owner-scoped RLS policies, and mark-watered updates when an interval exists.

### Slice 5.2: Google Calendar Sync

**Status:** implemented.

**Scope completed:** Google Calendar connect/callback routes, server-only OAuth token exchange, encrypted refresh-token storage, primary calendar event create/update, reminder-to-event linkage, compact sync status panel, disconnect cleanup, and sync failure behavior that preserves app reminders.

### Slice 5.3: Reminder Flexibility

**Status:** implemented.

**Scope completed:** Plain-language after-watering and fixed schedule modes, snooze by 1 or 3 days, watered-early behavior that resets after-watering reminders but leaves fixed schedule reminders unchanged, dashboard grouping that uses enabled reminder dates before interval fallback, next reminder preview copy, and Google Calendar sync updates from app reminder changes.

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

1. Complete product-owner production-readiness review of the merged `main` experience.
2. Decide the next campaign before starting new feature implementation.
3. Later: health support, richer knowledge, smarter automation, and Outlook sync.

This order keeps future work grounded in the implemented watering-first loop instead of adding unapproved scope.

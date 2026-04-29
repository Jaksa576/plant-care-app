# Plant Care App Roadmap

## Status Legend

- **implemented**: present in the repo and intended to work now
- **active**: the current implementation slice or immediate planning target
- **planned**: agreed and sequenced, but not built yet
- **deferred**: intentionally postponed until a later phase
- **out of scope for v1**: not part of the first usable version

---

## Product Vision

The Plant Care App is a watering-first personal plant care system for helping users keep houseplants alive with as little friction as possible. It should feel visual, calm, mobile-friendly, and practical.

The durable core loop is:

1. Add a plant.
2. Identify it from a photo when helpful.
3. Store editable care basics.
4. Track watering.
5. Show a clear care dashboard.
6. Sync reminders after the in-app reminder model is stable.

AI is assistive only. AI suggestions can help with setup and later care support, but the user must be able to review, edit, override, or skip them. Practical care actions matter more than encyclopedic content, and the app should not claim certainty it does not have.

## Product Boundaries

Do not let the app drift into:

- a generic plant encyclopedia
- a generic household task manager
- an overclaimed plant diagnosis tool
- an overengineered automation system
- a calendar-sync product where external providers define the core model

---

## V1 Definition

### V1 Goal

Help the user identify each houseplant, understand when it needs water, and track whether watering happened.

### V1 Must-Haves

- User account and login.
- Personal plant collection tied to the signed-in user.
- Manual add, edit, and archive flows for plants.
- Plant profile with nickname, common name, optional scientific name, room/location, notes, editable watering guidance, last watered state, and next watering state.
- Watering workflow with a low-friction mark-watered action.
- Dashboard sections for overdue, due today, upcoming, and recently watered plants.
- Basic watering history.
- Plant photo support.
- AI-assisted plant identification with user review and manual override.
- Internal reminder model.
- Google Calendar sync after reminders exist in-app.

### V1 Nice-To-Haves

- AI identification confidence display.
- Room filters on the dashboard.
- Basic reminder snooze.
- Reminder flexibility for fixed schedule versus last-watered based scheduling.
- Lightweight empty, loading, and error refinements beyond the minimum.

### Deferred Features

- Outlook Calendar sync.
- Plant health support and issue suggestions.
- Richer plant knowledge such as light, humidity, toxicity, repotting, and fertilizing guidance.
- Adaptive watering adjustments.
- Seasonal automation.
- Broader care event types beyond watering.

### Explicitly Out Of Scope For V1

- Authoritative disease or pest diagnosis.
- Pest/disease certainty claims.
- Broad educational plant encyclopedia content.
- Gamification, streaks, or motivational scoring.
- A generalized task system.
- Google and Outlook sync in the same v1 integration slice.

### First Usable V1 Release Gates

- A signed-in user can create and manage their own plant collection.
- A signed-in user can open a clear plant profile.
- A signed-in user can record watering and see last watered plus next watering state.
- The dashboard clearly separates overdue, due today, upcoming, and recently watered plants.
- The user can review basic watering history.
- Plant photos and AI-assisted identification support setup without blocking manual setup.
- Reminder behavior is driven by an internal in-app reminder model before Google Calendar sync.
- Route protection and Supabase RLS still protect user-owned data.
- Mobile layouts are usable for the primary watering loop.
- Empty, loading, and error states are clear enough for the main flows.
- `npm run typecheck`, `npm test` if present, and `npm run build` pass before release candidates move to preview review.

---

## Current Implementation State

### Implemented

- Next.js + TypeScript + Tailwind scaffold exists.
- Public landing page at `/` exists.
- Supabase Auth entry at `/login` exists.
- Protected `/app` route exists.
- Signed-in shell exists.
- Supabase environment handling exists.
- Browser and server Supabase session helpers exist.
- Middleware-based Supabase session refresh exists.
- User-owned plant collection and manual add/edit/archive flows exist.
- Persisted `plants` table exists with RLS ownership policies and soft archive support.

### Active

- Slice 2.2: plant detail/profile view refinement.

### Planned

- Watering state and mark-watered action.
- Watering dashboard basics.
- Watering care history timeline.
- Plant photo upload.
- AI-assisted plant identification.
- Internal reminder model.
- Google Calendar sync.
- Reminder flexibility.

### Deferred

- Outlook Calendar sync.
- Plant health support.
- Richer plant knowledge.
- Smarter automation.

### Out Of Scope For V1

- Authoritative health diagnosis.
- Broad encyclopedia behavior.
- Gamification and streak systems.
- Generalized task management.

### Not Yet Implemented

- No image upload yet.
- No AI identification yet.
- No watering workflow yet.
- No reminder system yet.
- No calendar sync yet.

---

## Product Principles

- Watering is the primary feature.
- Editable guidance beats hardcoded plant truth.
- AI suggestions require uncertainty-aware UX and user override.
- Dashboard clarity matters more than feature breadth.
- Mobile-first interactions should make frequent care actions fast.
- Strong empty, loading, and error states are part of the core experience.
- Build in small, reviewable slices.
- Google Calendar comes first; Outlook comes later.
- Reminders follow a stable in-app reminder model.
- Photos and AI improve setup, but the manual plant and watering loop must be useful without AI.

---

## Campaigns

Campaign docs group several PR-sized slices under one product objective while preserving one implementation slice per PR. They provide enough continuity for sequencing without turning a campaign into one large implementation branch.

Current campaign:

- [Plant Profile + Watering Foundation Campaign](campaigns/plant-profile-watering-foundation.md)

---

## Phase Roadmap

## Phase 0: Foundation

**Goal:** Establish a clean repo, docs, and app shell.

**Status:** implemented.

**Why it matters:** The project needs a stable Next.js/Tailwind foundation and clear docs before product slices can move safely.

**Slices:** Slice 0.1.

**Non-goals:** Real auth, persistent product data, watering workflow, photos, AI, reminders, and calendar sync.

**Exit criteria:** The app scaffold exists, baseline docs exist, and the repo can support the first authenticated product slice.

### Slice 0.1: App Scaffold And Docs

**Status:** implemented.

**Purpose:** Create the initial technical and planning foundation.

**Scope:** Next.js scaffold, TypeScript, Tailwind setup, placeholder landing/login/app pages, Supabase-ready helper structure, and initial docs.

**Non-goals:** Real auth, user-owned data, product workflows, AI, reminders, and calendar sync.

**Acceptance criteria:** The scaffold runs, the docs describe the product direction, and future slices can build on the established stack.

**Dependencies:** None.

**Validation notes:** Run the standard project checks when the scaffold changes.

---

## Phase 1: Auth And Signed-In Shell

**Goal:** Make the app usable as a real signed-in product shell.

**Status:** implemented.

**Why it matters:** Every useful product flow depends on user identity, route protection, and isolated user data.

**Slices:** Slice 1.1.

**Non-goals:** Plant CRUD, image upload, AI identification, watering workflow, reminders, and calendar sync.

**Exit criteria:** Signed-in users can access `/app`, signed-out users are redirected away from protected routes, and auth sessions behave predictably.

### Slice 1.1: Real Auth + Protected App Shell

**Status:** implemented.

**Purpose:** Replace placeholder auth with Supabase-backed access control.

**Scope:** Supabase email sign-up/sign-in, sign-out flow, protected `/app`, signed-out redirects, middleware session refresh, and minimal signed-in empty state.

**Non-goals:** Plant CRUD, product data persistence, photos, AI, watering, reminders, and calendar sync.

**Acceptance criteria:** Users can sign up, sign in, persist sessions across refresh/navigation, sign out, and lose protected access after sign-out.

**Dependencies:** Slice 0.1.

**Validation notes:** Manual QA confirmed auth entry, route protection, session persistence, sign-out, and blocked `/app` access after sign-out.

---

## Phase 2: Core Plant Records And Plant Profiles

**Goal:** Let a signed-in user create, manage, and review plant records without AI dependency.

**Status:** active.

**Why it matters:** The app needs trustworthy user-owned plant records before watering state, photos, AI, or reminders can attach to them.

**Slices:** Slice 2.1 and Slice 2.2.

**Non-goals:** Photo upload, AI identification, watering events, reminder scheduling, and calendar sync.

**Exit criteria:** A user can create, edit, archive, list, and open a clear profile for their own plants.

### Slice 2.1: Manual Plant CRUD

**Status:** implemented.

**Purpose:** Prove the core user-owned plant data model without AI or watering complexity.

**Scope:** Manual create/edit/archive flows; protected collection view; empty collection state; persisted `plants` table with `user_id`, nickname, common name, optional scientific name, optional location, optional notes, optional watering interval/guidance, timestamps, and soft archive support.

**Non-goals:** Photos, AI identification, watering events, next watering calculations, reminders, dashboard due logic, and calendar sync.

**Acceptance criteria:** Signed-in users can create, view, edit, and archive their own plants; archived plants are hidden from the default collection; ownership is enforced through app queries and RLS.

**Dependencies:** Slice 1.1.

**Validation notes:** Re-check CRUD happy paths, persistence, archive hiding, protected route access, guided missing-env handling, and cross-user RLS in a Supabase-backed environment.

### Slice 2.2: Plant Detail/Profile View

**Status:** active.

**Purpose:** Give each plant a durable profile surface before attaching watering, photos, AI, or reminders.

**Scope:** Dedicated plant detail page, clear plant profile layout, display of existing plant fields, coherent edit/archive paths, and mobile-friendly presentation.

**Non-goals:** Photo upload, AI identification, watering tasks, last watered state, next watering calculations, reminders, dashboard due logic, and calendar sync.

**Acceptance criteria:** A signed-in user can open a dedicated plant detail/profile view from the collection; the view presents existing plant fields clearly on mobile; edit and archive behavior remains coherent; user ownership remains protected.

**Dependencies:** Slice 2.1.

**Validation notes:** Run the standard validation gates, inspect mobile layout, and verify a different signed-in user cannot access another user's plant record.

---

## Phase 3: Watering Workflow And Dashboard

**Goal:** Make the app genuinely useful for keeping plants alive.

**Status:** planned.

**Why it matters:** Watering is the primary product value; the app is not useful enough until users can track watering and see what needs attention.

**Slices:** Slice 3.1, Slice 3.2, and Slice 3.3.

**Non-goals:** Photo upload, AI identification, reminder notifications, Google Calendar sync, Outlook sync, health diagnosis, and a generalized task system.

**Exit criteria:** Users can record watering, see last/next watering state, scan a watering-focused dashboard, and review basic watering history.

### Slice 3.1: Watering State And Actions

**Status:** planned.

**Purpose:** Add the first real watering loop to plant records.

**Scope:** Last watered date, next watering date or equivalent derived state, mark-watered action, recalculation after watering, and graceful handling for early watering.

**Non-goals:** Dashboard grouping, full care history timeline, reminder notifications, calendar sync, AI recommendations, and non-watering task types.

**Acceptance criteria:** A signed-in user can mark a plant as watered; the app records the action; last watered and next watering state update predictably; behavior remains scoped to the signed-in user.

**Dependencies:** Slice 2.2.

**Validation notes:** Validate database ownership/RLS, server-side user derivation, date edge cases, and standard validation gates.

### Slice 3.2: Watering Dashboard Basics

**Status:** planned.

**Purpose:** Turn watering state into a clear daily operating view.

**Scope:** Dashboard sections for overdue, due today, upcoming, and recently watered plants; empty states for each meaningful condition; mobile-first scanning and completion flow.

**Non-goals:** Calendar sync, notification delivery, AI-generated scheduling, room filters unless trivial, and generalized task management.

**Acceptance criteria:** The dashboard clearly separates watering urgency categories; completed watering moves plants to the right state; signed-in users only see their own plants.

**Dependencies:** Slice 3.1.

**Validation notes:** Check date boundaries, empty states, loading states, mobile layout, and standard validation gates.

### Slice 3.3: Watering Care History Timeline

**Status:** planned.

**Purpose:** Let users review basic watering history and create the foundation for future care events.

**Scope:** Watering event history, plant-level history display, simple timeline model, and future-compatible naming without overbuilding non-watering care.

**Non-goals:** Treatment history, repotting history, diagnosis records, analytics, streaks, and broad activity feeds.

**Acceptance criteria:** A signed-in user can review recent watering events for a plant; history is tied to user-owned plants; the model can later expand without forcing extra event types into v1.

**Dependencies:** Slice 3.1; benefits from Slice 3.2.

**Validation notes:** Verify event ordering, ownership, empty history state, and standard validation gates.

---

## Phase 4: Photo Support And AI-Assisted Identification

**Goal:** Make plant setup more visual and convenient after the manual plant/watering loop is useful.

**Status:** planned.

**Why it matters:** Photos and AI reduce setup friction, but they should support the core loop rather than define it.

**Slices:** Slice 4.1 and Slice 4.2.

**Non-goals:** Watering workflow changes, reminder notifications, calendar sync, health diagnosis, and authoritative plant truth.

**Exit criteria:** Users can attach/display plant photos and review AI identification suggestions before saving or overriding them.

### Slice 4.1: Plant Photo Upload

**Status:** planned.

**Purpose:** Add visual plant identity without requiring AI.

**Scope:** Upload or capture plant image, store image in Supabase Storage, display image in collection and detail views, and preserve ownership/security expectations.

**Non-goals:** AI identification, image-based diagnosis, gallery management, bulk photo upload, and calendar/reminder work.

**Acceptance criteria:** A signed-in user can add or update a plant photo; the photo displays in the app; storage access does not expose other users' files.

**Dependencies:** Slice 2.2; ideally after Phase 3 core watering slices so setup polish does not delay watering value.

**Validation notes:** Validate storage policies, upload failure states, image display on mobile, and standard validation gates.

### Slice 4.2: AI-Assisted Plant Identification

**Status:** planned.

**Purpose:** Help users identify plants from photos while keeping the user in control.

**Scope:** Submit a plant photo for identification, show likely common/scientific names, show confidence or uncertainty, store accepted suggestions, and allow manual override/edit.

**Non-goals:** Authoritative identification, AI-only setup, health diagnosis, auto-generated watering truth that users cannot edit, and background automation.

**Acceptance criteria:** Users can accept, edit, or reject AI suggestions; low-confidence states are clear; manual setup remains available.

**Dependencies:** Slice 4.1 and existing editable plant fields.

**Validation notes:** Test skipped/failed/low-confidence identification states, user override behavior, and standard validation gates.

---

## Phase 5: Reminders And Google Calendar Sync

**Goal:** Help users remember watering outside the app without letting calendar sync dictate the core model.

**Status:** planned.

**Why it matters:** Reminders make the watering loop more reliable, but the app needs an internal reminder model before external sync.

**Slices:** Slice 5.1, Slice 5.2, Slice 5.3, and deferred Outlook sync.

**Non-goals:** Outlook sync in v1, generalized task reminders, advanced automation, and AI-controlled schedules.

**Exit criteria:** The app has a stable in-app reminder model, can sync watering reminders to Google Calendar, and can support basic user flexibility.

### Slice 5.1: Internal Reminder Model

**Status:** planned.

**Purpose:** Establish app-owned reminder state tied to watering.

**Scope:** Reminder scheduling logic, reminder states tied to next watering, user-owned reminder records or equivalent derived state, and groundwork for external provider sync.

**Non-goals:** Google Calendar integration, Outlook integration, push notifications unless separately scoped, and non-watering task reminders.

**Acceptance criteria:** The app can represent when a watering reminder is due without relying on a calendar provider.

**Dependencies:** Phase 3 watering state.

**Validation notes:** Validate date handling, ownership, reminder state transitions, and standard validation gates.

### Slice 5.2: Google Calendar Sync

**Status:** planned.

**Purpose:** Sync app-owned watering reminders to the first external calendar provider.

**Scope:** Connect Google account, create/update watering reminder events, store provider linkage, and keep sync one-way from app to calendar for v1 unless later scoped otherwise.

**Non-goals:** Outlook sync, two-way conflict resolution, broad calendar task management, and reminders that bypass the in-app model.

**Acceptance criteria:** A signed-in user can connect Google Calendar and sync watering reminders without exposing another user's data.

**Dependencies:** Slice 5.1.

**Validation notes:** Validate OAuth/session behavior, provider IDs, disconnect/error states, and standard validation gates.

### Slice 5.3: Reminder Flexibility

**Status:** planned.

**Purpose:** Let users adapt reminder behavior to real care routines.

**Scope:** Fixed schedule reminders, reminders based on last watering, snooze, and watered-early support.

**Non-goals:** Seasonal automation, AI-controlled scheduling, Outlook sync, and generalized task rules.

**Acceptance criteria:** Users can choose supported reminder behavior without breaking dashboard or calendar sync assumptions.

**Dependencies:** Slice 5.1; should consider Slice 5.2 behavior.

**Validation notes:** Validate schedule recalculation, snooze states, watered-early states, and standard validation gates.

### Outlook Sync

**Status:** deferred.

**Purpose:** Add a second calendar provider after Google and the in-app reminder model are stable.

**Scope:** Future provider linkage and sync behavior for Outlook.

**Non-goals:** Not part of first usable v1.

**Acceptance criteria:** To be defined when scheduled.

**Dependencies:** Stable internal reminder model and lessons from Google Calendar sync.

**Validation notes:** Define provider-specific validation when this work is promoted.

---

## Phase 6: Plant Health Support

**Goal:** Expand from watering tracker into a more useful plant care companion after v1 foundations are stable.

**Status:** deferred.

**Why it matters:** Health support can help users respond to problems, but it must not distort the watering-first v1 or overclaim diagnosis certainty.

**Slices:** Future health check and common issue suggestion slices.

**Non-goals:** Authoritative diagnosis, emergency claims, and replacing user judgment.

**Exit criteria:** To be defined after v1 watering, photos, AI identification, reminders, and calendar sync are stable.

---

## Phase 7: Richer Plant Knowledge

**Goal:** Make plant profiles more helpful without turning the product into a generic encyclopedia.

**Status:** deferred.

**Why it matters:** Care knowledge can improve confidence, but it should support action and stay editable.

**Slices:** Future care knowledge expansion slices.

**Non-goals:** Broad reference content, uneditable botanical truth, and content that distracts from watering tasks.

**Exit criteria:** To be defined after the core product loop is stable.

---

## Phase 8: Smarter Automation

**Goal:** Improve personalization after the core product is stable.

**Status:** deferred.

**Why it matters:** Automation can reduce friction, but only after the app has enough reliable user behavior and care history to personalize responsibly.

**Slices:** Future adaptive care and habit-related slices.

**Non-goals:** AI-controlled schedules without user review, gamification in v1, and automation that hides important care decisions.

**Exit criteria:** To be defined after reminder and history data prove useful.

---

## QA And Release Planning

Manual QA happens after a Vercel preview is available for the slice or release candidate.

QA findings should be classified as:

- **bug/regression**: behavior that violates implemented expectations and should be fixed before merge or release.
- **immediate follow-up patch**: small correction that should happen soon but does not change the roadmap.
- **roadmap change**: finding that materially changes scope, sequencing, or product direction.
- **future enhancement**: valid idea that should not interrupt the current slice.

Prefer the smallest correction that resolves the finding. Roadmap or architecture docs should change only when QA materially changes scope, sequencing, or product direction.

---

## Recommended Implementation Order

1. Slice 2.2: plant detail/profile view.
2. Slice 3.1: watering state and mark-watered action.
3. Slice 3.2: watering dashboard basics.
4. Slice 3.3: watering care history timeline.
5. Slice 4.1: plant photo upload.
6. Slice 4.2: AI-assisted plant identification.
7. Slice 5.1: internal reminder model.
8. Slice 5.2: Google Calendar sync.
9. Slice 5.3: reminder flexibility.
10. Later: health support, richer knowledge, smarter automation, and Outlook sync.

This order is intentional: build the manual plant and watering loop before photos, AI, reminders, and calendar integrations. The product should be useful without AI before AI tries to make setup faster.

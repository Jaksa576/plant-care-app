# Plant Care App Roadmap

## Status legend
- **implemented** — present in the repo and intended to work now
- **in progress** — actively being built right now
- **planned** — agreed and sequenced, but not built yet
- **deferred** — intentionally postponed until later
- **out of scope for v1** — not part of the first usable version

---

## Current product direction

The Plant Care App is a personal web app focused on helping users keep houseplants alive with as little friction as possible.

### Core product loop
- add plant
- identify plant from photo
- store basic care info
- track watering
- show dashboard
- sync reminders

### Product principles
- Watering is the primary feature.
- AI should assist, not control.
- Care guidance must remain editable by the user.
- The app should feel visual, simple, calm, and mobile-friendly.
- V1 should focus on practical care actions, not broad plant content or advanced diagnosis.

### Product boundaries
Do not let the app become:
- a generic plant encyclopedia
- a generic household task manager
- an overclaimed plant diagnosis tool
- an overengineered automation system in v1

---

## Current repo state

### Foundation
- App scaffold with Next.js App Router — **implemented**
- TypeScript and Tailwind setup — **implemented**
- Public landing page — **implemented**
- Real `/login` auth route — **implemented**
- Protected `/app` route — **implemented**
- Minimal signed-in shell — **implemented**
- Supabase-ready helper structure — **implemented**
- Initial docs set — **implemented**

### Not yet implemented
- Plant CRUD — **planned**
- Image upload — **planned**
- AI plant identification — **planned**
- Watering workflow — **planned**
- Dashboard logic — **planned**
- Reminder sync — **planned**
- Calendar sync — **planned**

---

## Important planning note

This roadmap separates:

1. **Product scope**  
   What belongs in v1 and later phases.

2. **Implementation order**  
   What should be built first to reduce risk and keep slices small.

Some features belong in **v1 product scope** but are intentionally built later in implementation order.  
Example: plant identification is part of the intended v1 experience, but it should come after auth, core plant records, and watering workflow foundations.

---

## V1 product scope

### V1 goal
Help the user identify each houseplant, know when it needs water, and track whether they watered it.

### Must-have v1 capabilities
- user account/login
- personal plant collection tied to account
- add plant
- plant photo support
- nickname and room/location
- plant profile with:
  - plant name
  - optional scientific name
  - photo
  - room/location
  - editable watering guidance
  - last watered date
  - next watering date
  - notes
- watering task tracking
- mark as watered
- automatic next reminder/date calculation
- dashboard showing:
  - needs water today
  - overdue
  - upcoming
  - recently completed care
- reminder support
- Google Calendar sync

### Optional if easy in v1
- AI identification confidence score
- manual override of identified plant
- room filters on dashboard
- basic reminder snooze
- simple care history timeline for watering events

### Out of scope for core v1
- advanced health diagnosis
- pest/disease certainty claims
- broad educational plant encyclopedia
- seasonal automation engine
- gamification/streak systems
- Outlook sync in the first usable version

---

## Implementation roadmap

## Phase 0 — foundation
Goal: establish a clean repo, docs, and app shell.

### Slice 0.1 — app scaffold and docs
Status: **implemented**

Includes:
- Next.js scaffold
- Tailwind setup
- placeholder landing/login/app pages
- Supabase-ready helper structure
- initial docs

Notes:
- This phase is complete enough to support the first real feature slice.
- The repo is still at a very early stage.

---

## Phase 1 — auth and signed-in shell
Goal: make the app usable as a real signed-in product shell.

### Slice 1.1 — real auth + protected app shell
Status: **implemented**

Scope:
- Supabase email-based sign up
- Supabase email-based sign in
- sign out flow
- protect `/app`
- redirect signed-out users away from protected routes
- minimal signed-in onboarding / empty state

Why this comes first:
- everything else depends on user identity and data isolation
- keeps the first real slice focused and reviewable

Non-goals:
- no plant CRUD yet
- no image upload yet
- no AI identification yet
- no calendar sync yet

Notes:
- `/login` now uses Supabase email auth, `/app` is protected, and the signed-in shell includes sign-out and a minimal empty state.
- Manual QA confirmed auth entry, protected `/app` access, session persistence across refresh and navigation, sign-out, and blocked `/app` access after sign-out.

---

## Phase 2 — core plant records
Goal: let a signed-in user create and manage plant records without AI dependency.

### Slice 2.1 — manual plant CRUD
Status: **planned**

Scope:
- create plant manually
- edit plant details
- delete/archive plant if needed
- store:
  - nickname
  - common name
  - optional scientific name
  - room/location
  - notes
  - editable watering interval/guidance

Why this comes before AI:
- proves the core data model first
- makes the app useful even without AI
- avoids blocking progress on vision/API decisions

Next recommended slice:
- implement the first user-owned plant collection with manual plant CRUD before adding photo, AI, watering, reminder, or calendar features

### Slice 2.2 — plant detail/profile view
Status: **planned**

Scope:
- plant detail page
- clean plant card/profile layout
- editable plant fields
- notes field
- room/location display

---

## Phase 3 — watering workflow
Goal: make the app genuinely useful for keeping plants alive.

### Slice 3.1 — watering state and actions
Status: **planned**

Scope:
- last watered date
- next watering date
- mark as watered action
- recalculate next watering date
- support early watering gracefully

### Slice 3.2 — dashboard basics
Status: **planned**

Scope:
- plants due today
- overdue plants
- upcoming plants
- recently completed watering

### Slice 3.3 — care history
Status: **planned**

Scope:
- watering event history
- simple timeline model for future extensibility

Why Phase 3 matters:
- this is the real product core
- the app is not valuable until watering workflows work well

---

## Phase 4 — photo support and identification
Goal: make plant setup more visual and convenient.

### Slice 4.1 — plant photo upload
Status: **planned**

Scope:
- upload or capture plant image
- store image in Supabase Storage
- display image in list and detail views

### Slice 4.2 — AI-assisted plant identification
Status: **planned**

Scope:
- identify likely plant from photo
- store suggested common/scientific name
- store confidence
- allow manual override/edit

Guardrails:
- identification is assistive only
- user can save a plant even if identification is low-confidence or skipped

Why this is after core watering flows:
- plant identification improves setup, but watering workflow is the core value
- keeps AI from becoming a blocker to the first usable product

---

## Phase 5 — reminders and calendar
Goal: make care actions easier to remember outside the app.

### Slice 5.1 — internal reminder model
Status: **planned**

Scope:
- reminder scheduling logic
- reminder states tied to next watering
- groundwork for external sync

### Slice 5.2 — Google Calendar sync
Status: **planned**

Scope:
- connect Google account
- create/update watering reminder events
- one-way sync from app to calendar

### Slice 5.3 — reminder flexibility
Status: **planned**

Scope:
- fixed schedule reminders
- reminder based on last watering
- snooze reminders
- watered early support

### Outlook sync
Status: **deferred**

Reason:
- Google first keeps v1 integration surface manageable
- Outlook can come after the reminder model is stable

---

## Phase 6 — plant health support
Goal: expand from watering tracker into a more useful plant care companion.

### Quick health check mode
Status: **deferred**

Scope:
- separate “analyze a sick plant” flow
- upload close-up health photo
- return likely issues and next-step suggestions

### Common issue suggestions
Status: **deferred**

Scope:
- underwatering
- overwatering
- yellowing leaves
- browning tips
- drooping
- pest suspicion

Guardrails:
- health analysis is suggestive, not authoritative
- do not overclaim diagnosis certainty
- advanced diagnosis is not core v1

---

## Phase 7 — richer plant knowledge
Goal: make plant profiles more helpful without turning the app into a generic encyclopedia.

### Care knowledge expansion
Status: **deferred**

Scope:
- light preference
- humidity preference
- temperature range
- soil notes
- repotting notes
- toxicity for pets
- fertilizing schedule
- beginner-friendly care summaries
- optional fun facts

Guardrail:
- practical care info should support action, not overwhelm the user with reference content

---

## Phase 8 — smarter automation
Goal: improve personalization after the core product is stable.

### Adaptive care features
Status: **deferred**

Scope:
- adaptive watering schedule based on user check-ins
- seasonal watering adjustments
- missed-care risk signals
- smarter reminder timing

### Habit features
Status: **out of scope for v1**

Scope:
- streaks
- gamification
- motivational scoring

Reason:
- not core to the first useful version
- should only be added if they improve care adherence without cluttering the product

---

## Supporting product ideas

### Organization improvements
- room-based organization — **planned**
- windows/light exposure grouping — **deferred**
- plant type grouping — **deferred**

### Plant profile improvements
- nickname + real species name — **planned**
- notes field — **planned**
- confidence-aware identification — **planned**

### Care workflow improvements
- care history log — **planned**
- treatment history — **deferred**
- repotting history — **deferred**

---

## Recommended implementation order summary

Build in this order:

1. auth + protected shell
2. manual plant CRUD
3. watering workflow
4. dashboard
5. photo upload
6. AI plant identification
7. internal reminders
8. Google Calendar sync
9. health support
10. richer knowledge
11. smarter automation

This order is intentional:
- build the core watering value before advanced AI
- prove the product works without AI
- keep integrations later than core product loops
- reduce implementation risk early

---

## Current next slice

### Next recommended slice
**Slice 1.1 — real auth + protected app shell**

Status: **planned**

Why:
- it is the smallest high-leverage next step
- it unlocks user-specific data safely
- it keeps the roadmap disciplined before plant features begin

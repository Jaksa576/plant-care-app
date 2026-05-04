# Plant Profile + Watering Foundation Campaign

**Campaign file:** `docs/campaigns/plant-profile-watering-foundation.md`  
**Campaign status:** Active  
**Roadmap span:** Slice 2.2 through Slice 3.3  
**Target branch:** `main`  
**Implementation model:** one PR-sized slice at a time  
**Follow-on campaign:** `docs/campaigns/photo-identification-reminder-sync.md`

## Campaign recommendation

Finish this campaign before starting photo upload, AI identification, reminders, or calendar sync.

This campaign should make the app feel useful without automation: a signed-in user can open a plant profile, understand its care basics, record watering, see what needs attention today, and review recent watering history.

The implementation should stay intentionally narrow. It should not become a generic task manager, a plant encyclopedia, a health-diagnosis system, or an AI-driven care planner.

---

## Source-of-truth docs

Codex must inspect these before starting each slice:

- `AGENTS.md`
- `docs/product.md`
- `docs/architecture.md`
- `docs/roadmap.md`
- `docs/current-task.md`
- `docs/campaigns/plant-profile-watering-foundation.md`

If the docs disagree on active slice, roadmap status, route shape, data model, ownership behavior, or product guardrails, Codex must stop and report the conflict before changing code.

---

## Current campaign context

At campaign start:

- Slice 2.1 is implemented.
- Slice 2.2 is active.
- Slices 3.1, 3.2, and 3.3 are planned follow-ons.
- Manual plant records exist.
- The app should now turn those records into a durable plant-level experience.
- Watering remains the core product loop.
- Photos, AI, reminders, and calendar sync are explicitly deferred.

### Campaign thesis

The app becomes meaningfully useful when the user can answer three questions quickly:

1. **What do I know about this plant?**
2. **Does it need water?**
3. **When did I last water it?**

This campaign builds those answers in the simplest durable order:

1. Plant profile.
2. Mark watered.
3. Watering dashboard.
4. Watering history.

---

## Campaign outcome

By the end of this campaign, a signed-in user can:

- Open a dedicated profile for each plant.
- See editable plant care basics in a calm, readable layout.
- Mark a plant as watered.
- See last-watered and next-watering state.
- Scan a dashboard grouped by watering urgency.
- Review basic watering history for a plant.

By the end of this campaign, the app can:

- Preserve user-owned data boundaries.
- Keep route protection intact.
- Keep Supabase RLS aligned with app queries and mutations.
- Support future reminders from stable app-owned watering state.
- Support future photo and AI features without requiring them for the manual loop.

---

## Product guardrails

Preserve:

- Watering-first UX.
- Personal plant collection, not encyclopedia browsing.
- Editable care basics.
- User-owned data and route protection.
- Conservative, practical copy.
- Mobile-first layouts.
- Clear empty, loading, and error states.
- Additive, migration-safe data changes.

Avoid:

- Broad rewrites.
- Unnecessary schema churn.
- AI care recommendations.
- Plant diagnosis or disease/pest claims.
- Generic task abstractions.
- Calendar-sync-first design.
- Reminder notification work before watering state is stable.
- Non-watering event types unless explicitly approved later.
- Gamification, scoring, streaks, or pressure-oriented copy.

---

## UX quality bar

This campaign should feel calm, practical, and beginner-friendly.

The UI should help the user make a simple decision: “Do I need to water anything?” It should not feel like a productivity dashboard, medical tool, or expert care system.

### Design tone

Use copy and layout that feel:

- Calm.
- Clear.
- Reassuring.
- Practical.
- Non-judgmental.
- Lightweight.

Avoid copy that feels:

- Alarmist.
- Overconfident.
- Botanically authoritative.
- Punitive.
- Gamified.
- Overly technical.

### Visual direction

Prefer:

- Soft card surfaces.
- Clear hierarchy.
- Generous spacing.
- Large tap targets.
- Mobile-first vertical flow.
- Muted urgency indicators.
- Short helper text where it prevents confusion.

Avoid:

- Dense tables on mobile.
- Bright warning-heavy designs.
- Overloaded cards.
- Multi-column desktop-first layouts as the primary experience.
- Hidden primary actions.

### Interaction principles

Primary actions should be obvious but not shouty.

- On plant profile, the primary action is eventually **Mark watered**.
- On dashboard, the primary action is resolving today’s watering need.
- Edit/archive actions should remain available, but secondary.
- Missing optional fields should feel expected, not broken.
- Loading states should preserve layout shape where practical.
- Errors should tell the user what happened and what they can do next.

---

## Suggested information architecture

The exact route structure should follow the existing repo conventions, but this campaign should generally support:

```text
Signed-in app
├─ Plant collection / dashboard surface
│  ├─ Plant cards
│  └─ Links to plant profiles
└─ Plant profile
   ├─ Header summary
   ├─ Care basics
   ├─ Watering status
   ├─ Primary watering action
   ├─ Notes
   ├─ Edit/archive affordances
   └─ Watering history, once Slice 3.3 is complete
```

Codex should not introduce a route structure that conflicts with existing App Router conventions in the repo.

---

## Suggested profile design mock

This is a design target, not a pixel-perfect requirement.

```text
┌─────────────────────────────────────┐
│ ← My plants                          │
│                                     │
│ Monstera                            │
│ Swiss cheese plant                  │
│ Living room                         │
│                                     │
│ [Edit details]                      │
├─────────────────────────────────────┤
│ Watering                            │
│                                     │
│ Next watering                       │
│ Tomorrow                            │
│                                     │
│ Last watered                        │
│ 6 days ago                          │
│                                     │
│ [Mark watered]                      │
│                                     │
│ Based on your 7-day interval.       │
├─────────────────────────────────────┤
│ Care basics                         │
│                                     │
│ Water every                         │
│ About every 7 days                  │
│                                     │
│ Watering notes                      │
│ Let the top inch of soil dry first. │
├─────────────────────────────────────┤
│ Notes                               │
│                                     │
│ New leaf opened in April.           │
├─────────────────────────────────────┤
│ Recent watering                     │
│                                     │
│ May 2                               │
│ Apr 25                              │
│ Apr 18                              │
└─────────────────────────────────────┘
```

### Profile design notes

- The header should identify the plant quickly.
- The profile should not require a photo to feel complete.
- Common name and scientific name should be helpful, not dominant.
- Room/location should support memory: “which plant is this?”
- Watering should become the most prominent care block once Slice 3.1 is implemented.
- Empty fields should collapse or show gentle placeholders depending on usefulness.

Recommended empty-field treatment:

| Field | Preferred empty behavior |
| --- | --- |
| Scientific name | Hide if missing, unless edit affordance makes sense. |
| Room/location | Show “No location set” only if it helps distinguish plants. |
| Watering interval | Show “No watering interval set yet” with edit prompt. |
| Watering guidance | Hide or show a quiet “Add watering notes” prompt. |
| Notes | Hide empty notes section or show a quiet empty state near edit action. |

---

## Suggested dashboard design mock

This is the campaign-level target for Slice 3.2.

```text
┌─────────────────────────────────────┐
│ Today                               │
│ 3 plants may need water             │
│                                     │
│ Overdue                             │
│ ┌─────────────────────────────────┐ │
│ │ Peace Lily                      │ │
│ │ Last watered 10 days ago        │ │
│ │ Due 3 days ago                  │ │
│ │ [Mark watered]                  │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Due today                           │
│ ┌─────────────────────────────────┐ │
│ │ Pothos                          │ │
│ │ Last watered 7 days ago         │ │
│ │ [Mark watered]                  │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Upcoming                            │
│ ┌─────────────────────────────────┐ │
│ │ Snake Plant                     │ │
│ │ Due in 5 days                   │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Recently watered                    │
│ ┌─────────────────────────────────┐ │
│ │ Monstera                        │ │
│ │ Watered yesterday               │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Dashboard design notes

- “Overdue” should be calm, not alarming.
- “Due today” should be easy to act on.
- “Upcoming” should be scannable but secondary.
- “Recently watered” should reassure the user that completed care was recorded.
- Empty sections should not create clutter.
- Dashboard cards should link to profiles.
- If mark-watered is available on a card, the UI must avoid accidental duplicate submissions.

Suggested section copy:

| State | Example copy |
| --- | --- |
| No overdue plants | “Nothing overdue right now.” |
| No due-today plants | “No plants due today.” |
| No upcoming plants | “Add watering intervals to see upcoming care.” |
| No recently watered plants | “Watering history will appear here after you mark plants watered.” |
| Missing interval | “No watering interval set.” |
| Unknown last watered | “Not watered yet.” |

---

## Watering date semantics

Codex must inspect existing date handling before implementing. If the repo docs or current schema already define date semantics, follow them.

If not already defined, prefer simple local-day semantics for this campaign:

- Store actual event timestamps when watering is recorded.
- Derive display labels from the user-facing local date.
- Treat “due today” as due on the current local calendar day.
- Treat “overdue” as due before the current local calendar day.
- Avoid precision claims like exact ideal watering times.

### Derived state language

Use soft, practical language:

- “Due today”
- “Due tomorrow”
- “Due in 3 days”
- “Overdue by 2 days”
- “Watered today”
- “Watered yesterday”
- “Last watered 6 days ago”

Avoid overclaiming:

- “Must water now”
- “Plant is thirsty”
- “Optimal watering time”
- “Plant health risk”

### Early watering

Early watering should be allowed.

Recommended behavior:

- The user can mark watered before the calculated due date.
- The app records the event.
- The next watering date is derived from the new watering date and the plant’s interval.
- The UI can quietly explain: “Next date updated from today.”

Do not block early watering or imply the user did something wrong.

---

## Data and ownership principles

Codex should inspect the current Supabase schema, app queries, server actions, and RLS policies before choosing implementation details.

Preserve:

- User-owned plants.
- Server-derived ownership checks.
- RLS-backed access control.
- Protected routes for signed-in app surfaces.
- Additive migrations only.

### Recommended watering model direction

This campaign should end with watering history. Therefore, the data model should avoid painting the app into a corner.

Preferred direction if no model exists yet:

- Use a watering event/history table or equivalent durable event model for watering records.
- Derive `last_watered` from latest watering event where practical.
- Derive `next_watering` from latest watering event plus plant watering interval where practical.
- Keep any denormalized plant-level summary fields justified and documented if introduced.

Acceptable narrower direction for Slice 3.1 only:

- A minimal `last_watered_at` field may be acceptable if it is clearly documented and Slice 3.3 can migrate safely to history.

Stop instead of guessing if:

- Existing schema conventions make the right model unclear.
- RLS policy design is ambiguous.
- Date semantics would diverge between plant profile and dashboard.
- Supporting history would require broad schema churn.

### Do not introduce

- Generic task tables.
- Arbitrary event-type systems.
- Diagnosis records.
- Notification schedules.
- Calendar event tables.
- AI-generated care schedules.

---

## Campaign slice plan

## Slice 2.2 — Plant detail/profile view refinement

### Recommendation

Implement a dedicated plant profile that makes existing manual plant data feel complete and durable before adding watering behavior.

### User story

As a signed-in plant owner, I want to open one plant and review its care basics so that my plant collection feels personal and useful.

### Product intent

Slice 2.2 is not just navigation. It creates the main plant-level surface that later watering, photo, AI, and reminder features can attach to.

The profile should work even when the plant has sparse data. A plant with only a nickname and watering interval should still feel like a valid record.

### Design target

The profile should include:

- Back navigation to the plant collection/dashboard surface.
- Plant identity header.
- Optional botanical/common-name details.
- Optional room/location.
- Care basics section.
- Notes section, if useful.
- Edit affordance.
- Archive affordance, likely secondary/destructive.
- Graceful missing-field states.

Before watering exists, care basics can be the main content. After Slice 3.1, watering status becomes the most important card.

### Interaction details

- Tapping a plant card opens the plant profile.
- Edit remains available from the plant profile.
- Archive remains available from the plant profile or a coherent nearby flow.
- Archive should not feel like a primary action.
- Archived plants should remain hidden from the default active collection.
- Back navigation should be predictable on mobile.

### Empty/loading/error states

Required states:

- Loading profile.
- Plant not found.
- Plant archived or unavailable, if distinguishable.
- Unauthorized/cross-user access attempt.
- Missing optional fields.

Preferred copy examples:

- Missing watering interval: “No watering interval set yet.”
- Missing notes: “No notes yet.”
- Not found: “This plant could not be found.”
- Unauthorized/unavailable: “You may not have access to this plant.”

Do not expose internal IDs or database details in user-facing copy.

### Data and ownership expectations

- The profile must only load plants owned by the signed-in user.
- Mutations reachable from the profile must preserve ownership checks.
- The implementation must stay aligned with Supabase RLS.
- If route params are used, they must not bypass server-side ownership filtering.

### Scope

Include:

- Dedicated plant profile route or existing route refinement, following repo conventions.
- Collection-to-profile navigation.
- Clear mobile-first field rendering.
- Edit/archive continuity.
- Missing-field presentation.
- Protected route behavior.
- Documentation updates.

Exclude:

- Photo upload.
- Supabase Storage.
- AI identification.
- Watering state.
- Mark-watered action.
- Dashboard due logic.
- Watering history.
- Reminders.
- Calendar sync.
- Health diagnosis.
- Generic task behavior.

### Likely files or areas

Codex should inspect before changing:

- Signed-in App Router routes.
- Plant collection route/components.
- Plant form/edit/archive flows.
- Plant query utilities or server actions.
- Auth/session helpers.
- Supabase client/server helpers.
- Existing component conventions.
- `docs/current-task.md`
- `docs/roadmap.md`
- `docs/architecture.md`

### Acceptance criteria

- A signed-in user can open a dedicated plant profile from the active plant collection.
- Existing plant fields render clearly on mobile.
- Optional missing fields are handled gracefully.
- Edit behavior remains coherent from the profile.
- Archive behavior remains coherent from the profile or nearby plant-level flow.
- Archived plants remain hidden from the default active collection.
- Another signed-in user cannot access or mutate the plant.
- No photo, AI, watering, reminder, calendar, diagnosis, or task-manager behavior is introduced.

### Manual QA checklist

Test with at least:

- Plant with full details.
- Plant with only required fields.
- Plant with no scientific name.
- Plant with no room/location.
- Plant with no watering guidance.
- Archived plant.
- Signed-out user.
- Different signed-in user, if the environment supports it.

Verify:

- Collection card opens profile.
- Profile renders on a narrow mobile viewport.
- Edit path returns to a coherent state.
- Archive path hides plant from active collection.
- Protected route behavior works.
- Cross-user access is blocked.

### Validation expectations

Run:

- `npm run typecheck`, if present.
- `npm test`, if present.
- `npm run build`.

### Documentation delta expectations

Update:

- `docs/current-task.md` to move active work to Slice 3.1 after completion.
- `docs/roadmap.md` to mark Slice 2.2 implemented and Slice 3.1 active/planned according to existing doc convention.
- This campaign file to mark Slice 2.2 complete.

Update `docs/architecture.md` only if route shape, data access, ownership behavior, or relevant app structure changes.

### Stop conditions

Stop and report if:

- The current route structure makes profile/edit/archive behavior ambiguous.
- Ownership checks cannot be preserved.
- RLS policy behavior conflicts with required app queries.
- The implementation would require watering, photos, AI, reminders, or calendar sync.
- Validation fails.

---

## Slice 3.1 — Watering state and mark-watered action

### Recommendation

Add the smallest durable watering loop on the plant profile: show current watering state and let the user mark the plant as watered.

### User story

As a signed-in plant owner, I want to mark a plant as watered so that the app can help me remember when to water it next.

### Product intent

This is the first slice where the app becomes actively useful for plant care. Keep it focused on one action: recording watering.

The user should not have to understand the data model. They should see simple state, tap one action, and trust that the app updated.

### Design target

Add a watering card to the plant profile.

Suggested layout:

```text
Watering

Next watering
Due tomorrow

Last watered
6 days ago

[Mark watered]

Based on your 7-day interval.
```

Possible states:

| State | User-facing treatment |
| --- | --- |
| Never watered, interval exists | “Not watered yet” and primary mark-watered action. |
| Last watered exists, next date future | “Due in X days.” |
| Due today | “Due today.” |
| Overdue | “Overdue by X days.” Use calm styling. |
| Missing interval | “No watering interval set yet.” Link or prompt to edit. |
| Mark-watered pending | Disable action and show progress. |
| Mark-watered success | Update card; optional quiet confirmation. |
| Mark-watered failure | Show recoverable error; do not fake success. |

### Interaction details

- Primary action label: **Mark watered**.
- The action should be available from the profile.
- Duplicate submissions should be prevented during pending state.
- After success, the UI should update without requiring confusing navigation.
- If the user waters early, record it normally.
- If there is no watering interval, allow recording watering if the model supports it, but avoid pretending a next date exists.

Suggested success copy:

- “Watering recorded.”
- “Next watering updated.”

Suggested error copy:

- “Could not record watering. Please try again.”

Avoid:

- “Your plant is healthy now.”
- “You saved this plant.”
- “Optimal watering schedule updated.”

### Data and ownership expectations

Codex must inspect the existing schema before deciding implementation.

Preferred if safe:

- Record watering as a durable event.
- Derive latest watering from most recent event.
- Derive next watering from latest event plus plant interval.

Acceptable if event model is too large for the slice:

- Add minimal last-watered state with a documented path to event history in Slice 3.3.

Required either way:

- Only the owner can record watering for their plant.
- RLS must prevent cross-user watering access/mutation.
- Date calculation must be centralized enough that profile and dashboard will not diverge.

### Scope

Include:

- Watering state display on plant profile.
- Mark-watered action.
- Last-watered state.
- Next-watering derived state or clearly defined equivalent.
- Early watering behavior.
- Missing interval behavior.
- Ownership/RLS-safe mutation.
- Documentation updates.

Exclude:

- Dashboard grouping.
- Watering history timeline UI, unless the event model makes minimal event creation unavoidable.
- Reminder scheduling.
- Calendar sync.
- AI care suggestions.
- Non-watering task types.
- Health diagnosis.
- Generic task behavior.

### Likely files or areas

Codex should inspect before changing:

- Supabase migrations/schema.
- Existing plant table fields.
- Generated database types, if any.
- Plant profile route/components.
- Server actions or mutation utilities.
- Date helper conventions.
- Auth/session helpers.
- RLS policies.
- Existing tests.
- Relevant docs.

### Acceptance criteria

- A signed-in user can mark one of their own plants as watered.
- Last-watered state updates predictably.
- Next-watering state updates predictably when enough interval data exists.
- Missing watering interval does not break the UI.
- Early watering is allowed and handled calmly.
- Pending and failure states are clear.
- Refreshing the page preserves recorded watering state.
- Another signed-in user cannot water or view watering state for a plant they do not own.
- The slice does not introduce dashboard grouping, reminders, calendar sync, AI, or generic tasks.

### Manual QA checklist

Test with:

- Plant never watered, with interval.
- Plant never watered, without interval.
- Plant watered today.
- Plant watered before due date.
- Plant due today.
- Plant overdue.
- Failed mutation scenario, if practical.
- Cross-user access scenario, if practical.

Verify:

- Mark watered updates UI.
- Refresh preserves state.
- Duplicate click does not create duplicate/confusing state.
- Date labels make sense around today/tomorrow/yesterday.
- Mobile card layout is clear.
- RLS/ownership remains intact.

### Validation expectations

Run:

- `npm run typecheck`, if present.
- `npm test`, if present.
- `npm run build`.

### Documentation delta expectations

Update:

- `docs/current-task.md` to move active work to Slice 3.2 after completion.
- `docs/roadmap.md` to mark Slice 3.1 implemented and Slice 3.2 active/planned according to existing doc convention.
- `docs/architecture.md` if watering state, event persistence, derived date behavior, RLS policies, or server actions changed.
- This campaign file to mark Slice 3.1 complete.

### Stop conditions

Stop and report if:

- Date semantics are unclear.
- Model choice would block future watering history.
- Ownership checks or RLS cannot be preserved.
- The implementation pushes toward a generic task system.
- Dashboard/reminder/calendar work becomes necessary to complete the slice.
- Validation fails.

---

## Slice 3.2 — Watering dashboard basics

### Recommendation

Turn recorded watering state into a daily dashboard organized by urgency: overdue, due today, upcoming, and recently watered.

### User story

As a signed-in plant owner, I want to quickly see which plants need water so that I can care for them without checking every profile.

### Product intent

This slice creates the core dashboard experience. It should be practical and scannable, not a task-management system.

The dashboard should answer: “What should I water today?”

### Design target

Dashboard sections:

1. Overdue.
2. Due today.
3. Upcoming.
4. Recently watered.

Suggested page structure:

```text
Today
3 plants may need water

Overdue
[Plant card] [Mark watered]

Due today
[Plant card] [Mark watered]

Upcoming
[Plant card]

Recently watered
[Plant card]
```

### Section behavior

| Section | Includes | Primary purpose |
| --- | --- | --- |
| Overdue | Plants with next watering date before today. | Draw attention without alarm. |
| Due today | Plants with next watering date equal to today. | Main action area. |
| Upcoming | Plants with future next watering date. | Help the user anticipate care. |
| Recently watered | Plants with recent watering events/state. | Reassure that care was recorded. |

Codex should inspect existing roadmap/docs before deciding exact ranges for “upcoming” and “recently watered.” If no docs define this, use simple conservative defaults and document them.

Suggested defaults if undefined:

- Upcoming: next 7 days.
- Recently watered: last 7 days.

Stop if these assumptions would conflict with existing product or architecture docs.

### Interaction details

- Dashboard cards should link to plant profiles.
- Overdue and due-today cards may include **Mark watered**.
- Upcoming and recently-watered cards may omit the action or keep it secondary, depending on existing component patterns.
- Mark-watered from dashboard must produce the same data result as mark-watered from profile.
- After marking watered, sections should update by refresh, revalidation, or existing state pattern.

### Empty/loading/error states

Required states:

- No plants yet.
- Plants exist but no watering intervals are set.
- No overdue plants.
- No due-today plants.
- No upcoming plants.
- No recently watered plants.
- Loading dashboard.
- Query/action failure.

Suggested copy:

- No plants: “Add your first plant to start tracking watering.”
- No watering intervals: “Add watering intervals to see what is due.”
- No overdue: “Nothing overdue right now.”
- No due today: “No plants due today.”
- No recent watering: “Watering you record will appear here.”

### Data and ownership expectations

- Dashboard data must be scoped to the signed-in user.
- Grouping logic must match Slice 3.1 date semantics.
- Mark-watered mutation must preserve ownership checks.
- RLS must continue to protect underlying rows.
- Query shape should remain efficient enough for a personal plant collection.

### Scope

Include:

- Dashboard sections by watering status.
- Mobile-first dashboard cards.
- Empty/loading/error states.
- Profile links from dashboard cards.
- Mark-watered access from dashboard where appropriate.
- Documentation updates.

Exclude:

- Notification delivery.
- Reminder records.
- Google Calendar sync.
- Outlook sync.
- AI-generated schedules.
- Filters/search unless already present and trivial to preserve.
- Non-watering task types.
- Streaks, scoring, or gamification.
- Generic task-manager UI.

### Likely files or areas

Codex should inspect before changing:

- Existing dashboard or signed-in landing route.
- Plant query utilities.
- Watering state helpers from Slice 3.1.
- Dashboard/card components.
- Mark-watered mutation/action.
- Date helper utilities.
- Empty/loading/error components.
- Relevant docs.

### Acceptance criteria

- Dashboard separates plants into overdue, due today, upcoming, and recently watered sections.
- Section membership matches the date semantics from Slice 3.1.
- Completing watering moves plants to the correct state after refresh/revalidation.
- Empty sections are understandable and calm.
- Mobile users can scan the dashboard quickly.
- Dashboard cards link to the relevant plant profile.
- Users only see their own plants and watering state.
- The dashboard does not become a generalized task list.

### Manual QA checklist

Create or seed plants that represent:

- Overdue.
- Due today.
- Upcoming.
- Recently watered.
- No interval.
- Never watered.

Verify:

- Each plant appears in the expected section.
- Mark watered changes section membership correctly.
- Empty states appear when a section has no items.
- Cards are usable on mobile.
- Dashboard links to profile.
- Cross-user access is blocked.

### Validation expectations

Run:

- `npm run typecheck`, if present.
- `npm test`, if present.
- `npm run build`.

### Documentation delta expectations

Update:

- `docs/current-task.md` to move active work to Slice 3.3 after completion.
- `docs/roadmap.md` to mark Slice 3.2 implemented and Slice 3.3 active/planned according to existing doc convention.
- `docs/architecture.md` if dashboard query patterns, date grouping helpers, or watering data access patterns should be documented.
- This campaign file to mark Slice 3.2 complete.

### Stop conditions

Stop and report if:

- Dashboard grouping conflicts with Slice 3.1 date semantics.
- The implementation requires a reminder/calendar model.
- Query logic risks cross-user data exposure.
- UI direction drifts into generic task management.
- Validation fails.

---

## Slice 3.3 — Watering care history timeline

### Recommendation

Add a plant-level watering history so users can trust and review the watering records they create.

### User story

As a signed-in plant owner, I want to see when I watered a plant so that I can understand its recent care pattern.

### Product intent

History makes the watering loop trustworthy. It also creates a stable foundation for future reminder behavior without requiring notifications yet.

This should be basic and practical: a timeline/list of watering records, not an analytics dashboard.

### Design target

Add a recent watering section to the plant profile.

Suggested layout:

```text
Recent watering

May 2, 2026
Watered

Apr 25, 2026
Watered

Apr 18, 2026
Watered
```

If no history exists:

```text
Recent watering
No watering recorded yet.
Mark this plant as watered to start its history.
```

### Interaction details

- History should appear on the plant profile.
- Records should be ordered newest first.
- The section should be readable on mobile.
- The slice does not need editing/deleting events unless already supported by existing patterns and explicitly scoped.
- The slice does not need notes per watering event unless explicitly scoped.

### Data and ownership expectations

If Slice 3.1 already introduced watering events:

- Reuse that model.
- Avoid schema churn.
- Focus on display, ordering, and integration polish.

If Slice 3.1 only introduced a summary field:

- Add the smallest durable event/history model needed for watering history.
- Migrate or bridge existing last-watered state carefully.
- Document the model and any derivation rules.

Required:

- Watering history must be tied to user-owned plants.
- RLS must prevent cross-user access.
- Mark-watered should create history consistently after this slice.
- Last-watered and dashboard state should not diverge from history.

### Scope

Include:

- Watering history model if not already present.
- Plant-level watering history display.
- Ordered recent watering records.
- Empty history state.
- Mark-watered integration with history, if needed.
- Documentation updates.

Exclude:

- Treatment history.
- Repotting history.
- Diagnosis records.
- Photos in history.
- Event notes unless explicitly approved.
- Analytics.
- Streaks.
- General activity feed.
- Reminders.
- Calendar sync.
- AI suggestions.

### Likely files or areas

Codex should inspect before changing:

- Watering state model from Slice 3.1.
- Supabase migrations/schema.
- RLS policies.
- Mark-watered mutation/action.
- Plant profile components.
- Timeline/list component patterns.
- Database type generation conventions, if present.
- Relevant docs.

### Acceptance criteria

- A signed-in user can review recent watering events for a plant.
- Watering history is tied to user-owned plants.
- Events are ordered newest first or otherwise predictably documented.
- Empty history state is clear and calm.
- Mark-watered creates or updates history consistently.
- Last-watered/dashboard state remains consistent with history.
- Another signed-in user cannot view or mutate another user’s watering history.
- No non-watering history types, reminders, calendar sync, AI, diagnosis, or generic activity-feed behavior is introduced.

### Manual QA checklist

Test:

- Plant with no watering history.
- Plant with one watering event.
- Plant with multiple watering events.
- Mark watered and confirm new event appears.
- Refresh and confirm ordering persists.
- Dashboard/profile consistency after new event.
- Cross-user access, if practical.
- Mobile layout.

### Validation expectations

Run:

- `npm run typecheck`, if present.
- `npm test`, if present.
- `npm run build`.

### Documentation delta expectations

Update:

- `docs/current-task.md` to identify the next recommended campaign or Slice 4.1, depending on user approval.
- `docs/roadmap.md` to mark Slice 3.3 implemented and identify Slice 4.1 as planned/next according to doc convention.
- `docs/architecture.md` if watering event/history model, RLS policies, date derivation, or app data flow changed.
- This campaign file to mark Slice 3.3 complete and the campaign complete.

### Stop conditions

Stop and report if:

- History modeling turns into broad activity-feed design.
- Last-watered/dashboard state would diverge from history.
- The data model cannot preserve user-owned history boundaries.
- The slice requires reminder/calendar behavior to work.
- Validation fails.

---

## Campaign-level QA matrix

Codex should not treat this as a replacement for slice-specific QA, but it should be used before declaring the campaign complete.

| Area | Scenario | Expected result |
| --- | --- | --- |
| Auth | Signed-out user visits protected plant profile. | User cannot access private plant data. |
| Ownership | User A tries to open User B plant URL. | Access is blocked or plant is unavailable. |
| Profile | Full-detail plant. | Fields render clearly. |
| Profile | Sparse plant. | Missing fields do not look broken. |
| Archive | Archived plant. | Hidden from default active collection. |
| Watering | Never-watered plant with interval. | Can mark watered; next date derives. |
| Watering | Plant due today. | Appears due today; marking watered updates state. |
| Watering | Overdue plant. | Appears overdue with calm copy. |
| Watering | Early watering. | Allowed; next date updates from new watering date. |
| Dashboard | Mixed plant states. | Plants appear in correct sections. |
| History | Multiple watering records. | Newest records appear predictably. |
| Mobile | Narrow viewport. | Primary content and actions are usable. |
| Error | Mutation failure. | User gets recoverable error copy. |
| Docs | After each slice. | Current task, roadmap, campaign, and architecture docs are current where needed. |

---

## Campaign exit criteria

This campaign is complete when:

- Slice 2.2 is implemented and merged.
- Slice 3.1 is implemented and merged.
- Slice 3.2 is implemented and merged.
- Slice 3.3 is implemented and merged.
- Users can open a clear plant profile.
- Users can record watering.
- Users can see last-watered and next-watering state.
- Dashboard sections separate overdue, due today, upcoming, and recently watered plants.
- Users can review basic watering history.
- All behavior remains scoped to the signed-in user.
- RLS and route protection remain intact.
- Photos, AI, reminders, and calendar sync remain deferred.
- `docs/current-task.md` and `docs/roadmap.md` identify the next approved work after this campaign.

---

## Campaign-level stop conditions

Stop and ask the user for direction if:

- Repo docs conflict on active slice or roadmap status.
- Current schema differs materially from documented architecture.
- Required Supabase environment/configuration is unavailable for runtime validation.
- RLS behavior cannot be verified for a user-owned mutation.
- A slice would require broad architecture rewrites.
- A slice would require adding photos, AI, reminders, or calendar sync to complete.
- A slice would require inventing a generic task/activity system.
- Validation fails and the fix is not clearly within the slice.

---

## Codex handoff template for each slice

Use this campaign file as context, but keep each actual handoff slice-sized.

```markdown
# Codex handoff — [Slice name]

## Goal
[One sentence describing the slice outcome.]

## Docs to inspect first
- AGENTS.md
- docs/product.md
- docs/architecture.md
- docs/roadmap.md
- docs/current-task.md
- docs/campaigns/plant-profile-watering-foundation.md

## Readiness gate
Stop before coding if the docs do not identify this slice as the active/next slice, or if they conflict on scope, data model, routes, or ownership requirements.

## Context
[Brief slice-specific context from this campaign.]

## Scope
[Bullets copied/adapted from the slice scope.]

## Non-goals
[Bullets copied/adapted from the slice non-goals.]

## Likely files
[Only include if useful after inspecting repo patterns.]

## Acceptance criteria
[Slice acceptance criteria.]

## Validation
Run:
- npm run typecheck, if present
- npm test, if present
- npm run build

Also perform the manual QA checks listed for this slice where practical.

## Documentation delta
Update docs/current-task.md, docs/roadmap.md, this campaign file, and docs/architecture.md if architecture/data/route behavior changed.

## Stop conditions
Stop and report if any campaign or slice stop condition is hit.

## Final report
Include:
- Summary
- Files changed
- Validation results
- Manual QA performed / not performed
- Documentation delta
- Risks or follow-ups
- Compact state packet
```

---

## Documentation update rules

After every implementation slice, Codex must update docs while the implementation context is fresh.

Always consider:

- `docs/current-task.md`
- `docs/roadmap.md`
- This campaign file

Update `docs/architecture.md` when the slice changes:

- Route structure.
- Data model.
- Supabase policies.
- Server actions or query ownership patterns.
- Derived watering/date semantics.
- Dashboard data access patterns.

Do not update architecture docs for cosmetic-only UI changes unless the docs would otherwise become misleading.

---

## State packet expectation

Every Codex final report for this campaign must include:

```text
Project: Plant Care App
Branch: [branch]
Commit: [commit]
Merged to main: yes/no
Active campaign: Plant Profile + Watering Foundation
Completed slice: [slice]
Current status: [brief]
Next recommended action: [brief]
Docs updated: [list]
Manual QA needed: [brief]
Known risks: [brief]
```

The state packet is a transition note only. Repo docs remain authoritative.

---

## Follow-on campaign readiness

Do not start `docs/campaigns/photo-identification-reminder-sync.md` until:

- This campaign is complete through Slice 3.3.
- Docs identify Slice 4.1 or the follow-on campaign as the next approved work.
- The user approves moving from watering foundation to photo/AI/reminder work.

The follow-on campaign should build on stable watering state. It should not redefine the watering model unless a documented issue requires a narrow patch.

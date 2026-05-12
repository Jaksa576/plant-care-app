# AI Care Setup Campaign Docs Package

This file packages the proposed campaign documentation for the Plant Care App.

Contents:

1. `docs/campaigns/ai-care-setup.md`
2. `docs/current-task.md` update draft
3. `docs/roadmap.md` delta draft

---

# 1. `docs/campaigns/ai-care-setup.md`

```md
# AI Care Setup Campaign

Status: **planned**.

## Goal

Improve the AI-assisted setup experience so a user can more confidently identify a plant from a photo, then review and apply practical care starting points — especially watering check cadence — without making AI or third-party providers authoritative.

The campaign improves the existing Pl@ntNet identification helper and introduces an internal curated care profile database.

Core user flow:

```txt
owned plant photo
→ Pl@ntNet identification candidates
→ grouped/scored recommendation review
→ accepted plant identity
→ internal care profile match
→ review suggested watering/care basics
→ apply editable starting-point fields to the plant
```

## Readiness gate

Start this campaign only after:

- The UI Redesign UX Overhaul work is merged/closed or explicitly paused.
- `docs/current-task.md` and `docs/roadmap.md` agree on the active campaign.
- Product owner approves the initial internal care profile seed list.
- Product owner confirms that care suggestions should be framed as check/reminder cadences, not strict watering instructions.

## Source references

Product and architecture source of truth:

```txt
AGENTS.md
docs/product.md
docs/architecture.md
docs/roadmap.md
docs/current-task.md
```

Related prior campaign:

```txt
docs/campaigns/archived/photo-identification-reminder-sync.md
```

Research/reference input:

```txt
Plant-care data source assessment from product owner research
```

## Product guardrails

Preserve:

- watering-first UX
- personal plant collection
- editable care guidance
- user-owned plant data
- route protection and RLS
- conservative AI assistance
- clear empty/loading/error states
- mobile-first layouts
- calm, practical copy

Do not introduce:

- encyclopedia-first plant browsing
- authoritative plant diagnosis
- AI-controlled care truth
- live third-party care API dependency in the user-critical setup path
- generic task-manager behavior
- broad automation
- calendar-first reminder semantics
- unnecessary schema churn on user-owned plant records

## Product philosophy

The app should distinguish between check cadence and watering instruction:

```txt
watering_interval_days = when to check / remind
watering_guidance = how to decide whether to water
```

Use language like:

```txt
Suggested starting point: check every 14 days. Water only if the soil is dry enough. You can edit this anytime.
```

Avoid language like:

```txt
Water every 14 days.
```

Care profile suggestions are starting points. User-edited plant records remain authoritative for that user.

## Data source decision

Primary care source:

```txt
Internal curated care_profiles table
```

Supporting/enrichment sources:

```txt
Perenual - optional research/enrichment/seeding
OpenPlantbook - optional environmental threshold enrichment
WFO / POWO / Wikidata - optional name normalization/synonym support
LLM - optional admin drafting assistant only, not direct production truth
```

Do not call an external care provider live for every user action in the MVP flow.

Reasons:

- provider free tiers and burst limits are restrictive
- care suggestions are core product value
- watering defaults need product control and review
- the app should remain fast and reliable
- care copy must stay conservative and editable

## Implemented starting point

The app already supports:

```txt
plants.watering_interval_days
plants.watering_guidance
```

The existing Pl@ntNet helper returns transient identification candidates with:

```txt
provider
scientificName
commonName
confidenceScore
confidenceLabel
```

The current identification UI shows coarse confidence labels but does not yet make numeric score or grouped recommendations easy for users to interpret.

## New reference data model

Add an app-owned `care_profiles` table.

Suggested fields:

```txt
id
accepted_scientific_name
synonyms
common_names

watering_interval_days_default
watering_interval_days_min
watering_interval_days_max
watering_guidance

sunlight_preference
soil_pot_drainage_guidance
humidity_guidance
common_stress_signs
toxicity_note
beginner_notes

source_notes
review_status
last_reviewed_at
confidence

created_at
updated_at
```

Recommended field behavior:

- `accepted_scientific_name`: canonical reviewed scientific name.
- `synonyms`: scientific-name synonyms and former names.
- `common_names`: common display/search names.
- `watering_interval_days_default`: value suggested for `plants.watering_interval_days`.
- `watering_interval_days_min` / `max`: range shown in care suggestion UI.
- `watering_guidance`: editable care guidance suggested for `plants.watering_guidance`.
- `review_status`: e.g. `draft`, `reviewed`.
- `confidence`: e.g. `high`, `medium`, `low`, based on review/source quality.
- `source_notes`: internal notes/citations; do not show long copied care prose to users.

For MVP, do not add range fields to the user-owned `plants` table. Show the range in the review UI, but apply only:

```txt
plants.watering_interval_days
plants.watering_guidance
```

## Initial seed profiles

Seed at minimum:

```txt
Snake plant
- accepted: Dracaena trifasciata
- synonyms: Sansevieria trifasciata
- common names: snake plant, mother-in-law's tongue

Pothos
- accepted: Epipremnum aureum
- common names: pothos, golden pothos, devil's ivy

Monstera
- accepted: Monstera deliciosa
- common names: monstera, swiss cheese plant

Peace lily
- accepted: Spathiphyllum
- common names: peace lily

ZZ plant
- accepted: Zamioculcas zamiifolia
- common names: ZZ plant, Zanzibar gem

Spider plant
- accepted: Chlorophytum comosum
- common names: spider plant
```

Seed content should be concise, beginner-friendly, and reviewed before production use.

## Care profile matching

After a user accepts or edits an identification candidate, match profiles in this order:

1. Exact accepted scientific name.
2. Exact scientific synonym.
3. Exact common name.
4. Normalized common-name match.
5. No profile found: show manual care setup and explain no profile was found.

Matching should be case-insensitive and punctuation-tolerant.

Do not treat a low-confidence Pl@ntNet result as enough to auto-apply care data. The user must accept or edit the plant identity first.

## Identification recommendation behavior

Improve the Pl@ntNet result experience by transforming raw candidates into user-friendly recommendations.

### Score display

Show numeric match score as a percentage.

Use conservative labels:

```txt
Strong match
Possible match
Low-confidence match
```

Do not call the score “accuracy.”

Use copy like:

```txt
Best match · 82%
```

or:

```txt
Possible match · 48%
```

For low scores, offer a clearer retry path:

```txt
This is a low-confidence match. Try a clearer photo of the leaves in natural light, or keep editing manually.
```

### Grouping similar candidates

When multiple Pl@ntNet candidates share the same common name, combine them into one recommendation card.

Example:

```txt
Best match · 84%
Snake plant
Dracaena trifasciata
2 similar scientific matches considered.
```

Rules:

- Group by normalized common name when common name exists.
- Use the highest-scoring candidate as the recommended scientific name.
- Preserve/edit the recommended scientific name before save.
- Optionally disclose alternate scientific names in a compact details element.
- Do not overwhelm the user with three visually similar cards when the common name is identical.

When common names differ, show separate recommendation cards ordered by score.

## User-facing care suggestion behavior

After the user accepts or edits a plant identity:

- Look up an internal care profile.
- If a profile is found, show a care suggestion card.
- Let the user apply suggested watering interval and guidance.
- Keep suggestions editable.
- If no profile is found, let the user continue manually.

Suggested UI copy:

```txt
Suggested care starting point

Check every 14 days.
Water only when the soil is dry enough.

This is a starting point based on the plant type. Light, pot, drainage, season, and your home can change how often it needs water. You can edit this anytime.
```

Apply action:

```txt
Use these care basics
```

Secondary action:

```txt
Skip for now
```

Do not auto-create reminders unless the user already opted into reminders or explicitly confirms reminder setup.

## Slice plan

### Slice 0: Campaign Docs And Care Profile Spec

Status: planned.

Goal:

Create the campaign documentation and align the care-profile data model before implementation.

Scope:

- Add this campaign doc.
- Update `docs/current-task.md` to make this the active or next planned campaign after UI redesign is closed.
- Update `docs/roadmap.md` to list this campaign as planned/active.
- Document the care profile philosophy: check cadence, not strict watering instruction.
- Document initial seed profile list.
- Do not change app code.

Non-goals:

- No schema changes.
- No Pl@ntNet UI changes.
- No care suggestion UI.
- No provider integrations.

Acceptance criteria:

- Hot-path docs agree on campaign status and next slice.
- Campaign doc clearly scopes identification confidence, care profiles, matching, and non-goals.
- Docs explicitly preserve editable care guidance and user-owned plant records.
- Docs call out external providers as enrichment only, not source of truth.

Validation:

- Docs-only consistency review.
- Build can be skipped if no code changed.

### Slice 1: Care Profile Data Foundation

Status: planned.

Goal:

Add the internal care profile reference data layer without changing user-facing flows.

Scope:

- Add Supabase migration for `care_profiles`.
- Seed the initial common houseplant profiles.
- Add typed data access helpers for care profile lookup.
- Match by accepted scientific name, synonyms, and common names.
- Keep `care_profiles` app-owned reference data, not user-owned records.
- Do not change `plants` table.
- Do not change Pl@ntNet UI yet.

Likely files:

```txt
supabase/migrations/*
src/lib/care-profiles/*
docs/architecture.md
docs/current-task.md
docs/campaigns/ai-care-setup.md
```

Acceptance criteria:

- `care_profiles` table exists.
- Initial profiles are seeded.
- Lookup helper can find profiles by:
  - accepted scientific name
  - synonym
  - common name
- No user-owned plant data behavior changes.
- No live third-party provider call is introduced.
- Seed wording is concise and avoids copied long-form care prose.

Validation:

- `npm run typecheck` if present.
- `npm test` if present.
- `npm run build`.
- `npm run lint` if present.
- Migration review for additive safety.

Stop conditions:

- Seed data licensing/source concerns are unresolved.
- Schema requires changing existing user-owned plant fields.
- Matching creates ambiguity that cannot be handled conservatively.

### Slice 2: Identification Confidence And Grouped Recommendations

Status: planned.

Goal:

Make Pl@ntNet suggestions easier to understand and choose from.

Scope:

- Display numeric match scores as percentages.
- Update confidence copy to use `Strong match`, `Possible match`, and `Low-confidence match`.
- Group candidates that share the same normalized common name.
- For grouped candidates, show one card using the highest-scoring scientific name.
- Include compact disclosure for similar scientific matches.
- Add clearer retry-photo/manual-edit copy for low-confidence results.
- Preserve review/edit/save behavior.
- Do not persist raw Pl@ntNet responses by default.
- Do not change care profile schema.

Likely files:

```txt
src/lib/plant-identification/*
src/components/plant-identification-form.tsx
src/app/app/plants/actions.ts
docs/architecture.md
docs/current-task.md
docs/campaigns/ai-care-setup.md
```

Acceptance criteria:

- Candidate cards show score percentages.
- Highest-scoring candidate appears first.
- Same-common-name candidates collapse into one recommendation.
- Snake plant-style results do not show multiple near-identical common-name cards.
- User can still edit common and scientific names before save.
- Low-confidence results clearly suggest retaking photo or editing manually.
- AI copy remains conservative.

Validation:

- `npm run typecheck` if present.
- `npm test` if present.
- `npm run build`.
- `npm run lint` if present.
- Manual QA with:
  - high-confidence result
  - low-confidence result
  - duplicate common-name candidates
  - no-candidate result
  - saved reviewed names

Stop conditions:

- Grouping hides materially different common-name choices.
- Score display implies certainty or authoritative identification.
- Existing manual edit/save behavior regresses.

### Slice 3: Suggested Care Review After Accepted Identification

Status: planned.

Goal:

After a user accepts or edits an identification, show reviewable care suggestions from the internal care profile database.

Scope:

- After saving reviewed plant names, attempt care profile lookup.
- If a profile matches, show suggested care basics.
- Suggested care includes:
  - check cadence from `watering_interval_days_default`
  - watering interval range if available
  - watering guidance
  - sunlight preference
  - soil/pot/drainage guidance
  - humidity guidance
  - stress signs
  - beginner notes
  - toxicity note when available
- Provide action to apply suggested watering fields to the plant.
- Applying suggestions updates only:
  - `plants.watering_interval_days`
  - `plants.watering_guidance`
- Preserve manual skip/edit path.
- Do not auto-create or auto-enable reminders.
- Do not introduce live external care-provider calls.

Likely files:

```txt
src/app/app/plants/actions.ts
src/components/plant-identification-form.tsx
src/components/*
src/lib/care-profiles/*
src/lib/plants/data.ts
docs/architecture.md
docs/current-task.md
docs/campaigns/ai-care-setup.md
```

Acceptance criteria:

- A matched care profile produces a reviewable suggestion card.
- User can apply the suggested watering interval and guidance.
- User can skip suggestions.
- Suggestions are framed as starting points/check cadence.
- Existing plant edit route still allows later changes.
- No suggestion is applied without user action.
- No care profile match falls back gracefully to manual editing.
- Ownership checks are preserved before plant updates.

Validation:

- `npm run typecheck` if present.
- `npm test` if present.
- `npm run build`.
- `npm run lint` if present.
- Manual QA with:
  - matched profile after accepted ID
  - synonym match after accepted ID
  - no profile match
  - applying suggestions
  - skipping suggestions
  - editing plant after applying suggestions

Stop conditions:

- Suggestions are applied automatically.
- Care copy implies guaranteed watering schedule.
- Plant update path weakens server-side ownership checks.
- The flow becomes AI-first or blocks manual setup.

### Slice 4: Care Profile Expansion And QA

Status: planned.

Goal:

Expand profile coverage and verify the complete identification-to-care setup experience.

Scope:

- Add more reviewed common houseplant profiles.
- Improve source notes and review metadata.
- QA grouped identification and care suggestion flow together.
- Identify any matching gaps or copy issues.
- Keep provider integrations out of the user-facing path unless separately approved.

Suggested expansion targets:

```txt
Aloe vera
Jade plant
Rubber plant
Fiddle leaf fig
Chinese money plant
Philodendron
Heartleaf philodendron
Boston fern
Calathea
Prayer plant
African violet
English ivy
Dieffenbachia
Dumb cane
Aglaonema
Parlor palm
Areca palm
Bird of paradise
String of pearls
Hoya
```

Acceptance criteria:

- Expanded seed data remains concise and reviewed.
- Matching still behaves predictably.
- UI remains calm and mobile-friendly.
- No encyclopedia-style profile pages are introduced.
- Manual setup remains useful without AI.

Validation:

- `npm run typecheck` if present.
- `npm test` if present.
- `npm run build`.
- `npm run lint` if present.
- Manual QA across at least:
  - first six seed plants
  - one synonym-heavy plant
  - one common-name-only match
  - one no-match plant
  - mobile viewport
  - desktop viewport

Stop conditions:

- Care profile expansion turns into broad plant encyclopedia work.
- Source/review quality becomes unclear.
- The slice requires admin tooling not already approved.

## Campaign QA checklist

Manual QA should cover:

- plant with no photo
- plant with photo
- Pl@ntNet unavailable
- Pl@ntNet no candidates
- low-confidence candidate
- high-confidence candidate
- duplicate common-name candidates
- accepted candidate with exact care profile match
- accepted candidate with synonym care profile match
- accepted candidate with no care profile
- apply suggested care
- skip suggested care
- edit care fields after applying suggestion
- mark watered after applying suggested interval
- dashboard next-date behavior after applying suggested interval
- reminder behavior remains unchanged unless user edits reminders
- mobile layout
- desktop layout
- route protection
- cross-user ownership assumptions

## Documentation expectations

Every slice should update:

```txt
docs/current-task.md
docs/campaigns/ai-care-setup.md
```

Update these when relevant:

```txt
docs/architecture.md
docs/roadmap.md
docs/product.md
```

Update `docs/architecture.md` when:

- `care_profiles` table is added
- matching helpers are added
- identification candidate grouping changes
- care suggestion apply behavior is implemented

Update `docs/roadmap.md` when:

- campaign status changes
- slice status changes
- campaign is completed or deferred

Update `docs/product.md` only if product guardrails, V1 scope, or care philosophy changes.

## Final reporting expectations

Each Codex final report should include:

- branch
- commit
- slice completed
- files changed
- validation results
- documentation delta
- manual QA notes
- known risks
- next recommended action
- compact state packet

## Stop conditions

Stop and report if:

- hot-path docs disagree on active campaign or slice
- UI redesign is still active and blocks this campaign
- schema work would alter existing user-owned plant fields without approval
- RLS or server-side ownership checks become unclear
- care suggestions are being applied without user review
- copy implies diagnosis, certainty, or strict watering instructions
- a live external care provider becomes required for the user flow
- validation fails
```

---

# 2. `docs/current-task.md` update draft

Use this after the UI redesign campaign is merged/closed.

```md
# Current Task

## Current Status

- Next.js + TypeScript + Tailwind scaffold is implemented.
- Supabase email auth at `/login` is implemented.
- `/app` is protected for signed-in users.
- Signed-in shell, sign-out, and middleware-based session refresh are implemented.
- User-owned plant CRUD is implemented with a persisted `plants` table, RLS ownership policies, and soft archive behavior.
- A dedicated, protected plant detail/profile view is implemented for user-owned plant records.
- Plant-level watering state and mark-watered behavior are implemented with durable watering events and reminder-aware next-date display.
- A reminder-aware watering dashboard with overdue, due today, upcoming, and recently watered sections is implemented.
- Plant-level watering history is implemented from the durable watering event model.
- Primary plant photo upload is implemented with private Supabase Storage, one optional photo per owned plant, profile display, dashboard thumbnails, replace/remove actions, and calm no-photo fallbacks.
- AI-assisted plant identification is implemented with a deliberate Pl@ntNet-backed helper from an owned primary photo. Suggestions are transient, names-only, reviewable, editable, rejectable, and saved only after user acceptance into normal plant fields.
- App-owned watering reminders and Google Calendar one-way sync are implemented.
- UI Redesign UX Overhaul is complete or closed before this campaign begins.

## Active Slice

AI Care Setup Campaign is active.

Current slice:

```txt
Slice 0: Campaign Docs And Care Profile Spec
```

## Why This Is Next

The app already supports the core manual plant and watering loop, optional photo identification, editable watering interval/guidance, reminders, and calendar reflection.

The next product improvement is to make AI-assisted setup more useful without making AI authoritative:

1. Show clearer identification confidence and grouped recommendations.
2. Add internal curated care profiles.
3. Let users review and apply suggested watering/care basics after accepting an identification.

This keeps the app watering-first while reducing setup friction.

## Scope

- Add `docs/campaigns/ai-care-setup.md`.
- Align roadmap/current-task docs around the new campaign.
- Document the internal care profile strategy.
- Document the identification confidence/grouping enhancement.
- Document care suggestion flow and non-goals.
- Do not implement schema or app code in Slice 0.

## Non-Goals

- Do not add live external care-provider dependency to the user-facing setup path.
- Do not implement health diagnosis.
- Do not create encyclopedia-style plant pages.
- Do not auto-apply care suggestions.
- Do not auto-create reminders from care suggestions.
- Do not change existing user-owned plant fields in Slice 0.
- Do not change Pl@ntNet provider behavior in Slice 0.

## Acceptance Criteria

- Campaign doc exists and is internally consistent.
- Hot-path docs agree this campaign is active/planned.
- The campaign clearly distinguishes:
  - identification confidence
  - internal care profile data
  - reviewable care suggestions
  - user-owned editable plant care fields
- The care philosophy is documented:
  - `watering_interval_days` is a check/reminder cadence
  - `watering_guidance` explains how to decide whether to water
- External providers are documented as enrichment/research inputs only.

## Validation Expectations

For docs-only Slice 0:

- Verify affected docs are internally consistent.
- Targeted search for stale active-campaign references.
- Build validation can be skipped because no code changed.

For implementation slices:

- `npm run typecheck` if present.
- `npm test` if present.
- `npm run build`.
- `npm run lint` if present.

## Next Recommended Action

Complete Slice 0 docs, then hand Codex Slice 1: Care Profile Data Foundation.
```

---

# 3. `docs/roadmap.md` delta draft

Add this under Campaigns and near Later Phases or after Phase 5.

```md
## Campaigns

Active campaign:

- [AI Care Setup Campaign](campaigns/ai-care-setup.md)

Completed campaigns:

- [UI Redesign UX Overhaul Campaign](campaigns/ui-redesign-ux-overhaul.md)
- [Plant Profile + Watering Foundation Campaign](campaigns/archived/plant-profile-watering-foundation.md)
- [Photo Identification + Reminder Sync Campaign](campaigns/archived/photo-identification-reminder-sync.md)
```

Add a new phase/campaign section:

```md
## Phase 6: AI Care Setup

**Status:** active.

**Goal:** Make AI-assisted plant setup more useful by improving identification confidence and offering reviewed care starting points from internal curated profiles.

### Slice 6.1: Campaign Docs And Care Profile Spec

**Status:** active.

**Scope:** Add campaign documentation, align current-task/roadmap, document the care profile data strategy, and define conservative care suggestion behavior.

### Slice 6.2: Care Profile Data Foundation

**Status:** planned.

**Scope:** Add internal `care_profiles` reference table, seed initial common houseplant profiles, and add lookup helpers.

### Slice 6.3: Identification Confidence And Grouped Recommendations

**Status:** planned.

**Scope:** Show Pl@ntNet score percentages, improve confidence copy, group duplicate common-name candidates, and recommend the highest-scoring scientific match.

### Slice 6.4: Suggested Care Review After Accepted Identification

**Status:** planned.

**Scope:** After accepted identification, match an internal care profile and let the user review/apply suggested watering interval and watering guidance.

### Slice 6.5: Care Profile Expansion And QA

**Status:** planned.

**Scope:** Expand reviewed profile coverage and QA the complete identification-to-care setup flow.

**Guardrail:** Care suggestions are editable starting points. User-owned plant records remain authoritative.
```

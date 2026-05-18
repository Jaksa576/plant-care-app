# AI Care Setup Campaign

Status: **planned**.

## Recommendation

Run this as a single comprehensive campaign focused on **better plant identification, broad practical houseplant coverage, and fast editable watering setup**.

This campaign should make Plant Care App feel meaningfully smarter for the average houseplant owner without turning the app into an encyclopedia, diagnosis tool, or AI-controlled care engine.

The campaign thesis:

```txt
clearer plant identification
→ internal houseplant care profile database
→ exact / genus / care-group matching
→ conservative fallback watering guidance
→ user reviews and applies editable watering basics
→ optional reminder handoff
→ expanded profile coverage inside the same campaign
```

## Objective and target state

### Objective

Improve AI-assisted plant setup so users can more confidently identify a plant from a photo and quickly arrive at a practical watering check cadence.

The app should help a beginner answer:

```txt
What plant is this probably?
How confident is the app?
How often should I check whether it needs water?
What should I look for before watering?
Can I change this later?
```

The answer must remain conservative, reviewable, and editable.

### Target state

By the end of this campaign, a signed-in user can:

- add or open a plant with a photo
- ask for plant identification help
- see clearer Pl@ntNet recommendations with understandable confidence
- avoid being overwhelmed by duplicate/similar candidates
- accept, edit, reject, retry, or skip AI suggestions
- match accepted plant identity to an internal care profile
- receive a practical watering starting point
- understand the difference between a check cadence and a watering command
- apply editable watering basics to the plant
- optionally create or review an app-owned watering reminder
- still complete setup manually when AI or profile matching is not helpful

### Ideal user flow

```txt
plant photo
→ improved identification recommendations
→ user accepts or edits identity
→ internal care profile lookup
→ exact profile, genus profile, care group, or fallback
→ suggested watering starting point
→ user applies, edits, or skips
→ optional reminder handoff
```

### Product promise

The campaign should help most average houseplant owners get **decent watering guidance quickly**, even when:

- the exact species is uncertain
- a plant has messy common names
- scientific names have changed
- Pl@ntNet returns similar candidates
- the app does not have a species-level profile yet

The app should do this by using a coverage-first strategy:

```txt
specific species profiles where confidence is high
+ genus profiles where species precision is unnecessary
+ care-group profiles where watering behavior matters more than exact taxonomy
+ fallback questions when identity confidence is low
```

## Current state and source-of-truth notes

### Hot-path docs to inspect before each slice

Codex must inspect these before implementation:

```txt
AGENTS.md
docs/product.md
docs/architecture.md
docs/roadmap.md
docs/current-task.md
docs/campaigns/ai-care-setup.md
```

If this campaign doc is first created by replacing the package-style file, Codex should also inspect:

```txt
docs/campaigns/ai-care-setup-campaign-docs.md
```

### Current implemented baseline

The app already has:

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth
- Supabase Postgres
- Supabase Storage
- Vercel
- protected signed-in app shell
- user-owned plant collection
- manual plant create, edit, archive, and detail flows
- watering events
- mark-watered action
- watering history
- reminder-aware dashboard urgency
- private primary plant photos
- Pl@ntNet-backed identification from an owned plant photo
- app-owned watering reminders
- one-way Google Calendar reflection of app-owned reminders

### Existing AI behavior

The existing Pl@ntNet helper is useful but limited:

- suggestions are transient
- suggestions are names-only
- the user must review before saving
- accepted common/scientific names update normal editable plant fields
- care basics are not suggested by AI
- watering intervals are not suggested from the identification result
- score/confidence is not yet made clear enough for a beginner
- similar candidates can feel repetitive or confusing

### Existing plant care fields

The app already supports the right user-owned fields:

```txt
plants.watering_interval_days
plants.watering_guidance
```

This campaign should use those fields rather than creating unnecessary user-owned schema churn.

For user-owned plants:

```txt
watering_interval_days = when the app should ask the user to check
watering_guidance = how the user should decide whether to water
```

The app should never imply that a fixed interval is guaranteed botanical truth.

### Source-of-truth / status caveat

If `main` still lists no active campaign or stale current task status, Slice 0 must align `docs/current-task.md` and `docs/roadmap.md` before implementation work begins.

If the onboarding / rooms / photo-first Add Plant campaign has not been merged into `main`, this campaign should begin with the existing owned-photo plant profile identification flow and defer Add Plant photo-first integration until that foundation is present.

## Scope and non-goals

### Included scope

#### Identification improvements

- Show Pl@ntNet match score as a percentage.
- Replace vague labels with conservative, user-friendly labels:
  - `Strong match`
  - `Possible match`
  - `Low-confidence match`
- Group duplicate/similar candidates when they share the same normalized common name.
- Use the highest-scoring scientific name as the primary recommendation within a grouped card.
- Show alternate scientific matches in compact details.
- Add clearer low-confidence, no-result, retry-photo, and manual-edit copy.
- Preserve the ability to edit common/scientific names before saving.
- Preserve reject, retry, skip, and manual override paths.

#### Internal care profile database

- Add an internal app-owned `care_profiles` reference data table.
- Add aliases/synonyms for matching messy names.
- Add profile levels:
  - `species`
  - `genus`
  - `care_group`
  - `fallback`
- Add profile review status and confidence metadata.
- Add seed tooling or structured fixtures so profile expansion is repeatable.
- Add enough profile coverage for a normal houseplant owner.
- Keep external care data as research/enrichment input, not runtime truth.

#### Matching strategy

After accepted identity, match in this order:

```txt
exact species profile
→ synonym / alias match
→ genus profile
→ reviewed care group
→ fallback watering setup questions
→ manual care setup
```

The app should prefer a safe broader profile over a brittle exact-match-only failure.

#### Watering starting points

- Suggest a practical watering **check cadence**.
- Show an optional range when helpful.
- Explain how to decide whether to water.
- Store and apply only editable plant care fields.
- Provide explicit user actions:
  - use suggestion
  - edit first
  - skip for now
- Avoid overwriting existing user-entered care fields without confirmation.

#### Optional reminder handoff

- After applying a watering cadence, optionally invite the user to set or review an app-owned watering reminder.
- Do not create reminders automatically.
- Do not make Google Calendar the source of truth.
- Existing Google Calendar sync remains a one-way reflection of app reminders.

#### Coverage expansion

This campaign includes coverage expansion through three waves:

```txt
Coverage Wave 1: core common plants and data foundation
Coverage Wave 2: expanded average-household coverage
Coverage Wave 3: broad houseplant coverage and QA hardening
```

Waves 2 and 3 are part of this campaign, not a separate future campaign.

### Explicit non-goals

- No authoritative plant identification.
- No AI-controlled plant truth.
- No automatic care application without user review.
- No health diagnosis.
- No pest, disease, or treatment guidance.
- No toxicity decision support beyond short conservative notes in reviewed profiles.
- No encyclopedia-style plant browsing.
- No broad plant pages unrelated to the user's collection.
- No live third-party care API dependency in the user-critical setup path.
- No LLM-generated production care data shown directly to users.
- No generic task management.
- No required photo, AI, care suggestion, reminder, or calendar setup.
- No destructive changes to existing user-owned plant fields.
- No auto-created calendar events outside the existing app-owned reminder sync model.
- No Outlook sync.

## Product principles

### 1. Watering-first

Every slice should improve the user's ability to decide when to check and whether to water.

Do not add broad plant knowledge unless it directly supports setup or watering decisions.

### 2. Confidence without overclaiming

Use language like:

```txt
Best match · 82%
Possible match · 48%
Low-confidence match
```

Do not use language like:

```txt
Accurate result
Correct plant
Guaranteed match
```

### 3. Check cadence, not watering command

Use language like:

```txt
Suggested starting point: check every 14 days.
Water only if the top soil feels dry enough.
```

Avoid language like:

```txt
Water every 14 days.
```

### 4. User-owned plant records are authoritative

Care profiles suggest starting points.

User edits win.

After a suggestion is applied, the plant record owns its care basics.

### 5. Broad coverage through tiers

Most users should get a useful answer even if exact species matching fails.

Preferred matching fallback:

```txt
species → genus → care group → fallback questions → manual
```

### 6. Manual setup remains first-class

AI should reduce friction, not create a dependency.

A user must always be able to continue manually.

## Data strategy

### Why internal profiles

The app should own its care defaults because:

- watering guidance is core product value
- provider limits and quality vary
- live external care calls create reliability risk
- care copy must stay conservative and product-reviewed
- the user experience should remain fast
- user-owned plant fields must stay editable

External sources can help with research, seeding, or review, but the app should not depend on a live external care provider in the user-facing setup path.

### Profile levels

#### `species`

Use when a specific plant is common and has distinct enough care expectations.

Examples:

```txt
Dracaena trifasciata / snake plant
Epipremnum aureum / pothos
Monstera deliciosa
Zamioculcas zamiifolia / ZZ plant
Chlorophytum comosum / spider plant
Ficus lyrata / fiddle leaf fig
```

#### `genus`

Use when genus-level guidance is useful and exact species may be unnecessary or hard to determine.

Examples:

```txt
Philodendron
Dracaena
Peperomia
Hoya
Ficus
Begonia
Anthurium
Pilea
Dischidia
Tradescantia
```

#### `care_group`

Use when watering behavior matters more than exact identity.

Examples:

```txt
succulent-like / drought-tolerant
cactus / very dry
moderate tropical / let top soil dry
moisture-loving tropical
fern / evenly moist
orchid in bark mix
semi-aquatic / very high moisture
```

#### `fallback`

Use when the app cannot safely match identity.

Fallback should ask simple questions and suggest a conservative starting point.

Example fallback questions:

```txt
Does this plant have thick, fleshy leaves?
Does it look like a cactus or succulent?
Does the label or seller say fern, orchid, palm, or tropical?
Do you want to start cautiously and check more often at first?
```

Fallback result example:

```txt
Start by checking every 7 days.
Only water if the top inch of soil feels dry.
Adjust after you learn how quickly it dries in your home.
```

## Data model direction

### `care_profiles`

Reference data table.

Suggested fields:

```txt
id uuid primary key
profile_key text unique not null
profile_level text not null -- species | genus | care_group | fallback
display_name text not null
accepted_scientific_name text null
accepted_common_name text not null
taxon_rank text null

watering_interval_days_default integer not null
watering_interval_days_min integer null
watering_interval_days_max integer null
dryness_preference text not null
watering_guidance text not null

light_guidance text null
soil_pot_drainage_guidance text null
humidity_guidance text null
seasonal_note text null
beginner_note text null
toxicity_note text null

match_confidence text not null default 'medium' -- high | medium | low
review_status text not null default 'draft' -- draft | reviewed | needs_review
source_summary text null
source_links jsonb null
last_reviewed_at timestamptz null

created_at timestamptz not null default now()
updated_at timestamptz not null default now()
```

### `care_profile_aliases`

Recommended as a separate table to make matching safer and easier to audit.

```txt
id uuid primary key
care_profile_id uuid not null references care_profiles(id)
alias text not null
normalized_alias text not null
alias_type text not null -- scientific | synonym | common | normalized_common | genus | group
priority integer not null default 100
created_at timestamptz not null default now()

unique(care_profile_id, normalized_alias, alias_type)
```

### Optional future table: `care_profile_match_log`

Do not add unless needed for QA or analytics.

Potential use:

- understand no-match cases
- identify common aliases to add
- detect low-confidence identification patterns

If added, it must avoid storing raw photo data and must preserve user privacy.

### `dryness_preference`

Recommended controlled values:

```txt
dry_fully
dry_mostly
dry_top_half
dry_top_inch
lightly_moist
evenly_moist
special_medium
unknown_conservative
```

This helps explain the watering cadence in plain language.

Example mapping:

```txt
dry_fully → Let the soil dry fully before watering.
dry_mostly → Let most of the soil dry before watering.
dry_top_half → Let the top half of the soil dry before watering.
dry_top_inch → Let the top inch of soil dry before watering.
lightly_moist → Keep lightly moist, but not soggy.
evenly_moist → Keep evenly moist and check often.
special_medium → Follow medium-specific guidance, such as bark mix.
unknown_conservative → Start conservatively and adjust based on drying.
```

## Matching behavior

### Identification candidate grouping

Group Pl@ntNet candidates when:

- normalized common name is the same
- or common names are aliases in the internal alias table
- and scientific names are not meaningfully different for beginner watering setup

Do not group candidates when:

- common names differ
- profiles would map to very different care groups
- one candidate is a succulent/cactus and another is tropical/moisture-loving
- grouping would hide a meaningful user choice

### Candidate display

Each recommendation card should show:

```txt
Best match · 82%
Snake plant
Dracaena trifasciata
2 similar scientific matches considered
```

For lower confidence:

```txt
Low-confidence match · 34%
This may not be the right plant. Try a clearer leaf photo in natural light, or continue manually.
```

### Care profile lookup order

After user accepts or edits identity:

```txt
1. exact accepted scientific name
2. exact scientific synonym
3. exact normalized scientific name
4. exact common name alias
5. normalized common name alias
6. genus profile
7. care group profile if inferred safely
8. fallback setup questions
9. manual care setup
```

### Ambiguity handling

If a name maps to multiple profiles with meaningfully different watering behavior, do not auto-select.

Show a conservative message:

```txt
We found a few possible care matches. Choose one if it looks right, or keep setup manual for now.
```

### Applying suggestions

Suggestion application rules:

- Never auto-apply.
- Never silently overwrite user-entered watering basics.
- Apply only after explicit user action.
- Apply only editable plant fields:
  - `plants.watering_interval_days`
  - `plants.watering_guidance`
- Do not add range fields to `plants` in this campaign.
- Show the range in the UI only.
- User can edit later from the normal plant edit route.

## Coverage strategy

### Coverage goals

The campaign should be useful for most average houseplant collections.

Approximate campaign targets:

```txt
Coverage Wave 1: 25–40 core profiles and aliases
Coverage Wave 2: 75–100 total profiles/aliases
Coverage Wave 3: 150–250 total profiles/aliases
```

These totals can include species, genus, care-group, fallback, and alias records. The point is practical coverage, not taxonomy completeness.

### Coverage measurement

Track:

```txt
number of reviewed species profiles
number of reviewed genus profiles
number of reviewed care groups
number of aliases
number of ambiguous aliases
number of no-match QA examples
percentage of QA plant list that receives useful guidance
```

### Definition of useful guidance

A result is useful when it gives the user:

- a conservative check cadence
- a clear dryness test
- editable plant care basics
- honest uncertainty
- a path to continue manually

It does not require exact species-level certainty.

## Suggested starter coverage

### Coverage Wave 1: core common plants

Target: 25–40 practical profiles/aliases.

Seed species profiles:

```txt
Snake plant — Dracaena trifasciata / Sansevieria trifasciata
Pothos — Epipremnum aureum
Monstera — Monstera deliciosa
Peace lily — Spathiphyllum
ZZ plant — Zamioculcas zamiifolia
Spider plant — Chlorophytum comosum
Aloe vera — Aloe vera
Jade plant — Crassula ovata
Rubber plant — Ficus elastica
Fiddle leaf fig — Ficus lyrata
Chinese money plant — Pilea peperomioides
Boston fern — Nephrolepis exaltata
Heartleaf philodendron — Philodendron hederaceum
Orchid — Phalaenopsis
African violet — Saintpaulia / Streptocarpus sect. Saintpaulia
English ivy — Hedera helix
Dieffenbachia — Dieffenbachia
Aglaonema — Aglaonema
Parlor palm — Chamaedorea elegans
Areca palm — Dypsis lutescens
Bird of paradise — Strelitzia reginae
String of pearls — Curio rowleyanus / Senecio rowleyanus
Hoya — Hoya carnosa
Peperomia — Peperomia obtusifolia
Prayer plant — Maranta leuconeura
Calathea group — Calathea / Goeppertia
Anthurium — Anthurium andraeanum
Croton — Codiaeum variegatum
Schefflera — Heptapleurum / Schefflera
Tradescantia — Tradescantia zebrina
```

Seed genus profiles:

```txt
Philodendron
Dracaena
Peperomia
Ficus
Hoya
Pilea
Begonia
Anthurium
Dischidia
Tradescantia
```

Seed care groups:

```txt
Succulent-like houseplant
Cactus / very dry houseplant
Moderate tropical houseplant
Moisture-loving tropical houseplant
Fern / evenly moist houseplant
Orchid in bark mix
Palm houseplant
Unknown conservative starter
```

### Coverage Wave 2: expanded average-household coverage

Target: 75–100 total profiles/aliases.

Add profiles/aliases for:

```txt
Nerve plant — Fittonia
Polka dot plant — Hypoestes
Money tree — Pachira aquatica
Lucky bamboo — Dracaena sanderiana
Corn plant — Dracaena fragrans
Dragon tree — Dracaena marginata
Cast iron plant — Aspidistra elatior
Wax plant — Hoya varieties
Burro's tail — Sedum morganianum
Echeveria
Haworthia
Gasteria
Christmas cactus — Schlumbergera
Thanksgiving cactus — Schlumbergera truncata
Kalanchoe
Oxalis triangularis
Maidenhair fern — Adiantum
Bird's nest fern — Asplenium nidus
Staghorn fern — Platycerium
Alocasia
Colocasia
Syngonium
Scindapsus
Rhaphidophora tetrasperma
Ctenanthe
Stromanthe
Yucca cane
Norfolk Island pine — Araucaria heterophylla
Bromeliad
Air plant — Tillandsia
```

Wave 2 should also add stronger alias coverage for common names:

```txt
devil's ivy
golden pothos
swiss cheese plant
mother-in-law's tongue
zanzibar gem
money plant
inch plant
wandering dude
prayer plant
peacock plant
rubber tree
mini monstera
```

### Coverage Wave 3: broad coverage and QA hardening

Target: 150–250 total profiles/aliases.

Wave 3 should focus on:

- plants that commonly appear in retail stores
- common Pl@ntNet misidentifications
- common aliases from QA
- genus-level profiles for messy plant groups
- care-group fallback reliability
- ambiguous name handling

Add or improve coverage for:

```txt
Dischidia
Rhipsalis
Epiphyllum
Ponytail palm — Beaucarnea recurvata
Ming aralia — Polyscias fruticosa
Aralia
Fatsia japonica
Coleus
Herbs grown indoors
Lavender indoors
Rosemary indoors
Mint indoors
Basil indoors
Citrus indoors
Dwarf banana
Coffea arabica
Mimosa pudica
Carnivorous plants group
Pitcher plant group
Venus flytrap group
Poinsettia
Cyclamen
Gardenia indoors
Jasmine indoors
Azalea indoors
Bonsai beginner group
Ficus bonsai group
Succulent rosette group
Trailing succulent group
Caudex plant group
```

Wave 3 should not try to complete global plant taxonomy. It should make the app feel strong for normal houseplant ownership.

## Slice plan

### Slice 0 — Campaign Doc Rewrite and Source-of-Truth Alignment

Status: planned.

Goal:

Create this campaign doc as the durable source of truth and align hot-path docs before implementation.

Scope:

- Replace the package-style `ai-care-setup-campaign-docs.md` with a clean `docs/campaigns/ai-care-setup.md`, or convert the existing file if preferred.
- Update `docs/current-task.md` so it no longer points to stale active work.
- Update `docs/roadmap.md` to list this campaign as planned or active, depending on product-owner approval.
- Document all scope, non-goals, profile levels, matching behavior, coverage waves, validation, and stop conditions.
- Do not change app code.

Acceptance criteria:

- Campaign doc is comprehensive enough for autonomous Codex handoffs.
- Hot-path docs agree on campaign status.
- Profile coverage strategy includes Waves 1, 2, and 3 in the same campaign.
- Watering cadence philosophy is explicit.
- AI and care guardrails are explicit.
- Build is skipped if no code changed.

Validation:

- Docs-only consistency review.
- Targeted search for stale active campaign references.
- Targeted search for stale `ai-care-setup-campaign-docs.md` package references.
- Report if build was skipped because no code changed.

Manual QA:

- Product owner reviews campaign direction and confirms this is the desired next campaign.

Stop conditions:

- Hot-path docs disagree and cannot be reconciled.
- Campaign depends on unmerged work without clear sequencing.
- Scope drifts into diagnosis, encyclopedia, or auto-applied AI care.

### Slice 1 — Care Profile Data Foundation

Status: planned.

Goal:

Add the internal care profile reference data model and lookup helpers without changing user-facing flows.

Scope:

- Add `care_profiles`.
- Add `care_profile_aliases`.
- Add profile-level support:
  - species
  - genus
  - care_group
  - fallback
- Add normalization helpers.
- Add lookup helpers.
- Add basic ambiguity handling.
- Add minimal seed profiles and care groups.
- Do not change `plants`.
- Do not change Pl@ntNet UI.
- Do not expose suggestions yet.

Acceptance criteria:

- Migration is additive and safe.
- Profiles can be looked up by scientific name, synonym, common name, and alias.
- Genus and care-group profiles are representable.
- Ambiguous aliases do not produce unsafe automatic matches.
- Existing plant flows still work.
- Architecture docs describe the reference data model.

Validation:

- `npm run typecheck` if present.
- `npm test` if present.
- `npm run build`.
- `npm run lint` if present.
- Migration/RLS/reference-data review.

Manual QA:

- Existing plant profile renders.
- Existing identification helper still renders.
- Existing watering dashboard still renders.
- Seed lookups can be exercised through helper tests or temporary targeted checks.

Stop conditions:

- Existing plant records require destructive migration.
- Ambiguous match handling is unclear.
- Reference data becomes user-owned by mistake.

### Slice 2 — Seed Workflow and Coverage Wave 1

Status: planned.

Goal:

Create repeatable seed tooling and add the first meaningful coverage wave.

Scope:

- Add structured seed source, such as JSON or TypeScript fixtures.
- Add validation for required profile fields.
- Add duplicate alias detection.
- Add the Coverage Wave 1 profiles, genus profiles, and care groups.
- Include source/review metadata.
- Keep care copy concise and beginner-friendly.
- Do not add admin UI.

Acceptance criteria:

- Coverage Wave 1 includes roughly 25–40 practical profiles/aliases.
- Seed validation catches missing fields and duplicate aliases.
- Each profile has:
  - profile level
  - display name
  - aliases
  - default check cadence
  - optional min/max range
  - dryness preference
  - watering guidance
  - review status
  - review confidence
- No long copied source prose appears in user-facing profile content.
- Docs explain how to expand profiles.

Validation:

- Seed validation.
- `npm run typecheck` if present.
- `npm test` if present.
- `npm run build`.
- `npm run lint` if present.

Manual QA:

- Spot-check at least 10 Wave 1 profiles.
- Confirm common aliases map as expected.
- Confirm duplicate/ambiguous aliases are reported.

Stop conditions:

- Seed source quality is unclear.
- Care copy becomes too long or encyclopedia-like.
- Seed tooling becomes a broad admin platform.

### Slice 3 — Identification Confidence and Grouped Recommendations

Status: planned.

Goal:

Make identification suggestions easier for beginners to understand and choose from.

Scope:

- Display Pl@ntNet match scores as percentages.
- Use conservative match labels:
  - Strong match
  - Possible match
  - Low-confidence match
- Group candidates with the same normalized common name when safe.
- Show alternate scientific names in compact details.
- Improve retry/manual copy for low-confidence and no-result cases.
- Preserve edit/reject/manual flows.
- Keep raw provider responses transient by default.

Acceptance criteria:

- Candidate cards are clearer and less repetitive.
- Score display never claims accuracy.
- Similar common-name candidates collapse into a single card when safe.
- Different care-behavior candidates remain separate.
- Low-confidence results guide the user to retry or continue manually.
- User can still edit common/scientific names before saving.

Validation:

- `npm run typecheck` if present.
- `npm test` if present.
- `npm run build`.
- `npm run lint` if present.

Manual QA:

- High-confidence result.
- Low-confidence result.
- Duplicate common-name candidates.
- Different common-name candidates.
- No-candidate result.
- Provider error.
- Edit before save.
- Reject and continue manually.
- Mobile viewport.

Stop conditions:

- Grouping hides materially different choices.
- Score copy implies certainty.
- Manual override regresses.

### Slice 4 — Care Profile Match After Accepted Identity

Status: planned.

Goal:

Connect accepted plant identity to internal care profile matching.

Scope:

- After user accepts or edits identity, attempt care profile lookup.
- Match by scientific name, synonym, common name, alias, genus, and care group.
- Return:
  - exact profile match
  - genus match
  - care-group match
  - ambiguous match
  - no match
- Add conservative user-facing copy for each state.
- Do not apply watering fields yet unless explicitly included as preview-only.
- Do not create reminders.

Acceptance criteria:

- Exact species match works.
- Synonym match works.
- Common-name alias match works.
- Genus fallback works.
- Care-group fallback can be represented.
- Ambiguous matches are not auto-applied.
- No-match state gracefully invites manual setup.
- Ownership checks remain server-derived.

Validation:

- `npm run typecheck` if present.
- `npm test` if present.
- `npm run build`.
- `npm run lint` if present.
- Unit tests for normalization and matching if test tooling exists.

Manual QA:

- Snake plant synonym match.
- Pothos common-name match.
- Monstera exact match.
- Philodendron genus match.
- Succulent care-group fallback.
- Ambiguous alias.
- No match.

Stop conditions:

- Ambiguous names are treated as exact.
- Lookup requires live provider calls.
- Ownership checks become unclear.

### Slice 5 — Reviewable Watering Starting Point UI

Status: planned.

Goal:

Show a care suggestion card and let users apply editable watering basics.

Scope:

- Show suggestion after matched profile.
- Include:
  - suggested check cadence
  - optional min/max range
  - dryness preference
  - watering guidance
  - concise caveat about home conditions
- Actions:
  - Use these care basics
  - Edit first
  - Skip for now
- Apply only:
  - `plants.watering_interval_days`
  - `plants.watering_guidance`
- Protect existing user-entered values from silent overwrite.
- No automatic reminders.

Acceptance criteria:

- Suggestion card is concise and mobile-friendly.
- User can apply suggested watering interval/guidance.
- User can skip.
- User can edit later.
- Existing values require confirmation before overwrite.
- Dashboard next-date behavior uses existing interval logic after apply.
- Copy says check cadence, not strict watering command.

Validation:

- `npm run typecheck` if present.
- `npm test` if present.
- `npm run build`.
- `npm run lint` if present.

Manual QA:

- Empty watering fields.
- Existing watering fields.
- Apply suggestion.
- Skip suggestion.
- Edit after applying.
- Mark watered after applying.
- Dashboard next-date behavior.
- Mobile layout.

Stop conditions:

- Suggestions auto-apply.
- Existing user-entered care is overwritten silently.
- Copy implies guaranteed watering schedule.

### Slice 6 — Fallback Watering Setup Questions

Status: planned.

Goal:

Provide useful guidance when exact profile matching fails.

Scope:

- Add a lightweight fallback setup path.
- Ask simple watering-relevant questions.
- Map answers to fallback care groups.
- Suggest a conservative check cadence.
- Let user apply, edit, or skip.
- Keep fallback optional.

Example questions:

```txt
Does this plant have thick, fleshy leaves?
Does it look like a cactus or succulent?
Does it seem tropical with thin/soft leaves?
Does it prefer staying moist, such as a fern?
Is it planted in bark, such as an orchid?
```

Acceptance criteria:

- No-match users can still get a useful conservative starting point.
- Fallback does not pretend to know the exact plant.
- Fallback suggestions use care groups.
- User can skip and enter manually.
- Applied fallback values remain editable.

Validation:

- `npm run typecheck` if present.
- `npm test` if present.
- `npm run build`.
- `npm run lint` if present.

Manual QA:

- No profile match.
- Low-confidence identity.
- Succulent-like fallback.
- Tropical fallback.
- Fern/moisture-loving fallback.
- Orchid fallback.
- Skip fallback.
- Mobile layout.

Stop conditions:

- Fallback questions become a long wizard.
- Fallback copy overclaims certainty.
- Manual setup is hidden.

### Slice 7 — Optional Reminder Handoff

Status: planned.

Goal:

After a user applies a watering starting point, optionally help them turn it into an app-owned reminder.

Scope:

- If no reminder exists, offer to set one using the applied cadence.
- If a reminder exists, offer to review it.
- Use the existing reminder model.
- Do not auto-create reminders.
- Do not directly create calendar events except through existing reminder sync.
- Preserve Google Calendar as one-way reflection.

Acceptance criteria:

- Applying care does not automatically create a reminder.
- User can explicitly create/review reminder.
- Existing reminders are not overwritten silently.
- Calendar sync behavior remains unchanged.
- User can decline and continue.

Validation:

- `npm run typecheck` if present.
- `npm test` if present.
- `npm run build`.
- `npm run lint` if present.

Manual QA:

- No existing reminder.
- Existing after-watering reminder.
- Existing fixed schedule reminder.
- Google Calendar disconnected.
- Google Calendar connected.
- Decline reminder handoff.
- Mobile layout.

Stop conditions:

- Reminder becomes mandatory.
- Calendar becomes source of truth.
- Existing reminders are overwritten without consent.

### Slice 8 — Add Plant / Photo-First Integration

Status: planned.

Goal:

Bring the improved identification and care suggestion flow into Add Plant when photo-first Add Plant exists on the target branch.

Scope:

- Integrate grouped identification into Add Plant photo flow.
- Let user accept/edit identity before save.
- After plant save, match care profile.
- Show reviewable care suggestion.
- Apply only after user action.
- Preserve manual Add Plant path.
- Preserve photo-optional flow.

Acceptance criteria:

- Manual Add Plant still works without photo or AI.
- Photo-first flow can show improved identification recommendations.
- User can save plant without accepting AI.
- User can apply or skip care suggestions.
- Failed AI does not block plant creation.
- Failed photo upload does not lose saved plant.

Validation:

- `npm run typecheck` if present.
- `npm test` if present.
- `npm run build`.
- `npm run lint` if present.

Manual QA:

- Manual Add Plant.
- Photo selected, no AI.
- Photo selected, high-confidence AI.
- Photo selected, low-confidence AI.
- AI provider error.
- Care suggestion applied.
- Care suggestion skipped.
- Photo upload failure handling.

Stop conditions:

- Photo-first foundation is not present on target branch.
- Add Plant becomes AI-required.
- Failed AI blocks plant creation.

### Slice 9 — Coverage Wave 2 Expansion

Status: planned.

Goal:

Expand profile coverage so the app feels useful for most average houseplant collections.

Scope:

- Add the Coverage Wave 2 profile set.
- Add aliases for common retail names and messy common names.
- Improve genus profile coverage.
- Improve ambiguity handling based on Wave 1 QA.
- Keep care copy concise.
- Update docs with coverage metrics.

Acceptance criteria:

- Total practical coverage reaches roughly 75–100 profiles/aliases.
- Expanded aliases improve match rates.
- Ambiguous names remain safely handled.
- No profile turns into a long encyclopedia entry.
- Seed validation passes.
- QA list coverage improves measurably.

Validation:

- Seed validation.
- `npm run typecheck` if present.
- `npm test` if present.
- `npm run build`.
- `npm run lint` if present.

Manual QA:

- At least 25 Wave 2 plants/aliases.
- At least 5 ambiguous aliases.
- At least 5 genus fallback cases.
- At least 5 no-match/fallback cases.
- Mobile care suggestion UI.

Stop conditions:

- Profile quality becomes unreliable.
- Source/review metadata is missing.
- Expansion requires new unapproved admin tooling.

### Slice 10 — Coverage Wave 3 Broad Coverage and QA Hardening

Status: planned.

Goal:

Complete the campaign by broadening houseplant coverage and hardening the end-to-end experience.

Scope:

- Add the Coverage Wave 3 profile/alias set.
- Focus on common retail plants, common misidentifications, and QA-discovered gaps.
- Strengthen care-group fallback behavior.
- Improve copy where user confusion appears likely.
- Verify complete identification-to-watering flow.
- Update architecture/current-task/roadmap docs to reflect completed campaign state.

Acceptance criteria:

- Total practical coverage reaches roughly 150–250 profiles/aliases.
- Most QA sample plants receive useful guidance through species, genus, care group, or fallback.
- Manual setup remains clear.
- No broad encyclopedia browsing is introduced.
- Campaign docs and hot-path docs reflect completed state.
- Product owner can QA the full end-to-end campaign branch stack.

Validation:

- Seed validation.
- `npm run typecheck` if present.
- `npm test` if present.
- `npm run build`.
- `npm run lint` if present.
- Full campaign regression QA.

Manual QA:

- First 25 Wave 1 examples.
- At least 25 Wave 2 examples.
- At least 25 Wave 3 examples.
- At least 10 exact species matches.
- At least 10 genus matches.
- At least 10 care-group fallback cases.
- At least 10 no-match/manual paths.
- High-confidence Pl@ntNet.
- Low-confidence Pl@ntNet.
- Duplicate candidate grouping.
- Existing user-entered watering fields.
- Reminder handoff.
- Mobile and desktop.

Stop conditions:

- Coverage expansion reduces trust or quality.
- Profiles become too generic to be useful.
- Campaign cannot be validated without excessive manual intervention.
- Docs cannot accurately describe the implemented behavior.

## Campaign validation and QA expectations

### Required validation for implementation slices

Run the scripts that exist in `package.json`:

```txt
npm run typecheck if present
npm test if present
npm run build
npm run lint if present
```

For docs-only slices:

```txt
targeted doc consistency search
stale status search
report build skipped because no code changed
```

For schema/data slices:

```txt
migration review
RLS / permission review
seed validation
lookup validation
ambiguity validation
```

### Campaign-level manual QA matrix

QA should include:

```txt
existing plant with no photo
existing plant with photo
manual identification skip
Pl@ntNet high-confidence result
Pl@ntNet low-confidence result
Pl@ntNet no result
Pl@ntNet provider error
duplicate common-name candidates
different common-name candidates
accepted identity exact species match
accepted identity synonym match
accepted identity common-name match
accepted identity genus match
accepted identity care-group fallback
ambiguous care match
no care profile match
fallback question flow
apply suggested watering basics
skip suggested watering basics
protect existing user-entered watering fields
edit care basics after apply
mark watered after apply
dashboard next-date behavior
optional reminder handoff
Google Calendar connected
Google Calendar disconnected
mobile viewport
desktop viewport
signed-out route protection
cross-user data boundaries where practical
```

## Documentation expectations

Every slice should update:

```txt
docs/current-task.md
docs/campaigns/ai-care-setup.md
```

Update `docs/architecture.md` when:

- care profile tables are added
- alias/matching behavior is implemented
- identification grouping behavior changes
- care suggestion apply behavior is implemented
- fallback watering questions are implemented
- reminder handoff is implemented
- Add Plant integration is implemented

Update `docs/roadmap.md` when:

- campaign status changes
- slice status changes
- campaign completes
- follow-up work is deferred

Update `docs/product.md` only if product guardrails or V1 product direction changes.

## Final reporting expectations

Each Codex final report should include:

```txt
Project
Branch
Commit
Merged to main
Active campaign
Slice completed
Completed work
Files changed
Validation results
Documentation delta
Manual QA needed
Known risks
Next recommended action
Compact state packet
```

## Campaign stop conditions

Stop and report if:

- hot-path docs disagree on active campaign or active slice
- target branch does not include required prerequisite work for the slice
- schema work would destructively alter existing user-owned plant records
- RLS or ownership boundaries become unclear
- Pl@ntNet score is presented as accuracy or certainty
- care suggestions are applied without user review
- existing user-entered care fields are overwritten silently
- copy implies diagnosis, treatment, or guaranteed watering precision
- a live external care provider becomes required for the user-facing setup flow
- seed data source/review quality is unclear
- profile expansion becomes encyclopedia-first
- manual setup becomes hidden or degraded
- validation fails

## Campaign completion criteria

The campaign is complete when:

- identification results are clearer and less repetitive
- match scores and confidence labels are understandable and conservative
- internal care profiles exist with species, genus, care-group, and fallback coverage
- profile seed workflow is repeatable and validated
- Coverage Waves 1, 2, and 3 are implemented in the campaign
- most average houseplant QA examples receive useful guidance
- accepted identity can match care profiles safely
- ambiguous matches are handled conservatively
- no-match cases still guide users with fallback watering setup
- users can review and apply editable watering starting points
- optional reminder handoff works without making reminders mandatory
- manual setup remains first-class
- docs accurately describe implemented state
- product-owner QA approves the full end-to-end flow

## Follow-up backlog

These are not part of this campaign unless explicitly promoted:

- Admin UI for editing care profiles.
- Import tooling for large external datasets.
- Automated taxonomic reconciliation against WFO / POWO / Wikidata.
- User feedback loop: “too soon / too late / just right.”
- Adaptive watering based on history and season.
- Pot size, soil type, light level, and room condition personalization.
- Multi-photo identification.
- Plant health support.
- Pest/disease/treatment guidance.
- Toxicity detail pages.
- Care profile versioning with user notification.
- Analytics dashboard for no-match and low-confidence cases.
- Household/shared plant ownership.
- Outlook sync.

## Recommended first handoff

Start with a docs-only handoff:

```txt
Slice 0 — Campaign Doc Rewrite and Source-of-Truth Alignment
```

After Slice 0, proceed to:

```txt
Slice 1 — Care Profile Data Foundation
Slice 2 — Seed Workflow and Coverage Wave 1
```

Do not start UI care suggestions until the care profile model and seed workflow are stable.

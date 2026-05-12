# Plant Care Campaign — Onboarding, Rooms, Settings, and Photo-First Add Plant

Status: **draft / planned / not started**.

No first slice has been selected yet.

## Recommendation

Build this as a follow-up campaign now that the UI Redesign UX Overhaul campaign has been merged and archived.

This campaign adds the product structure the redesign now implies:

```txt
onboarding → room setup → photo-first add plant → optional PlantNet help → app-owned reminders → settings-managed calendar sync
```

## Why this campaign exists

Manual QA identified several larger opportunities that should not be included in the narrow QA polish patch because they are new product and data-model work:

1. Onboarding workflow.
2. Room management settings and room dropdown data model.
3. Google Calendar relocation to Settings.
4. Photo-first Add Plant flow with pre-save PlantNet support.

## Source references

Read before implementation:

```txt
AGENTS.md
docs/product.md
docs/architecture.md
docs/roadmap.md
docs/current-task.md
docs/design/plant-care-brand-reference.md
docs/design/ui-redesign-visual-reference.md
docs/design/ui-redesign-implementation-reference.md
docs/campaigns/archived/ui-redesign-ux-overhaul.md
```

## Product guardrails

Preserve:

- watering-first UX
- personal plant collection
- editable care guidance
- user-owned data and route protection
- conservative AI assistance
- app-owned reminders
- Google Calendar as a one-way reflection of app-owned reminders
- mobile-first layouts
- calm empty/loading/error states

Do not add:

- authoritative health diagnosis
- AI-controlled care truth
- calendar-first reminder truth
- generic task management
- broad encyclopedia features
- Outlook support
- bidirectional calendar sync
- unrelated schema churn

## Included scope

- Skippable first-run onboarding.
- Optional room setup during onboarding.
- User-managed rooms in Settings.
- Room dropdown / add-new-room behavior in Add/Edit Plant.
- Google Calendar integration relocated to Settings as an account/app-level surface.
- Photo-first Add Plant flow.
- Pre-save PlantNet identification from a staged photo.
- User review/accept/reject of AI suggestions before saving plant data.
- Manual plant creation remains available.

## Not included

- Health Check feature.
- Plant disease diagnosis.
- Calendar-owned reminders.
- Room floorplan/map UI.
- Notification delivery.
- Multi-user households.
- Room-level reminders.
- Required room setup.
- Required AI identification.

## UX principles

### Onboarding

Onboarding should be short, useful, and skippable.

Recommended steps:

1. Welcome / value statement.
2. Optional room setup.
3. Optional first plant photo.
4. Finish into Add Plant or Today.

Do not force users to add rooms or photos before they can use the app.

### Room management

Rooms should improve consistency without becoming bureaucracy.

Rules:

```txt
If rooms exist:
  Add/Edit Plant shows a room dropdown.

If user needs a new room:
  Provide inline Add room.

If no rooms exist:
  Allow free entry or quick room creation.

If plant has no room:
  Show Unassigned calmly.
```

### Google Calendar relocation

Move Google Calendar setup to Settings because it is account/app-level integration behavior.

Plant detail should not carry a full Google Calendar setup panel. Plant detail may show lightweight status only:

```txt
Reminder on
Calendar sync enabled
Managed in Settings
```

Reminder ownership remains app-owned and plant-specific.

### Photo-first Add Plant

Recommended flow:

```txt
Add photo
Identify if helpful
Review suggestion
Save plant
```

Manual entry remains available. PlantNet suggestions are optional help, not truth.

Recommended copy:

```txt
Add a photo first
A photo helps you recognize this plant and can help with identification.

Identification suggestions are optional.
Review and edit everything before saving.
```

## Proposed data model

This campaign likely requires migration-safe schema work.

### Rooms

Recommended table:

```txt
plant_rooms
```

Suggested fields:

```txt
id uuid primary key
user_id uuid not null references auth.users(id)
name text not null
sort_order integer null
created_at timestamptz not null default now()
updated_at timestamptz not null default now()
archived_at timestamptz null
```

Recommended constraints:

```txt
unique active room name per user, case-insensitive if practical
RLS: user owns room through user_id
```

### Plants room relation

Preferred approach:

```txt
plants.room_id nullable uuid references plant_rooms(id)
```

Migration notes:

- Preserve existing `plants.location` values.
- Backfill rooms from distinct non-empty `location` values per user.
- Set `room_id` where matching backfilled room exists.
- Keep `location` temporarily for backward compatibility.
- Do not drop `location` in the first room migration unless explicitly approved.

### Pre-save photo staging

Pre-save PlantNet needs an ownership-safe model because current photo behavior may depend on an owned plant.

Option A: temporary staged upload table.

```txt
plant_photo_drafts
```

Fields:

```txt
id uuid primary key
user_id uuid not null
storage_path text not null
plantnet_result jsonb null
created_at timestamptz not null default now()
expires_at timestamptz not null
consumed_at timestamptz null
```

Option B: create a draft plant first, then attach photo and identify.

Recommendation:

Start with Option B only if draft plants already fit the schema. Otherwise use Option A with strict owner-scoped RLS and expiration. Do not implement pre-save uploads without a clear ownership and cleanup model.

## Campaign slices

### Slice 1 — Onboarding shell and first-run routing

Goal: Add a short, skippable onboarding surface for new users.

Scope:

- Detect first-run state.
- Add onboarding route/surface.
- Welcome/value step.
- Skip/complete behavior.
- Route user to Today/Add Plant afterward.
- Persist onboarding completion.

Acceptance criteria:

- New user sees onboarding.
- Returning user does not repeatedly see onboarding.
- User can skip.
- Completion persists per user.
- Existing users are not blocked.

### Slice 2 — Room data model and migration

Goal: Introduce user-owned rooms and connect plants to rooms.

Scope:

- Add room table.
- Add nullable plant room relation.
- Backfill rooms from existing location values.
- Add RLS policies.
- Add server helpers/actions.
- Preserve existing location behavior during transition.

Acceptance criteria:

- Existing plant location data is preserved.
- Users can only access their own rooms.
- Plants can have no room.
- Migrations and build pass.
- No cross-user leakage.

### Slice 3 — Room management settings

Goal: Add room management to Settings.

Scope:

- Settings page section for Rooms.
- List rooms.
- Add room.
- Rename room.
- Archive/delete room safely.
- Show Unassigned behavior where relevant.

Acceptance criteria:

- User can manage rooms from Settings.
- Duplicate room names are handled.
- Existing plants remain assigned when room is renamed.
- Archiving a room handles assigned plants safely.

### Slice 4 — Room dropdown in Add/Edit Plant

Goal: Use managed rooms in plant forms.

Scope:

- Add/Edit Plant room dropdown.
- Inline Add room option.
- Unassigned option.
- Migration fallback for old `location`.
- Preserve manual flow.

Acceptance criteria:

- User can select existing room.
- User can add a room inline.
- User can leave plant unassigned.
- Home/Plants room grouping uses room names consistently.

### Slice 5 — Settings-managed Google Calendar integration

Goal: Move Google Calendar setup and integration controls to Settings.

Scope:

- Settings calendar section.
- Connect/disconnect/status.
- Keep Google Calendar as one-way reflection of app-owned reminders.
- Plant detail shows lightweight calendar status only when relevant.
- Reminder panels continue to manage plant-level reminder state.

Acceptance criteria:

- Calendar setup is available in Settings.
- Plant detail no longer has a heavy calendar setup panel.
- Existing sync behavior still works.
- Reminder ownership remains app-owned.

### Slice 6 — Photo-first Add Plant foundation

Goal: Restructure Add Plant to lead with photo while preserving manual entry.

Scope:

- Add Plant begins with photo affordance.
- Manual entry remains available.
- Photo can be associated with final plant.
- If staged upload is needed, implement ownership-safe staging.
- Clear required fields.

Acceptance criteria:

- User can add plant manually.
- User can start with photo.
- Required fields are clear.
- Abandoned draft/staged photo state is safe.

### Slice 7 — Pre-save PlantNet identification

Goal: Allow optional PlantNet help before final plant save.

Scope:

- Trigger PlantNet from staged/new plant photo.
- Show names-only suggestions.
- User reviews/accepts/rejects.
- Suggestions populate editable fields only after user action.
- No authoritative care claims.
- Save final plant with photo and accepted/edited details.

Acceptance criteria:

- User can identify from photo before save.
- User can reject and continue manually.
- User can edit accepted suggestions.
- AI copy remains conservative.
- Storage and AI requests remain owner-scoped.

### Slice 8 — Onboarding room/photo integration polish

Goal: Connect onboarding to room setup and first plant/photo flow.

Scope:

- Onboarding can collect initial room names.
- Onboarding can route to photo-first Add Plant.
- Returning users can manage rooms in Settings.
- Empty states reference onboarding progress where useful.

Acceptance criteria:

- Onboarding feels useful but skippable.
- New user can add rooms quickly.
- New user can add first plant/photo quickly.
- Existing users are not disrupted.

## Manual QA checklist

- New user onboarding.
- Skip onboarding.
- Returning user does not see onboarding loop.
- Add room in onboarding.
- Add room in Settings.
- Rename room.
- Archive/delete room with assigned plants.
- Add plant with existing room.
- Add plant with new inline room.
- Add plant with no room.
- Existing plants retain migrated room/location.
- Home groups plants by room.
- Plants tab groups plants by room.
- Settings calendar connect/disconnect.
- Reminder with calendar sync still works.
- Plant detail shows reminder/calendar status without heavy setup panel.
- Add plant manually.
- Add plant photo-first.
- Pre-save PlantNet suggestion.
- Reject AI suggestion.
- Accept AI suggestion and edit fields.
- Abandon staged photo/draft.
- Private storage and owner-scoping sanity checks.

## Validation expectations

For implementation slices:

```txt
npm run typecheck
npm test
npm run build
npm run lint
```

Only run scripts that exist, but build is required for implementation work.

For migration slices, also validate migrations and RLS behavior in the configured local/preview workflow.

## Stop conditions

Stop and report if:

- room model requires destructive migration
- existing plant location data would be lost
- staged photo ownership is unclear
- pre-save PlantNet requires public storage access
- AI suggestions would be saved without review
- Google Calendar behavior becomes calendar-owned
- schema/RLS changes cannot be made safely
- validation fails
- onboarding blocks existing users

# Plant Care Campaign — Onboarding, Rooms, Settings, and Photo-First Add Plant Foundation

Status: **active**.

Slice 8 is implemented on branch `campaign/onboarding-rooms-s8-onboarding-polish`; awaiting review/merge.

Pre-merge QA patches are implemented on the same branch.

Product-owner selected implementation sequence for this autonomous campaign run:

```txt
1. Onboarding shell and first-run routing
2. Room data model and migration
3. Room management in Settings
4. Room dropdown in Add/Edit Plant
5. Settings-managed Google Calendar integration
6. Photo-first Add Plant foundation
7. Pre-save Pl@ntNet identification
8. Onboarding room/photo integration polish
```

## Recommendation

Run this as the next foundation campaign before the AI Care Setup campaign.

This campaign should make the app easier to enter, organize, and configure:

```txt
first-run onboarding
→ optional setup progress checklist
→ optional room setup
→ managed rooms in Settings
→ room-aware Add/Edit Plant
→ Settings-managed Google Calendar connection
→ photo-first Add Plant foundation
→ optional identity-only Pl@ntNet help before save
```

This campaign should **not** implement the richer AI Care Setup vision. The next AI Care Setup campaign owns:

```txt
improved identification confidence display
→ grouped/scored recommendations
→ internal care_profiles table
→ care profile matching
→ suggested watering/care starting points
→ review/apply editable care basics
```

## Objective and target state

### Objective

Improve the product structure around first-run setup, room organization, Settings, and photo-first plant creation so the existing watering-first loop is easier for new and returning users to use.

The target state is a calm, mobile-first setup experience where a signed-in user can:

- enter a short skippable onboarding flow
- see a lightweight Getting Started checklist after onboarding
- optionally create room names
- manage rooms later in Settings
- assign plants to rooms consistently
- connect/disconnect Google Calendar from Settings
- understand calendar sync status and that Plant Care remains the source of truth
- start Add Plant with a photo or manual entry
- optionally use Pl@ntNet for identity suggestions before saving
- review/edit/reject identity suggestions before plant creation
- continue manually without AI

### Product target state

By the end of this campaign:

- Onboarding is short, skippable, and per-user.
- Users can revisit setup from Settings without triggering an onboarding loop.
- A Getting Started checklist helps users complete setup without forcing it.
- Rooms are user-owned records, not only free-text plant locations.
- Existing `plants.location` values are preserved and migrated safely.
- Add/Edit Plant uses room records where available while preserving Unassigned.
- Settings becomes the home for account/app-level controls, including Account, Rooms, Reminders & Calendar, Setup, and Help/App Info.
- Google Calendar status in Settings shows connection state, sync health, and conservative copy.
- Plant detail keeps plant-level reminder controls but no longer carries heavy Google Calendar setup.
- Add Plant can begin with photo capture/upload, but manual creation remains equally available.
- Pre-save Pl@ntNet support is identity-only and conservative.
- Photo-first Add Plant previews the selected image immediately and uses the same selected file for optional identification and final primary-photo save.
- Add Plant now uses one sequential, skippable photo-first setup flow instead of separate manual/photo choice cards.
- The Getting Started checklist is primarily on Today when setup is incomplete; Settings keeps a lightweight setup review entry.
- Add/Edit Plant requires a nickname. Common and scientific names remain optional.
- Fixed schedule watering reminders can be saved without a watering interval; after-watering reminders still require an interval so they can recalculate from watering history.
- No AI care guidance or suggested watering cadence is introduced in this campaign.

## Current state and source-of-truth notes

### Hot-path source of truth

Before each slice, Codex must inspect:

```txt
AGENTS.md
docs/product.md
docs/architecture.md
docs/roadmap.md
docs/current-task.md
docs/campaigns/onboarding-rooms-settings-photo-first-ai.md
docs/campaigns/ai-care-setup-campaign-docs.md
```

Also inspect design references when UI work is included:

```txt
docs/design/plant-care-brand-reference.md
docs/design/ui-redesign-visual-reference.md
docs/design/ui-redesign-implementation-reference.md
docs/campaigns/archived/ui-redesign-ux-overhaul.md
```

### Current implemented state

The app already has:

- Next.js App Router, TypeScript, Tailwind, Supabase Auth/Postgres/Storage, and Vercel.
- Public landing, Supabase login, protected `/app`, and signed-in shell.
- Home / Plants / Settings bottom navigation.
- Manual plant create/edit/archive flows.
- User-owned `plants` table with RLS and soft archive behavior.
- Plant profile/detail route.
- Watering events, mark-watered behavior, watering history, reminder-aware urgency, and dashboard sections.
- Primary plant photo upload via private Supabase Storage.
- Optional Pl@ntNet-backed identification helper from an owned primary photo.
- App-owned watering reminders.
- One-way Google Calendar sync as a reflection of app-owned reminders.

### Current active status

The product owner selected this campaign for implementation. Slice 8 is implemented on `campaign/onboarding-rooms-s8-onboarding-polish` and awaits review/merge.

### Roadmap status

The roadmap lists this campaign as active, with Slice 8 onboarding room/photo integration polish implemented and product-owner QA planned next.

### AI Care Setup alignment note

`ai-care-setup-campaign-docs.md` defines a later AI care setup campaign focused on:

- clearer Pl@ntNet confidence and grouped recommendations
- internal curated `care_profiles`
- matching accepted identity to care profiles
- reviewable suggested watering/care basics
- applying only editable plant fields after user action

This campaign should avoid those areas. It may create the safe photo-first/staged-photo foundation that the later AI campaign can reuse.

### Doc conflict / stale-area note

There is no direct implementation-status conflict in the hot-path docs.

The main stale-area risk is roadmap visibility: `ai-care-setup-campaign-docs.md` exists on `main`, but `docs/roadmap.md` may not yet list it under draft/candidate campaigns. Do not treat AI Care Setup as active until roadmap/current-task are updated.

## Scope and non-goals

### Included scope

- Skippable first-run onboarding.
- Per-user onboarding completion state.
- Settings-managed setup/onboarding controls.
- Lightweight Getting Started checklist.
- Optional room setup during onboarding.
- Suggested room chips during onboarding.
- User-owned room data model.
- Migration/backfill from existing `plants.location`.
- User-facing review state for backfilled rooms.
- Settings room management.
- Room dropdown and inline Add room behavior in Add/Edit Plant.
- Room-aware Home and Plants grouping.
- Settings information architecture for:
  - Account
  - Rooms
  - Reminders & Calendar
  - Setup
  - Help & App Info
- Settings-managed Google Calendar connect/disconnect/status.
- Calendar sync health/status copy in Settings.
- Lightweight plant-detail calendar status only.
- Privacy/ownership reassurance in Settings.
- Photo-first Add Plant foundation.
- Ownership-safe staged photo/draft model if needed.
- Optional pre-save Pl@ntNet identity suggestions.
- User review/edit/reject/manual override before saving.
- Manual Add Plant remains fully available.

### Explicit non-goals

- No internal `care_profiles` table.
- No suggested watering cadence from plant type.
- No AI-generated care basics.
- No AI-applied `watering_interval_days`.
- No AI-applied `watering_guidance`.
- No improved Pl@ntNet grouped/scored recommendation UI beyond what is needed for safe identity selection.
- No health diagnosis.
- No pest/disease/treatment guidance.
- No encyclopedia-style plant profile pages.
- No notification delivery.
- No Outlook sync.
- No bidirectional calendar sync.
- No calendar-owned reminder model.
- No room-level reminders.
- No room floorplan/map UI.
- No multi-user households.
- No required onboarding, required rooms, required photos, or required AI.
- No gamification, streaks, motivational scoring, or broad checklist mechanics outside initial setup.

### Product guardrails

Preserve:

- watering-first UX
- personal plant collection
- editable care guidance
- user-owned data and route protection
- conservative AI assistance
- app-owned reminders
- Google Calendar as one-way reflection of app-owned reminders
- mobile-first layouts
- calm empty/loading/error states
- beginner-friendly copy

Do not allow this campaign to become:

- AI-first setup
- calendar-first reminder architecture
- generic task management
- broad plant encyclopedia
- authoritative diagnosis/care engine
- a mandatory setup wizard

## UX principles

### Onboarding

Onboarding should be short, useful, and skippable.

Recommended first-run path:

```txt
Welcome
→ optional room setup
→ choose first plant path
→ finish to Add Plant or Today
```

Onboarding should offer three clear first-plant choices:

```txt
Add manually
Start with a photo
Skip for now
```

Rules:

- Do not force room setup.
- Do not force plant creation.
- Do not force photo upload.
- Do not force AI identification.
- Do not trap users in onboarding.
- Do not show onboarding repeatedly after completion.
- Let users revisit setup from Settings.

Recommended onboarding copy:

```txt
Let’s set up your plant care space.
Add rooms, start your first plant, or skip and come back later.
```

### Getting Started checklist

After onboarding, show a calm setup checklist on Today and/or Settings.

Recommended checklist items:

```txt
Add your first plant
Add a room
Set a watering reminder
Add a photo
Connect Google Calendar
```

Checklist rules:

- Completion should derive from real app state where possible.
- Items should be optional.
- Checklist should be dismissible or naturally disappear once complete.
- Do not turn this into gamification, streaks, or scoring.
- Do not create generic task-management behavior.
- Do not block the watering dashboard.

### Room setup

Rooms should improve consistency without becoming bureaucracy.

Recommended onboarding quick chips:

```txt
Living room
Bedroom
Kitchen
Bathroom
Office
Balcony
```

Rules:

```txt
If rooms exist:
  Add/Edit Plant shows a room dropdown.

If user needs a new room:
  Provide inline Add room.

If no rooms exist:
  Allow Unassigned and offer quick room creation.

If plant has no room:
  Show Unassigned calmly.
```

### Settings

Settings should become the app’s home base for account/app-level controls.

Recommended Settings structure:

```txt
Settings
- Account
- Rooms
- Reminders & Calendar
- Setup
- Help & App Info
```

#### Account

Include:

- signed-in email, if available
- sign out
- small privacy reassurance

Recommended copy:

```txt
Your plants, rooms, photos, and reminders are private to your account.
```

#### Rooms

Include:

- list rooms
- add room
- rename room
- archive room
- assigned plant count if practical
- review state after backfilled rooms are created from legacy locations

Recommended migration/review copy:

```txt
We organized your existing plant locations into rooms. Review them anytime.
```

#### Reminders & Calendar

Include:

- app reminders explanation
- Google Calendar connection state
- connect/disconnect controls
- last synced, if available
- sync issue, if any
- conservative source-of-truth copy

Recommended copy:

```txt
Plant Care reminders stay in Plant Care. Google Calendar is a one-way reflection.
```

#### Setup

Include:

- Getting Started checklist
- Restart/review setup
- Mark onboarding complete, if appropriate
- Add first plant
- Manage rooms
- Connect calendar

#### Help & App Info

Keep lightweight.

Possible content:

- app version/build info if available
- “About Plant Care”
- conservative AI reminder

Recommended copy:

```txt
Plant identification suggestions are optional. Review and edit everything before saving.
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
Choose add path
→ Add photo, if desired
→ Identify if helpful
→ Review identity suggestion
→ Complete editable plant details
→ Save plant
```

Manual entry remains available. Pl@ntNet suggestions are optional help, not truth.

Recommended copy:

```txt
Add a photo first
A photo helps you recognize this plant and can help with identification.

Identification suggestions are optional.
Review and edit everything before saving.
```

## Data model direction

This campaign likely requires migration-safe schema work.

### User setup/preferences

Recommended table if no equivalent exists:

```txt
user_app_preferences
id uuid primary key
user_id uuid not null references auth.users(id)
onboarding_completed_at timestamptz null
setup_checklist_dismissed_at timestamptz null
created_at timestamptz not null default now()
updated_at timestamptz not null default now()
```

Notes:

- Completion state is per user.
- Existing users must not be blocked.
- Checklist completion should derive from app state where possible rather than storing every item.
- `setup_checklist_dismissed_at` can suppress the checklist without pretending setup is complete.

### Rooms

Recommended table:

```txt
plant_rooms
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
unique active room name per user
case-insensitive uniqueness if practical
RLS: room.user_id = auth.uid()
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
- Do not drop `location` in this campaign unless explicitly approved.
- Do not require plants to have a room.

Transitional display precedence:

```txt
if plant.room_id joins to active plant_rooms.name:
  display room name
else if plant.location is non-empty:
  display plant.location
else:
  display Unassigned
```

### Pre-save photo staging

Pre-save Pl@ntNet needs an ownership-safe model because current photo behavior depends on an owned plant.

Preferred staged upload table if needed:

```txt
plant_photo_drafts
id uuid primary key
user_id uuid not null references auth.users(id)
storage_path text not null
created_at timestamptz not null default now()
expires_at timestamptz not null
consumed_at timestamptz null
```

Storage path should include `user_id` and draft ID.

Rules:

- Do not use public storage.
- Do not send signed Supabase URLs to Pl@ntNet.
- Server-side actions must verify ownership before reading photo bytes.
- Abandoned staged photos must be safe.
- If cleanup cannot be implemented in the slice, document the residual risk and mitigation.

Option B is to create a draft plant first, then attach photo and identify. Use this only if draft plants fit the existing product and schema without weakening plant validation or UX.

Do not implement pre-save uploads without a clear ownership and cleanup model.

## Slice plan

### Slice 0 — Campaign Doc Expansion and AI Boundary Alignment

Status: planned.

Goal:

Update this campaign doc so it can guide autonomous Codex handoffs and clearly avoids overlap with AI Care Setup.

Scope:

- Rewrite `docs/campaigns/onboarding-rooms-settings-photo-first-ai.md`.
- Add explicit AI Care Setup boundary notes.
- Add Getting Started checklist and Settings home-base concepts.
- Add source-of-truth notes, slice plan, acceptance criteria, validation, QA, stop conditions, completion criteria, and backlog.
- Do not change app code.
- Do not activate an implementation slice unless product owner explicitly approves.

Likely files:

```txt
docs/campaigns/onboarding-rooms-settings-photo-first-ai.md
docs/current-task.md
docs/roadmap.md
```

Only update `docs/current-task.md` / `docs/roadmap.md` if the product owner approves this campaign as active or wants docs aligned around this planning work.

Acceptance criteria:

- Campaign doc is detailed enough for future slice handoffs.
- AI Care Setup overlap is explicitly excluded.
- Getting Started and Settings scope is documented.
- The staged photo/identity-only boundary is clear.
- Hot-path docs remain internally consistent.
- Build is skipped if docs-only.

Validation:

- Docs-only consistency review.
- Targeted search for stale campaign status or overlap with AI Care Setup.
- Build can be skipped if no code changed.

### Slice 1 — Onboarding State and Skippable First-Run Shell

Status: implemented on `campaign/onboarding-rooms-s1-onboarding`; awaiting review/merge.

Goal:

Add a short, skippable onboarding surface for new signed-in users without blocking existing users.

Scope:

- Add per-user onboarding completion state.
- Add protected onboarding route or in-app onboarding surface.
- Add welcome/value step.
- Add skip and complete actions.
- Route users safely after onboarding:
  - to Today if skipped/completed without plant flow
  - to Add Plant if user chooses to add first plant
- Add Settings entry point to revisit setup.
- Ensure returning users do not see onboarding repeatedly.
- Ensure existing users are not blocked.

Non-goals:

- No room database yet unless required for onboarding state.
- No photo-first Add Plant work.
- No AI.
- No calendar changes.
- No setup checklist beyond a placeholder if not included in this slice.

Acceptance criteria:

- New signed-in user with no plants and no completed onboarding state sees onboarding once.
- User can skip onboarding.
- User can complete onboarding.
- Completion persists per user in `user_app_preferences`.
- Existing users with plants are not trapped or redirected unexpectedly.
- User can revisit setup from Settings without creating an onboarding loop.
- Route protection and server-side user checks remain intact.
- Missing environment values degrade to guided setup state rather than crash.

Completed notes:

- Added additive `user_app_preferences` migration with owner-scoped RLS.
- Added `/app/onboarding` protected route.
- Added skip/complete server action that derives `user_id` from the signed-in session.
- Added Today redirect only for signed-in users with zero plants and no completed onboarding state.
- Added Settings "Review setup" entry point.
- Did not add room setup, photo-first Add Plant, AI, or calendar changes.

Validation:

- `npm run lint`: passed.
- `npm run build`: passed.
- `npm run typecheck`: not present.
- `npm test`: not present.
- Supabase CLI migration apply was not run because `supabase` CLI is not installed in this environment.
- Migration/RLS reviewed for additive safety and `auth.uid() = user_id` ownership boundaries.

Validation:

- `npm run typecheck` if present.
- `npm test` if present.
- `npm run build`.
- `npm run lint` if present.

Manual QA:

- New user first sign-in.
- Skip onboarding.
- Complete onboarding.
- Refresh after completion.
- Returning user path.
- Existing user path.
- Mobile viewport.

Stop conditions:

- Existing users are blocked.
- Onboarding loops after completion.
- Completion state is not scoped to the signed-in user.

### Slice 2 — Getting Started Checklist and Settings IA Foundation

Status: planned.

Goal:

Turn Settings into a clear home base and add a lightweight setup checklist that guides users without forcing setup.

Scope:

- Restructure Settings into clear sections:
  - Account
  - Rooms
  - Reminders & Calendar
  - Setup
  - Help & App Info
- Add Setup section.
- Add Getting Started checklist.
- Checklist items should derive from app state where practical:
  - first plant exists
  - at least one room exists
  - at least one reminder exists
  - at least one plant photo exists
  - Google Calendar connected
- Add checklist dismiss behavior if practical.
- Add privacy/ownership reassurance copy.
- Keep Settings mobile-friendly.

Non-goals:

- No room management implementation unless already available.
- No Google Calendar relocation implementation beyond placeholder/status if not already feasible.
- No gamification, scoring, or streaks.
- No broad task system.

Acceptance criteria:

- Settings has durable section structure.
- Setup section exists.
- Checklist appears when setup is incomplete.
- Checklist does not block the dashboard.
- Checklist can be dismissed or naturally disappears when complete.
- Checklist does not imply requirements.
- Privacy/ownership reassurance appears in Settings.
- Existing sign-out/account behavior remains available.

Validation:

- `npm run typecheck` if present.
- `npm test` if present.
- `npm run build`.
- `npm run lint` if present.

Manual QA:

- New user with no plants.
- User with one plant.
- User with a room, reminder, photo, and calendar connected where available.
- Dismiss checklist.
- Mobile Settings.
- Desktop Settings.

Stop conditions:

- Checklist becomes generic task management.
- Settings IA hides existing required account/sign-out controls.
- Checklist requires unavailable data in a way that breaks render.

### Slice 3 — Room Data Model and Safe Backfill

Status: implemented on `campaign/onboarding-rooms-s2-room-model`; awaiting review/merge.

Goal:

Introduce user-owned rooms and connect plants to rooms without losing existing `location` data.

Scope:

- Add `plant_rooms` table.
- Add nullable `plants.room_id`.
- Backfill room records from distinct non-empty `plants.location` values per user.
- Set `plants.room_id` for plants with matching backfilled room.
- Keep `plants.location` temporarily for compatibility.
- Add RLS for rooms.
- Add typed helpers/actions for room reads and mutations.
- Preserve Unassigned behavior.

Migration rules:

- Do not drop `plants.location`.
- Do not overwrite existing non-empty `location`.
- Do not require every plant to have a room.
- Treat missing room as Unassigned.
- If duplicate location values differ only by case/spacing, normalize cautiously and document behavior.

Non-goals:

- No Settings room UI yet unless product owner combines slices.
- No onboarding room setup yet.
- No floorplan/map.
- No room-level reminders.

Acceptance criteria:

- Existing plant location data is preserved.
- Rooms are user-owned.
- Users cannot read/write other users' rooms.
- Plants can remain Unassigned.
- Room backfill is migration-safe.
- Existing Home/Plants grouping still works after migration.
- Build validation passes.

Completed notes:

- Added additive `plant_rooms` migration with owner-scoped RLS.
- Pre-merge QA renamed the room migrations to `20260512_01_slice_room_data_model.sql` and `20260512_02_slice_room_archive_function.sql` so fresh applies create `plant_rooms` before the archive RPC that returns `public.plant_rooms`.
- Added nullable `plants.room_id` with a foreign key to `plant_rooms`.
- Backfilled rooms from distinct non-empty trimmed `plants.location` values per user.
- Backfilled `plants.room_id` where legacy location matched an active room name.
- Preserved `plants.location` unchanged for compatibility and rollback safety.
- Added database trigger preventing plants from referencing cross-user or archived rooms.
- Added typed room data helpers for list/create operations.
- Updated plant record typing with nullable `room_id`.
- Did not add Settings room management, Add/Edit room dropdowns, Home/Plants grouping changes, or destructive location cleanup.

Validation:

- `npm run lint`: passed.
- `npm run build`: passed.
- `npm run typecheck`: not present.
- `npm test`: not present.
- Supabase CLI migration apply was not run because `supabase` CLI is not installed in this environment.
- Migration/RLS reviewed for additive safety, location preservation, owner-scoped room access, and same-user active room assignment enforcement.

Manual QA:

- Existing plant with location.
- Existing plant without location.
- Multiple plants with same location.
- Same room name across two users.
- Cross-user room access check where practical.

Stop conditions:

- Existing `plants.location` would be lost.
- RLS cannot be made clear.
- Backfill creates ambiguous destructive behavior.

### Slice 4 — Settings Room Management and Backfilled Room Review

Status: implemented on `campaign/onboarding-rooms-s3-room-settings`; awaiting review/merge.

Goal:

Let users manage room names from Settings and review rooms created from legacy plant locations.

Scope:

- Add Settings Rooms section.
- List active rooms.
- Show assigned plant count if practical.
- Add room.
- Rename room.
- Archive room.
- Show calm review message for backfilled rooms.
- Define safe behavior for archiving rooms with assigned plants.
- Preserve Unassigned grouping.

Recommended archive behavior:

When a room is archived:

- keep the room record with `archived_at`
- move assigned active plants to Unassigned by setting `room_id` to null
- never delete plant records
- document this behavior in architecture/campaign docs

Recommended review copy:

```txt
We organized your existing plant locations into rooms. Review them anytime.
```

Non-goals:

- No room restore UX unless very small.
- No room sorting/reordering unless included deliberately.
- No onboarding integration.
- No Add/Edit dropdown yet unless tightly coupled.

Acceptance criteria:

- User can view rooms in Settings.
- User can add a room.
- User can rename a room.
- Duplicate active room names are handled gracefully.
- User can archive a room.
- Archiving does not lose plants.
- Assigned plants become Unassigned or documented safe behavior is implemented.
- Backfilled rooms have clear review copy.
- Cross-user access remains blocked.
- Settings remains calm and mobile-friendly.

Validation:

- `npm run lint`: passed.
- `npm run build`: passed.
- `npm run typecheck`: not present.
- `npm test`: not present.
- Supabase CLI migration apply was not run because `supabase` CLI is not installed in this environment.
- Room archive behavior reviewed: archive is a soft archive, assigned plants are moved to Unassigned by clearing `room_id`, and plant records plus legacy `plants.location` are preserved.

Completed notes:

- Added Settings Rooms section with active room list and assigned plant counts.
- Added room create, rename, and archive actions scoped to the signed-in user.
- Duplicate/blank/error outcomes surface as calm Settings messages.
- Added database `archive_plant_room` function to keep room archiving and plant unassignment together.
- Did not add room restore, sorting/reordering, onboarding room setup, Add/Edit dropdown, or Home/Plants grouping changes.

Manual QA:

- Add room.
- Rename room.
- Duplicate room.
- Archive empty room.
- Archive room with assigned plants.
- Verify plants remain safe.
- Review backfilled room copy.
- Mobile Settings.

Stop conditions:

- Archiving rooms can orphan inaccessible plants.
- Room mutations can affect another user.
- Duplicate handling is unclear.

### Slice 5 — Room Dropdown in Add/Edit Plant and Room-Aware Grouping

Status: implemented on `campaign/onboarding-rooms-s4-room-plant-forms`; awaiting review/merge.

Goal:

Use managed rooms in plant forms and collection grouping.

Scope:

- Update Add Plant form to select existing room.
- Update Edit Plant form to select existing room.
- Provide Unassigned option.
- Provide inline Add room option if practical.
- Use room names for Home and Plants grouping.
- Preserve fallback to legacy `location` during transition.
- Keep manual entry flow low-friction.

Transitional display logic:

```txt
if plant.room_id joins to active plant_rooms.name:
  display room name
else if plant.location is non-empty:
  display plant.location
else:
  display Unassigned
```

After room migration is stable, later cleanup may deprecate `location`, but not in this slice.

Completed notes:

- Add Plant and Edit Plant load active user-owned rooms.
- Plant forms include a managed room dropdown, Unassigned, inline Add room, and legacy location note.
- Plant create/update verifies selected rooms through user-scoped server checks and creates inline rooms under the signed-in user.
- Home, Plants, and plant profile display use managed room name first, then legacy `plants.location`, then Unassigned.
- Accepted Pl@ntNet name updates preserve existing room assignments.

Non-goals:

- No destructive cleanup of `plants.location`.
- No full room-management redesign.
- No onboarding integration.
- No AI/photo changes.

Acceptance criteria:

- User can select an existing room when adding a plant.
- User can select an existing room when editing a plant.
- User can leave plant Unassigned.
- User can add a room inline if included.
- Home groups plants by room consistently.
- Plants tab groups plants by room consistently.
- Existing legacy location values still display.
- User-owned scoping is preserved.

Validation:

- `npm run typecheck` if present.
- `npm test` if present.
- `npm run build`.
- `npm run lint` if present.

Manual QA:

- Add plant with room.
- Add plant as Unassigned.
- Edit room assignment.
- Add room inline if included.
- Existing legacy location displays.
- Home grouping.
- Plants grouping.
- Mobile Add/Edit forms.

Stop conditions:

- Room form changes break manual plant creation.
- Existing legacy locations disappear before migration cleanup is approved.
- Cross-user room assignment is possible.

### Slice 6 — Settings-Managed Google Calendar Integration

Status: implemented on `campaign/onboarding-rooms-s5-calendar-settings`; awaiting review/merge.

Goal:

Move account/app-level Google Calendar setup to Settings while preserving plant-level reminder ownership.

Scope:

- Add Google Calendar section to Settings under Reminders & Calendar.
- Show connection status.
- Show last synced if available.
- Show sync issue if available.
- Provide connect/disconnect controls.
- Keep existing OAuth routes and token handling.
- Keep Google Calendar as one-way reflection of app-owned reminders.
- Replace heavy plant-detail calendar setup panel with lightweight status.
- Plant detail may show:
  - Reminder on/off
  - Calendar sync enabled/disabled
  - Managed in Settings
- Reminder panels continue to own plant-level reminder editing.

Recommended copy:

```txt
Plant Care reminders stay in Plant Care. Google Calendar is a one-way reflection.
```

Completed notes:

- Added Settings-level Google Calendar connect, disconnect, connection status, mirrored reminder count, last sync/status, and sync issue display.
- Redirected Google OAuth status returns to Settings.
- Removed the heavy plant-detail Google Calendar setup panel.
- Added lightweight plant-detail calendar status when relevant, with integration management linked to Settings.
- Kept reminder editing on plant detail and kept Google Calendar as a one-way reflection of app-owned reminders.
- No schema, RLS, provider, or reminder model changes were introduced.

Non-goals:

- No bidirectional calendar sync.
- No Outlook.
- No calendar-owned reminders.
- No recurring Google events.
- No non-watering calendar events.
- No reminder model redesign.

Acceptance criteria:

- User can connect Google Calendar from Settings.
- User can disconnect Google Calendar from Settings.
- Settings shows connection state.
- Settings shows last sync or sync issue where existing metadata supports it.
- Existing reminder-to-calendar sync still works.
- Disconnect behavior still preserves app reminders.
- Plant detail no longer carries heavy setup UI.
- Plant-level reminders remain app-owned.
- Calendar copy remains conservative and clear.

Validation:

- `npm run typecheck` if present.
- `npm test` if present.
- `npm run build`.
- `npm run lint` if present.

Manual QA:

- Disconnected Settings state.
- Connect Google Calendar.
- Connected Settings state.
- Reminder sync still creates/updates app-managed event.
- Disconnect Google Calendar.
- Disconnect preserves app reminders.
- Plant detail lightweight status.
- Calendar config missing/degraded state if applicable.

Stop conditions:

- Calendar becomes source of truth.
- Existing OAuth/token security is weakened.
- Plant-level reminders become hard to manage.

### Slice 7 — Onboarding Room Setup Integration

Status: implemented on `campaign/onboarding-rooms-s8-onboarding-polish`; awaiting review/merge.

Goal:

Let onboarding collect optional room names using the implemented room model.

Scope:

- Add optional room setup step to onboarding.
- Present suggested room chips:
  - Living room
  - Bedroom
  - Kitchen
  - Bathroom
  - Office
  - Balcony
- Let user add custom room names.
- Let user remove/edit selected rooms before saving.
- Save selected rooms into `plant_rooms`.
- Continue to first plant choice or Today.
- Keep room setup skippable.

Completed notes:

- Onboarding now includes optional suggested room chips and comma-separated custom room entry.
- Submitted room names are normalized, de-duplicated, checked against active rooms, and created under the signed-in user before onboarding completion is saved.
- Duplicate active room names are skipped so setup can continue.
- Room setup remains optional and can be skipped.
- Created rooms are visible in Settings and Add/Edit Plant through the existing room helpers.

Non-goals:

- No required room setup.
- No room floorplan.
- No room-level reminders.
- No AI/photo changes.

Acceptance criteria:

- New user can select suggested rooms.
- New user can add custom room.
- New user can skip rooms.
- Rooms save as user-owned `plant_rooms`.
- Duplicate room names are handled.
- User can manage rooms later in Settings.
- Existing users are not disrupted.

Validation:

- `npm run typecheck` if present.
- `npm test` if present.
- `npm run build`.
- `npm run lint` if present.

Manual QA:

- Onboarding with suggested rooms.
- Onboarding with custom rooms.
- Onboarding skip rooms.
- Duplicate room entry.
- Rooms appear in Settings.
- Rooms appear in Add/Edit plant.
- Mobile onboarding.

Stop conditions:

- Onboarding requires room setup.
- Room creation is not user-scoped.
- Duplicate handling blocks completion without clear recovery.

### Slice 8 — Photo-First Add Plant Foundation

Status: implemented on `campaign/onboarding-rooms-s6-photo-first-add`; awaiting review/merge.

Goal:

Restructure Add Plant so a user can begin with a photo while preserving manual Add Plant.

Scope:

- Add first Add Plant choice:
  - Add manually
  - Start with a photo
- Add photo-first entry affordance.
- Keep manual entry available from the first screen.
- Let user continue without photo.
- Let user add or replace photo before final save if safe.
- Decide and implement ownership-safe staging only if necessary.
- Ensure abandoned staged photos do not become cross-user or orphaned risk.
- Save final plant with optional primary photo.

Preferred staging direction:

Use an ownership-safe staged upload model if pre-save photo is required:

```txt
plant_photo_drafts
id uuid primary key
user_id uuid not null references auth.users(id)
storage_path text not null
created_at timestamptz not null default now()
expires_at timestamptz not null
consumed_at timestamptz null
```

Completed notes:

- Add Plant now starts in one sequential, skippable photo-first flow with progress through photo, identity, room, watering basics, and review.
- Manual Add Plant remains fully available by skipping the optional photo and identification steps; it does not require rooms, AI, reminders, or calendar setup.
- Photo-first users can choose an optional photo before final save and see an immediate browser-local preview.
- The server creates the signed-in user's plant first, then uploads the optional photo to the existing private owner/plant-scoped Storage path and saves it as the primary photo.
- The same selected photo is retained through optional pre-save identification and final save, so users do not need to upload it twice.
- The photo limit is 12 MB and Server Action/proxy body size is configured to support typical mobile camera photos.
- If photo upload fails after plant creation, the plant remains saved and the profile shows a recoverable message.
- No public storage, draft plant records, staged photo table, or pre-save Pl@ntNet call was introduced.
- Abandoning Add Plant before save leaves no staged photo object to clean up.

Non-goals:

- No Pl@ntNet pre-save call was introduced in this photo-first foundation slice; it was added later in Slice 9.
- No care suggestions.
- No `care_profiles`.
- No AI-generated watering fields.
- No draft plant records unless explicitly chosen and documented.

Acceptance criteria:

- User can add a plant manually as before.
- User can start with a photo.
- User can save plant with photo.
- User can abandon photo-first flow safely.
- Selecting a photo previews immediately.
- Identifying a photo keeps the preview and same selected file for final save.
- Required fields are clear.
- Storage remains private.
- Ownership checks remain server-side.
- No staged photo can be accessed cross-user.

Validation:

- `npm run typecheck` if present.
- `npm test` if present.
- `npm run build`.
- `npm run lint` if present.
- Storage/RLS sanity checks if staging is added.

Manual QA:

- Add manually.
- Start with photo and save.
- Start with photo and abandon.
- Replace/remove photo before save if supported.
- Save with required fields.
- Mobile photo-first flow.
- Missing storage/env guided state if applicable.

Stop conditions:

- Staged photo ownership is unclear.
- Public storage would be required.
- Manual Add Plant regresses.
- Required fields become unclear.

### Slice 9 — Pre-Save Identity-Only Pl@ntNet Assistance

Status: implemented on `campaign/onboarding-rooms-s7-presave-plantnet`; awaiting review/merge.

Goal:

Allow optional Pl@ntNet identity help before final plant save, using the safe photo-first foundation.

Scope:

- Trigger Pl@ntNet from a staged/new plant photo.
- Submit private photo bytes server-side.
- Show names-only identity suggestions.
- Let user accept, edit, reject, or continue manually.
- Save accepted/edited common and scientific names into normal plant fields.
- Reuse existing conservative uncertainty labels unless a separate AI Care Setup slice changes recommendation UX later.
- Do not persist raw provider response by default.
- Do not show care suggestions.

Completed notes:

- Add Plant can identify from the selected initial photo before final plant save.
- The server validates the signed-in session and submitted image, then sends transient file bytes directly to Pl@ntNet.
- No staged photo object, draft plant, public URL, signed Supabase URL, or raw provider response is stored.
- The UI shows up to three names-only suggestions with existing uncertainty labels.
- Suggestions only fill editable common/scientific name fields after the user chooses one.
- Users can reject suggestions and continue manual setup.
- AI does not modify watering interval, watering guidance, reminders, rooms, notes, diagnosis, or care guidance.

AI boundary:

This slice may support:

```txt
photo → identity suggestions → user review → common_name/scientific_name fields
```

This slice must not support:

```txt
identity → care profile → suggested watering cadence → suggested watering guidance
```

That belongs to AI Care Setup.

Non-goals:

- No internal care profile lookup.
- No suggested watering interval.
- No suggested watering guidance.
- No grouped/scored recommendation overhaul.
- No diagnosis, toxicity advice, treatment advice, or care encyclopedia content.

Acceptance criteria:

- User can request identification before saving a plant.
- User can reject suggestions and continue manually.
- User can accept a suggestion and edit fields before saving.
- Suggestions are never treated as authoritative.
- No care fields are modified by AI.
- Storage and provider calls remain owner-scoped and server-only.
- Pl@ntNet unavailable/no-result states are clear and non-blocking.

Validation:

- `npm run typecheck` if present.
- `npm test` if present.
- `npm run build`.
- `npm run lint` if present.

Manual QA:

- Identify from staged photo.
- Pl@ntNet unavailable state.
- No candidates state.
- Low-confidence state.
- Accept suggestion.
- Reject suggestion.
- Edit accepted names before save.
- Save plant with accepted/edited names.
- Confirm no watering/care fields are AI-applied.
- Confirm no diagnosis/care claims appear.

Stop conditions:

- AI applies care fields.
- AI suggestions save without review.
- Provider call exposes signed/public storage URLs.
- Identification UI implies authority.

### Slice 10 — Onboarding First Plant Integration Polish

Status: implemented on `campaign/onboarding-rooms-s8-onboarding-polish`; awaiting review/merge.

Goal:

Connect onboarding to first plant creation without making first plant/photo/AI required.

Scope:

- Onboarding can route to Add Plant manual path.
- Onboarding can route to photo-first Add Plant path.
- Onboarding can finish to Today.
- Empty states reference setup progress where useful.
- Getting Started checklist reflects first plant/photo/room state.
- Returning users can manage everything from Settings.
- Polish mobile flow and loading/error states.

Completed notes:

- Onboarding finish actions route to Today, manual Add Plant, or photo-first Add Plant.
- Today includes a state-derived setup checklist for first plant, rooms, reminders, photos, and Google Calendar connection when setup is incomplete.
- Settings keeps a lightweight setup review entry instead of being the primary checklist surface.
- Today's no-plants empty state links to manual and photo-first Add Plant paths.
- Account privacy copy in Settings now reassures users that plants, rooms, photos, and reminders are private to their account.
- Existing-user onboarding protections remain in place: users with plants are not redirected into onboarding, and Settings review does not create a loop.

Non-goals:

- No required first plant.
- No required photo.
- No required AI.
- No care suggestions.

Acceptance criteria:

- New user can skip onboarding.
- New user can add rooms quickly.
- New user can start manual Add Plant.
- New user can start photo-first Add Plant.
- New user can finish to Today.
- Existing users are not disrupted.
- Empty states remain calm and practical.
- Onboarding does not loop after completion.
- Checklist reflects meaningful next actions.

Validation:

- `npm run typecheck` if present.
- `npm test` if present.
- `npm run build`.
- `npm run lint` if present.

Manual QA:

- Onboarding → skip → Today.
- Onboarding → rooms → Today.
- Onboarding → manual Add Plant.
- Onboarding → photo-first Add Plant.
- Onboarding → setup checklist.
- Existing user path.
- Mobile viewport.
- Desktop viewport.

Stop conditions:

- Onboarding becomes mandatory.
- First plant creation is required.
- Photo or AI is required.
- Empty states become noisy or guilt-based.

## Campaign-level acceptance criteria

The campaign is successful when:

- Onboarding is implemented and skippable.
- Users can revisit setup from Settings.
- Getting Started checklist guides setup without forcing it.
- Settings has clear Account, Rooms, Reminders & Calendar, Setup, and Help/App Info sections.
- Settings includes privacy/ownership reassurance.
- Rooms are user-owned records with safe RLS.
- Existing `plants.location` values survive migration.
- Settings supports room management.
- Backfilled rooms have user-facing review copy.
- Add/Edit Plant supports room selection and Unassigned.
- Home/Plants use room names consistently.
- Google Calendar setup lives in Settings.
- Calendar sync health/status is visible in Settings where available.
- Plant detail keeps only lightweight calendar status.
- Add Plant can start with photo or manual entry.
- Optional pre-save Pl@ntNet identity help works without care suggestions.
- Manual plant creation remains useful without rooms, photo, or AI.
- No overlap with AI Care Setup care-profile work is introduced.

## Validation and manual QA expectations

### Validation for implementation slices

Run scripts that exist in `package.json`:

```txt
npm run typecheck
npm test
npm run build
npm run lint
```

Build is required for implementation work.

For docs-only slices:

```txt
targeted doc consistency review
targeted search for stale active-campaign references
build can be skipped if no code changed
```

### Migration/RLS validation

For schema slices, validate:

- migrations are additive
- RLS is enabled on user-owned tables
- preference/setup state is scoped by authenticated user
- room queries are scoped by authenticated user
- plant room assignment cannot cross users
- staged photo records cannot cross users
- storage paths include authenticated user ID
- abandoned staged photos are safe

### Manual QA checklist

#### Onboarding

- New user sees onboarding.
- New user can skip.
- New user can complete.
- Returning user does not see onboarding loop.
- Existing user is not blocked.
- User can revisit setup from Settings.
- Onboarding works on mobile.

#### Getting Started

- Checklist appears for incomplete setup.
- Checklist items reflect actual app state.
- Checklist links route to correct surfaces.
- Checklist can be dismissed if implemented.
- Checklist does not block Today/dashboard.
- Checklist does not feel like gamification.

#### Settings

- Account section shows sign-out/account controls.
- Rooms section appears.
- Reminders & Calendar section appears.
- Setup section appears.
- Help & App Info section appears.
- Privacy/ownership reassurance appears.
- Settings works on mobile.

#### Rooms

- Add room in Settings.
- Rename room.
- Attempt duplicate room name.
- Archive room with no plants.
- Archive room with assigned plants.
- Verify assigned plants remain safe.
- Add room during onboarding.
- Add plant with existing room.
- Add plant with new inline room if included.
- Edit plant room.
- Leave plant Unassigned.
- Existing plants retain migrated location/room display.
- Home groups by room.
- Plants tab groups by room.

#### Calendar Settings

- Settings shows disconnected state.
- Connect Google Calendar.
- Settings shows connected state.
- Last synced or sync issue appears where available.
- Disconnect Google Calendar.
- Existing reminder sync still creates/updates app-managed events.
- Disconnect preserves app reminders.
- Plant detail shows only lightweight calendar status.
- No calendar copy implies calendar owns reminders.

#### Photo-first Add Plant

- Add plant manually with no photo.
- Start with photo and save.
- Start with photo, abandon flow.
- Replace staged photo before save if supported.
- Save final plant with photo.
- Missing photo fallback still works.

#### Pre-save identity-only AI

- Identify from staged photo.
- Pl@ntNet unavailable state.
- No candidates state.
- Low-confidence state.
- Accept suggestion.
- Reject suggestion.
- Edit accepted names before save.
- Save plant with accepted/edited names.
- Confirm no watering/care fields are AI-applied.
- Confirm no diagnosis/care claims appear.

#### Ownership/security sanity

- User A cannot see User B setup state.
- User A cannot see User B rooms.
- User A cannot assign User B room to a plant.
- User A cannot access User B staged photo.
- User A cannot identify User B photo.
- User A cannot mutate User B Google Calendar connection/link records.

## Stop conditions and campaign completion criteria

### Stop conditions

Stop and report if:

- hot-path docs disagree on active campaign or active slice
- implementation scope starts overlapping AI Care Setup care-profile work
- setup checklist becomes generic task management or gamification
- onboarding blocks existing users
- onboarding loops after completion
- room migration could lose existing `plants.location`
- room model requires destructive migration
- staged photo ownership is unclear
- staged photo cleanup cannot be made safe
- pre-save Pl@ntNet requires public storage
- AI suggestions would be saved without review
- AI suggestions would modify watering/care fields
- Google Calendar behavior becomes calendar-owned
- schema/RLS changes cannot be made safely
- validation fails
- task scope expands into health diagnosis, encyclopedia, or generic task behavior

### Campaign completion criteria

This campaign can be marked complete when:

- all selected slices are implemented, validated, and merged
- `docs/current-task.md` and `docs/roadmap.md` reflect final status
- `docs/architecture.md` describes implemented onboarding state, checklist/settings behavior, rooms, Settings calendar location, and photo-first/staged-photo behavior
- the campaign doc is updated with completed slice status
- manual QA is complete on Vercel preview
- remaining AI care work is explicitly handed off to AI Care Setup
- known risks/backlog items are documented

## Follow-up backlog

### Hand off to AI Care Setup

Defer these to `ai-care-setup`:

- improve Pl@ntNet confidence labels and percentages
- group duplicate common-name candidates
- add internal `care_profiles`
- seed curated plant care profiles
- match accepted identities to care profiles
- show suggested care starting points
- apply user-reviewed watering interval/guidance
- expand care profile coverage
- QA identification-to-care setup flow

### Later cleanup

- Deprecate or remove `plants.location` only after room model is stable and explicitly approved.
- Add room restore UX if room archiving creates enough user need.
- Add room sorting/reordering.
- Add onboarding analytics only if product owner wants instrumentation.
- Add staged photo cleanup job/process if manual cleanup is not enough.
- Consider moving photo-first Add Plant polish into a later UX refinement slice after manual QA.
- Add richer Help/App Info content only if it stays lightweight and practical.

### Explicitly deferred product areas

- Outlook sync.
- Push/email notification delivery.
- Plant health support.
- Pest/disease/treatment suggestions.
- Adaptive watering automation.
- Richer plant knowledge.
- Multi-user households.
- Room-level reminders.

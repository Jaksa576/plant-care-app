# UI Redesign UX Overhaul Campaign

Status: **active**.

## Goal

Redesign Plant Care into a calm, icon-led, watering-first mobile experience that avoids the generic rounded-card dashboard pattern while preserving the app’s core product loop and implemented data boundaries.

The approved direction is:

```txt
Care Index + Room Chapters + Daily Log
```

The visible Home page should say **Today**, not “Care Index.”

## Source references

Design reference:

```txt
docs/design/ui-redesign-visual-reference.md
docs/design/ui-redesign-implementation-reference.md
docs/design/mockups/plant-care-ui-redesign-final-vision-board.png
```

Brand reference:

```txt
docs/design/plant-care-brand-reference.md
```

Product and architecture source of truth:

```txt
AGENTS.md
docs/product.md
docs/architecture.md
docs/roadmap.md
docs/current-task.md
```

## Product guardrails

Preserve:

- watering-first UX
- personal plant collection
- editable care guidance
- user-owned records and route protection
- conservative AI assistance
- app-owned reminders
- Google Calendar as a one-way reflection of app reminders
- mobile-first layouts
- calm empty/loading/error states

Do not introduce:

- generic task-manager behavior
- encyclopedia-first UI
- authoritative diagnosis or Health Check feature
- AI-controlled care truth
- calendar-first reminder truth
- broad schema churn
- unrelated new features

## Design guardrails

Avoid on the Home screen:

- stacked dashboard cards
- rounded block sections
- pill filter-heavy controls
- floating widgets
- generic hero dashboard
- more than three bottom navigation destinations

Use instead:

- editorial hierarchy
- thin dividers
- list/index rows
- room chapters
- icon-led actions
- soft humanist typography
- warm natural palette
- restrained botanical visuals
- clear action hierarchy

## Navigation model

Signed-in app bottom app bar:

```txt
Home
Plants
Settings
```

### Home

Route likely:

```txt
/app
```

Purpose:

- Today’s care
- needs water
- room grouping
- recent care
- quick Add plant

### Plants

Likely route:

```txt
/app/plants
```

Purpose:

- full collection
- browse by room/all plants
- add plant
- open details

### Settings

Likely route:

```txt
/app/settings
```

Purpose:

- account/settings utility
- sign out
- sync/settings entry points

Do not add Health, AI, Calendar, or Reminders as top-level tabs in this campaign.

## Slice plan

### Slice 0: Docs And Reference Package

Status: complete on `ui-redesign/00-docs-reference`.

Goal:

Add the approved campaign docs and mockups to the repo.

Scope:

- Add visual reference docs.
- Add implementation reference docs.
- Add final mockup images.
- Add this campaign doc.
- Do not change app code.

Acceptance criteria:

- `docs/design/ui-redesign-visual-reference.md` exists.
- `docs/design/ui-redesign-implementation-reference.md` exists.
- `docs/design/plant-care-brand-reference.md` exists.
- final mockups exist under `docs/design/mockups/`.
- `docs/campaigns/ui-redesign-ux-overhaul.md` exists.
- Docs are internally consistent.

Validation:

- Docs-only consistency check.
- Build validation can be skipped if no code changed.

### Slice 1: Design System And Shell Foundation

Status: complete on `ui-redesign/01-foundation-shell`.

Goal:

Introduce the visual foundation needed for the overhaul without redesigning all screens at once.

Scope:

- Add/adjust design tokens.
- Apply softer typography direction.
- Add shared icon primitives or an approved icon library.
- Add shared bottom app bar shell for Home / Plants / Settings.
- Add route stubs only if needed for shell navigation.
- Preserve existing auth/session behavior.

Non-goals:

- Full Home redesign.
- Full Plants tab implementation.
- Full Settings implementation.
- Plant detail redesign.
- Schema or RLS changes.
- Health Check feature.

Acceptance criteria:

- Visual primitives exist and are reusable.
- Home / Plants / Settings nav is available on signed-in app surfaces where appropriate.
- Add Plant remains discoverable.
- Existing protected route behavior still works.
- No user-owned data behavior changes.

Validation:

- `npm run typecheck` if present.
- `npm test` if present.
- `npm run build`.
- `npm run lint` if present.

Notes:

- No icon dependency was added; Slice 01 introduced local inline SVG primitives for the required icon set.
- Existing `next/font/google` usage was preserved and switched to Nunito Sans.
- `/app/plants` and `/app/settings` are protected minimal surfaces for the new bottom app bar. Full collection and settings polish remain scoped to later slices.

### Slice 2: Home / Today Redesign

Status: complete on `ui-redesign/02-home-today`.

Goal:

Replace the current dashboard presentation with the approved Home / Today care surface.

Scope:

- Home title/copy uses Today/date language.
- Needs water section.
- Primary icon-led Water action.
- Secondary Snooze action.
- By room chapters when useful.
- Unassigned group when needed.
- Recent care log.
- Existing dashboard grouping/reminder-aware logic is reused.
- Empty/loading/error states are restyled.

Non-goals:

- New reminder model.
- New health features.
- Calendar sync behavior changes.
- AI behavior changes.

Acceptance criteria:

- Overdue/due today plants are immediately visible.
- Water action remains low-friction.
- Snooze is available where supported and visually secondary.
- Room grouping behaves correctly.
- Missing room/location is handled calmly.
- Mobile layout matches the approved visual reference closely.

Validation:

- Standard implementation validation.
- Manual QA with plants in multiple rooms, missing room, overdue, due today, upcoming, and recently watered states.

Notes:

- Existing reminder-aware dashboard grouping is reused.
- Water uses the existing mark-watered server action.
- Snooze is shown as secondary and enabled only for plants with enabled reminder state available to the Home grouping.
- Recent care is sourced from watering events and shown as a lightweight log.

### Slice 3: Plants Tab / Collection

Status: next.

Goal:

Create a dedicated full collection surface aligned with the new visual system.

Scope:

- `/app/plants` collection view if not already present.
- Full active plant collection.
- Room grouping where useful.
- Unassigned group.
- Add plant access.
- Plant detail navigation.
- Calm empty state.

Non-goals:

- Advanced search/filtering unless already trivial.
- Archive restore workflow unless already implemented.
- New schema.

Acceptance criteria:

- User can browse full collection independent of Home.
- Add Plant is obvious.
- Plant detail links work.
- Route protection and user-owned scoping are preserved.

### Slice 4: Plant Detail Redesign

Status: planned.

Goal:

Redesign plant detail as a calm inspector-style view.

Scope:

- Photo/fallback hero.
- Plant identity and room.
- Water now primary action.
- Snooze/reminder secondary actions.
- Care basics as rows.
- Watering history.
- Photo/identification helper.
- Calendar sync panel.
- Edit/archive access.

Non-goals:

- Changing AI identification scope.
- Changing calendar sync semantics.
- Health diagnosis.

Acceptance criteria:

- Plant detail remains user-owned/protected.
- Existing actions still work.
- Watering, reminders, history, photo, AI, and calendar surfaces remain findable.
- UI matches visual reference direction.

### Slice 5: Add/Edit Plant Flow Polish

Status: planned.

Goal:

Make setup/editing match the new design language.

Scope:

- Add plant flow.
- Edit plant form.
- Photo input affordance.
- Watering guidance fields.
- Room/location handling.
- Archive visual treatment.

Non-goals:

- Mandatory room/location.
- AI-first setup.
- Schema changes unless explicitly required.

Acceptance criteria:

- Manual add remains useful.
- User can save partial/simple info.
- Editable care guidance remains clear.
- Archive is secondary/destructive and safe.

### Slice 6: Supporting Feature Polish

Status: planned.

Goal:

Polish reminders, Google Calendar sync, photo, AI identification, and edge states under the new visual system.

Scope:

- Reminder panel polish.
- Calendar sync panel polish.
- Photo/identify helper polish.
- Empty/loading/error states.
- Accessibility pass.

Non-goals:

- New calendar provider.
- Health Check.
- New AI diagnosis behavior.
- Broad automation.

Acceptance criteria:

- Supporting features feel coherent with the redesign.
- AI and calendar remain secondary to watering.
- Copy remains conservative and user-owned.

## Campaign QA checklist

Manual QA should cover:

- first-run no plants
- one plant
- multiple plants
- multiple rooms
- missing room / unassigned
- overdue plant
- due today plant
- upcoming plant
- recently watered plant
- mark watered
- snooze
- add plant
- edit plant
- archive plant
- plant detail
- photo/fallback states
- AI suggestion states
- reminder states
- Google Calendar connected/disconnected/failure states
- mobile viewport
- desktop viewport
- signed-out protection
- cross-user ownership assumptions

## Documentation expectations

Every implementation slice should update:

```txt
docs/current-task.md
docs/campaigns/ui-redesign-ux-overhaul.md
```

Update product/architecture/roadmap only when the slice changes product status, architecture, route structure, integration behavior, milestone status, scope, or sequencing.

## Stop conditions

Stop and report if:

- current docs still show another active campaign that blocks new implementation
- repo state is dirty or branch/worktree state is unexpected
- implementation would require schema/RLS changes not approved in this campaign
- route protection or user ownership becomes unclear
- adding a font/icon dependency becomes necessary but was not scoped
- validation fails
- the slice starts drifting into health diagnosis, generic tasks, or calendar-first behavior

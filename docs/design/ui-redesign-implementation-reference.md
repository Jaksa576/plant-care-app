# Plant Care UI Redesign Implementation Reference

Status: implementation guidance for Codex and future slices.

This document translates the approved final visual direction into implementation constraints and slice guidance.

## Source references

Design mockups:

```txt
docs/design/mockups/plant-care-ui-redesign-final-vision-board.png
docs/design/mockups/home-today-final-vision.png
docs/design/mockups/plants-tab-final-vision.png
docs/design/mockups/plant-detail-final-vision.png
docs/design/mockups/design-system-final-vision.png
```

Primary visual/design doc:

```txt
docs/design/ui-redesign-visual-reference.md
```

Campaign doc:

```txt
docs/campaigns/ui-redesign-ux-overhaul.md
```

Brand reference:

```txt
docs/design/plant-care-brand-reference.md
```

## Implementation posture

The overhaul should be implemented in reviewable slices. Do not attempt to rebuild the entire app in one PR.

Preserve:

- watering-first UX
- personal plant collection
- editable care guidance
- user-owned data and route protection
- Supabase auth/session behavior
- Supabase RLS and server-derived ownership checks
- conservative AI assistance
- app-owned reminder model
- Google Calendar as one-way reflection of app reminders
- clear empty/loading/error states

Avoid:

- broad schema churn
- unrelated feature work
- adding Health Check as a feature in this campaign
- making AI/diagnosis more prominent
- making calendar sync define the product
- rewriting server actions unless a scoped slice requires it

## Typography implementation

Preferred direction: soft humanist sans.

Recommended option:

```txt
Nunito Sans
```

Use project-compatible font loading. If the repo already uses a font strategy, follow it. If adding a web font would create friction, use the existing font stack first and soften the design through:

- lighter weights
- less all-caps
- larger line-height
- calmer spacing
- reduced visual density

Do not commit proprietary or downloaded font files.

## Icons

Prefer a consistent icon set.

If the repo already has an icon library, use it. If not, use inline SVG icons for the initial slice rather than adding a dependency unless the dependency is explicitly justified.

Required icons for the first redesign slices:

```txt
Droplet: Water
Alarm clock: Snooze
Bell: Reminder
Home: Home tab
Sprout / potted plant: Plants tab
Gear: Settings tab
Plus: Add plant
Room/home: By room
Clock: Recent care
Leaf/sprout: plant row marker
Calendar: upcoming
Check circle: watered
Camera: photo
Chevron: row/detail navigation
```

Accessibility:

- icon-only buttons need aria-labels
- icon + label is preferred for primary actions
- do not rely on color alone to convey urgency

## Home / Today implementation notes

Route likely remains:

```txt
/app
```

User-facing page title should be:

```txt
Today
```

Do not show:

```txt
Care Index
Dashboard
Tasks
Queue
```

Home sections:

1. Needs water.
2. By room.
3. Recent care.

The Home page should continue using existing reminder-aware dashboard grouping logic. The redesign should reorganize and restyle existing data, not create a new data model.

### Needs water

Include overdue and due-today plants.

Each row should include:

- small plant photo/fallback
- plant name
- room/location if available
- interval or last-watered metadata
- status
- primary Water button
- secondary Snooze action where reminder support exists
- plant detail navigation

The Water action should call the existing mark-watered behavior. Snooze should use existing snooze behavior if already implemented. If snooze is not available for a plant/reminder state, show a disabled/hidden secondary action based on current product rules.

### By room

Group active plants by `location` when the user has more than one room/location.

If there are not enough room values, show a simpler collection section instead.

Unassigned plants should be grouped under:

```txt
Unassigned
```

Do not treat missing room as an error.

### Recent care

Use existing watering events and recent activity already available in the app. Keep this lightweight.

## Plants tab implementation notes

A Plants tab is a top-level collection view.

Likely route:

```txt
/app/plants
```

Purpose:

- browse full collection
- open plant detail
- add plant
- optionally browse by room
- show unassigned plants clearly

Do not add complex search/filter behavior unless scoped later.

## Settings tab implementation notes

A Settings tab is a top-level utility/settings surface.

Likely route:

```txt
/app/settings
```

Initial content can be modest:

- signed-in account context
- sign out
- sync/settings entry points if currently implemented
- app preference placeholders only where useful

Do not invent broad settings features.

## Plant detail implementation notes

Route remains:

```txt
/app/plants/[plantId]
```

The detail view should feel like an inspector.

Priority order:

1. Photo / fallback.
2. Name, room, status.
3. Water now primary action.
4. Snooze / Reminder secondary actions.
5. Care basics rows.
6. Watering history.
7. Photo / identify helper.
8. Calendar sync panel.
9. Edit/archive.

Plant detail can use grouped action controls and rows. It does not need to avoid every surface boundary; the main concern is avoiding a generic stacked dashboard-card wall.

## Add/edit flow notes

Routes remain whatever the repo currently uses for create/edit.

Goals:

- match the softer typography and icon system
- keep forms calm and readable
- group fields by meaning
- preserve manual setup usefulness
- keep AI optional and reviewable
- avoid forcing room/location

## Visual QA checklist

Before a slice is considered ready:

- no overlapping text
- Water action is obvious
- Snooze is secondary
- Add plant is discoverable
- Home / Plants / Settings app bar is clear
- room grouping works with multiple rooms
- unassigned plants display calmly
- empty/loading/error states still exist
- mobile layout works first
- desktop does not become an admin dashboard
- no RLS/auth/ownership behavior was weakened

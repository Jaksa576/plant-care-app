# Plant Care UI Redesign Visual Reference

Status: **approved final visual direction for the UI/UX overhaul campaign**.

Primary mockup reference:

```txt
docs/design/mockups/plant-care-ui-redesign-final-vision-board.png
```

Supporting cropped references:

```txt
docs/design/mockups/home-today-final-vision.png
docs/design/mockups/plants-tab-final-vision.png
docs/design/mockups/plant-detail-final-vision.png
docs/design/mockups/design-system-final-vision.png
```

## North star

Plant Care should feel like a calm, modern, watering-first home for a personal plant collection.

The product should feel:

- calm
- natural
- focused
- practical
- visual
- mobile-first
- beginner-friendly
- personal without becoming decorative

The product should not feel like:

- a generic dashboard
- a generic task manager
- a plant encyclopedia
- a diagnosis tool
- a calendar-first scheduler
- a dense admin app
- a vintage scrapbook or overly floral lifestyle product

## Final direction name

Use this internal design direction name:

```txt
Care Index + Room Chapters + Daily Log
```

Do **not** expose “Care Index” as the visible Home title. It is a design-system name, not user-facing copy.

## User-facing Home copy

The Home screen should use plain language.

Preferred header:

```txt
May 10
Today
+ Add plant
```

Primary section labels:

```txt
Needs water
By room
Recent care
```

Avoid visible Home labels such as:

```txt
Care Index
Dashboard
Tasks
Queue
```

## Screen model

### Home / Today

Purpose: answer what needs care now and what is happening next.

Structure:

1. Date and Today header.
2. Quick Add plant action.
3. Needs water.
4. By room.
5. Recent care.
6. Bottom app bar.

Core behavior:

- Watering remains the primary loop.
- Due and overdue plants appear first.
- Water is a primary icon-led button.
- Snooze is a secondary icon-led action.
- Room grouping appears when useful.
- Recent care is a lightweight log, not a dashboard widget.

### Plants tab

Purpose: full collection browsing and collection management.

Structure:

1. My plants.
2. Search or compact browse affordance if useful.
3. Add plant action.
4. Collection rows grouped by room when useful.
5. Unassigned group when plants lack location.

Plants tab may include collection controls, but avoid turning the screen into filter-pill clutter. Use simple, restrained controls only when needed.

### Plant detail

Purpose: a calm inspector for one plant.

Structure:

1. Large plant photo or fallback.
2. Plant identity: nickname/common name, room, status.
3. Primary action: Water now.
4. Secondary actions: Snooze, Reminder.
5. Care facts/fields as clean rows.
6. Care history.
7. Photo/identification helper.
8. Edit/archive actions.

Plant detail can use grouped control surfaces where needed for readability, but avoid a stacked dashboard-card wall.

## Navigation model

Use a minimal bottom app bar in the signed-in app:

```txt
Home
Plants
Settings
```

### Home

Today’s care surface:

- needs water
- room grouping
- recent care
- quick add plant

### Plants

Full collection:

- browse all plants
- browse by room
- add plant
- open plant detail

### Settings

Account and app-level settings:

- sign out
- app preferences
- sync settings
- future support/settings surfaces

Do not add top-level tabs yet for:

- health check
- AI identification
- reminders
- calendar sync

Those remain contextual flows until they earn top-level navigation.

## Visual language

### Background

Use a warm off-white background, not stark white.

Suggested values:

```txt
Warm background: #FBF8F1
Paper surface: #FFFDF8
Divider: #DED7CA
Soft divider: #EEE7DA
```

The mockup includes subtle botanical/watercolor edges. In implementation, this should be restrained and optional. Avoid heavy background art that hurts readability.

### Color direction

Use the approved logo colors and a calm natural palette.

Suggested roles:

```txt
Deep leaf / primary: #145A5D
Dark ink: #173E3F
Sage / secondary: #81B29A
Moss / positive: #A7C957
Clay / warm neutral: #F9E1D6
Stone / surface: #F6F5F2
Charcoal / text: #1F1F1F
Terracotta / attention: #E07A5F
```

Watering states:

```txt
Overdue: terracotta/coral text, not loud red
Due today: teal/aqua
Upcoming: muted ink or sage
Watered today: calm green or check icon
No schedule: muted neutral
```

### Typography

Target a softer, calmer humanist sans direction inspired by the Waking Up app feel.

Recommended implementation direction:

```txt
Primary UI: Nunito Sans or a similarly soft humanist sans
Fallback: system sans-serif
Weights: prefer 400 / 500 / 600 / 700
Avoid heavy 800+ weights except rare emphasis
```

Typography rules:

- Prefer sentence case over all caps.
- Use all caps only for small section labels when needed.
- Reduce harsh letter spacing.
- Increase line height for calm readability.
- Avoid overly formal serif UI type.
- Avoid script fonts.

Suggested type scale:

```txt
Screen title: 28–32px, semibold
Section label: 14–16px, semibold
Plant name: 15–18px, semibold
Body/meta: 12–14px, regular
Button label: 12–14px, semibold
Bottom nav label: 11–12px
```

## Iconography

Use icons to reduce text density and improve scan speed.

Style:

- simple line icons
- rounded stroke caps/joins
- consistent stroke width
- calm teal/neutral color
- accessible text labels where needed
- do not rely on icon alone for ambiguous actions unless there is visible label or aria label

Recommended icon mappings:

```txt
Water: droplet
Snooze: alarm clock
Reminder: bell
Home: home
Plants: sprout or potted plant
Settings: gear
Add plant: plus
Room / By room: home or room icon
Recent care: clock
Plant row: small leaf/sprout
Upcoming: calendar
Watered: check circle
Photo: camera
Health/future: do not add as top-level nav yet
```

Primary watering action should be icon-led:

```txt
[droplet icon]
Water / Water now
```

Snooze should be secondary:

```txt
[alarm icon]
Snooze
```

## Layout principles

### Avoid

- stacked dashboard cards on Home
- generic rounded dashboard block sections
- floating widgets
- pill filter-heavy Home screen
- generic hero dashboard
- bottom nav with too many tabs
- dense table UI on mobile

### Use instead

- editorial hierarchy
- thin dividers
- list/index rows
- room chapters
- visual plant thumbnails
- icon-led primary actions
- recent care as a chronological log
- clear mobile-first tap targets

## Home / Today row pattern

Needs water rows should clearly separate plant info, status, and actions.

Recommended row content:

```txt
[order number] [plant thumbnail] [plant name]
                         [Water icon button] [Snooze icon button]
              [room · interval/last watered]
              [status]
```

Interaction hierarchy:

1. Water: primary button.
2. Snooze: secondary button.
3. Row tap / chevron: open plant detail.
4. Add plant: quick top action, also available from Plants tab.

## Room grouping rules

Use room chapters only when they help.

Rules:

```txt
If user has 2+ rooms:
  Show By room.

If user has 0–1 rooms:
  Prefer Collection / All plants.

If some plants lack room:
  Show Unassigned as a normal group, not an error.
```

Room chapters should use text hierarchy and dividers, not rounded blocks.

## Recent care rules

Recent care should feel like a logbook.

Show:

- date
- action
- plant
- optional icon

Examples:

```txt
Today — Aloe watered
Yesterday — Fern snoozed 1 day
May 8 — Pothos photo updated
```

## Empty states

Use soft illustrations or approved logo mark sparingly.

Examples:

```txt
No plants yet
Add your first plant to get started.

All caught up
No plants need water right now.

No plants here
Add a plant to this room to see it here.
```

## Accessibility and implementation notes

- Keep text contrast high.
- Do not use icon-only buttons without aria labels.
- Minimum tap target should be about 44px.
- Water and Snooze must be reachable by keyboard/screen reader.
- Maintain loading, empty, and error states.
- Preserve route protection and user-owned data behavior.
- Do not change data ownership, RLS assumptions, or reminder/calendar semantics during visual slices.

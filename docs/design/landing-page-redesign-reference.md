# Plant Care Landing Page Redesign Reference

Status: **planned / ready for implementation slice**.

## Recommendation

Implement the landing page directly in the app using real responsive HTML/CSS/Tailwind and review it in a Vercel preview.

Do **not** rely on generated image mockups for this page. The landing page quality bar depends on actual layout behavior, responsive spacing, real typography, and real asset handling.

## Source of truth

This landing page should extend the approved signed-in UI redesign direction:

```txt
docs/design/ui-redesign-visual-reference.md
docs/design/ui-redesign-implementation-reference.md
docs/design/plant-care-brand-reference.md
docs/campaigns/ui-redesign-ux-overhaul.md
```

The landing page should preserve the product north star:

```txt
calm
natural
focused
practical
visual
mobile-first
beginner-friendly
personal without becoming decorative
```

It should not feel like:

```txt
generic SaaS dashboard
generic task manager
plant encyclopedia
diagnosis tool
calendar-first scheduler
dense admin app
vintage scrapbook
overly floral lifestyle product
```

## Landing page goal

The public landing page should explain the product in one simple story:

```txt
Plant care that starts with watering.
```

The landing page should sell the core loop:

```txt
add a plant → add a photo → identify if helpful → track watering → organize by room → keep a simple care log
```

The page should make the user feel:

```txt
This app is calm.
This app is easy to start.
This app is visual.
This app helps me remember watering.
This app keeps me in control.
```

## Primary headline and copy

### Hero headline

Use:

```txt
Plant care that starts with watering.
```

### Hero supporting copy

Use:

```txt
Track watering, rooms, photos, and simple care notes for the plants you live with — without turning care into chores.
```

### Primary CTA

Use:

```txt
Start your plant log
```

### Secondary CTA

Use:

```txt
Sign in
```

### Trust line

Use:

```txt
Helpful suggestions stay reviewable. You decide what gets saved.
```

## Page information architecture

### Header

Desktop:

```txt
Left:
  approved Plant Care logo/mark

Right:
  How it works
  Rooms
  Trust
  Sign in
  Start free
```

Mobile:

```txt
Left:
  approved Plant Care logo/mark

Right:
  Sign in or Start free
```

Keep the header quiet. Do not create a large SaaS navigation bar.

### Hero

Purpose:

Show what the app is immediately.

Layout:

Desktop:

```txt
Left column:
  eyebrow
  headline
  supporting copy
  primary CTA
  secondary CTA
  trust line

Right column:
  botanical/photo visual
  app preview
  small photo-first note
```

Mobile:

```txt
logo/header
headline
supporting copy
primary CTA
visual block
app preview
```

Hero visual rules:

- No text may sit directly on top of a busy illustration or plant photo.
- Any text over visual areas must be inside a clear paper panel with enough padding.
- Product preview should show the redesigned signed-in Today screen.
- The botanical visual should support the product story, not dominate it.
- The hero should not look like a dashboard screenshot wall.

### Core loop section

Section title:

```txt
A calmer loop for everyday plant care
```

Supporting copy:

```txt
Start with a photo, keep watering simple, and organize plants around the rooms where they live.
```

Steps:

```txt
1. Add a photo
   Start with the thing you recognize first: the plant itself.

2. Identify if helpful
   Optional suggestions can help, but you review and edit before saving.

3. Track watering
   Today shows what needs care, with Water and Snooze close by.

4. Move room by room
   Keep the collection organized the way plants live in your home.
```

Layout rules:

- Desktop can use four clean columns if spacing is comfortable.
- Mobile must stack the steps vertically.
- Do not squeeze long text into tiny cards.
- Do not use generic feature-card walls.

### Room organization section

Section headline:

```txt
Care by room, not by clutter.
```

Supporting copy:

```txt
See what needs water, then move through the rooms where your plants actually live.
```

Example room list:

```txt
Living room — Monstera · overdue
Bedroom — Snake plant · today
Kitchen — Pothos · in 3 days
Unassigned — Set room later
```

Layout rules:

- Use textual room rows and thin dividers.
- Keep it aligned with the signed-in room chapter model.
- Do not create a floorplan/map interface on the landing page.

### Trust section

Section headline:

```txt
You stay in control of every plant record.
```

Content blocks:

```txt
Your records stay yours.
Photos, notes, rooms, reminders, and suggestions stay tied to your own plant collection.

AI stays reviewable.
Identification can help, but you decide what gets saved.
```

Do not say:

```txt
AI diagnosis
plant doctor
detects disease
perfect watering
automatic care truth
```

### Final CTA

Text:

```txt
Ready to start your plant log?
```

CTA:

```txt
Start free
```

## Visual direction

### Overall feel

The page should feel:

```txt
warm
quiet
confident
product-led
visual
modern
natural
not overly decorative
```

### Background

Use the approved warm background:

```txt
#FBF8F1
```

Use subtle large background washes only if they do not hurt readability:

```txt
aqua wash
sage wash
clay wash
```

Do not use heavy watercolor art behind text.

### Surfaces and dividers

Use:

```txt
paper surface: #FFFDF8
divider: #DED7CA
soft divider: #EEE7DA
```

Avoid heavy card shadows and lots of rounded SaaS blocks.

### Color

Use:

```txt
deep leaf / primary: #145A5D
dark ink: #173E3F
sage: #81B29A
moss: #A7C957
clay: #F9E1D6
terracotta: #E07A5F
muted text: #6E817E
```

Primary buttons must use white text on deep teal/green.

### Typography

Use the same soft humanist direction as the app redesign:

```txt
Primary UI: Nunito Sans or current approved soft sans stack
Weights: 400 / 500 / 600 / 700
Avoid heavy 800+ weights except rare emphasis
```

Suggested landing scale:

Desktop:

```txt
Hero headline: 64–84px
Section headline: 36–48px
Body: 17–20px
Small: 13–15px
CTA: 14–16px semibold/bold
```

Mobile:

```txt
Hero headline: 42–52px
Section headline: 28–34px
Body: 15–17px
CTA: 14–16px
```

Typography rules:

- Prefer sentence case.
- Do not overuse all caps.
- Avoid cramped letter spacing.
- Keep line length comfortable.
- Do not place small text over imagery.

## Hero visual specification

Use one of these implementation approaches.

### Preferred: real product-preview composition

Create a hero visual with:

```txt
1. A botanical/photo panel
2. A small app preview of Today
3. A small photo-first note
```

The app preview should include:

```txt
May 10
Today
+ Add plant

Needs water
Monstera — Living room · 10 days — Overdue — Water
Snake plant — Bedroom · every 14 days — Due today — Water

By room
Living room — 2 plants
Kitchen — calm
```

The preview can be a static HTML mock within the landing page, not a real data-bound component.

### Alternative: real screenshot from redesigned app

If an actual screenshot of the redesigned Home page exists and is high quality, use it inside a phone frame.

Still keep the botanical visual separate.

## Asset guidance

Use:

```txt
approved Plant Care logo/mark
approved color palette
existing product UI components where helpful
simple line icons from the app icon system
```

Do not add stock imagery unless the license is clear and appropriate.

If the page needs a plant illustration, prefer CSS/SVG created in the repo or a simple product-safe decorative visual. Keep it restrained.

## Responsive behavior

### Desktop

Recommended structure:

```txt
max-width container around 1120–1200px
header height 80–96px
hero two-column grid
hero visual never overlaps hero copy
sections separated by generous vertical rhythm
```

### Mobile

Recommended structure:

```txt
single column
header compact
hero copy first
CTA visible before visual
visual stacked below copy
loop steps stacked
room/trust sections stacked
final CTA obvious
```

Mobile must not horizontally scroll.

## Hard layout rules

- No overlapping text.
- No text on top of busy images.
- No clipped words.
- No feature text squeezed into tiny columns.
- No dense card grid.
- No generic dashboard hero.
- No diagnosis or AI doctor language.
- No calendar-first language.
- Primary CTA must be visible above the fold on mobile.

## Accessibility

- CTAs must have accessible contrast.
- Primary buttons must use white text on teal/green.
- Images/illustrations should have useful alt text or be decorative.
- Headings should follow semantic order.
- Links/buttons should be keyboard accessible.
- Mobile tap targets should be about 44px or larger.
- Do not rely on color alone for meaning.

## Implementation quality bar

The page is ready only if:

- desktop has no visible overlap at 1440px and 1024px widths
- mobile has no overlap at 390px and 360px widths
- hero feels polished and uncluttered
- app preview is legible
- copy matches the approved tone
- CTAs route correctly
- signed-in redirect behavior is preserved if present
- `npm run build` passes

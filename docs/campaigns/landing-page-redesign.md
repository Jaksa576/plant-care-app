# Landing Page Redesign Campaign

Status: **planned**.

## Goal

Redesign the public landing page so it matches the approved Plant Care UI redesign direction and presents the product as calm, visual, watering-first, and beginner-friendly.

The landing page should introduce:

```txt
Plant care that starts with watering.
```

It should explain the loop:

```txt
add a plant → add a photo → identify if helpful → track watering → organize by room → keep a simple care log
```

## Source references

```txt
AGENTS.md
docs/product.md
docs/architecture.md
docs/current-task.md
docs/design/plant-care-brand-reference.md
docs/design/ui-redesign-visual-reference.md
docs/design/ui-redesign-implementation-reference.md
docs/design/landing-page-redesign-reference.md
```

## Product guardrails

Preserve:

- watering-first positioning
- personal plant collection positioning
- conservative AI assistance
- user-owned data language
- calm, trustworthy copy
- mobile-first layout

Avoid:

- diagnosis claims
- encyclopedia-first positioning
- generic productivity/task-manager language
- calendar-first language
- AI doctor language
- generic SaaS dashboard hero
- dense feature-grid marketing page

## Approved landing page structure

1. Header.
2. Hero.
3. Core loop.
4. Room organization.
5. Trust / AI restraint.
6. Final CTA.

## Implementation slices

### Slice 1 — Landing page redesign

Goal:

Implement the new public landing page in one PR-sized slice.

Scope:

- Public landing page only.
- Header/logo/CTA polish.
- Hero copy and visual composition.
- Static product preview.
- Core loop section.
- Room organization section.
- Trust section.
- Final CTA.
- Responsive desktop/mobile layout.
- Conservative copy.

Non-goals:

- Signed-in app changes.
- Auth changes.
- Add Plant flow changes.
- Onboarding.
- Room data model.
- Google Calendar changes.
- Health Check.
- AI diagnosis.

Acceptance criteria:

- Landing page matches `docs/design/landing-page-redesign-reference.md`.
- No text overlap on desktop or mobile.
- Primary CTA is clear above the fold.
- Page is aligned with app redesign visual language.
- Copy is watering-first and conservative.
- Mobile layout is polished.
- Sign in / start flows route correctly.
- Build passes.

Validation:

```txt
npm run lint
npm run build
npm run typecheck
npm test
```

Run only scripts that exist.

Manual QA:

- desktop 1440px
- desktop 1024px
- mobile 390px
- mobile 360px
- header links
- primary CTA
- sign in CTA
- no horizontal scroll
- no text overlap
- no inaccessible contrast

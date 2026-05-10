# Plant Care Brand Reference — Approved Revised Concept

Status: **approved visual direction for the UI overhaul campaign**.

This folder uses the approved revised concept board as the source image. The icon, app icon, and logo files are source-derived crops so the droplet, leaf shapes, gradients, and wordmark stay aligned with the approved imagery.

## Primary visual direction

Use the aqua/teal water droplet with the white sprout and soft green leaves as the primary app mark.

The design should feel:

- calm
- modern
- plant-focused
- beginner-friendly
- watering-first
- practical rather than decorative

## Important quality guardrail

Do **not** redraw or reinterpret the leaves during implementation unless there is a new design review. The leaf quality is part of the approved direction.

For now, prefer the source-derived PNGs when visual fidelity matters. The SVG files in this folder are intentionally raster-backed wrappers around the approved PNGs; they are not hand-vectorized recreations.

## Recommended repo placement

```txt
public/brand/plant-care-approved-icon-square-1024.png
public/brand/plant-care-approved-app-icon-1024.png
public/brand/plant-care-approved-logo-horizontal-1600x400.png
public/brand/plant-care-approved-auth-logo-1200x320.png
public/brand/plant-care-approved-logo-horizontal-raster.svg
docs/design/plant-care-approved-brand-reference-sheet.png
docs/design/plant-care-brand-reference.md
```

## Supabase sign-up / auth recommendation

Use:

```txt
plant-care-approved-auth-logo-1200x320.png
```

or:

```txt
plant-care-approved-logo-horizontal-raster.svg
```

Use the PNG if the surface supports raster images cleanly. Use the raster-backed SVG when the app wants an SVG file reference but should still preserve the approved image. Do not replace these with hand-drawn SVGs unless the leaf shapes are reviewed again.

## Asset notes

- `plant-care-approved-brand-reference-sheet.png` — full approved board.
- `plant-care-approved-icon-source-crop.png` — direct source crop of the standalone icon.
- `plant-care-approved-icon-square-1024.png` — square icon reference with padding.
- `plant-care-approved-icon-square-512.png` — smaller square icon reference.
- `plant-care-approved-app-icon-1024.png` — app icon mockup crop, resized for repo reference.
- `plant-care-approved-logo-horizontal-1600x400.png` — horizontal logo lockup.
- `plant-care-approved-auth-logo-1200x320.png` — auth/sign-up logo reference.
- `plant-care-approved-*-raster.svg` — SVG wrappers embedding the approved PNG art.

## Codex implementation guidance

When applying this brand direction, keep changes slice-sized and additive.

For the first implementation slice, limit scope to adding the assets and using the auth logo in the sign-up/sign-in surface. Avoid a broad UI overhaul until the brand reference is committed and reviewed.

Acceptance criteria for the first slice:

- Brand assets are added under `public/brand/`.
- The reference sheet and this note are added under `docs/design/`.
- Supabase/auth UI uses the approved auth/logo asset without changing unrelated app routes.
- The implementation does not redraw, vectorize, simplify, or replace the approved leaf shapes.
- Validation runs according to the repo’s normal implementation expectations.

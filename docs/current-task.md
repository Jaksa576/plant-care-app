# Current Task

## Current Status

- Next.js + TypeScript + Tailwind scaffold is implemented.
- Supabase email auth at `/login` is implemented.
- `/app` is protected for signed-in users.
- Signed-in shell, sign-out, middleware-based session refresh, and Home / Plants / Settings navigation are implemented.
- User-owned plant CRUD is implemented with persisted plant records, RLS ownership policies, and soft archive behavior.
- Plant detail/profile, watering state, mark-watered behavior, watering history, reminders, and reminder-aware urgency are implemented.
- Primary plant photo upload is implemented with private Supabase Storage and user-owned display/fallback behavior.
- AI-assisted plant identification is implemented as an optional Pl@ntNet-backed helper from an owned primary photo.
- Google Calendar sync is implemented as a one-way reflection of app-owned watering reminders when server OAuth configuration is present.
- The UI Redesign UX Overhaul campaign is completed, merged to `main`, and archived.
- The public landing page redesign and concise login-page UX refresh are merged to `main`.

## Active Slice

Installable App Icon Support.

Scope:

- Add install-friendly app metadata and icons only.
- Reuse the approved designed app icon at `public/brand/plant-care-approved-app-icon-1024.png`.
- Add App Router manifest metadata at `src/app/manifest.ts`.
- Add manifest icon PNGs at `public/icons/plant-care-icon-192.png`, `public/icons/plant-care-icon-512.png`, and `public/icons/plant-care-icon-maskable-512.png`.
- Add Next.js app icon conventions at `src/app/favicon.ico`, `src/app/icon.png`, and `src/app/apple-icon.png`.

Non-goals:

- Service workers, offline caching, push notifications, reminder/calendar behavior, auth changes, schema/RLS changes, and brand redesign.

## Validation Results

- `npm run lint`: passed.
- `npm run build`: passed after regenerating `src/app/favicon.ico` with RGBA icon frames.
- `npm run typecheck`: not run; no script exists.
- `npm test`: not run; no script exists.
- Local manifest check: `http://localhost:3000/manifest.webmanifest` returned the expected `name`, `short_name`, `description`, `start_url`, `scope`, `display`, `background_color`, `theme_color`, and icon entries.
- Local icon endpoint check: manifest icons plus `/icon.png`, `/apple-icon.png`, and `/favicon.ico` returned HTTP 200.

## Next Recommended Action

Review the Vercel preview in Chrome DevTools Application > Manifest, then install the preview from Chrome on an Android phone and confirm the launcher icon uses the designed Plant Care App icon.

## Validation Expectations

For future implementation slices, run the scripts that exist in `package.json`:

- `npm run typecheck` if present.
- `npm test` if present.
- `npm run build`.
- `npm run lint` if present.

For docs-only cleanup, use targeted doc consistency searches instead of app build validation.

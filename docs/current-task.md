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
- The public landing page redesign slice is implemented on branch `codex/landing-page-redesign` and awaiting validation/preview review before merge.

## Active Slice

Landing Page Redesign — Slice 1.

Scope:

- Public landing page at `/` only.
- Header, hero, static Today preview, core loop, room organization, trust/AI restraint, and final CTA.
- Approved brand mark, warm palette, Nunito Sans, and existing local icon strategy.

Non-goals:

- Signed-in app changes.
- Auth/session changes.
- Schema, RLS, onboarding, room model, PlantNet, Health Check, or calendar sync changes.

## Next Recommended Action

Run validation, review the landing page through desktop/mobile viewport QA and Vercel preview, then merge manually if accepted.

## Validation Expectations

For future implementation slices, run the scripts that exist in `package.json`:

- `npm run typecheck` if present.
- `npm test` if present.
- `npm run build`.
- `npm run lint` if present.

For docs-only cleanup, use targeted doc consistency searches instead of app build validation.

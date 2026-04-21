# Architecture

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase client helpers for future auth and data work

## Folder layout

- `src/app`: routes, layouts, and page-level server components
- `src/components`: small shared UI pieces
- `src/lib`: environment and Supabase helper utilities
- `docs`: roadmap, active task, architecture notes, and handoff context

## Routing approach

- `/` is the public landing page.
- `/login` is a placeholder route that signals where auth UX will live.
- `/app` is the future authenticated surface, but it is intentionally not protected yet.

## Supabase role in v1

- Supabase is the planned backend for auth and application data.
- This slice adds browser/server client helpers and environment handling.
- The current app does not rely on completed auth flows to render basic pages.

## Near-term boundaries

- Authentication should be the next major slice.
- Plant collection and care logs should follow only after auth basics are stable.
- AI-assisted identification and calendar sync remain out of scope for now.

# Plant Care App

Plant Care App is a personal web app for tracking plants, care routines, and notes. This repository is set up for slice-by-slice development with a simple Next.js foundation and Supabase-ready wiring.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase client helpers

## Prerequisites

- Node.js 20.9 or newer
- npm 10 or newer

## Getting started

1. Install dependencies:

```bash
npm install
```

2. Create your local environment file:

```bash
cp .env.example .env.local
```

3. Fill in the Supabase values in `.env.local`.

4. Start the development server:

```bash
npm run dev
```

5. Open `http://localhost:3000`.

## Available scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Environment variables

Required for Supabase-backed features:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Optional for future server-side admin tasks only:

- `SUPABASE_SERVICE_ROLE_KEY`

## Current routes

- `/` public landing page
- `/login` auth placeholder
- `/app` future authenticated app area placeholder

## Docs

- `docs/roadmap.md` outlines the planned slices
- `docs/current-task.md` records the active slice and definition of done
- `docs/agent-handoff.md` captures current state and next-step guidance
- `docs/architecture.md` explains the current structure and boundaries

## Notes

- AI plant identification is intentionally not implemented yet.
- Calendar sync is intentionally not implemented yet.
- The current `/app` route is a placeholder foundation, not a finished protected experience.

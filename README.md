# Plant Care App

Plant Care App is a watering-first personal web app for keeping houseplants alive with as little friction as possible. The core direction is: add a plant, identify it from a photo when useful, store editable care basics, track watering, show a clear dashboard, and sync reminders later.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth, Postgres, and Storage
- Vercel

## Prerequisites

- Node.js 20.9 or newer
- npm 10 or newer
- PowerShell on Windows

## Development Workflow

- Development is Windows-native, not WSL.
- Implementation slices use a dedicated git worktree and branch.
- Review the Vercel preview before manually merging.
- See `AGENTS.md` for the concise agent operating contract.

## Getting Started

1. Install dependencies:

```powershell
npm install
```

2. Create your local environment file:

```powershell
Copy-Item .env.example .env.local
```

3. Fill in the Supabase values in `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. Start the development server:

```powershell
npm run dev
```

5. Open `http://localhost:3000`.

## Available Scripts

```powershell
npm run dev
npm run build
npm run start
npm run lint
```

## Current State

- `/` is a public landing page.
- `/login` provides Supabase email sign-in and sign-up.
- `/app` is protected for signed-in users.
- Supabase environment handling, session helpers, middleware refresh, and sign-out exist.
- User-owned plant CRUD exists with persisted `plants` records, RLS ownership policies, and soft archive behavior.
- There is no dedicated plant detail/profile view yet.
- There is no image upload, AI identification, watering workflow, reminder system, or calendar sync yet.

## Docs

Hot-path docs:

- `AGENTS.md` is the agent operating contract.
- `docs/product.md` captures durable product truth and guardrails.
- `docs/architecture.md` describes the implemented technical shape and integration boundaries.
- `docs/roadmap.md` tracks product sequencing and slice status.
- `docs/current-task.md` identifies the active slice and next action.
- Active `docs/campaigns/*.md` files group related PR-sized slices.

Archived docs may exist under `docs/archive/` for historical context only.

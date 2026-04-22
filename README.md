# Plant Care App

Plant Care App is a personal web app for helping users keep houseplants alive and healthy with as little friction as possible. The v1 direction is watering-first: identify the plant, store basic care info, remind the user when watering is due, and track whether watering happened.

This repository is still at the beginning of that product journey. Today it contains a simple Next.js foundation, placeholder routes, and Supabase-ready helpers so the first real implementation slices can start from a clean base.

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

## Current state

- `/` is a public landing page.
- `/login` exists, but it is still a placeholder route.
- `/app` exists, but it is still a placeholder route and is not protected yet.
- Supabase environment and session helpers exist, but the real auth flow is not complete.
- There is no plant CRUD, image upload, AI identification, watering workflow, or calendar sync yet.

## Docs

- `docs/roadmap.md` outlines the current sequence of work and future phases.
- `docs/current-task.md` records the next implementation slice and definition of done.
- `docs/agent-handoff.md` captures current repo truth and next-step guidance.
- `docs/architecture.md` explains the current technical direction and product boundaries.

## Notes

- Plant identification is part of the product direction, but it is not implemented yet.
- The MVP stays focused on the personal plant collection and watering loop before richer plant knowledge or automation.
- AI features should remain assistive and should not overclaim diagnosis or certainty.
- Calendar sync is planned later, with Google Calendar first and Outlook later.

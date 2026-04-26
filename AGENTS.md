# AGENTS.md

## Purpose
This repository contains a personal plant care web app focused on helping users keep houseplants alive, starting with watering workflows.

## Product priorities
1. Watering workflow is the core product value.
2. Plant identification supports setup but is not authoritative.
3. Dashboard clarity and low-friction task completion matter more than feature breadth.
4. Health diagnosis is a later phase and should not distort v1 scope.

## Architecture direction
- Frontend/app: Next.js + TypeScript + Tailwind
- Backend platform: Supabase
- Database: Postgres
- Auth: Supabase Auth
- File storage: Supabase Storage
- Hosting: Vercel
- AI usage: assistive only, user-editable outputs
- Calendar: Google first, Outlook later

## Development principles
- Prefer the simplest thing that works.
- Make small, reviewable changes.
- Avoid premature abstraction.
- Use clear naming and modular structure.
- Keep database changes migration-safe.
- Preserve backward compatibility where practical.

## Local development and WSL resource guardrails
- Assume local development runs inside WSL/Ubuntu.
- Keep the repo under the WSL filesystem, such as `~/code/plant-care-app`, not under `/mnt/c/...`.
- Avoid running multiple dev servers for the same repo.
- Before starting the dev server, check whether port 3000 is already in use:

```bash
ss -ltnp | grep ':3000'
```

- Avoid concurrent `npm install`, `npm update`, `npm run build`, and `npm run dev` runs.
- Monitor memory and CPU when the dev server or VS Code Remote WSL feels unstable:

```bash
free -h
ps aux --sort=-%cpu | head -15
```

- Stop runaway Next/PostCSS processes if needed:

```bash
pkill -f "next-server"
pkill -f ".next/dev/build/postcss.js"
```

- Avoid Tailwind source patterns that scan the full repo or generated folders.
- Never intentionally scan `.next`, `node_modules`, `dist`, `build`, `coverage`, or `.git`.
- Avoid changing dependency specs to `latest`.

## Repository docs are the source of truth
Keep these files updated when relevant:
- docs/roadmap.md
- docs/current-task.md
- docs/agent-handoff.md
- docs/architecture.md

## Slice workflow
For each slice:
- restate scope
- state why it is next
- state explicit non-goals
- implement only that slice
- provide verification steps
- note follow-up risks or deferred items

## Guardrails
- Do not expand scope to “smart plant doctor” in v1
- Do not assume AI identification is correct
- Do not hardcode plant care truth that the user cannot edit
- Do not introduce Google + Outlook calendar sync together unless requested
- Do not add unnecessary infrastructure or services

## UX guidance
- Mobile-first
- Clear dashboard
- Fast plant setup
- Strong empty/loading/error states
- Minimize user friction for watering completion

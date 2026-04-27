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

## Development environment standard
- OS: Windows native, not WSL.
- Repo location: `C:\Code\plant-care-app`.
- Shell: PowerShell.
- Editor: VS Code standard, not Remote-WSL.
- Implementation agent: Codex running Windows-native.
- Bash and WSL assumptions are no longer valid.
- All commands must be PowerShell-compatible.
- Avoid running multiple dev servers for the same repo.
- Avoid concurrent `npm install`, `npm update`, `npm run build`, and `npm run dev` runs.
- Avoid Tailwind source patterns that scan the full repo or generated folders.
- Never intentionally scan `.next`, `node_modules`, `dist`, `build`, `coverage`, or `.git`.
- Avoid changing dependency specs to `latest`.

## Execution model
- Each implementation slice runs in its own git worktree.
- Each slice uses a dedicated branch.
- Do not develop in place on the main branch.
- Workflow:
  1. Create branch.
  2. Create worktree.
  3. Implement the scoped slice.
  4. Run validation gates.
  5. Push branch.
  6. Review via Vercel preview.
  7. Merge manually.

## Responsibility split

### ChatGPT
- Product strategy.
- Roadmap planning.
- Slice definition.
- QA triage.
- Codex prompt generation.

### Codex
- Implementation.
- Worktree execution.
- Branch management.
- Running checks.
- Updating docs when instructed.
- Committing and pushing.

## Required validation gates
Codex must run these before completing a slice:
- `npm run typecheck`
- `npm test` if present
- `npm run build`

If any validation gate fails, Codex must stop, report the errors, and not continue.

## Stop conditions
Codex must stop and report when:
- Validation fails.
- Requirements are ambiguous.
- Task scope is exceeded.
- Unexpected repo state occurs.

## Environment handling
- `.env.local` is not available in worktrees by default.
- Before running the app in a worktree, Codex must:
  1. Copy `.env.local` from the root repo.
  2. Validate required environment variables exist.
  3. Run `npm install`.

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

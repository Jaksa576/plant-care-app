# AGENTS.md

## Operating Contract

This repo is a watering-first personal plant care app. Coding agents should keep work small, branch-based, and aligned with the current docs before changing code.

## Hot-Path Docs

Read these before each slice:

- `docs/product.md` for durable product truth and guardrails.
- `docs/architecture.md` for implemented stack, auth, ownership, data model, and integration boundaries.
- `docs/roadmap.md` for product sequencing and slice status.
- `docs/current-task.md` for the active slice, acceptance criteria, and next action.
- Active `docs/campaigns/*.md` when the slice belongs to a campaign.

Archived docs may provide history, but they are not current source of truth.

## Product Guardrails

- Watering workflow is the core product value.
- Plant identification supports setup but is not authoritative.
- Care guidance must remain editable by the user.
- AI is assistive only and must expose uncertainty, review, skip, and override paths.
- Dashboard clarity and low-friction watering completion matter more than feature breadth.
- Do not drift into an encyclopedia, generic task manager, overclaimed diagnosis tool, or premature calendar-sync product.
- Mobile-first, calm UX with clear empty, loading, and error states is part of the product.

## Development Environment

- OS: Windows native, not WSL.
- Repo location: `C:\Code\plant-care-app`.
- Shell: PowerShell.
- Editor: VS Code standard, not Remote-WSL.
- Implementation agent: Codex running Windows-native.
- All commands must be PowerShell-compatible.
- Avoid running multiple dev servers for the same repo.
- Avoid concurrent `npm install`, `npm update`, `npm run build`, and `npm run dev` runs.
- Never intentionally scan `.next`, `node_modules`, `dist`, `build`, `coverage`, or `.git`.
- Avoid dependency changes unless the slice explicitly requires them; never change dependency specs to `latest`.

## Slice Workflow

Each implementation slice uses its own branch and git worktree. Do not develop in place on `main`.

1. Confirm latest `main`.
2. Create a dedicated branch.
3. Create a dedicated worktree.
4. Restate scope, why it is next, and explicit non-goals.
5. Copy `.env.local` from the root repo before running the app in a worktree.
6. Validate required environment variables before app runtime work.
7. Run `npm install` in the worktree when dependencies are needed.
8. Implement only the scoped slice.
9. Run validation gates.
10. Commit and push the branch if validation passes.
11. Review through Vercel preview before manual merge.

## Validation Gates

Before completing a code slice, run:

- `npm run typecheck` if present.
- `npm test` if present.
- `npm run build`.

If validation fails, stop and report the errors. For docs-only slices, run consistency checks and targeted searches instead of full app builds unless code or config changed.

## Documentation Freshness

Update hot-path docs when a slice changes product status, architecture, current task, or active campaign guidance. Keep docs concise and avoid large workflow manuals, obsolete version files, generated bundles, or chat transcripts.

## State Packet

When handing work back to ChatGPT or another agent, include:

- Project
- Branch
- Commit
- Merged to main
- Active campaign
- Completed work
- Current status
- Next recommended action
- Docs updated
- Manual QA needed
- Known risks

## Stop Conditions

Stop and report when:

- Validation fails.
- Requirements are ambiguous.
- Task scope is exceeded.
- Repo state is unexpectedly dirty.
- Docs disagree on implemented status or active slice and the conflict cannot be resolved from repo evidence.
- Retiring legacy docs would lose unique current-state information that cannot be safely migrated.

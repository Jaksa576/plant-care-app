# Current Task

## Current Status

- The Onboarding, Rooms, Settings, and Photo-First Add Plant Foundation campaign is completed and merged to `main`.
- The UI Redesign UX Overhaul campaign is completed, merged to `main`, and archived.
- The public landing page redesign, concise login-page UX refresh, and installable app icon support are merged to `main`.
- Repo workflow helper optimization is complete as an infrastructure/docs patch.

## Active Work

AI Care Setup campaign, Slice 5: Reviewable Watering Starting Point UI.

Workflow helper patch completed:

- Add `npm run typecheck` and `npm run check`.
- Add PowerShell helpers for worktree setup, validation, and pushed-branch verification.
- Update AGENTS/README command references.
- Ensure agents do not treat local-only commits as complete.

Next AI Care Setup scope:

- Show concise watering starting point suggestions after safe care profile match.
- Let users use, edit first, or skip suggested care basics.
- Apply only `plants.watering_interval_days` and `plants.watering_guidance` after review.
- Protect existing user-entered watering basics from silent overwrite.

Non-goals:

- No app feature changes.
- No UI changes.
- No schema, auth, RLS, provider, or dependency upgrade changes.

## Validation Expectations

- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `npm run check`
- `.\scripts\validate.ps1`

## Next Recommended Action

Push and verify the workflow helper branch, then resume the AI Care Setup campaign from the paused Slice 5 branch/worktree.

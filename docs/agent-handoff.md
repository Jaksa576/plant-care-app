# Agent Handoff

## Current status

The repository now has a clean application foundation with a public landing page, a placeholder authenticated app area, and lightweight Supabase helpers for future auth work.

## Important decisions already made

- Use Next.js App Router with TypeScript and Tailwind.
- Keep source code under `src/`.
- Keep the first slice intentionally light on abstractions.
- Use Supabase-ready helpers now, but defer the real auth implementation to the next slice.
- Keep UI simple, mobile-friendly, and easy to understand.

## Constraints to preserve

- Do not introduce AI plant identification yet.
- Do not introduce calendar sync yet.
- Avoid speculative architecture, complex state management, or premature domain layers.
- Prefer changes that are obvious to a junior/intermediate developer reading the code for the first time.

## Recommended next slice

Implement a real authentication flow:

- add a simple Supabase email-based sign-in flow
- protect `/app`
- add a signed-in shell state
- keep the plant domain out of that slice unless it is required for onboarding

## Verification still needed

Node.js was not available in the current execution environment, so installation, linting, and build verification still need to be run locally once the toolchain is available.

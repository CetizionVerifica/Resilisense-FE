---
description: Implement the UI of one ResiliSense 2.0 module in this repo (frontend) from its spec in docs/revamp/modules
argument-hint: <module id, e.g. M04> [extra notes]
---

Follow the project skill **`/build-module`** (`.claude/skills/build-module/SKILL.md`) for module **$ARGUMENTS**: it reads the CLAUDE.md chain (root → layer → module card), checks the spec is `Ready` and has a §14 contract (run `/module-contract` first if not), builds the module against that contract with fakes for unfinished dependencies, runs every check and opens the PR. Finish with `/check-module`.

The steps below are the short version, kept for reference.

Implement the frontend of module **$ARGUMENTS** in this repository (Resilisense-FE — the new Vite + React app).

1. Read `CLAUDE.md`, `docs/revamp/README.md`, `docs/revamp/02-design-system.md` and the module spec `docs/revamp/modules/<id>-*.md` (the id is the first word of the arguments), especially §5 (acceptance criteria) and §9 (UI).
2. Run `npm run api:sync` to regenerate the API client from the backend's merged `openapi.json`. If an endpoint the UI needs is missing, stop and describe the backend change needed — never hand-write fetch calls or compute scores in the UI.
3. If the spec is ambiguous or contradicts the design system, stop and propose a spec change instead of guessing.
4. Plan the routes, pages, components (reuse `src/components/ui` and the screen patterns from 02 §5), i18n namespaces and tests. Wait for approval if running interactively.
5. Implement following `CLAUDE.md` UI rules: tokens only, logical (RTL-safe) utilities, dark mode, loading/empty/error states, keyboard support, `t()` for every string, permission-aware navigation.
6. Tests: component tests for interactive pieces, MSW-backed page tests (loading/empty/error), a Playwright journey for the module's main acceptance criteria with axe checks, Storybook stories for new shared components.
7. Run lint, typecheck, unit and e2e tests; fix until green.
8. Commit with Conventional Commits, push, and open a PR titled `feat(<module>): …` that maps changes to spec sections and includes screenshots (light, dark, RTL) of the main screens.

# src/features — feature modules (layer rules)

Level 1 of the CLAUDE.md layers (`docs/revamp/06-modular-build.md` §2). One folder per module of the plan, named like its backend module. Its own `CLAUDE.md` (the module card) adds the module's contract, screens and component behaviour. Read the card before touching a feature.

## Anatomy of a feature

```
src/features/<module>/
├─ CLAUDE.md        module card: screens, components & behaviour, contract (06 §2.1)
├─ index.ts         public surface — the only file other features may import
├─ routes.tsx       RouteObject[] with lazy pages; mounted once in src/app/router.tsx
├─ pages/           one file per route, owns loading / empty / error states
├─ components/      feature-private components
├─ hooks.ts         wrappers around generated API hooks (query keys, invalidation), never raw fetch
├─ schemas.ts       Zod schemas for forms + mapping to/from API bodies
├─ mocks.ts         MSW handlers for this feature's endpoints (merged in src/mocks/handlers.ts)
└─ __tests__/       MSW-backed page tests, component tests
```

Translations live in `src/locales/en/<module>.json` (one namespace per feature).

## Boundaries (lint: `resilisense/module-boundaries`)

- Import another feature only as `@/features/<other>` (its `index.ts`). Never `@/features/<other>/components/…`.
- Need something it doesn't export? Add it to its `index.ts` with a line in its card's "Public surface", in the same PR. Prefer linking to its route over mounting its components.
- Never use another feature's hooks to fetch its data: call the generated hook for that endpoint (`src/api/generated`).
- `src/components` and `src/lib` never import a feature or `src/app`.
- `src/app/router.tsx` and `src/app/shell/nav.ts` are the composition roots: one route spread and one nav entry per feature.

## Rules every feature follows

- Server state only through generated orval hooks; invalidate their query keys after mutations.
- No business logic: scores, risk bands, rankings, permissions and state transitions come from the API. Format and visualise only.
- Permission-aware UI with `usePermission` / `<RequirePermission>`; module entitlement with `<RequireModule>` and the locked-module panel.
- Every page: skeleton while loading, empty state that explains + offers the action, error state with retry; URL-synced tabs and filters.
- Calm Ledger (`02` §9): tokens only, logical (RTL-safe) utilities, one entrance animation per view via the shared primitives, nothing that moves on its own, reduced motion respected.
- Every string through `t('<namespace>:…')`; numbers and dates through `Intl` helpers in `src/lib/format.ts`.

## Building one feature without the backend being finished

Write the contract first (`/module-contract`), then `/build-module`. Run `npm run api:sync` against the backend PR's `openapi.json` while it is in review; put the feature's MSW handlers in `mocks.ts` (they are contract-checked against `api/openapi.json`). `/check-module` reports drift when the backend lands.

## Features in this repo

Built: `auth` (M01), `settings` (M01 profile and security), `members` (M01), `workspace` (M02 settings), `companies` (M02), `partner` (M02), `home` (placeholder dashboard). Planned: the due diligence modules of `06-modular-build.md` §5 (same folder names as the backend).

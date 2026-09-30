# ResiliSense web app (Resilisense-FE)

The ResiliSense 2.0 single-page app: Vite + React 19 + TypeScript, Tailwind v4 + shadcn/ui (Radix), TanStack Query with an API client generated from the backend's `openapi.json`. Plan and specs: [`docs/revamp/`](docs/revamp/README.md) (mirrored in `CetizionVerifica/CSR_BE`). Working rules: [`CLAUDE.md`](CLAUDE.md).

The legacy CRA/antd app lives on the **`legacy`** branch, which production deploys from until cut-over.

## Getting started

```bash
nvm use                 # Node 22.12+ (24 LTS recommended)
npm ci                  # also generates src/api from api/openapi.json (orval)
cp .env.example .env.local
npm run dev             # http://localhost:5173 — proxies /v1 to the CSR_BE API on :4000
```

No backend handy? `VITE_API_MOCKS=1 npm run dev` serves the M01 API from MSW mocks
(`alice@example.com` / `correct horse battery staple`; `mfa@example.com` uses code `123456`).

## Scripts

| Command                                        | What it does                                                                                           |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `npm run dev` / `build` / `preview`            | Vite dev server, production build to `dist/`, preview                                                  |
| `npm run lint` · `typecheck` · `format:check`  | ESLint (incl. the RTL logical-properties rule), `tsc -b`, Prettier                                     |
| `npm test`                                     | Vitest + Testing Library + MSW (unit, component, page states)                                          |
| `npm run test:e2e`                             | Playwright journeys + axe against the dev server with MSW mocks                                        |
| `npm run storybook` · `build-storybook`        | Design-system workbench (theme, direction and locale toolbars, a11y panel)                             |
| `npm run i18n:check`                           | Fails when code references a key missing from `src/locales/en`                                         |
| `npm run api:sync [-- --ref <branch/tag/sha>]` | Pulls `openapi.json` from CSR_BE at the pinned ref (`api/openapi.lock.json`) and regenerates `src/api` |
| `npm run audit`                                | Production dependency audit gate                                                                       |

`api:sync` reads a local CSR_BE checkout (`CSR_BE_DIR`, default `../CSR_BE`) or the GitHub API (`GITHUB_TOKEN`).
The generated client (`src/api/generated`) is not committed; it is rebuilt on every install from the committed `api/openapi.json`.

## Layout

```
src/
  app/            providers, router (lazy routes, 404, error boundaries), shell (sidebar, top bar, ⌘K, workspace switcher)
  components/ui/  design-system primitives (shadcn-style, tokens only, RTL-safe) + stories
  features/<module>/  one folder per spec (auth = M01 public screens, home placeholder)
  lib/            api client (in-memory token, silent refresh), auth/permissions, i18n, theme
  locales/en/     i18next catalogues (ICU); en-XA pseudo-locale is generated in dev/test
  mocks/          MSW handlers mirroring the API contract
  styles/         design tokens (02 §2) and Tailwind theme
e2e/              Playwright journeys (+ axe)
api/              pinned backend contract (openapi.json + lock)
```

## Deploy

`Dockerfile` builds the static `web` image (Caddy, security headers, immutable asset caching; `VITE_API_BASE_URL` build arg, `API_ORIGIN` runtime env for the CSP). It is deployed with Kamal 2 to the VPS behind Cloudflare — no AWS (ADR-011). The Kamal config arrives with the infrastructure PR.

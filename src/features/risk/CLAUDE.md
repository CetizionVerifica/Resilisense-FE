# Supplier risk (M22 · SD06)

> Spec: `docs/revamp/modules/M22-risk.md` · Status: Draft · Wave: 2 (plan; the backend `engine/` is wave 2, these screens build with the wave-3 service) · Backend: `CSR_BE/src/modules/risk`

## Purpose

Shows buyers where their supplier risk sits and why: the risk view (heat map, top drivers, risk by category, risk trend, link to the signal feed), each supplier's risk tab (inherent and residual meters, factor breakdown, history) and the workspace risk settings. Every score, band and threshold comes from the API; this feature formats and visualises only.

## Owns

- Routes (lazy, error boundary each, inside the app shell):
  - `/risk` — risk view (`risk:read`, module `due_diligence`)
  - `/suppliers/:supplierId/risk` — supplier risk tab, a child route of the supplier detail layout of `supplier-register` (`risk:read`)
  - `/settings/risk` — risk settings (`risk:read` to view, `risk:configure` to edit)
- Nav entry in `src/app/shell/nav.ts`: group `nav.group.dueDiligence` (created by the first DD feature that lands), item `{ to: '/risk', labelKey: 'nav.risk', icon: ShieldAlert, permission: 'risk:read', module: 'due_diligence', end: false }`. Not entitled → locked-module panel.
- Namespace `src/locales/en/risk.json`; MSW handlers `src/features/risk/mocks.ts` (planned).
- Query keys: the generated ones for `/v1/suppliers/:sid/risk*`, `/v1/companies/:cid/risk/*`, `/v1/workspaces/current/risk-settings`.

## Public surface (`index.ts`, planned)

| Export              | Used by                                                                                                  |
| ------------------- | -------------------------------------------------------------------------------------------------------- |
| `riskRoutes`        | `src/app/router.tsx` (composition root)                                                                  |
| `supplierRiskRoute` | `src/app/router.tsx` passes it to `supplierDetailRoute(extraTabs)` (M19) → tab "Risk"; no feature import |

`RiskTrendCard` and `RiskByCategoryCard` stay private: the DD dashboard (`dd-reporting`) draws the same charts from `src/components/charts` with its own API data. The supplier register's risk-meter column uses `RiskMeter` from `src/components/charts` with data from the generated `GET /companies/:cid/risk/scores` hook — it does not import this feature.

## Depends on

- Generated hooks for the risk endpoints; company context (`src/lib/company-context.tsx`) for `:cid`.
- Shared: `PageHeader`, `StatTile`, `Entrance`, `DataTable`, `EmptyState`/`ErrorState`/`PageSkeleton` (`src/components/ui`, Calm Ledger additions are built by the first DD feature that needs them — likely this one); `ResiliChart`, `RiskHeatmap`, `RiskByCategoryChart`, `RiskTrendChart`, `RiskMeter`, `RiskBadge` (`src/components/charts`, planned there).
- Links by path only: `/suppliers?category=&region=` (supplier-register filters), `/monitoring` (monitoring, Signals tab), `/suppliers/esg-matches` (esg-data).

## Events

None in the browser. After `PUT risk-settings` or `POST …/risk:recompute`, invalidate the risk query keys; the API recomputes asynchronously, so the supplier tab shows "Calculating…" while `status: 'pending'` and refetches every 5 s for at most 1 min (no visual movement while polling).

## Components & behaviour

- `pages/risk-page.tsx` — 02 §9.5 risk view. Layout: 3 `StatTile`s (high-risk suppliers + delta vs last month, mean residual with band label, suppliers with missing data); heat-map card with `TopDriversPanel` beside it (below at < 1024px); `RiskByCategoryCard` + `RiskTrendCard`; signal-feed link card to `/monitoring` (rendered only when the router has the monitoring routes and the user has `monitoring:read`; never imports `@/features/monitoring`). Each card owns its query: skeleton while loading, `ErrorState` with retry on failure — one card failing never blanks the page. Page-level empty state (no supplier has a score): explains that risk is computed from country, sector and criticality + CTA "Add suppliers" (`/suppliers`).
- `RiskHeatmap` usage — category × region, value printed in every cell, legend "Lower → Higher"; `onCellClick(category, region)` navigates to `/suppliers?category=<code>&region=<code>`. Keyboard: the chart's "View as table" is the keyboard path (each cell is a link in the table); cells with 0 suppliers show "—" and are not links.
- `components/top-drivers-panel.tsx` — top 3 drivers from `GET …/risk/drivers` for the whole company or the focused heat-map cell (focus/hover a cell → filter, Escape clears); each driver: label, "affects N suppliers", mean points with sign as text ("+12 points"), never colour alone.
- `RiskByCategoryCard` — `RiskByCategoryChart` (bullet bars, band colour from `--risk-*`, value at the end, fixed reference-data order); takeaway sentence from the API numbers ("2 of 6 categories are high risk").
- `RiskTrendCard` — `RiskTrendChart`, 12 monthly points, end point labelled; `null` months show a gap, not 0.
- `pages/supplier-risk-tab.tsx` — two `RiskMeter`s (inherent, residual) with band label + number; `FactorTable` (factor, value, source + date e.g. "CSRhub · Sep 2026", points as signed text); missing-data notice listing missing factors with a link to edit the supplier; supplier risk trend (line from history); `HistoryTable` (DataTable, cursor pagination: date, previous → new score and band, trigger in words). Pending state: polite live region "Calculating risk…".
- `pages/risk-settings-page.tsx` — React Hook Form + Zod: band thresholds (integers, medium < high — server is authoritative and its `validation_failed` errors map onto fields), missing-data defaults, validity months, external-rating weight (0–0.15; disabled with an explanation when the workspace lacks the `esg_data` module). Save opens a confirm dialog "All supplier scores will be recalculated"; submit disabled while pending; read-only for users without `risk:configure`.
- Motion (02 §9.2): one entrance per view — cards `--motion-enter` (stagger 45ms, ≤ 12), meters and bars `--motion-grow` from the start edge (mirrored in RTL), lines `--motion-draw`, tile numbers `--motion-count`; refetch and filter changes update in place (`animationDurationUpdate: 0`); `prefers-reduced-motion` renders final values immediately.
- A11y: band always as label + number; heat-map cell text switches to `--on-primary` above the contrast threshold (handled by the chart); targets ≥ 24px; all charts have "View as table" and downloads (PNG/SVG/CSV).

## Invariants

- Never compute a score, band, mean or delta in the browser; thresholds shown in legends come from `bands` in the response.
- Risk colours only from `--risk-*` tokens, never the status colours; no raw hex, logical utilities only.
- Filters and the focused heat-map cell are URL-synced (`?cell=<category>:<region>`), so links are shareable.
- Supplier-workspace users never reach these routes (no `risk:read`).

## Tests

- `__tests__/risk-page.test.tsx` (MSW): loading skeletons, page empty state, per-card error + retry, cell click navigates with filters (US-22-4), table view values equal chart data (US-22-8).
- `__tests__/supplier-risk-tab.test.tsx`: meters show label + number, factor sources and dates (US-22-1, US-22-6), missing-data notice (US-22-3), pending state, history pagination (US-22-5).
- `__tests__/risk-settings.test.tsx`: validation, problem+json mapping, confirm dialog, read-only without `risk:configure` (US-22-7).
- E2e `e2e/risk.spec.ts` (planned): open risk view → click a high cell → filtered register; axe clean in light and dark.
- Stories for `RiskHeatmap`, `RiskByCategoryChart`, `RiskTrendChart`, `RiskMeter` (light, dark, RTL, reduced motion) live with those components.

## Not here

Supplier list and detail layout (`supplier-register`), signal feed and alerts (`monitoring`), ESG rating matching (`esg-data`), tiers and ranking (`screening`), the DD dashboard page and PDF reports (`dd-reporting`).

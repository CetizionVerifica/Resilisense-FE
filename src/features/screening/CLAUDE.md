# Screening & ranking (M10 §7 · SD07)

> Spec: `docs/revamp/modules/M10-supply-chain.md` §7, §9 (contract §14.1 screening) · Status: Draft · Wave: 4 · Backend: `CSR_BE/src/modules/screening`

## Purpose

The buyer's ranking and screening screen: pick a year, a screening level and a conformity range, filter the supplier population, and read the ranking, conforming, non-conforming and high-concern tables, tiers A–D and the yearly trend; export the exact same numbers to XLSX and a branded PDF. All numbers come from the API (`screening` engine); this feature formats and visualises them.

## Owns

- Route `/suppliers/ranking` (`supplier:rank`, module `ranking`; not entitled → locked-module panel). Lazy, own error boundary.
- Nav entry in `src/app/shell/nav.ts`, group `nav.group.dueDiligence`: `{ to: '/suppliers/ranking', labelKey: 'nav.ranking', icon: ListOrdered, permission: 'supplier:rank', module: 'ranking' }`.
- Namespace `src/locales/en/screening.json`; MSW handlers `src/features/screening/mocks.ts` (planned).
- Query keys: generated ones for `/v1/companies/:cid/screening*`, `/v1/screening-runs*`, `/v1/workspaces/current/screening-settings`, `/v1/companies/:cid/screening-filters`.

## Public surface (`index.ts`, planned)

| Export            | Used by              |
| ----------------- | -------------------- |
| `screeningRoutes` | `src/app/router.tsx` |

Other features link to `/suppliers/ranking?…` by path; nothing else is exported.

## Depends on

Generated screening hooks; company context; `POST /v1/dd/reports` `{ type: 'screening_ranking', params: { runId } }` (`dd-reporting`, generated hook) for the PDF; shared `PageHeader`, `StatTile`, `DataTable`, `StatusPill`, `Badge`, `Slider` (planned in `ui/`), `Select`, `DropdownMenu`, `Tabs`, `Sheet`, `Entrance`, states; `ResiliChart` (feature-private chart configs) and `RiskBadge` (`src/components/charts`, planned).

## Events

None in the browser. After `PUT screening-settings` or saving a filter, invalidate the screening keys. Export creates a run first (`POST …/screening-runs`), then downloads `…/export.xlsx` or starts the PDF job and follows it to `ready` (toast with link; polling stops after `ready`/`failed`).

## Components & behaviour

- `pages/ranking-page.tsx` — M10 §9 layout:
  1. `FilterBar` in one row (wraps on narrow screens): year (required), level (Overall · Core subject · Issue) with node multi-select for the last two, conformity range slider (two thumbs, keyboard: arrows ±1, PageUp/Down ±10, values shown as text), region, country, sector, category, impact (Low · Medium · High · Unknown), supply tier, risk band, "Verified only". All URL-synced (`?year=2026&level=issue&nodes=…`), "Reset" and "Saved filters ▾" (save/apply/delete own filters).
  2. Three `StatTile`s: suppliers assessed, % conforming, high concern (values from `totals`).
  3. URL-synced tabs Ranking · Conforming · Non-conforming · High concern.
  4. `RankChart` — horizontal bars of the top 20 by score (single primary colour; tier letter + score printed at the bar end; categorical order = rank, which is the data's meaning here), "View as table" + downloads.
  5. `RankingTable` (DataTable, cursor pagination): rank, supplier (link `/suppliers/:id`), country, category, impact, score (1 decimal via `Intl`), tier badge (A–D, letter always visible), source badge (Verified · Self-assessed · Questionnaire), conformity, `RiskBadge` (band label + residual, from the API), high-concern reasons (Tooltip text, escaped).
  6. `TrendChart` — line chart, two series (mean score, % conforming → legend; one y-axis 0–100), years without data as gaps, "View as table".
  7. `Export ▾` (XLSX with `supplier:rank`; PDF only with `dd_report:export`, else that item is hidden) and "Runs" (side `Sheet` listing earlier runs with their parameters, re-download).
- States: loading → skeleton of tiles, chart and table; empty (no supplier has a score for the year) → explains where scores come from (shared ISO 26000 results or questionnaires) + CTA "Send a questionnaire" (link `/questionnaires`) and secondary "Invite suppliers" (link `/suppliers`); empty after filters → "No suppliers match these filters" + "Reset filters"; error → `ErrorState` with retry; `entitlement_required` → locked-module panel.
- `components/screening-settings-sheet.tsx` (`supplier:manage`) — tier thresholds and default range; RHF + Zod, server `validation_failed` mapped to fields; read-only otherwise.
- Motion (02 §9.2): one entrance per view — tiles `--motion-count`, bars `--motion-grow` (from the start edge, mirrored in RTL), trend `--motion-draw`, table rows `--motion-enter` on the first load only; filter changes and pagination update in place without replaying; reduced motion renders final values.
- A11y: tier and conformity never by colour alone (letter/label text); slider has `aria-valuetext` ("50 to 100 percent"); table headers sortable by keyboard where the API supports the sort; all chart text in text tokens.

## Invariants

- Never compute a score, tier, rank, conformity, impact or mean in the browser; the page only sends filters.
- The PDF and XLSX are always produced from a run, so they match each other; the run's parameters equal the URL state at click time.
- "Tier A–D" labels are distinct from "Supply tier" (direct / sub-supplier) everywhere in copy and columns.
- Tooltip and table text from supplier data is rendered as text, never HTML.

## Tests

- `__tests__/ranking-page.test.tsx` (MSW): loading, empty (two kinds), error + retry, URL-synced filters and tabs, impact filter sent as query param (US-10-3), issue level sends nodes (US-10-3), locked panel without `ranking`.
- `__tests__/export.test.tsx`: Export creates a run then downloads XLSX / starts the PDF job with that run id (US-10-4).
- `__tests__/filter-bar.test.tsx`: slider keyboard, reset, saved filters.
- `__tests__/screening-settings.test.tsx`: thresholds form, validation mapping, read-only without `supplier:manage` (US-10-5).
- E2e `e2e/screening.spec.ts` (planned): filter → export XLSX → file numbers equal the table; axe clean light/dark.

## Not here

Supplier list and detail (`supplier-register`), risk view (`risk`), PDF layout and report history (`dd-reporting`), questionnaires (`questionnaires`).

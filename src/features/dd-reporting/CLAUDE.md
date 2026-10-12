# DD reporting (M11 §4.5 + M16 · SD12)

> Spec: `docs/revamp/modules/M11-reporting-dashboards.md` (§4.5, §9, §14.1) · Status: Draft · Wave: 4 · Backend: `CSR_BE/src/modules/dd-reporting`

## Purpose

The buyer's due diligence overview, report library, regulatory statement editor and the print routes the backend renders to PDF. It visualises numbers from the API and computes nothing.

## Owns

- Routes (planned, lazy, inside `RequireModule module="due_diligence"` → `LockedModulePanel`):
  - `/due-diligence` — DD dashboard (`dd_report:read`).
  - `/due-diligence/reports` — report library (`dd_report:read`; "New report" needs `dd_report:export`).
  - `/due-diligence/statements`, `/due-diligence/statements/:id` — statements (`dd_report:export`; approve/publish buttons need `dd_report:approve`).
  - `/print/dd/reports/:id` — print route outside the app shell (no auth session; render token from the URL).
- Nav (`src/app/shell/nav.ts`): "Overview" first in the Due diligence group (`/due-diligence`, `permission: 'dd_report:read'`, `module: 'due_diligence'`); "Reports" in Insights (`/due-diligence/reports`).
- Namespace `dd-reporting` (`src/locales/en/dd-reporting.json`); MSW handlers `mocks.ts`.

## Public surface (`index.ts`)

| Export (planned) | Used by                                                                                                                                                                                                                                                                                                                                                                                   |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| —                | Nothing for other features. Earlier-wave lists (`supplier-register`, `questionnaires`, `corrective-actions`) must not import this wave-4 feature: they use the generic `ExportMenu` primitive (planned in `src/components/ui`, props `formats`, `onExport(format)`) with the generated `GET /v1/dd/exports/:dataset.*` hook, and hide it until that endpoint exists in `api/openapi.json` |

`ddReportingRoutes` and `ddPrintRoutes` are imported by `src/app/router.tsx` only.

## Depends on

Generated `dd-reporting` hooks (`src/api/generated`); `ResiliChart` and `RiskTrendChart`, `RiskByCategoryChart`, `TierFlowChart` (`src/components/charts`); `StatTile`, `DataTable`, `StatusPill`, `StickyFooterBar` (`src/components/ui`); `company-context`, `format.ts`, auth guards (`src/lib`). Supplier and alert rows link to other features by path (`/suppliers/:id`, …), never import them.

## Events

No domain events in the browser. After `POST /v1/dd/reports` invalidate the report list and poll the report until `ready|failed`; statement edits invalidate that statement (autosave updates in place). The backend emits `report.ready|failed` (and notifies the requester itself with `notify()`) and `dd_statement.published` (M11 §10).

## Components & behaviour

- `dd-dashboard-page` — filter bar (company from the company switcher, period select, URL-synced). Layout 02 §9.5: 4 `StatTile`s (count-up `--motion-count`, delta with sign + label, never colour only) → `RiskTrendChart` + `RiskByCategoryChart` → `TierFlowChart` → `NeedsAttentionList`. Each widget owns skeleton / empty (explains + link to the module that fills it) / error (retry) and an "Not available" state for `status: 'unavailable'`. Charts: title, one-line takeaway, "View as table", PNG/SVG/CSV downloads.
- `needs-attention-list` — rows: time, severity chip (label + colour), supplier, one-line reason, link; newest first; `aria-live="polite"` only for inserted rows.
- `report-library-page` — `DataTable` (type, scope, format, language, requested by, status pill, date); polling `GET /v1/dd/reports/:id` every 3 s while `queued|rendering`, values update in place; empty state "No reports yet" + "New report"; download button for `ready`, failure reason for `failed` + "Try again".
- `new-report-dialog` — `Stepper` (type → scope → format & language → review); RHF + Zod; disables submit while pending; sends `Idempotency-Key`; toast on 202.
- `statements-page` — list with framework, period, status pill; empty state explains LkSG/CSDDD statements + "New statement".
- `statement-editor-page` — section navigator (completion per section) · section card: facts table with "as of" time and "Refresh facts" (draft only), narrative `Textarea` autosaving 800 ms debounced ("Saved · 2 s ago") · `StickyFooterBar`: Submit / Reopen / Approve / Publish per status and permission; approve disabled for the submitter with the reason (`four_eyes_required`); published = read-only with the PDF link. `ConfirmDialog` names the statement before publish.
- `print-report-page` — reads `GET /v1/dd/reports/:id/snapshot` with the render token; A4 `@page` CSS, fonts preloaded, animations off, sets `window.__REPORT_READY__ = true` after every chart's `finished` event.
- Exports: this feature only owns the library side (202 exports appear as reports); the `ExportMenu` primitive (XLSX, CSV; sync responses download, 202 shows a toast linking to `/due-diligence/reports`) lives in `src/components/ui`.

Keyboard & a11y: every control reachable by Tab, stepper and navigator with arrow keys, focus moves to the section heading on navigation, 24×24 px targets, axe clean; grievance counts `<3` read as "fewer than 3". RTL: logical utilities, charts mirrored by `ResiliChart`, numbers in `dir="ltr"` spans.

Motion (Calm Ledger, 02 §9.2): one entrance per view — tiles and rows `--motion-enter` (stagger 45 ms, ≤ 12 items), bars `--motion-grow`, lines and Sankey `--motion-draw`, counts `--motion-count`; refetches, polling and filter changes update in place with no replay; `prefers-reduced-motion` renders final values immediately. Print route: no motion.

## Invariants

No score, band, delta or rank computed in the browser; numbers formatted with `Intl` only. Tooltips never build HTML from user data. Print route never mounts the app shell or reads live endpoints.

## Tests

`__tests__/dd-dashboard.test.tsx` (US-11-5, US-11-6: loading, unavailable, error, locked module), `report-library.test.tsx` (US-11-8 polling, failed state; US-11-7 a 202 export appears in the library), `statement-editor.test.tsx` (US-11-9, US-11-10: autosave, four-eyes, locked), `print-report.test.tsx` (ready flag); e2e `e2e/dd-reporting.spec.ts` (generate report, draft → publish statement, axe). Stories for any new chart or `ui/` component (light, dark, RTL).

## Not here

Charts' implementation (`src/components/charts`); supplier, risk, CAP and alert screens (their features); ISO 26000 dashboards and share links (rest of M11); i18n framework (`src/lib/i18n.ts`).

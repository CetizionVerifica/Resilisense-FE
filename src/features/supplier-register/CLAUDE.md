# Supplier register (M19 · SD02)

> Spec: `docs/revamp/modules/M19-supplier-register.md` · Status: Draft · Wave: 2 · Backend: `CSR_BE/src/modules/supplier-register`

## Purpose

The buyer's supplier register: list, filter, create, edit, import and archive suppliers with their sites, contacts and sub-suppliers, and the supplier detail page that the other due diligence features extend with their own tabs.

## Owns

- Routes (all planned): `/suppliers` (register), `/suppliers/import` (import wizard), `/suppliers/:id` (detail layout: Overview · Sites · Contacts · Activity + tabs from other features), `/companies/:id/suppliers` (company tab).
- Nav: "Suppliers" first item of the **Due diligence** group in `src/app/shell/nav.ts` — `permission: 'supplier:read'`, `module: 'due_diligence'`, `end: false`; not entitled → `LockedModulePanel`.
- Namespace `supplier-register` (`src/locales/en/supplier-register.json`); MSW handlers `mocks.ts`; query keys from orval (`suppliers`, `supplier-imports`, `supplier-tags` tags).

## Public surface (`index.ts`)

| Export (all planned)             | Used by                                                                                                                                                                                                                                            |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `supplierRegisterRoutes`         | `src/app/router.tsx` (one spread)                                                                                                                                                                                                                  |
| `supplierDetailRoute(extraTabs)` | `router.tsx` passes tab routes of `supplier-portal` (Sharing), `questionnaires`, `supplier-evidence`, `risk`, `esg-data`, `dd-audits`, `corrective-actions`, `monitoring`, `grievances` (`handle.tab = { labelKey, order, permission?, module? }`) |
| `companySuppliersRoute`          | `router.tsx` adds it as a tab child of `companies/:id` (companies renders tabs from `handle.tab`, planned change in that feature)                                                                                                                  |
| `SupplierPicker`                 | Async combobox (search, country flag-free label, tier) reused by questionnaires, dd-audits, grievances                                                                                                                                             |

## Depends on

Generated hooks for `suppliers`, `supplier-imports`, `supplier-tags`, `files` (upload intent + complete, M14), `reference` (`src/lib/reference.ts`: countries, sectors; categories once M13 ships). Other modules' data only through their HTTP API: risk scores `GET /v1/companies/:cid/risk/scores?supplierIds=` (M22, `risk:read`) with `delta` for the change column, and questionnaire progress `GET /v1/companies/:cid/questionnaire-progress?supplierIds=` (M21 §8, `questionnaire:read`). Until those endpoints are in `api/openapi.json` the two columns are not rendered (added by a follow-up PR of this feature). `src/lib/company-context.tsx` for the selected company.

## Events

No domain events in the browser. After mutations invalidate the orval keys: create/edit/archive/restore/bulk → `suppliers` list + detail and `supplier-tags`; site/contact writes → that supplier's sites/contacts; import confirm → `supplier-imports` + `suppliers` once the job reports `completed`. The backend emits `supplier.created|updated|archived|restored|import.completed` (M19 §10).

## Components & behaviour

- `suppliers-page` (planned) — list pattern (02 §5) + register pattern (02 §9.5). Header: title, count, primary "Add supplier" (`supplier:manage`), secondary "Import". Filter bar in one row: search (debounced 300 ms), chips tier · country · risk band · status · category · tag · criticality, company select, "Archived" toggle, saved views; every filter and the cursor live in the URL (`useSearchParams`), including `region=` (set by the risk heat-map link `/suppliers?category=&region=`, shown as a removable chip) and `status=suspended`. Toolbar links (path only): "Ranking" → `/suppliers/ranking` (`supplier:rank` + module `ranking`), "Evidence" → `/suppliers/evidence`, "ESG matches" → `/suppliers/esg-matches` (`esg:read` + module `esg_data`); static paths rank before `/suppliers/:id` in React Router. Risk-band chip asks risk for ids then filters by `ids` (M19 §13 Q2); disabled with a tooltip without `risk:read`.
  - States: skeleton table (8 rows); empty register → `EmptyState` explaining the register with "Add supplier", "Import CSV/XLSX" and template download; empty filter result → "No supplier matches" + "Clear filters"; error → `ErrorState` with retry. Risk/questionnaire cells have their own skeleton and show "—" with tooltip when unavailable; their failure never fails the page.
- `suppliers-table` (planned) — `DataTable`: supplier (display + legal name, link to detail), country, tier, category, `RiskMeter` (bar + number + band label, values from the API, never computed here), questionnaire % (`ProgressBar` + number), `StatusPill` (Linked / Invited / Off-platform / Archived, plus "Suspended" from the API, icon + label), change since last period (arrow + signed number + `sr-only` text). Row selection → bulk bar: Add tag, Set criticality, Invite to portal (link to `/suppliers/invite?ids=`, owned by `supplier-portal`), Archive (`ConfirmDialog`). Selection count announced (`aria-live="polite"`).
- `supplier-sheet` (planned) — create/edit `Sheet` (React Hook Form + Zod, `schemas.ts`): Identity, Classification, Supply chain (parent `SupplierPicker`, tier read-only), Status (compliance, high concern + reason), Tags (`MultiSelect`). 409 duplicate → inline `Alert` with link to the existing supplier and "Create anyway" (`allowDuplicate`); 409 stale version → "Changed by someone else — reload"; problem+json field errors via `src/lib/form-errors.ts`. Submit disabled while pending.
- `supplier-layout` (planned) — header (display name, status pill, country, tier, criticality, buyer company), URL tabs from its own children plus `handle.tabs` of `supplierDetailRoute`; tabs filtered by `usePermission`/`useEntitlement`; archived → read-only banner with "Restore"; suspended → banner with the reason and a link to the corrective action plan (path only). 404 → "Supplier not found" empty state with back link.
- `overview-tab`, `sites-tab`, `contacts-tab`, `activity-tab` (planned) — facts + high-concern `Alert`, sub-suppliers table; sites/contacts tables with Sheets (one primary contact, radio-like toggle); contact delete warns it is permanent; activity = audit feed (relative dates via `formatRelative`). Each tab has skeleton / empty (explains + add action) / error states.
- `import-wizard-page` (planned) — `Stepper` Upload → Review → Import → Done. `FileDropzone` (CSV/XLSX ≤ 20 MB, M14 presigned upload with progress), then `POST /supplier-imports`; Review polls the import (2 s, stops at `preview_ready`) and shows `StatTile`s (rows, create, update, skip, errors) + errors `DataTable` + "Download errors"; confirm sends an `Idempotency-Key`; Import shows a determinate `ProgressBar` updated in place; Done links to `/suppliers?tag=import:<date>`. Leaving with an unconfirmed preview asks for confirmation.
- `SupplierPicker` (planned) — `Combobox` on `GET /suppliers?q=` (limit 20), keyboard: arrows, Enter selects, Esc closes; label "<display name> · <country>".
- **Motion (Calm Ledger, 02 §9.2)** — One entrance per view: table rows `--motion-enter` (≤ 12 staggered 45 ms), risk meters and progress bars `--motion-grow` once on first render, stat tiles in the import review `--motion-count`. Filter changes, pagination, polling and refetches update in place without replaying. `prefers-reduced-motion` → final values immediately. Hover tint `--motion-hover` only.

## Invariants

- No business logic: tiers, risk bands, deltas and import counts come from the API; the FE only formats (`Intl` via `src/lib/format.ts`).
- Logical utilities only (RTL); tokens only; risk colours from `--risk-*` tokens, always with label + number.
- Never imports another feature's internals; other tabs arrive only through `supplierDetailRoute(extraTabs)`.

## Tests

- `__tests__/suppliers-page.test.tsx` (US-19-6, 7: URL filters, states, viewer sees no write actions), `__tests__/supplier-sheet.test.tsx` (US-19-1, 2, 3: validation, duplicate, version conflict), `__tests__/import-wizard.test.tsx` (US-19-4), `__tests__/archive.test.tsx` (US-19-5, 10), `schemas.test.ts`.
- Playwright `e2e/supplier-register.spec.ts` (add → import → archive, axe). Stories: `SupplierPicker`, `RiskMeter` lives in `src/components/charts` (light, dark, RTL).

## Not here

Invites, Sharing tab and "My customers" (`supplier-portal`); risk views and heat map (`risk`); questionnaire screens (`questionnaires`); certificates (`supplier-evidence`); ranking (`screening`); report exports (`dd-reporting`).

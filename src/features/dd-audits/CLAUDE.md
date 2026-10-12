# Supplier audits (M23 · SD08)

> Spec: `docs/revamp/modules/M23-dd-audits.md` · Status: Draft · Wave: 4 · Backend: `CSR_BE/src/modules/dd-audits`

## Purpose

Screens for buyers to plan, schedule and run desk reviews and on-site/remote supplier audits — checklist fieldwork, findings with severity, review and approval — plus the public page where a supplier contact confirms or proposes the visit date. Everything here is planned; nothing is built yet.

## Owns

- Routes (app shell): `/supplier-audits` (tabs `programme` · `agenda` · `findings`, URL-synced `?tab=`), `/supplier-audits/:id` (tabs overview · checklist · findings · files · activity), `/supplier-audits/:id/checklist` (assessment workspace), supplier tab `/suppliers/:sid/audits`. Not `/audit` — that is the M12 audit log.
- Public route (public entry `src/public/`, planned): `/audit-visit/:token`.
- Nav: "Audits" in the **Due diligence** group of `src/app/shell/nav.ts` — `permission: 'dd_audit:read'`, `module: 'due_diligence'`; not entitled → `LockedModulePanel`.
- Namespaces `dd-audits` (app) and `public-audit-visit` (public entry); MSW handlers `mocks.ts`; query keys from orval only.

## Public surface (`index.ts`)

| Export (planned)         | Used by                                                                                                                                               |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ddAuditsRoutes`         | `src/app/router.tsx`                                                                                                                                  |
| `supplierAuditsRoute`    | `router.tsx` passes it to `supplierDetailRoute(extraTabs)` (`handle.tab = { labelKey, order, permission: 'dd_audit:read', module: 'due_diligence' }`) |
| `publicAuditVisitRoutes` | public entry router                                                                                                                                   |

## Depends on

Generated hooks for `/v1/companies/:cid/dd-audits*`, `/v1/dd-audits/*`, `/v1/dd-findings/*`, `/v1/companies/:cid/dd-findings`, `/v1/suppliers/:sid/dd-audits`, `/v1/public/audit-visits/*`; `/v1/companies/:cid/caps?findingId=` (corrective-actions API, CAP status per finding — generated hook, never its feature hooks); `/v1/files/uploads` (evidence, report); reference checklist templates/finding categories. `SupplierPicker` from `@/features/supplier-register`. `src/components/ui` (`DataTable`, `Sheet`, `RadioGroup`, `DateRangePicker`, `FileDropzone`, `StatTile`, `Timeline`, `ConfirmDialog`, `EmptyState`, `ErrorState`, `Skeleton`), `src/components/charts` (`ResiliChart`, `BarChart`), `src/lib/format.ts`.

## Events

No domain events in the browser. After mutations the page invalidates generated query keys as follows. Plan, schedule or transition → audit list + detail (and `allowedTransitions`); item answers autosave and invalidate only that audit's items and completion; finding create/edit/raise/withdraw → the audit's findings and the findings register. The backend emits `dd_audit.scheduled|completed|cancelled`, `finding.raised|withdrawn|closed` (M23 §10); CAP status per finding is read from the corrective-actions API, never derived.

## Components & behaviour

- `audits-page` (planned) — list pattern (02 §5). Programme: `DataTable` (supplier, site, type, dates, lead, status pill, result badge with icon + label, open findings) with filter chips status · type · year · result · assignee "me"; Agenda: next 90 days grouped by week (on-site/remote only); Findings: register (ref, severity badge, category, supplier, audit, age, CAP status from the corrective-actions API, link to the CAP). Primary "Plan audit", secondary "Record external audit". States: 8-row skeleton; empty explains audits + both CTAs; error with retry.
- `plan-audit-sheet` (planned) — `Sheet` in two steps (what → when & who); supplier via `SupplierPicker`, site select, type, template, scope; date range, lead + team (ineligible members disabled with a reason), contact email prefilled; API warning `auditorOverlap` shown as an inline `Alert`; problem+json (`auditor_not_eligible`, `validation_failed`) mapped to fields; submit disabled while pending.
- `record-external-sheet` (planned) — type, date, firm, result (`pass · pass_with_findings · fail`), report upload (`FileDropzone`).
- `audit-detail-page` (planned) — header (title, supplier link, type, status pill, dates, "Visit confirmed" / "Supplier proposed …" badge with Accept/Dismiss) with exactly one primary action by state (Schedule · Start · Submit · Approve); Return / Cancel / Withdraw via `ConfirmDialog` with required reason. Overview: `StatTile`s (conformance %, findings by severity, items answered x/y) + conformance by section `ResiliChart` horizontal bars in template section order with "View as table". 404 → "Audit not found" empty state.
- `checklist-page` (planned) — assessment workspace (02 §5): navigator (sections with answered/NC counts) · item card with 5-option `RadioGroup` (conforming, minor NC, major NC, critical NC, N/A; keys `1`–`5`), notes, evidence · context panel (guidance, linked findings, comments). Autosave debounced 800 ms, "Saved · 2 s ago" in an `aria-live="polite"` status; `J/K` next/previous; filters "unanswered only", "non-conformities only"; sticky submit bar with completion %. `checklist_incomplete` → list of item links. Read-only for non-assignees and after completion.
- `finding-sheet` (planned) — title, description, severity (options below the item's default disabled and explained), category, evidence; critical → "Raise now" with a dialog explaining a CAP will start.
- `supplier-audits-tab` (planned) — supplier history + "Plan audit" prefilled; legacy rows badged "Legacy record — no checklist".
- `public-audit-visit-page` (planned) — minimal shell: buyer logo, audit type, scope, site, dates; "Confirm these dates" / "Propose other dates" (date range + comment); success, used and expired-link states that reveal nothing else; mobile-first 360 px, RTL, language switch.

Keyboard & a11y: every radio, dialog and sheet labelled; severity and status always icon + label; focus returns to the triggering row after closing a sheet; 24×24 px targets.

Motion (Calm Ledger 02 §9.2): one entrance per view — `--motion-enter` for tiles and the first 12 rows (45 ms stagger), `--motion-grow` for the conformance bars, `--motion-count` for tile numbers; autosave, refetches and filters update in place; `prefers-reduced-motion` renders final values; public page uses only `--motion-hover`.

## Invariants

- Conformance, result, severity floors and allowed transitions come from the API; the UI never computes them (buttons follow `allowedTransitions` from the audit response).
- Token kept only in the URL path and memory, never in storage or logs.

## Tests

- Page tests (MSW): `__tests__/audits-list.test.tsx` (US-23-1, US-23-8, loading/empty/error), `audit-detail.test.tsx` (US-23-5, 6, 7), `checklist.test.tsx` (US-23-3, 4: keyboard, autosave, NC → finding), `public-visit.test.tsx` (US-23-2).
- E2e: `e2e/dd-audits.spec.ts` — plan → schedule → checklist → submit → approve; public confirm at 360 px + RTL; axe on every page.

## Not here

CAP screens (`corrective-actions`), alert feed (`monitoring`), supplier certificates (`supplier-evidence`), checklist template editor (`reference-data`), audit log `/audit` (M12).

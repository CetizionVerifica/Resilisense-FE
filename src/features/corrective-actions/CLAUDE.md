# Corrective actions (M09 §14.1 · SD09)

> Spec: `docs/revamp/modules/M09-actions-kpis.md` (§4.3, §9, §14.1) · Status: Draft · Wave: 3 · Backend: `CSR_BE/src/modules/corrective-actions`

## Purpose

Supplier corrective action plans: buyers issue, follow, verify and close CAPs and decide on suspension when escalation recommends it; linked suppliers respond in-app; off-platform suppliers respond through a token link in the public minimal shell. Everything here is planned; nothing is built yet.

## Owns

- Routes (app shell, buyer): `/corrective-actions` (tabs `open` · `overdue` · `verification` · `closed` · `all`), `/corrective-actions/:id` (tabs actions · responses · files · activity), supplier tab `/suppliers/:sid/corrective-actions`.
- Routes (app shell, supplier workspace): `/customer-actions`, `/customer-actions/:id` (`cap:respond`, no entitlement), linked from M20 "My customers".
- Public route (public entry `src/public/`, planned): `/cap/:token`.
- Nav: "Corrective actions" in the **Due diligence** group — `permission: 'cap:read'`, `module: 'due_diligence'`, not entitled → `LockedModulePanel`; supplier side "Corrective actions" under the M20 "My customers" group — `permission: 'cap:respond'`, no module.
- Namespaces `corrective-actions` (app) and `public-cap` (public entry); MSW handlers `mocks.ts`; orval query keys only.

## Public surface (`index.ts`)

| Export (planned)          | Used by                                                                                                                |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `correctiveActionsRoutes` | `src/app/router.tsx`                                                                                                   |
| `customerActionsRoutes`   | `router.tsx` (supplier-side routes)                                                                                    |
| `supplierCapsRoute`       | `supplierDetailRoute(extraTabs)` (`handle.tab = { labelKey, order, permission: 'cap:read', module: 'due_diligence' }`) |
| `publicCapRoutes`         | public entry router                                                                                                    |

## Depends on

Generated hooks for `/v1/companies/:cid/caps`, `/v1/caps/*`, `/v1/cap-actions/*`, `/v1/suppliers/:sid/caps`, `/v1/workspaces/current/cap-policy`, `/v1/customer-caps*`, `/v1/customer-cap-actions/*`, `/v1/public/caps/*`, `/v1/files/uploads`. `SupplierPicker` from `@/features/supplier-register` (manual CAP). Links to findings by path (`/supplier-audits/:id?tab=findings`). `src/components/ui` (`DataTable`, `StatTile`, `ProgressBar`, `Stepper`, `Timeline`, `Sheet`, `ConfirmDialog`, `FileDropzone`, `Banner`), `src/lib/format.ts`.

## Events

No domain events in the browser. After mutations invalidate the generated keys: issue/cancel/close/suspension → plan list + detail; response accept/request-changes → the plan's responses; verify/reject → the action and the plan (escalation level and `allowedTransitions` come back from the API); supplier responses and submissions → `customer-caps`. The backend emits `cap.issued|overdue|escalated|suspension_decided|closed|cancelled` (M09 §10); the supplier register shows the resulting "Suspended" status from its own API.

## Components & behaviour

- `caps-page` (planned) — 4 `StatTile`s (open plans, overdue actions, awaiting verification, suspension recommended) → URL tabs → filter chips (supplier, severity, escalation level, source, owner) → `DataTable` (ref, supplier, title, severity badge, actions done/total `ProgressBar`, next due with "Overdue n days" chip, status pill, escalation step). Primary "New corrective action plan" (sheet: supplier, title, source, actions with due dates). States: skeleton (tiles + 8 rows), empty explains CAPs and how findings create them + CTA, error with retry.
- `cap-detail-page` (planned) — header (ref, supplier link, status pill, severity, due date) with one primary action from `allowedTransitions` (Issue · Accept response · Close plan); `EscalationLadder` (Reminder → Overdue → Escalated → Suspension recommended as a `Stepper`-like list, current step with icon + text, not colour alone); suspension `Banner` with "Suspend supplier" / "Keep active" (`ConfirmDialog`, reason required; lift later). Actions tab: table with finding ref link, due date (extend → reason dialog), status, verification badge, evidence count, row actions Verify / Reject (comment). Responses tab: rounds as `Timeline` with Accept / Request changes. Issue dialog: contact email, "response required" switch (locked on for major/critical, explained).
- `customer-actions-page`, `customer-action-detail-page` (planned) — supplier side: plans grouped by customer; response form (root cause, measure + planned date per action); per-action progress (status select, note, `FileDropzone`), submit disabled until required evidence is `ready`.
- `public-cap-page` (planned) — minimal shell, same forms as the supplier side for one plan, save & resume, review before submit, thank-you and invalid/expired-link states that reveal nothing; mobile-first 360 px, RTL, language switch.
- `cap-policy-form` (planned) — in workspace settings area of this feature (`/corrective-actions?tab=settings` for `cap:manage`): due days per severity and ladder days, number inputs with units.

Keyboard & a11y: row actions reachable by keyboard and labelled with the action title; dialogs trap focus and return it; overdue and escalation are text + icon; forms link errors with `aria-describedby`; problem+json mapped to fields.

Motion (02 §9.2): `--motion-enter` for tiles and first 12 rows, `--motion-count` for tile numbers, `--motion-grow` for progress bars, once per view; mutations update in place; reduced motion renders final values; public page only `--motion-hover`.

## Invariants

- Due dates, escalation levels, overdue days, plan status and allowed transitions come from the API; the UI never computes them.
- Supplier-side and public pages show only the fields the API returns for that party; the token lives only in the URL path and memory.

## Tests

- Page tests (MSW): `__tests__/caps-list.test.tsx` (US-09-5, loading/empty/error), `cap-detail.test.tsx` (US-09-6, 7, 8, 9), `customer-actions.test.tsx` (US-09-7, 10), `public-cap.test.tsx` (US-09-6 response by token, invalid link); component test for `EscalationLadder` (screen-reader names per step).
- E2e: `e2e/corrective-actions.spec.ts` — issue CAP → supplier responds by token → submit evidence → verify → close; axe, 360 px and RTL for the public flow.

## Not here

Findings and audits (`dd-audits`), alert feed (`monitoring`), supplier status display (`supplier-register`), company actions/KPIs/targets (M09 performance feature).

# Grievances (M25 · SD11)

> Spec: `docs/revamp/modules/M25-grievances.md` · Status: Draft · Wave: 2 · Backend: `CSR_BE/src/modules/grievances`

## Purpose

The public complaints channel for workers and communities (anonymous by default, follow-up with reference + access code) and the confidential case workspace for appointed handlers, with statistics for LkSG/CSDDD reporting. Everything here is planned; nothing is built yet.

## Owns

- App routes: `/grievances` (case list), `/grievances/:id` (tabs `overview` · `messages` · `suppliers` · `measures` · `activity`, URL-synced `?tab=`), `/grievances/insights`, `/grievances/settings`.
- Public routes (public entry `src/public/`, planned, `survey.resilisense.org`): `/report/:slug` (intake + receipt), `/report/:slug/follow-up`.
- Nav (`src/app/shell/nav.ts`, last item of Due diligence): "Grievances", visible with any of `grievance:handle`, `grievance:configure`, `grievance:stats`; `module: 'due_diligence'`, locked-module panel when not entitled. Landing tab depends on permission (handlers → cases, stats-only → insights).
- Namespaces `grievances` (app) and `public-grievance` (public entry).

## Public surface (`index.ts`)

| Export (planned)             | Used by                                                                                                                                                                                                                                                                                                       |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `grievancesRoutes`           | `src/app/router.tsx`                                                                                                                                                                                                                                                                                          |
| `publicGrievanceRoutes`      | public entry router                                                                                                                                                                                                                                                                                           |
| `supplierGrievancesTabRoute` | `router.tsx` → M19 `supplierDetailRoute(extraTabs)`: tab "Grievances" at `/suppliers/:sid/grievances` (`handle.tab = { labelKey, order, permission: 'grievance:stats', module: 'due_diligence' }`; counts by status/severity from `GET /v1/suppliers/:sid/grievance-summary`, link to the filtered case list) |

## Depends on

Generated hooks for `/v1/grievance-*`, `/v1/grievances*`, `/v1/suppliers/:sid/grievance-summary`, `/v1/public/grievances/*`, `/v1/suppliers` (link combobox), `/v1/files/uploads`. `src/components/ui` (`DataTable`, `Tabs`, `Timeline`, `StatTile`, `FileDropzone`, `Switch`, `ConfirmDialog`, `EmptyState`, `ErrorState`, `Skeleton`), `src/components/charts` (`ResiliChart`, `BarChart`), `src/lib/format.ts`.

## Events

No domain events in the browser. After mutations invalidate the generated keys: triage/transition/assign → case list + detail; message, measure, supplier link → that case's tabs; channel/handler settings → `grievance-channels`, `grievance-handlers`. Public intake and follow-up keep no client cache beyond the page. The backend emits `grievance.received|supplier_linked|status_changed|substantiated|overdue` (M25 §10), never with content.

## Components & behaviour

Pages (each: skeleton, empty state that explains + CTA, `ErrorState` with retry):

- `cases-page` — list pattern: reference, received (absolute date), category, country, linked supplier, severity chip and status pill (icon + label), `DeadlineChip` ("Acknowledge by 14 Oct" / "Overdue", from API flags); filters status/category/overdue/supplier in the URL. Empty: handlers see "No reports yet — share your channel link" with copy button; configurers without a channel see "Set up your reporting channel".
- `case-page` — header (reference, status, deadlines, one primary transition action from the API's allowed transitions); `TriageForm` (category, severity, urgency, admissible, assignee; RHF + Zod, problem+json mapped to fields); `MessageThread` (reporter-visible messages visually and textually marked "Visible to reporter", composer `Switch` off by default, confirmation before sending a visible message); `SupplierLinks` (register combobox); `MeasuresList`; `Timeline` of transitions. Case text always rendered as plain text. "Declare conflict of interest" action.
- `insights-page` — 4 `StatTile`s (open cases, acknowledged on time %, median days to close, substantiated %) with `--motion-count`; `BarChart` "Cases by category" in `ResiliChart` (fixed category order from reference data, "< 3" shown as text, "View as table", downloads); cases-by-country table.
- `settings-page` — channel link + QR + copy, languages, intro texts per language, categories, deadlines, retention, handlers list (appoint/revoke with `ConfirmDialog` naming the person).
- `public-intake-page` — minimal shell, company logo, language switch, plain-language intro and protection notice, single column `body-lg`, "Stay anonymous" switch (on), optional contact, attachments, honeypot field visually hidden and `aria-hidden` + `tabIndex=-1`, review step, submit disabled while pending; generic error messages.
- `receipt-page` — reference + access code in large mono text with copy buttons, "I have saved my code" checkbox before leaving, warning that the code cannot be recovered; code kept only in component state.
- `public-follow-up-page` — reference + code form (follow-up token in memory only), coarse status, messages, "Add information", withdraw with confirmation.

Accessibility: all public pages keyboard-only, 360 px, RTL, 200 % zoom, axe clean; no third-party scripts, analytics or cookies; focus moves to the receipt heading after submit.

Motion: one entrance per app view (`--motion-enter` rows/tiles, `--motion-grow` bars, `--motion-count`); public pages only `--motion-hover`; reduced motion renders final values.

## Invariants

- No deadline, overdue flag, allowed transition or statistic is computed here.
- Access codes and follow-up tokens are never stored (`localStorage`, `sessionStorage`, URL query) or logged.
- Case content never appears in page titles, toasts or notification text.

## Tests

- MSW: `src/features/grievances/mocks.ts` (planned; contract-checked, errors via `problem()`).
- Page tests: `__tests__/public-intake.test.tsx` (US-25-1, -2), `follow-up.test.tsx` (US-25-3), `case.test.tsx` (US-25-4, -5), `insights.test.tsx` (US-25-6); component tests for `MessageThread` visibility switch and `DeadlineChip`.
- E2e: `e2e/grievances.spec.ts` — anonymous report → receipt → follow-up; handler acknowledges and replies; axe on every page.

## Not here

Supplier record (`supplier-register`), corrective action plans (`corrective-actions`), risk display (`risk`), regulatory report rendering (`dd-reporting`).

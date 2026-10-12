# Supplier evidence (M14 · SD05)

> Spec: `docs/revamp/modules/M14-files-evidence.md` (§5.2, §10, §14.2) · Status: Draft · Wave: 3 · Backend: `CSR_BE/src/modules/supplier-evidence`

## Purpose

Buyer screens to collect, request and verify suppliers' certificates and policies and to see what expires soon, plus the public page where a supplier contact uploads a requested document without an account.

## Owns

- Routes (lazy, `routes.tsx`, planned):
  - `/suppliers/evidence` — evidence register with tabs `?tab=all|review` (URL-synced) and filter chips (status, type, supplier, expires before).
  - `/suppliers/:sid/evidence` — Evidence tab: `supplierEvidenceTabRoute`, passed by `src/app/router.tsx` to M19 `supplierDetailRoute(extraTabs)` (`handle.tab = { labelKey, order, permission: 'supplier:read', module: 'due_diligence' }`); never imports `supplier-register`.
  - `/r/:token` — public document request page, minimal shell, mounted in the public entry (M08, planned).
- Nav: no own sidebar item; "Evidence" is a sub-entry under Suppliers in the Due diligence group (`nav.ts`, `permission: 'supplier:read'`, `module: 'due_diligence'`); without the entitlement the `LockedModulePanel` shows.
- Gating: pages wrapped in `<RequireModule module="due_diligence">`; add, edit, withdraw and request actions behind `usePermission('supplier:manage')`, verify actions behind `usePermission('supplier_evidence:verify')`.
- Namespace `supplier-evidence`; query keys from the generated `supplier-documents`, `document-requests` and public hooks.

## Public surface (`index.ts`)

| Export (all planned)       | Used by                                                                                                         |
| -------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `supplierEvidenceRoutes`   | `src/app/router.tsx` (`/suppliers/evidence`)                                                                    |
| `supplierEvidenceTabRoute` | `router.tsx` → `supplierDetailRoute(extraTabs)` of `supplier-register`                                          |
| `publicEvidenceRoutes`     | The public entry (`/r/:token`)                                                                                  |
| `CertificateStatusPill`    | this feature's tab and register; later features (wave 4: dd-reporting) may reuse it; status always from the API |

## Depends on

`@/features/files` (`FileUploader`, `FileListItem`, `FilePreviewSheet`, `useFileDownload`); generated hooks for supplier documents, verifications, requests, summary and `GET /v1/reference/certificate-types`; `src/components/ui` (`DataTable`, `StatTile` (planned), `Sheet`, `RadioGroup`, `StatusPill`, `EmptyState`, `ErrorState`, `Skeleton`); `src/components/charts` `ResiliChart` (planned).

## Events

Mutations invalidate: documents list of the supplier, register list, summary, and the document's verifications.

## Components & behaviour

- `evidence-register-page` — Calm Ledger list page: 4 `StatTile`s (pending review, expiring in 30 days, expired, verified %; numbers from `/summary`, `--motion-count` once) → "Expiry by month" card: `ResiliChart` horizontal-time `bar`, 12 months, one series, takeaway sentence, "View as table" + downloads, bars `--motion-grow` once → `DataTable` (supplier, type, title, valid until, status pill, verifier, source), rows `--motion-enter` (≤ 12, staggered 45 ms) on first render only. Review tab = pending review, oldest first. Loading: tile + table skeletons. Empty: "No supplier documents yet — request certificates from your suppliers or add one you hold" with "Request document". Error: `ErrorState` with retry.
- `supplier-evidence-tab` — documents grouped by certificate type with `CertificateStatusPill` (Verified · Expiring in N days · Expired · Pending review · Rejected · Missing · Requested; label + icon, never colour alone), validity, verifier; actions "Add document", "Request document". Empty state explains why evidence matters and offers both actions.
- `add-document-sheet` — RHF + Zod (`schemas.ts`): type (combobox of certificate types), title, issuer, number, issued/valid from/valid until (required when the type `expires`, number when `requires_number` — flags from the API), sites; `FileUploader` purpose `supplier_evidence`; submit disabled until the file is `ready` and while pending; problem+json mapped to fields.
- `request-document-sheet` — type, message, due date, recipient (prefilled from the supplier contact); POST with an `Idempotency-Key`; success toast names the recipient.
- `verification-sheet` — `FilePreviewSheet` content beside three `RadioGroup`s: Authentic (Yes/No), Up to date (Yes/No), Communicated (Yes/No/N/A) + comment; sends criteria only and renders the outcome the API returns (verified / rejected / verified, not communicated). Keyboard: radios with arrow keys, `Ctrl+Enter` submits; focus returns to the row afterwards.
- `public-request-page` (`/r/:token`) — minimal shell (logo, language switch), mobile-first single column at 360 px: buyer company, requested type, due date, `FileUploader`, valid-until field when required, done state. Invalid/used/expired token (410) → a plain explanation with no data. RTL-safe.
- All strings via `t('supplier-evidence:…')`; dates and counts via `Intl` (`src/lib/format.ts`), plurals with ICU ("Expiring in {count, plural, one {# day} other {# days}}").

## Invariants

- Statuses, outcomes, days left and summary numbers come from the API; the UI never computes expiry or verification results.
- Filters and tabs live in the URL; refetches update in place without replaying entrance motion; reduced motion shows final values.
- Logical (RTL-safe) utilities and tokens only.

## Tests

- `__tests__/evidence-register.test.tsx` (MSW): loading, empty, error + retry, filters in URL, table view of the chart (US-14-13 numbers match the table).
- `__tests__/add-and-verify.test.tsx`: required fields by type (US-14-8), verification outcome from the API (US-14-10), superseded shown (US-14-12).
- `__tests__/public-request.test.tsx`: upload journey (US-14-9), 410 token (US-14-14), axe.
- E2e `e2e/supplier-evidence.spec.ts`: request → public upload → review → verified, with axe. MSW handlers in `src/features/supplier-evidence/mocks.ts`. Story for `CertificateStatusPill` (light, dark, RTL).

## Not here

Upload mechanics and preview (`files`), supplier list and detail layout (`supplier-register`), risk scores (`risk`), the supplier's own shared library ("My customers", `supplier-portal`, later increment).

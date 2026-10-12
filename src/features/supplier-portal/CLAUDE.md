# Supplier portal (M20 · SD03)

> Spec: `docs/revamp/modules/M20-supplier-portal.md` · Status: Draft · Wave: 3 · Backend: `CSR_BE/src/modules/supplier-portal`

## Purpose

Both sides of the buyer–supplier connection: the buyer's Sharing tab and bulk invitations on a supplier record, the supplier's "My customers" (requests, sharing matrix, access log, profile), the consent dialog, and the public invite page that hands over to sign-up or sign-in.

## Owns

- Routes (all planned): `/suppliers/:id/sharing` (tab route for the `supplier-register` detail, `handle.tab = { labelKey: 'supplier-portal:tab.sharing', order: 20, permission: 'supplier:read', module: 'due_diligence' }`), `/suppliers/invite` (bulk invite review, `supplier:manage`), `/customers` with URL tabs `requests` · `sharing` · `access-log` · `profile`, `/customers/:linkId`; public `/supplier-invite/:token` (minimal shell, outside `AppShell`, like the auth public routes).
- Nav: "My customers" in the **Due diligence** group — `permission: 'customer:read'`, **no** `module` (answering customers is free); shown only when `GET /customers` has a link or `GET /me/supplier-invites` has one.
- Namespace `supplier-portal`; MSW handlers `mocks.ts`; orval tags `supplier-links`, `supplier-access`, `customers`, `supplier-profile`, `supplier-invites`.

## Public surface (`index.ts`)

| Export (all planned)           | Used by                                                                                   |
| ------------------------------ | ----------------------------------------------------------------------------------------- |
| `supplierPortalRoutes`         | `src/app/router.tsx` (inside `AppShell`)                                                  |
| `supplierPublicRoutes`         | `router.tsx` (public, minimal shell; no `RequireAuth`)                                    |
| `supplierSharingTabRoute`      | `router.tsx` → `supplierDetailRoute([supplierSharingTabRoute, …])` of `supplier-register` |
| `PendingSupplierInvitesBanner` | `src/app/shell/app-shell.tsx` (one line)                                                  |

`SharingLevelBadge` is feature-private (label + icon, never colour only): questionnaires is wave 2 and must not import this wave-3 feature; if another feature needs it, move a generic level badge to `src/components/ui`.

## Depends on

Generated hooks of the portal routes (M20 §8), `me` (`useMe`, `usePermission`), `companies` (logo/display name), `reference` (countries, sectors for the profile form). Links to `supplier-register` routes by path only; never imports that feature.

## Events

No domain events in the browser. After mutations invalidate: invite/resend/cancel/unlink → that supplier's link + `supplier-links` + `suppliers` (platform status pill); request/cancel → the link; grant/decline/revoke/share/level change → `customers` + requests; profile save → `supplier-profile`; accept → `customers`, `me/supplier-invites`, `/me`. The backend emits the `supplier.*` and `supplier_access.*` events of M20 §10.

## Components & behaviour

- `sharing-tab` (planned) — `LinkCard` by link status: off-platform (explain + "Invite to portal" → `InviteDialog`), invited (sent, expiry, reminders, Resend, Cancel invite), linked (supplier workspace, since, linked by, profile summary; "Apply profile changes" shows a field diff and PATCHes the M19 supplier — the only write to another module, via its HTTP API), declined/expired (reason, "Invite again"). Then `AccessTable` (year, status pill, `SharingLevelBadge`, physical audit, dates, Request/Cancel) + `RequestAccessDialog` (years multi-select, message) and the buyer access log. States: card + table skeleton; empty access → explains requests + "Request access"; error → retry. Write actions only with `supplier:manage`.
- `InviteDialog` (planned) — email (prefilled from the primary contact, editable), language, optional message; sends an `Idempotency-Key`; 409 (already invited) → inline message with "Resend instead".
- `bulk-invite-page` (planned) — reads `ids` from the URL, lists suppliers with their primary contact email, flags rows without email, "Send n invites" → 202 job, then a result summary; empty selection → back to register.
- `customers-page` (planned) — URL tabs:
  - **Requests**: cards (customer + logo, years, message) with Grant (opens `ConsentDialog`) and Decline (`Dialog` with optional reason). Empty: "No requests yet — customers who invite you appear here".
  - **Sharing**: `SharingMatrix` customers × years, `role="grid"`, arrow keys move between cells, Enter opens the cell menu (change level, share, revoke with `ConfirmDialog` naming the customer and year); each cell shows level text, never colour alone. Empty: explains linking.
  - **Access log**: `DataTable` time · customer · user · resource · year · level, filters customer/date in the URL, cursor pagination.
  - **Profile**: React Hook Form + Zod; read-only without `customer:share`; 409 stale version → reload prompt.
  - Each tab: skeleton, empty (explains + action), error with retry.
- `ConsentDialog` (planned) — customer, years, level radio (`status_only` / `full_results`) with an Included / Not included list (i18n per M20 §7.3, content from `GET /customers/consent-text`), physical audit checkbox, required "I am authorised…" checkbox; primary disabled until checked and while pending; focus trap, Esc cancels, focus returns to the trigger; sends `consentVersion` + `confirm: true`; 409 stale consent → reloads the text and asks again.
- `invite-page` (planned, public) — minimal shell (logo + buyer logo, language switch, no sidebar), single column, 360 px, RTL. States: loading skeleton; valid (who invites, "nothing is shared until you choose", Create account → `/sign-up?email=&returnTo=`, Sign in → `/sign-in` with return state, Decline); invalid/expired (one generic message); signed in (workspace choice among owner/admin workspaces with `customer:share` or "Create a workspace", then Accept → `/customers`). Decline confirms first.
- `PendingSupplierInvitesBanner` (planned) — `Alert` "<Company> invited you to share sustainability data — Review" when `GET /me/supplier-invites` is non-empty; dismissible per session; never shown inside the public shell.
- **Motion (Calm Ledger, 02 §9.2)** — One entrance per view: cards and rows `--motion-enter` (≤ 12, 45 ms stagger). Matrix cells, status changes and polling update in place. No continuous motion; `prefers-reduced-motion` → no entrance. The public page uses the same tokens.

## Invariants

- Sharing levels, what each level includes and access decisions come from the API; the FE never decides visibility.
- Access token stays in memory; the public page sends no auth header and keeps the token only in the URL path (never storage).
- All strings via `t('supplier-portal:…')`; years and dates via `Intl`.

## Tests

- `__tests__/sharing-tab.test.tsx` (US-20-1, 9, 11), `__tests__/customers-page.test.tsx` (US-20-5, 6, 7, 8, 10), `__tests__/consent-dialog.test.tsx` (keyboard, screen-reader names, disabled until consent), `__tests__/invite-page.test.tsx` (US-20-2, 3, 4: valid, invalid, signed-in choice, decline).
- Playwright `e2e/supplier-portal.spec.ts`: invite → sign up → linked → request → grant → revoke, with axe on the public page and My customers. Story for `SharingLevelBadge` and `SharingMatrix` (light, dark, RTL).

## Not here

The supplier list, record, sites and contacts (`supplier-register`); questionnaire answering and shared answers (`questionnaires`); documents (`supplier-evidence`); sign-up, sign-in and email verification (`auth`).

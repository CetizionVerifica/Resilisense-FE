# Partner clients (M02 §9 · SD01)

> Spec: `docs/revamp/modules/M02-workspaces-companies.md` · Status: Shipped (first slice) · Wave: 0 · Backend: `CSR_BE/src/modules/workspaces`

## Purpose

Partner workspaces (consultancies, agencies) onboard and open their client workspaces.

## Owns

- Route: `/partner/clients`, nav entry only in partner workspaces with `partner:manage`.
- Namespace `partner`.

## Public surface (`index.ts`)

None yet; the router imports `partnerRoutes` directly.

## Depends on

`companies` (company form: `CompanyFields`, `companySchema`, `EMPTY_COMPANY`, `toCreateBody`, `applyCompanyErrors`); generated `partner` hooks.

## Events

None of its own: events are emitted by the backend module. After every mutation the page invalidates the generated query keys it changed (06 §3.2).

## Components & behaviour

- `partner-clients-page` — list of client workspaces with their status and an "Open" action that switches workspace.
- `onboard-client-sheet` — workspace name + first company (reused company form) + owner email; one request creates the client workspace and invites its owner.

## Invariants

- Server state only through generated hooks; permissions and limits come from the API (`usePermission`, entitlements), never computed here.
- Calm Ledger (`02` §9): tokens only, logical utilities, one entrance per view through the shared primitives, nothing moves on its own, reduced motion renders final values.
- Every async view has a loading skeleton, an empty state with a call to action and an error state with retry.

## Tests

`__tests__/partner-clients.test.tsx`. Stories `US-02-*`.

## Not here

Company form internals (`companies`), workspace switching (`src/lib/auth`), client workspace settings (`workspace`).

# Partner clients (M02 §9 · SD01)

> Spec: `docs/revamp/modules/M02-workspaces-companies.md` · Status: Shipped (first slice)

## Purpose

Partner workspaces (consultancies, agencies) onboard and open their client workspaces.

## Owns

- Route: `/partner/clients`, nav entry only in partner workspaces with `partner:manage`.
- Namespace `partner`.

## Public surface (`index.ts`)

None yet; the router imports `partnerRoutes` directly.

## Depends on

`companies` (company form: `CompanyFields`, `companySchema`, `EMPTY_COMPANY`, `toCreateBody`, `applyCompanyErrors`); generated `partner` hooks.

## Components & behaviour

- `partner-clients-page` — list of client workspaces with their status and an "Open" action that switches workspace.
- `onboard-client-sheet` — workspace name + first company (reused company form) + owner email; one request creates the client workspace and invites its owner.

## Tests

`__tests__/partner-clients.test.tsx`. Stories `US-02-*`.

# Companies (M02 §9 · SD01)

> Spec: `docs/revamp/modules/M02-workspaces-companies.md` · Status: Shipped (first slice, deferred tabs in M02 §9)

## Purpose

List, create and manage the companies of a workspace; the future home of each company's projects, stakeholders and suppliers tabs.

## Owns

- Routes: `/companies`, `/companies/:id` (overview), `/companies/:id/activity`, `/companies/:id/settings`.
- Namespace `companies`; company context (`src/lib/company-context.tsx`) is set from here.

## Public surface (`index.ts`)

| Export                                                                             | Used by                                             |
| ---------------------------------------------------------------------------------- | --------------------------------------------------- |
| `CompanyFields`, `companySchema`, `EMPTY_COMPANY`, `toCreateBody`, `CompanyValues` | `partner` client onboarding reuses the company form |
| `applyCompanyErrors`                                                               | maps problem+json field errors onto those fields    |

## Depends on

Generated `companies` and `reference` hooks; `src/lib/reference.ts` (sectors, countries, display names).

## Components & behaviour

- `companies-page` + `companies-table` — list page pattern (02 §5): search, filters, create; empty state offers "New company".
- `create-company-sheet` — side sheet form; problem+json errors mapped onto fields (`form-errors.ts`), plan limits enforced by the API.
- `company-layout` — header with status, URL-synced tabs (Overview · Activity · Settings); suppliers tab is added by `supplier-register` through a route child, not by editing this layout's logic.
- `delete-company-dialog` — confirmation naming the company; the API soft-deletes and allows a restore.
- `activity-feed` — audit events, relative dates.

## Tests

`__tests__/companies.test.tsx`, `schemas.test.ts`; e2e `e2e/workspaces-companies.spec.ts`. Stories `US-02-*`.

## Not here

Workspace settings (`workspace`), partner onboarding (`partner`), suppliers (`supplier-register`).

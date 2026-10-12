# Workspace settings (M02 §9 · SD01)

> Spec: `docs/revamp/modules/M02-workspaces-companies.md` · Status: Shipped (first slice) · Wave: 0 · Backend: `CSR_BE/src/modules/workspaces`

## Purpose

Workspace profile and plan pages under `/settings`.

## Owns

- Routes: `/settings/workspace` (profile, data region read-only, partner access), `/settings/plan` (entitlements, usage vs limits).
- Namespace `workspace`.

## Public surface (`index.ts`)

| Export            | Used by                                |
| ----------------- | -------------------------------------- |
| `workspaceRoutes` | `settings` mounts it under `/settings` |

## Depends on

Generated `workspaces` hooks; `src/lib/auth/entitlements.ts`.

## Events

None of its own: events are emitted by the backend module. After every mutation the page invalidates the generated query keys it changed (06 §3.2).

## Components & behaviour

- `workspace-page` — edit name, contact, locale and time zone with `workspace:manage`; read-only otherwise.
- `plan-page` — modules bought and usage against limits as returned by the API (no limit maths in the UI).
- `partner-access-card` — partner grants on this workspace with revoke (confirm dialog names the partner).

## Invariants

- Server state only through generated hooks; permissions and limits come from the API (`usePermission`, entitlements), never computed here.
- Calm Ledger (`02` §9): tokens only, logical utilities, one entrance per view through the shared primitives, nothing moves on its own, reduced motion renders final values.
- Every async view has a loading skeleton, an empty state with a call to action and an error state with retry.

## Tests

`__tests__/workspace.test.tsx`; e2e `e2e/workspaces-companies.spec.ts`. Stories `US-02-*`.

## Not here

User profile and security (`settings`), members (`members`), platform-side plan editing (platform admin, M13).

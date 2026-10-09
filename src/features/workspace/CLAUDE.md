# Workspace settings (M02 §9 · SD01)

> Spec: `docs/revamp/modules/M02-workspaces-companies.md` · Status: Shipped (first slice)

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

## Components & behaviour

- `workspace-page` — edit name, contact, locale and time zone with `workspace:manage`; read-only otherwise.
- `plan-page` — modules bought and usage against limits as returned by the API (no limit maths in the UI).
- `partner-access-card` — partner grants on this workspace with revoke (confirm dialog names the partner).

## Tests

`__tests__/workspace.test.tsx`; e2e `e2e/workspaces-companies.spec.ts`. Stories `US-02-*`.

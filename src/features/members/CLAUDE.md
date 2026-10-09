# Members (M01 §9 · SD01)

> Spec: `docs/revamp/modules/M01-identity-access.md` · Status: Shipped (first slice)

## Purpose

Workspace admins manage who has access: members, roles, scopes and invitations.

## Owns

- Route: `/settings/members` (mounted by `settings`), needs `org:manage-users`.
- Namespace `members`.

## Public surface (`index.ts`)

| Export          | Used by                                |
| --------------- | -------------------------------------- |
| `membersRoutes` | `settings` mounts it under `/settings` |

## Depends on

Generated `members`/`invitations` hooks; `src/lib/auth` for the current user's role.

## Components & behaviour

- `members-table` — `DataTable` of members with role select and remove; actions the current role may not take are hidden (decided by the API's permission list, `roles.ts` only maps labels).
- `invitations-table` — pending invitations with resend and revoke.
- `invite-sheet` — single email or CSV upload, results from the API shown in the sheet.
- `scope-summary` — what a role can do, in words, next to the role select.

## Tests

`__tests__/members.test.tsx`; e2e `e2e/settings-members.spec.ts`. Stories `US-01-*`.

## Not here

Accepting an invitation (`auth`), platform users (platform admin, M13).

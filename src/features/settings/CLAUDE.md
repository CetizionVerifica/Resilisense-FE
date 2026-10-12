# Settings (M01 §9, M02 §9 · SD01)

> Spec: `docs/revamp/modules/M01-identity-access.md`, `M02-workspaces-companies.md` · Status: Shipped (first slice) · Wave: 0 · Backend: `CSR_BE/src/modules/identity`, `CSR_BE/src/modules/workspaces`

## Purpose

The `/settings` area: the user's own profile and security, plus the workspace pages that other features mount inside it.

## Owns

- Routes: `/settings` (redirects to `profile`), `/settings/profile`, `/settings/security`, and the `SettingsLayout` side navigation.
- Composes `workspaceRoutes` (from `workspace`) and `membersRoutes` (from `members`) under `/settings`.
- Namespace `settings`.

## Public surface (`index.ts`)

None yet; the router imports `settingsRoutes` directly. Add an `index.ts` when another feature needs something from here.

## Depends on

`auth` (`MfaSetup`, `MIN_PASSWORD`, `newPassword`), `workspace` (`workspaceRoutes`), `members` (`membersRoutes`); generated `me` hooks; `src/lib/auth/preferences.ts` (theme, density, locale).

## Events

None of its own: events are emitted by the backend module. After every mutation the page invalidates the generated query keys it changed (06 §3.2).

## Components & behaviour

- `profile-page` + `change-email-card` — name, job title, phone, language, time zone and theme; email change goes through verification.
- `security-page` + `change-password-card`, `two-factor-card`, `sessions-card` — change password, enable/disable MFA, list and revoke other sessions (current one marked, cannot be revoked here).
- `settings-layout` — side navigation filtered by permission (members only with `org:manage-users`).

## Invariants

- Server state only through generated hooks; permissions and limits come from the API (`usePermission`, entitlements), never computed here.
- Calm Ledger (`02` §9): tokens only, logical utilities, one entrance per view through the shared primitives, nothing moves on its own, reduced motion renders final values.
- Every async view has a loading skeleton, an empty state with a call to action and an error state with retry.

## Tests

`__tests__/profile.test.tsx`, `security.test.tsx`; e2e `e2e/settings-members.spec.ts`.

## Not here

Workspace profile and plan (`workspace`), members (`members`).

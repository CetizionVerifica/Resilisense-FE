# Settings (M01 §9, M02 §9 · SD01)

> Spec: `docs/revamp/modules/M01-identity-access.md`, `M02-workspaces-companies.md` · Status: Shipped (first slice)

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

## Components & behaviour

- `profile-page` + `change-email-card` — name, job title, phone, language, time zone and theme; email change goes through verification.
- `security-page` + `change-password-card`, `two-factor-card`, `sessions-card` — change password, enable/disable MFA, list and revoke other sessions (current one marked, cannot be revoked here).
- `settings-layout` — side navigation filtered by permission (members only with `org:manage-users`).

## Tests

`__tests__/profile.test.tsx`, `security.test.tsx`; e2e `e2e/settings-members.spec.ts`.

## Not here

Workspace profile and plan (`workspace`), members (`members`).

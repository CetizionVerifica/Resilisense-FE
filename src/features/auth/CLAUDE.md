# Auth (M01 §9 · SD01)

> Spec: `docs/revamp/modules/M01-identity-access.md` · Status: Shipped (first slice) · Backend: `CSR_BE/src/modules/identity`

## Purpose

Public sign-in journey and the gates every signed-in route passes through.

## Owns

- Routes (public, minimal shell): `/sign-in`, `/sign-up`, `/forgot-password`, `/reset-password/:token`, `/accept-invite/:token`, `/verify-email/:token`.
- Gates mounted by `src/app/router.tsx`: `TermsGate` (current terms accepted before the app shell).
- Namespace `auth`.

## Public surface (`index.ts`)

| Export                        | Used by                                                      |
| ----------------------------- | ------------------------------------------------------------ |
| `MfaSetup`                    | `settings` security page (enable two-factor)                 |
| `MIN_PASSWORD`, `newPassword` | `settings` change-password form, so the rule is defined once |

`authRoutes`, `publicOnlyAuthRoutes` and `TermsGate` are imported directly by the router (composition root).

## Depends on

Generated `auth`/`me`/`invitations` hooks; `src/lib/auth` (token in memory, silent refresh, `useAuth`).

## Components & behaviour

- `sign-in-page` — email + password; on `mfaRequired` switches to the TOTP/recovery step, on `mfaEnrollmentRequired` to `MfaEnrollment`; problems mapped through `problem-message.ts`; returns to the page the user came from.
- `sign-up-page`, `verify-email-page` — self-service trial sign-up and email verification with resend.
- `forgot-password-page`, `reset-password-page` — the request always answers "if an account exists…" (no account enumeration); new password validated by `newPassword`.
- `accept-invite-page` — existing users join the workspace; new users set name + password first.
- `MfaSetup` / `MfaEnrollment` — QR + secret, 6-digit confirm, recovery codes shown once with copy.
- `TermsGate` — blocks the app shell until the current terms version is accepted.
- Layout: `AuthLayout` + `AuthCard`, single column, language switch, works at 360px.

## Invariants

Access token never in `localStorage`/`sessionStorage`; every form disables submit while pending and maps problem+json to fields.

## Tests

`__tests__/sign-in.test.tsx`, `sign-up-and-verify.test.tsx`, `password-and-invite.test.tsx`, `terms-and-impersonation.test.tsx`; e2e `e2e/auth.spec.ts`. Stories `US-01-*`.

## Not here

Profile, password change and sessions (`settings`), members and invitations management (`members`).

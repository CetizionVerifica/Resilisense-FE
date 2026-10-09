# src/lib — shared frontend kernel (layer rules)

Level 1 (`docs/revamp/06-modular-build.md` §2). Cross-cutting helpers used by every feature. Nothing here imports a feature or `src/app` (lint).

| File                                      | Provides                                                                                    | Rules                                                        |
| ----------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `api-client.ts`                           | The orval mutator: the only `fetch` to the API, single 401 interceptor + silent refresh     | Never call `fetch` for the API anywhere else                 |
| `auth-token.ts`, `auth/auth-provider.tsx` | Access token in memory, session bootstrap, `useAuth`                                        | Never `localStorage`/`sessionStorage` for tokens             |
| `auth/guards.tsx`                         | `RequireAuth`, `PublicOnly`, `RequirePermission`, `RequireModule`, `LockedModulePanel`      | Permissions and entitlements come from `GET /v1/me`          |
| `auth/me.ts`, `auth/entitlements.ts`      | `useMe`, `usePermission`, `useEntitlement`, `useIsPartnerWorkspace`, `useWorkspaceReadOnly` |                                                              |
| `auth/preferences.ts`, `theme.tsx`        | Theme, language and profile preferences                                                     | `data-theme` on the root element                             |
| `i18n.ts`, `pseudo-locale.ts`             | i18next init, `directionOf`, pseudo-locale for tests                                        | Every string via `t()`                                       |
| `format.ts`                               | `formatDate`, `formatRelative` (+ number formatting as added)                               | All dates and numbers through `Intl`                         |
| `problem.ts`, `form-errors.ts`            | `ApiError`, problem+json parsing, mapping server errors to form fields                      |                                                              |
| `reference.ts`                            | Sectors, countries, display names, currencies                                               | Moves to the `reference-data` API when M13 ships, same hooks |
| `company-context.tsx`                     | The selected company for company-scoped pages                                               |                                                              |
| `utils.ts`                                | `cn()` with the type-scale tokens registered in tailwind-merge                              | Register new theme tokens here or `cn()` drops them          |

Add to `lib` only what two or more features need and that holds no business rule.

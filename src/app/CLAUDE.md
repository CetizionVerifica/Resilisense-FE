# src/app — composition root and app shell (layer rules)

Level 1 (`docs/revamp/06-modular-build.md` §2). The only code that knows every feature. Keep it thin: features plug in here with one line each and own everything else.

| File              | Role                                                                                           | Adding a module touches                                                               |
| ----------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `router.tsx`      | Route tree: public-only, auth, `RequireAuth` → `TermsGate` → `AppShell` → feature routes, 404  | One `...<module>Routes` spread (import from the feature's `routes.tsx` or `index.ts`) |
| `shell/nav.ts`    | Sidebar groups (02 §3): Workspace · Engagement · Due diligence · Insights · Admin              | One `NavItem` with `permission` and, for paid modules, `module` (entitlement)         |
| `shell/*`         | Sidebar, top bar, workspace and company switchers, command palette, notification bell, banners | Optional command palette entry                                                        |
| `providers.tsx`   | Query client, i18n, theme, auth, toasts                                                        | Nothing                                                                               |
| `route-error.tsx` | Route error boundary, 404, lazy-route fallback                                                 | Nothing                                                                               |

Rules:

- Nav items are filtered by permission and entitlement only (never ad-hoc role checks); a non-entitled module shows `LockedModulePanel`.
- Due diligence modules go in the **Due diligence** group in this order: Overview · Suppliers · Questionnaires · Risk · Ranking · Evidence · Audits · Corrective actions · Monitoring · Grievances. Supplier-side items: My customers · Questionnaire requests · Customer actions. DD reports stay in Insights. Supplier detail tabs are added through `supplierDetailRoute(extraTabs)` (`supplier-register`), never by editing another feature.
- The shell follows Calm Ledger (`02` §9): dark slate sidebar in both themes, amber active bar on the start side, no motion beyond `--motion-hover`.
- Never put feature logic, API calls or feature-specific state here.

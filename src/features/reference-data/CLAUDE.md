# Reference data (M13 §3.3 · SD14)

> Spec: `docs/revamp/modules/M13-platform-admin-content.md` §3.3, §5, §6, §14 · Status: Draft · Wave: 1

## Purpose

Platform-admin screens for the global reference data: countries, sectors, supplier categories, risk index sources and their yearly import batches, and the questionnaire template library. Only platform owners see them. Tenant forms do not use this feature: they read lists through `src/lib/reference.ts`.

## Owns

- Routes (planned, lazy): `/admin/reference` redirecting to `/admin/reference/countries`; URL-synced tabs `countries`, `sectors`, `categories`, `risk-indices`, `templates`; `/admin/reference/risk-indices/:source` (batches), `/admin/reference/risk-indices/:source/imports/:id` (preview + publish), `/admin/reference/templates/:id` (editor or read-only version).
- Nav: one entry "Reference data" in a "Platform admin" group of `src/app/shell/nav.ts`, `permission: 'reference:manage'` (hidden for everyone else). Header label "Platform admin" (M13 §6) so it is never confused with workspace settings.
- Namespace `reference-data` (`src/locales/en/reference-data.json`). Query keys: the generated `reference` and `platform-reference` hooks.
- MSW handlers in `mocks.ts` for `/v1/reference/*` and `/v1/platform/reference/*`.

## Public surface (`index.ts`)

| Export (planned)      | Used by                           |
| --------------------- | --------------------------------- |
| `referenceDataRoutes` | `src/app/router.tsx` (one spread) |

Nothing else. Other features read lists through `src/lib/reference.ts` (kernel; add `useCategories()` there when this module lands) and never import this feature.

## Depends on

Generated hooks of the reference-data API (M13 §5.2); `usePermission('reference:manage')` / `<RequirePermission>`; `src/lib/reference.ts` for display names (`Intl.DisplayNames` for countries). No other feature.

## Components & behaviour

- `reference-page` — tab layout (Calm Ledger list pattern, `02` §5 / §9); tab in the URL; one entrance animation for the view, none per tab switch.
- `countries-tab`, `sectors-tab`, `categories-tab` — tables (TanStack Table) with search; sectors and categories as two-level groups; "Retired" shown as a dot+label status pill, never colour alone. Edit and retire in a side sheet (RHF + Zod); retire asks for confirmation naming the entry. Countries: region only. Loading skeleton rows, empty state with "Add category" (categories), error state with retry.
- `risk-index-sources-tab` — sources with publisher, licence, dimension, scale and direction; "Add source" sheet. Empty state explains that values are imported per year.
- `import-batch-sheet` — paste or upload CSV (`code,value`), parsed in the browser into JSON rows for `POST …/imports` (no value is transformed or scored); server field errors (problem+json) listed by row number.
- `import-preview-page` — rows with unknown codes, missing subjects and change vs the published batch (numbers through `Intl`, decimal strings from the API shown as-is, no recalculation); "Publish" with confirmation that it supersedes the published batch of the same year; "Discard draft". Values are never charted here.
- `templates-tab` + `template-editor-page` — list by purpose with version and status; draft editor (sections, questions, answer type, options) validated by a Zod schema mirroring the API; published versions read-only with "New version". 409 from the API shows "This version is published; create a new version".
- Keyboard: tabs are a Radix tab list (arrow keys), sheets trap focus and return it to the trigger, every action reachable without a mouse, targets ≥ 24×24 px.

## Invariants

- No business logic: retirement effects, supersession, validation verdicts and template versions come from the API.
- Every string through `t('reference-data:…')`; labels of list entries come from the API (`label_key`), never hard-coded.

## Tests

Planned: `__tests__/reference-page.test.tsx` (tabs in URL, loading / empty / error per tab, 403 hides nav), `__tests__/import-preview.test.tsx` (preview, publish, field errors), `__tests__/template-editor.test.tsx` (draft edit, 409 on published); e2e `e2e/reference-data.spec.ts` (platform owner imports and publishes a batch, axe clean). Stories US-13-1 … US-13-6.

## Not here

Tenant-facing pickers and labels (`src/lib/reference.ts`), workspace templates and campaigns (`questionnaires`), risk views and scores (`risk`), the rest of the admin area (workspaces, users, help, legal, flags — later M13 modules).

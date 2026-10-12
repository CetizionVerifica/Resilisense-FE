# External ESG data (M26 · SD16)

> Spec: `docs/revamp/modules/M26-esg-data.md` · Status: Draft · Wave: 4 (optional — CSRhub licence pending) · Backend: `CSR_BE/src/modules/esg-data`

## Purpose

Shows a supplier's external ESG rating (CSRhub) with its source and date, and lets buyers review and confirm which provider company is their supplier. The rating is information next to the buyer's own assessment; it is weighted into risk only by the backend (`risk`), never here.

## Owns

- Routes (lazy, own error boundary): `/suppliers/esg-matches` — match review (`esg:match` to act, `esg:read` to view; module `esg_data`); `/suppliers/:supplierId/esg` — supplier tab "ESG rating" (`esg:read`; tab hidden without the module).
- No nav item: the supplier register toolbar links to it ("ESG matches", visible with `esg:read` + module) — `supplier-register` renders that link by path.
- Namespace `src/locales/en/esg-data.json`; MSW handlers `src/features/esg-data/mocks.ts` (planned).
- Query keys: generated ones for `/v1/suppliers/:sid/esg-rating`, `/v1/companies/:cid/esg-matches`, `/v1/esg-matches/:id/*`, `/v1/esg-provider/search`.

## Public surface (`index.ts`, planned)

| Export                                      | Used by                                                                                                                                                                 |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `esgDataRoutes`                             | `src/app/router.tsx`                                                                                                                                                    |
| `supplierEsgRoute`                          | `src/app/router.tsx` passes it to `supplierDetailRoute(extraTabs)` (M19) → supplier tab "ESG rating" at `/suppliers/:supplierId/esg`                                    |
| `ExternalRatingPanel` (props: `supplierId`) | The tab above; exported for the DD dashboard / reports preview if they need it. `risk` does **not** mount it — the risk tab shows the external factor from the risk API |

## Depends on

Generated esg-data hooks; `useEntitlement('esg_data')`, `usePermission`; shared `DataTable`, `Sheet`, `StatusPill`, `EmptyState`, `ErrorState`, `Skeleton`, `Entrance`; `src/lib/format.ts` for month and number formatting. Links to `/suppliers/:supplierId` by path.

## Events

None in the browser. After confirm / reject / no-match invalidate the match-list and the supplier's `esg-rating` keys; a newly confirmed match shows "Fetching rating…" until the rating arrives (refetch every 5 s, at most 1 min).

## Components & behaviour

- `ExternalRatingPanel` — compact card. States, in this order:
  1. not entitled → one-line locked note with "Learn more" (not a full locked panel, it sits inside other pages);
  2. API `feature_disabled` → "External ratings are not available yet";
  3. loading → skeleton of the card;
  4. error → `ErrorState` (compact) with retry;
  5. match `suggested`/`pending` → "Possible matches found" + link "Review match";
  6. `no_match` → "Not covered by CSRhub — common for smaller companies" (neutral, not an error);
  7. confirmed with rating → overall value (large) + 4 category bars (Community, Employees, Environment, Governance; values printed, bars `--motion-grow` once), line "CSRhub · Sep 2026" (month via `Intl.DateTimeFormat`), attribution text, "Stale" `StatusPill` (neutral tone) when `stale`; history sparkline of up to 12 months with "View as table".
     Never uses `--risk-*` colours (a rating is not a risk band) and never shows a number without source and month.
- `pages/esg-matches-page.tsx` — list page pattern (02 §5): URL-synced tabs Suggested · Unmatched · Confirmed · Rejected; DataTable (supplier, country, status, best candidate, strength in words "Strong / Likely / Possible" + number). Row expand button (`aria-expanded`) shows candidates with name, country, identifiers and the reasons. Actions per candidate: Confirm (`aria-label` names the candidate), Reject; per supplier: No match, Search provider (side `Sheet` with a search form, results list, Confirm). Submit buttons disabled while pending; `409 conflict` → toast "Already decided by someone else" + refetch. Loading skeleton; empty per tab (e.g. Suggested: "No suggestions to review — new suppliers are matched each month" + link to the register); error with retry. Read-only for `esg:read` without `esg:match`.
- Motion: one entrance per view (`--motion-enter` on rows of the first page only); expand/collapse uses `--motion-hover` timing; reduced motion → no animation.

## Invariants

- No match strength, staleness or rating maths in the browser: strength, `stale` and `attribution` come from the API.
- Source and month are always rendered next to a value, also in table views and downloads.
- Non-entitled or provider-off workspaces never call the provider search.

## Tests

- `__tests__/external-rating-panel.test.tsx` (MSW): all seven states, source + month always present (US-26-3, US-26-5).
- `__tests__/esg-matches-page.test.tsx`: tabs URL-synced, confirm/reject/no-match flows with invalidation, 409 handling, keyboard expand, screen-reader names (US-26-1, US-26-2).
- E2e `e2e/esg-data.spec.ts` (planned, only when the module is enabled in the e2e mocks): review → confirm → panel shows rating; axe clean.

## Not here

Risk weighting and settings (`risk`), supplier detail layout and toolbar (`supplier-register`), report output (`dd-reporting`).

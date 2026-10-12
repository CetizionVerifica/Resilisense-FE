# Monitoring & alerts (M24 · SD10)

> Spec: `docs/revamp/modules/M24-monitoring.md` · Status: Draft · Wave: 4 · Backend: `CSR_BE/src/modules/monitoring`

## Purpose

The compliance officer's daily view: a live signal feed of what changed across suppliers, alerts to triage, reassessment cycles, watchlist (sanctions / adverse-media) matches to review and alert rules. Other features link here by path (the risk view links to `/monitoring`); nothing is mounted elsewhere. Everything here is planned; nothing is built yet.

## Owns

- Routes: `/monitoring` (URL tabs `signals` · `alerts` · `reassessments` · `watchlist` · `rules`; filters in the query string), supplier tab `/suppliers/:sid/monitoring`.
- Nav: "Monitoring" in the **Due diligence** group — `permission: 'monitoring:read'`, `module: 'due_diligence'`; not entitled → `LockedModulePanel`. Rules tab only with `monitoring:manage`; triage buttons only with `monitoring:triage`.
- Namespace `monitoring`; MSW handlers `mocks.ts`; orval query keys only.

## Public surface (`index.ts`)

| Export (planned)          | Used by                                                                                                                       |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `monitoringRoutes`        | `src/app/router.tsx`                                                                                                          |
| `supplierMonitoringRoute` | `supplierDetailRoute(extraTabs)` (`handle.tab = { labelKey, order, permission: 'monitoring:read', module: 'due_diligence' }`) |

## Depends on

Generated hooks for `/v1/companies/:cid/{signals,alerts,monitoring/summary,needs-attention,reassessment-cycles,watchlist}`, `/v1/suppliers/:sid/{signals,watchlist}`, `/v1/alerts/*`, `/v1/monitoring/rules*`, `/v1/reassessment-cycles/*`, `/v1/reassessment-items/*`, `/v1/watchlist-matches/*`. Links to source records by path only (certificates, CAPs, audits, questionnaires, grievances, suppliers). `src/components/ui` (`StatTile`, `DataTable`, `Sheet`, `Timeline`, `Switch`, `Dialog`, `Badge`, `EmptyState`, `ErrorState`, `Skeleton`), `src/lib/format.ts` (relative + absolute dates, `Intl`).

## Events

No domain events in the browser. After triage actions (acknowledge, assign, resolve, dismiss) invalidate that alert, the alerts list and `monitoring/summary`; after rule, cycle or watchlist-review changes invalidate their lists. The feed polls `signals?since=` every 60 s while the tab is visible (no movement on update beyond the 180 ms insertion fade, paused on hover/focus). The backend emits `alert.raised|resolved`, `reassessment.due`, `watchlist.match_confirmed` (M24 §10).

## Components & behaviour

- `monitoring-page` (planned) — 4 `StatTile`s (open critical alerts, open alerts, reassessments due in 30 days, matches to review) → tabs. Per-tab skeletons; empty feed: "No signals yet — signals appear when certificates near expiry, actions run late, risk changes or screening finds a match" + CTA "Set up a reassessment cycle"; error with retry per tab.
- `SignalFeed` (planned, `components/signal-feed.tsx`, 02 §9.4) — `<ol>` newest first; row = time (relative, absolute in `Tooltip`), severity chip (icon + label, §2.3 info/warning/danger tokens), supplier link, one line `t(titleKey, params)` (params as text, never HTML), link to the source. Live: polls `since=<newest occurredAt>` every 60 s only while `document.visibilityState === 'visible'`; new rows fade in over 180 ms at the top; a visually hidden `aria-live="polite"` region announces "N new signals" once per batch; while pointer hover or focus is inside the feed, new rows are buffered and a "N new signals — Show" button appears (focus stays put); never scrolls on its own (WCAG 2.2.2); "Load older" button pages by cursor. Reduced motion: no fade.
- `SignalFeedPanel` (planned, feature-private) — `Card` wrapper with title, filters (severity, source) and `SignalFeed` for a company (Signals tab) or a supplier (supplier tab).
- `alerts-tab` (planned) — `DataTable` (severity, title, supplier, opened, last signal, assignee, status pill); row opens `alert-sheet`: signal history `Timeline`, source link, Acknowledge · Assign (member combobox) · Resolve (note) · Dismiss (reason); buttons from `allowedTransitions` and permission.
- `reassessments-tab` (planned) — cycle cards (kind, scope chips, months per band, counts by status) + items table (supplier, risk band label + number, last done, next due, status); `cycle-sheet` (kind, template, scope chips, interval per band, lead days); Trigger now / Skip (reason).
- `watchlist-tab` (planned) — pending matches first, then recent checks; `match-review-dialog` shows provider data as plain text (list, matched name, score %, published date, source link `target="_blank" rel="noopener noreferrer"`), Confirm / False positive with required note; checks with `error` read "Not screened — provider unavailable", never "clear".
- `rules-tab` (planned) — table of rule kinds: enabled `Switch`, severity select, parameter inputs with units; save → toast.
- `NeedsAttentionList` (planned, feature-private; the DD dashboard has its own list in `dd-reporting`) — up to 8 items from `needs-attention`, severity chip + text + link; empty "Nothing needs attention"; skeleton 4 rows.

Keyboard & a11y: feed rows are list items with a single link each (no nested interactive traps); the "new signals" button is the only control added while the user is in the feed; severity never by colour alone; sheets and dialogs trap and return focus.

Motion (02 §9.2): `--motion-count` for tile numbers, `--motion-enter` for the first 12 feed rows and table rows on first render only; polling inserts use the 180 ms fade, not the entrance; refetches update in place; reduced motion renders final values.

## Invariants

- Severity, dedupe, alert state, due dates and match classification come from the API; the UI formats only.
- Provider text and signal params are rendered as text nodes, never `dangerouslySetInnerHTML`.

## Tests

- Component: `__tests__/signal-feed.test.tsx` (US-24-2: insertion, hover/focus buffering, live-region text, no auto-scroll, reduced motion).
- Page tests (MSW): `monitoring-page.test.tsx` (US-24-1, US-24-8 tiles, loading/empty/error), `alerts.test.tsx` (US-24-3), `rules.test.tsx` (US-24-4), `reassessments.test.tsx` (US-24-5), `watchlist.test.tsx` (US-24-6, 7).
- E2e: `e2e/monitoring.spec.ts` — open alert → assign → resolve; review a watchlist match; axe.

## Not here

Risk charts and heat map (`risk`), CAP and audit screens (`corrective-actions`, `dd-audits`), certificate screens (`supplier-evidence`), notification bell and preferences (`notifications`), supplier ranking (`screening`).

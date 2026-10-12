# Notifications (M12 · SD13)

> Spec: `docs/revamp/modules/M12-notifications-collaboration-audit.md` (slice 1, §14) · Status: Ready · Wave: 1

## Purpose

The in-app notification centre: the bell in the top bar, the full notifications list, the user's and the workspace's notification preferences, and the public one-click unsubscribe page that emails link to. Planned, nothing built yet (the shell's placeholder bell is `src/app/shell/notification-bell.tsx`).

## Owns

- Routes: `/notifications` (in the app shell), `/settings/notifications` (inside `SettingsLayout`, tabs `?tab=mine|workspace`), `/unsubscribe?token=` (public, auth layout, no sign-in needed).
- Namespace `notifications` (`src/locales/en/notifications.json`); the shell keys `common:notifications.*` move here.
- Query keys: the generated ones for `/v1/notifications`, `/v1/notifications/unread-count`, `/v1/me/notification-preferences`, `/v1/notification-defaults`.

## Public surface (`index.ts`, planned)

| Export                       | Used by                                                                                             |
| ---------------------------- | --------------------------------------------------------------------------------------------------- |
| `NotificationBell`           | `src/app/shell/app-shell.tsx` (replaces the shell placeholder, which is deleted)                    |
| `notificationsRoutes`        | `src/app/router.tsx` (one spread inside the shell)                                                  |
| `unsubscribeRoutes`          | `src/app/router.tsx` (public routes, next to `publicOnlyAuthRoutes` but reachable when signed in)   |
| `notificationSettingsRoutes` | `settings` spreads it under `/settings`, like `workspaceRoutes`; plus one entry in `SettingsLayout` |

## Depends on

Generated `notifications` and `me` hooks only; `usePermission('workspace:manage')` for the workspace tab; `src/lib/format.ts` for relative dates. MSW handlers in `mocks.ts` (contract-checked against `api/openapi.json`; `npm run api:sync` against the backend PR while it is in review).

## Components & behaviour

- `notification-bell` — ghost icon button; badge with the unread count (`9+` above nine, hidden at 0); accessible name "Notifications, 3 unread" (ICU plural). Unread count polled every 60 s while `document.visibilityState === 'visible'` (TanStack `refetchInterval` + `refetchIntervalInBackground: false`) and refetched after every mark-read. The badge never animates (Calm Ledger: nothing moves on its own).
- `notification-popover` — latest 10 grouped by day (Today, Yesterday, `Intl` date); unread rows marked by a dot **and** bold title (not colour alone); "Mark all as read"; "View all" → `/notifications`. Clicking a row marks it read, then navigates to its `link` (app-relative only; anything else is ignored). Arrow keys move between rows, Enter opens, Escape closes and returns focus to the bell.
- `notification-item` — title from `t(titleKey, params)` (the key names the emitting feature's namespace, `<ns>:notifications.<type>`; unknown key → `notifications:fallback`); params rendered as text, never HTML; relative time with an absolute `title`.
- `notifications-page` — list page (02 §5): category filter chips + "Unread only" toggle synced to the URL (`?category=&unread=1`), "Load more" button for the next cursor page (no auto-loading scroll), per-row mark read and "Mark all as read". States: skeleton rows while loading; empty state explaining what will appear here (and, with filters, a "Clear filters" action); error state with retry. One `--motion-enter` entrance on first render only; refetches update in place.
- `preferences-page` — `/settings/notifications`: matrix of categories (rows) × channels In-app / Email (columns), each a select of Instant / Daily digest / Weekly digest / Off, with a source hint (mine · workspace default · ResiliSense default). Security row locked with an explanation. React Hook Form + Zod, submit disabled while pending, problem+json errors mapped to cells. Tab "Workspace defaults" only with `workspace:manage` (same matrix, saves `/notification-defaults`). Table with row/column headers so screen readers announce "Assignments, Email".
- `unsubscribe-page` — public: posts the token once on load, then shows "You will no longer receive <category> emails" with a link to preferences; invalid token → error state explaining the link is not valid, with a sign-in link.

## Tests

Planned: `__tests__/notification-bell.test.tsx` (count, accessible name, keyboard, mark read + navigate — US-12-1), `notifications-page.test.tsx` (filters in URL, load more, empty/error — US-12-2), `preferences-page.test.tsx` (matrix, locked security row, workspace tab permission — US-12-3, US-12-4), `unsubscribe-page.test.tsx` (US-12-5); e2e `e2e/notifications.spec.ts` with axe. Waivers in `spec-coverage.json` for US-12-6–8 (digest, bounce handling, event bus: backend only). Add `M12` there.

## Not here

Which events notify whom (the emitting modules), email templates (backend), audit trail and activity feeds (`audit`, `companies`), comments, "My work" inbox and real-time stream (M12 slice 2).

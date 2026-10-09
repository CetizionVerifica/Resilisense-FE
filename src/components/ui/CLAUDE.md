# src/components/ui — design-system primitives (layer rules)

Level 1 (`docs/revamp/06-modular-build.md` §2). shadcn/ui components we own, styled with the tokens of `docs/revamp/02-design-system.md` and the Calm Ledger rules of §9. Features compose these; they never restyle them with raw values.

## Rules for every component

- Typed props, `forwardRef` where it renders a DOM element, `className` passthrough merged with `cn()` (`src/lib/utils.ts`).
- Tokens only (no hex, no inline colour/spacing styles); logical utilities only (lint `resilisense/logical-properties`); works in light, dark, compact density and RTL.
- Keyboard and screen reader: Radix semantics kept, visible 2px focus ring, targets ≥ 24×24px, icon-only buttons have `aria-label`.
- No API calls, no feature imports (lint `resilisense/module-boundaries`), no i18n keys of a feature: labels come in as props.
- A story in `*.stories.tsx` (light, dark, RTL toolbars) and a test for anything interactive.

## Behaviour of the shared states (`states.tsx`)

| Component      | Behaviour                                                                                              |
| -------------- | ------------------------------------------------------------------------------------------------------ |
| `PageSkeleton` | Shown while a page's first query loads; announces its label to screen readers; never a blank `<div/>`  |
| `EmptyState`   | Explains what the object is and why the list is empty, one primary action, optional secondary (import) |
| `ErrorState`   | Problem title in words, "Try again" calls the query's `refetch`; no stack traces                       |

## Calm Ledger additions (02 §9) — build here when the first due diligence screen needs them

| Component                 | Behaviour                                                                                                                                                                                       |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `StatTile`                | Label, value counted up once with `--motion-count` (formatted by `Intl` each frame), delta with direction icon + text, optional sparkline; under reduced motion the final value renders at once |
| `RiskBadge` / `RiskMeter` | Band label + score always visible; meter width = score, fill = `--risk-*` band token, grows once with `--motion-grow`; band comes from the API                                                  |
| `StatusPill` (exists)     | Tone + label; tones map to §2.3 status colours only, never to risk bands                                                                                                                        |
| `SignalFeed`              | List of time, severity chip, subject, one line; newest first, `aria-live="polite"`, new items fade in (180ms), insertion pauses while hovered or focused, never auto-scrolls                    |
| `Entrance`                | Wrapper that applies `--motion-enter` with a stagger index to its children on first render only; no-op under reduced motion                                                                     |

`DataTable` keeps its sort, filter, selection and empty/loading/error states; rows use `Entrance` only on the first page load, not on sort or pagination.

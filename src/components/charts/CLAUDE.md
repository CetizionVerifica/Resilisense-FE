# src/components/charts — ResiliChart and signature charts (layer rules)

Level 1 (`docs/revamp/06-modular-build.md` §2). Not built yet: the first module that needs a chart (the due diligence dashboard) creates `ResiliChart` here first, then its chart. Rules: `docs/revamp/02-design-system.md` §6 and §9.

## ResiliChart (the wrapper every chart uses)

- ECharts 6 with modular imports only (`echarts/core` + the series and components a chart needs), SVG renderer.
- Theme generated from CSS tokens at runtime (text, grid, axis, categorical slots §6.1, risk ramp §9.3); re-themes on light/dark switch without remounting.
- Motion from `02` §9.2: entrance animation once (`animationDuration`, `animationEasing`, per-index `animationDelay`), `animationDurationUpdate: 0` for refetches; no animation under `prefers-reduced-motion`.
- Card chrome: title, one-sentence takeaway (prop), "View as table" (renders the same data as an accessible `<table>`), Download PNG/SVG/CSV.
- Tooltips are built with text nodes or escaped strings, never HTML from user data; numbers formatted with `Intl`.
- One y-axis, legend for ≥ 2 series, chart text in text tokens, colour never the only signal.
- Props are plain data already computed by the API; charts never compute scores, bands or rankings.

## Charts to build for due diligence (02 §9.4)

| Chart                 | Series            | Behaviour                                                                                                                 |
| --------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `RiskTrendChart`      | `line` + 12% area | 12 points, end point emphasised with its value; tooltip crosshair                                                         |
| `RiskByCategoryChart` | horizontal `bar`  | Fixed category order from reference data, bar colour = band, value label at the end                                       |
| `RiskHeatmap`         | `heatmap`         | Category × region, value in every cell, `onCellClick(category, region)` so the page can navigate to the filtered register |
| `TierFlowChart`       | `sankey`          | Tier 1–3 → Low/Medium/High, ribbons draw tier by tier; table view lists source, target, count                             |

Existing plan from 02 §4 (materiality matrix, gap bars, radar, donut, gauge, sparkline) follows the same wrapper. Each chart gets a story with light, dark and RTL, and a test for the table view.

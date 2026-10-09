# e2e — Playwright journeys (layer rules)

Level 1 (`docs/revamp/06-modular-build.md` §2). Playwright + axe against the dev server with MSW mocks (or staging).

- One file per module journey: `e2e/<module>.spec.ts`, titled with the stories it proves (`'US-xx-y: …'`).
- Each module covers its critical journeys from its spec §5 (for due diligence: register a supplier, send a questionnaire, answer it on the public entry, review risk, raise a corrective action, export a report).
- Every journey runs axe on each screen it visits (`support.ts`) and fails on any violation.
- `responsive.spec.ts` checks 360px width; add new screens to it.
- Select by role and accessible name, never by CSS classes or test ids when a role exists.

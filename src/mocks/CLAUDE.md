# src/mocks and src/test — MSW mocks and test helpers (layer rules)

Level 1 (`docs/revamp/06-modular-build.md` §2).

- `src/mocks/handlers.ts` merges the handlers of every feature; `data.ts` holds shared fixtures (users, workspaces, companies). New features keep their handlers in `src/features/<module>/mocks.ts` and add one spread here, so features can be built and tested without each other.
- Every mocked response and JSON request body is validated against `api/openapi.json` (`src/test/contract.ts`): a status, body or request outside the contract fails the test. Update mocks only after `npm run api:sync`. Error responses use `problem()` from `handlers.ts`; only HTTP plumbing tests may call `ignoreContract()`.
- `VITE_API_MOCKS=1 npm run dev` runs the app on these mocks (`browser.ts`).
- Test helpers in `src/test/`: `renderApp(url)` and `renderSignedIn(url, email)` render the real router with MSW; `server.ts` is the MSW node server.
- Fixtures are invented and obviously fake (`alice@example.com`); never real customer or supplier data.

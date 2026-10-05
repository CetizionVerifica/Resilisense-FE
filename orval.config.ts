import { defineConfig } from 'orval';

/**
 * API client + TanStack Query hooks generated from the backend contract (ADR-004/009).
 * Output in src/api/generated is gitignored and regenerated on install; never edit it.
 */
export default defineConfig({
  resilisense: {
    input: { target: './api/openapi.json' },
    output: {
      target: './src/api/generated/endpoints.ts',
      schemas: './src/api/generated/model',
      mode: 'tags-split',
      client: 'react-query',
      httpClient: 'fetch',
      clean: true,
      override: {
        mutator: { path: './src/lib/api-client.ts', name: 'apiFetch' },
        query: { signal: true },
        fetch: { includeHttpResponseReturnType: false },
        // Cursor-paginated lists ("Load more"): the page param is the `cursor` query param.
        operations: Object.fromEntries(
          [
            'MembersController_list',
            'MembersController_invitations',
            'PlatformUsersController_list',
            'CompaniesController_list',
            'CompaniesController_activity',
            'PartnerController_list',
            'PlatformWorkspacesController_list',
          ].map((id) => [
            id,
            { query: { useQuery: true, useInfinite: true, useInfiniteQueryParam: 'cursor', signal: true } },
          ]),
        ),
      },
    },
  },
});

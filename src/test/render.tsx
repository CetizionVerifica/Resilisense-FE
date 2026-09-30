import { render, type RenderResult } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { AppProviders } from '@/app/providers';
import { routes } from '@/app/router';

/** Renders the real route tree (lazy routes, guards, providers) at a URL. */
export function renderApp(url: string): RenderResult & { router: ReturnType<typeof createMemoryRouter> } {
  const router = createMemoryRouter(routes, { initialEntries: [url] });
  const result = render(
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>,
  );
  return { ...result, router };
}

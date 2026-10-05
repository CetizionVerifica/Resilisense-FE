import { createBrowserRouter, type RouteObject } from 'react-router';
import { TermsGate } from '@/features/auth/components/terms-gate';
import { authRoutes, publicOnlyAuthRoutes } from '@/features/auth/routes';
import { companiesRoutes } from '@/features/companies/routes';
import { partnerRoutes } from '@/features/partner/routes';
import { settingsRoutes } from '@/features/settings/routes';
import { PublicOnly, RequireAuth } from '@/lib/auth/guards';
import { NotFound, RouteError, RouteFallback } from './route-error';
import { AppShell } from './shell/app-shell';

/** Lazy route modules per feature (ADR-008); each feature exports its RouteObjects. */
export const routes: RouteObject[] = [
  {
    errorElement: <RouteError />,
    hydrateFallbackElement: <RouteFallback />,
    children: [
      { element: <PublicOnly />, children: publicOnlyAuthRoutes },
      ...authRoutes,
      {
        element: <RequireAuth />,
        children: [
          {
            element: <TermsGate />,
            children: [
              {
                element: <AppShell />,
                errorElement: <RouteError />,
                children: [
                  {
                    index: true,
                    lazy: async () => ({ Component: (await import('@/features/home/home-page')).HomePage }),
                  },
                  ...companiesRoutes,
                  ...partnerRoutes,
                  ...settingsRoutes,
                ],
              },
            ],
          },
        ],
      },
      { path: '*', element: <NotFound /> },
    ],
  },
];

export const createRouter = () => createBrowserRouter(routes);

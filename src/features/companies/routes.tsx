import { type RouteObject } from 'react-router';

/** `/companies`, `/companies/:id` (+ activity, settings) — M02 §9. */
export const companiesRoutes: RouteObject[] = [
  { path: 'companies', lazy: async () => ({ Component: (await import('./pages/companies-page')).CompaniesPage }) },
  {
    path: 'companies/:id',
    lazy: async () => ({ Component: (await import('./pages/company-layout')).CompanyLayout }),
    children: [
      {
        index: true,
        lazy: async () => ({ Component: (await import('./pages/company-overview-page')).CompanyOverviewPage }),
      },
      {
        path: 'activity',
        lazy: async () => ({ Component: (await import('./pages/company-activity-page')).CompanyActivityPage }),
      },
      {
        path: 'settings',
        lazy: async () => ({ Component: (await import('./pages/company-settings-page')).CompanySettingsPage }),
      },
    ],
  },
];

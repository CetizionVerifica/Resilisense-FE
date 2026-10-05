import { type RouteObject } from 'react-router';

/** `/partner/clients` — M02 §9 partner console. */
export const partnerRoutes: RouteObject[] = [
  {
    path: 'partner/clients',
    lazy: async () => ({ Component: (await import('./pages/partner-clients-page')).PartnerClientsPage }),
  },
];

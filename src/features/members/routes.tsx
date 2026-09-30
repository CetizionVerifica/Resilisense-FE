import { type RouteObject } from 'react-router';

/** `/settings/members` (M01 §9); mounted inside the settings layout. */
export const membersRoutes: RouteObject[] = [
  { path: 'members', lazy: async () => ({ Component: (await import('./pages/members-page')).MembersPage }) },
];

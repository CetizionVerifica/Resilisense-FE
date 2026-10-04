import { type RouteObject } from 'react-router';

/** `/settings/workspace`, `/settings/plan` (M02 §9); mounted inside the settings layout. */
export const workspaceRoutes: RouteObject[] = [
  { path: 'workspace', lazy: async () => ({ Component: (await import('./pages/workspace-page')).WorkspacePage }) },
  { path: 'plan', lazy: async () => ({ Component: (await import('./pages/plan-page')).PlanPage }) },
];

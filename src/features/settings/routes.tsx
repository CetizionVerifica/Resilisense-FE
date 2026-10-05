import { Navigate, type RouteObject } from 'react-router';
import { membersRoutes } from '@/features/members/routes';
import { workspaceRoutes } from '@/features/workspace/routes';
import { SettingsLayout } from './components/settings-layout';

/** `/settings/*` (M01 §9, M02 §9): profile, security, workspace, plan and — with `org:manage-users` — members. */
export const settingsRoutes: RouteObject[] = [
  {
    path: 'settings',
    element: <SettingsLayout />,
    children: [
      { index: true, element: <Navigate to="profile" replace /> },
      { path: 'profile', lazy: async () => ({ Component: (await import('./pages/profile-page')).ProfilePage }) },
      { path: 'security', lazy: async () => ({ Component: (await import('./pages/security-page')).SecurityPage }) },
      ...workspaceRoutes,
      ...membersRoutes,
    ],
  },
];

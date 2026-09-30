import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, Outlet, useLocation } from 'react-router';
import { PageSkeleton } from '@/components/ui/states';
import { useAuth } from './auth-provider';
import { type Permission, usePermission } from './me';

function Bootstrapping() {
  const { t } = useTranslation();
  return (
    <div className="mx-auto max-w-5xl p-8">
      <PageSkeleton label={t('state.loading')} />
    </div>
  );
}

/** Routes for signed-in users; others go to /sign-in and come back afterwards. */
export function RequireAuth() {
  const { status } = useAuth();
  const location = useLocation();
  if (status === 'bootstrapping') return <Bootstrapping />;
  if (status === 'signed-out') {
    return <Navigate to="/sign-in" replace state={{ from: `${location.pathname}${location.search}` }} />;
  }
  return <Outlet />;
}

/** Where to go after signing in: the page RequireAuth bounced from, if it is a same-app path. */
export function returnPath(state: unknown): string {
  const from = (state as { from?: unknown } | null)?.from;
  return typeof from === 'string' && from.startsWith('/') && !from.startsWith('//') ? from : '/';
}

/**
 * Sign-in / sign-up / forgot-password are pointless when already signed in. Signing in lands
 * here too (the session starts before the page navigates), so honour the return path.
 */
export function PublicOnly() {
  const { status } = useAuth();
  const location = useLocation();
  if (status === 'bootstrapping') return <Bootstrapping />;
  if (status === 'signed-in') return <Navigate to={returnPath(location.state)} replace />;
  return <Outlet />;
}

/** Renders children only with the permission (UI hint; the API is authoritative). */
export function RequirePermission({
  permission,
  children,
  fallback = null,
}: {
  permission: Permission;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return usePermission(permission) ? children : fallback;
}

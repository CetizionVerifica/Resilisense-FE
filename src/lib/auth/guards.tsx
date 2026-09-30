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

/** Sign-in / forgot-password are pointless when already signed in. */
export function PublicOnly() {
  const { status } = useAuth();
  if (status === 'bootstrapping') return <Bootstrapping />;
  if (status === 'signed-in') return <Navigate to="/" replace />;
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

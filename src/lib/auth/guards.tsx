import { Lock } from 'lucide-react';
import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Navigate, Outlet, useLocation } from 'react-router';
import { Button } from '@/components/ui/button';
import { EmptyState, PageSkeleton } from '@/components/ui/states';
import { useAuth } from './auth-provider';
import { type ModuleName, useEntitlement } from './entitlements';
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
  // Same-app paths only: no protocol-relative `//host` and no `/\\host` (browsers treat `\\` as `/`).
  return typeof from === 'string' && /^\/(?![/\\])/.test(from) && !from.includes('\\') ? from : '/';
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

/**
 * Route guard for an entitlement module (M02 §4.1, 02 §3): non-entitled workspaces see the
 * locked-module panel instead of the module. UI hint; the API answers `403 entitlement_required`.
 */
export function RequireModule({ module }: { module: ModuleName }) {
  const { t } = useTranslation();
  const entitled = useEntitlement(module);
  if (entitled === undefined) return <PageSkeleton label={t('state.loading')} />;
  return entitled ? <Outlet /> : <LockedModulePanel module={module} />;
}

/** Lock icon + upsell panel for a module the workspace has not bought (M02 §9). */
export function LockedModulePanel({ module }: { module: ModuleName }) {
  const { t } = useTranslation();
  const canSeePlan = usePermission('workspace:manage');
  return (
    <EmptyState
      icon={<Lock aria-hidden />}
      title={t('locked.title', { module: t(`module.${module}`) })}
      description={t('locked.description')}
      action={
        canSeePlan ? (
          <Button asChild variant="secondary">
            <Link to="/settings/plan">{t('locked.viewPlan')}</Link>
          </Button>
        ) : (
          <p className="text-small text-fg-muted">{t('locked.askAdmin')}</p>
        )
      }
    />
  );
}

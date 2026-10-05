import { Lock, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';
import { useIsPartnerWorkspace } from '@/lib/auth/entitlements';
import { useMe } from '@/lib/auth/me';
import { cn } from '@/lib/utils';
import { Logo } from './logo';
import { NAV, type NavItem } from './nav';

/** Dark-slate sidebar in both themes with an amber active bar on the start side (02 §2.2, §3). */
export function Sidebar({
  collapsed,
  onToggle,
  onNavigate,
}: {
  collapsed: boolean;
  onToggle?: () => void;
  onNavigate?: () => void;
}) {
  const { t } = useTranslation();
  const { data: me } = useMe();
  const isPartner = useIsPartnerWorkspace();
  const allowed = (i: NavItem) =>
    (!i.permission || !!me?.permissions.includes(i.permission)) && (!i.partnerOnly || isPartner);
  // Non-entitled modules stay visible with a lock; their route shows the locked-module panel.
  const locked = (i: NavItem) => !!i.module && !me?.entitlements?.modules.includes(i.module);

  return (
    <nav
      aria-label={t('nav.label')}
      className={cn('flex h-full flex-col bg-sidebar text-sidebar-text', collapsed ? 'w-[72px]' : 'w-[264px]')}
    >
      <div className="flex h-14 items-center gap-2 px-4">
        <Logo compact={collapsed} />
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-2">
        {NAV.map((group) => {
          const items = group.items.filter(allowed);
          if (items.length === 0) return null;
          return (
            <div key={group.labelKey} className="grid gap-0.5 pb-4">
              {collapsed ? null : (
                <p className="px-3 pb-1 text-small uppercase tracking-wide text-sidebar-muted">{t(group.labelKey)}</p>
              )}
              {items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end ?? true}
                  onClick={onNavigate}
                  title={collapsed ? t(item.labelKey) : undefined}
                  className={({ isActive }) =>
                    cn(
                      'relative flex h-9 items-center gap-3 rounded-sm px-3 text-body hover:bg-sidebar-hover',
                      isActive &&
                        'bg-sidebar-hover font-medium text-white before:absolute before:inset-y-1.5 before:start-0 before:w-1 before:rounded-full before:bg-accent',
                    )
                  }
                >
                  <item.icon className="size-5 shrink-0" aria-hidden />
                  <span className={cn(collapsed && 'sr-only')}>{t(item.labelKey)}</span>
                  {locked(item) ? (
                    <>
                      <Lock
                        className={cn('ms-auto size-4 shrink-0 text-sidebar-muted', collapsed && 'hidden')}
                        aria-hidden
                      />
                      <span className="sr-only">{t('locked.label')}</span>
                    </>
                  ) : null}
                </NavLink>
              ))}
            </div>
          );
        })}
      </div>
      {onToggle ? (
        <button
          type="button"
          onClick={onToggle}
          className="m-3 flex h-9 items-center gap-3 rounded-sm px-3 text-body text-sidebar-muted hover:bg-sidebar-hover"
          aria-expanded={!collapsed}
        >
          {collapsed ? (
            <PanelLeftOpen className="size-5 rtl:-scale-x-100" aria-hidden />
          ) : (
            <PanelLeftClose className="size-5 rtl:-scale-x-100" aria-hidden />
          )}
          <span className={cn(collapsed && 'sr-only')}>{collapsed ? t('nav.expand') : t('nav.collapse')}</span>
        </button>
      ) : null}
    </nav>
  );
}

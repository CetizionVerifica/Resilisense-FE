import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router';
import { PageHeader } from '@/components/ui/page-header';
import { TabNav, TabNavLink } from '@/components/ui/tabs';
import { usePermission } from '@/lib/auth/me';

/** Settings shell: route-backed tabs so each section has a shareable URL (02 §5). */
export function SettingsLayout() {
  const { t } = useTranslation('settings');
  const canManageUsers = usePermission('org:manage-users');
  return (
    <>
      <PageHeader title={t('title')} description={t('description')} />
      <TabNav label={t('sections')} className="mb-6">
        <TabNavLink to="/settings/profile">{t('tab.profile')}</TabNavLink>
        <TabNavLink to="/settings/security">{t('tab.security')}</TabNavLink>
        <TabNavLink to="/settings/workspace">{t('tab.workspace')}</TabNavLink>
        <TabNavLink to="/settings/plan">{t('tab.plan')}</TabNavLink>
        {canManageUsers ? <TabNavLink to="/settings/members">{t('tab.members')}</TabNavLink> : null}
      </TabNav>
      <Outlet />
    </>
  );
}

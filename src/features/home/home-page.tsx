import { LayoutDashboard } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { EmptyState, ErrorState, PageSkeleton } from '@/components/ui/states';
import { useMe } from '@/lib/auth/me';

/** Home placeholder: the dashboard (M11) replaces it; shows the async-state patterns meanwhile. */
export function HomePage() {
  const { t } = useTranslation();
  const { data: me, isPending, isError, refetch } = useMe();

  if (isPending) return <PageSkeleton label={t('state.loading')} />;
  if (isError) {
    return <ErrorState title={t('error.title')} retryLabel={t('action.retry')} onRetry={() => void refetch()} />;
  }
  return (
    <>
      <PageHeader title={t('home.welcome', { name: me.user.name })} description={me.currentWorkspace?.name} />
      <Card>
        <EmptyState
          icon={<LayoutDashboard aria-hidden />}
          title={me.currentWorkspace ? t('home.empty.title') : t('home.noWorkspace.title')}
          description={me.currentWorkspace ? t('home.empty.description') : t('home.noWorkspace.description')}
        />
      </Card>
    </>
  );
}

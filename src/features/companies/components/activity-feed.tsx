import { History } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState, ErrorState } from '@/components/ui/states';
import { formatDate, formatRelative } from '@/lib/format';
import { useCompanyActivity } from '../hooks';

const KNOWN = ['company.created', 'company.updated', 'company.deleted', 'company.restored'];

/** Company activity from audit events (M02 §4.1 "real activity feed"), newest first. */
export function ActivityFeed({ companyId }: { companyId: string }) {
  const { t, i18n } = useTranslation('companies');
  const activity = useCompanyActivity(companyId);

  if (activity.isPending) {
    return (
      <div role="status" aria-label={t('common:state.loading')} className="grid gap-3">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-12" />
        ))}
      </div>
    );
  }
  if (activity.isError) {
    return (
      <ErrorState
        title={t('activity.loadFailed')}
        retryLabel={t('common:action.retry')}
        onRetry={() => void activity.refetch()}
      />
    );
  }
  if (activity.items.length === 0) {
    return (
      <EmptyState
        icon={<History aria-hidden />}
        title={t('activity.empty.title')}
        description={t('activity.empty.description')}
      />
    );
  }
  return (
    <div className="grid gap-4">
      <ol className="grid gap-0" aria-label={t('activity.label')}>
        {activity.items.map((e) => (
          <li key={e.id} className="relative grid gap-0.5 border-s-2 border-border py-2 ps-4">
            <span className="absolute -start-[5px] top-3.5 size-2 rounded-full bg-primary" aria-hidden />
            <p className="text-body text-fg">
              {t(
                KNOWN.includes(e.action)
                  ? `activity.action.${e.action.replace('company.', '')}`
                  : 'activity.action.other',
                {
                  actor: e.actor?.name || t('activity.system'),
                  action: e.action,
                },
              )}
            </p>
            {e.fields.length ? (
              <p className="text-small text-fg-muted">
                {t('activity.fields', {
                  fields: new Intl.ListFormat(i18n.language, { type: 'conjunction' }).format(
                    e.fields.map((f) => t(`field.${f}`, { defaultValue: f })),
                  ),
                })}
              </p>
            ) : null}
            <time
              className="text-small text-fg-muted"
              dateTime={e.occurredAt}
              title={formatDate(e.occurredAt, i18n.language)}
            >
              {formatRelative(e.occurredAt, i18n.language)}
            </time>
          </li>
        ))}
      </ol>
      {activity.hasNextPage ? (
        <Button
          variant="secondary"
          className="justify-self-start"
          loading={activity.isFetchingNextPage}
          onClick={() => void activity.fetchNextPage()}
        >
          {t('loadMore')}
        </Button>
      ) : null}
    </div>
  );
}

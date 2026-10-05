import { CheckCircle2, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { WorkspacesControllerEntitlements200ModulesItem as MODULE } from '@/api/generated/model';
import { useWorkspacesControllerEntitlements } from '@/api/generated/workspaces/workspaces';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ErrorState, PageSkeleton } from '@/components/ui/states';
import { formatDate } from '@/lib/format';
import { cn } from '@/lib/utils';

const MODULES = Object.values(MODULE);

function UsageMeter({ label, used, max }: { label: string; used: number; max: number | null | undefined }) {
  const { t, i18n } = useTranslation('workspace');
  const nf = new Intl.NumberFormat(i18n.language);
  const limited = typeof max === 'number';
  const ratio = limited ? (max === 0 ? 1 : Math.min(used / max, 1)) : 0;
  const full = limited && used >= max;
  return (
    <div className="grid gap-1.5">
      <div className="flex justify-between gap-2 text-body">
        <span className="font-medium">{label}</span>
        <span className="text-fg-secondary">
          {limited
            ? t('usage.ofLimit', { used: nf.format(used), max: nf.format(max) })
            : t('usage.unlimited', { used: nf.format(used) })}
        </span>
      </div>
      {limited ? (
        <div
          role="meter"
          aria-label={label}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-valuenow={Math.min(used, max)}
          aria-valuetext={t('usage.ofLimit', { used: nf.format(used), max: nf.format(max) })}
          className="h-2 overflow-hidden rounded-full bg-subtle"
        >
          <div
            className={cn('h-full rounded-full', full ? 'bg-warning' : 'bg-primary')}
            style={{ width: `${ratio * 100}%` }}
          />
        </div>
      ) : null}
      {full ? <p className="text-small text-warning">{t('usage.full')}</p> : null}
    </div>
  );
}

/** `/settings/plan` (M02 §9): plan, modules included vs. available, usage vs. limits. */
export function PlanPage() {
  const { t, i18n } = useTranslation('workspace');
  const ent = useWorkspacesControllerEntitlements();

  if (ent.isPending) return <PageSkeleton label={t('common:state.loading')} />;
  if (ent.isError) {
    return (
      <ErrorState
        title={t('plan.loadFailed')}
        retryLabel={t('common:action.retry')}
        onRetry={() => void ent.refetch()}
      />
    );
  }
  const { plan, modules, limits, usage, trialEndsAt } = ent.data;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>{t('plan.title', { plan: t(`plan.name.${plan}`, { defaultValue: plan }) })}</CardTitle>
          <CardDescription>
            {trialEndsAt
              ? t('plan.trialEnds', { date: formatDate(trialEndsAt, i18n.language) })
              : t('plan.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5">
          <UsageMeter label={t('usage.companies')} used={usage.companies} max={limits.companies} />
          <UsageMeter label={t('usage.users')} used={usage.users} max={limits.users} />
          {typeof limits.clientWorkspaces === 'number' && limits.clientWorkspaces > 0 ? (
            <UsageMeter
              label={t('usage.clientWorkspaces')}
              used={usage.clientWorkspaces}
              max={limits.clientWorkspaces}
            />
          ) : null}
          {typeof limits.projectsPerYear === 'number' ? (
            <p className="text-body text-fg-secondary">{t('usage.projectsPerYear', { max: limits.projectsPerYear })}</p>
          ) : null}
          <p className="text-small text-fg-muted">{t('plan.contact')}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{t('modules.title')}</CardTitle>
          <CardDescription>{t('modules.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-2" aria-label={t('modules.title')}>
            {MODULES.map((m) => {
              const included = modules.includes(m);
              return (
                <li key={m} className="flex items-center gap-3 text-body">
                  {included ? (
                    <CheckCircle2 className="size-4 shrink-0 text-success" aria-hidden />
                  ) : (
                    <Lock className="size-4 shrink-0 text-fg-muted" aria-hidden />
                  )}
                  <span className={cn(!included && 'text-fg-muted')}>{t(`common:module.${m}`)}</span>
                  <span className="ms-auto text-small text-fg-muted">
                    {included ? t('modules.included') : t('modules.notIncluded')}
                  </span>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

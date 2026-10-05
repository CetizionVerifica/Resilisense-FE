import { Handshake, Plus } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { toast } from 'sonner';
import { useMeControllerSwitchWorkspace } from '@/api/generated/me/me';
import { type PartnerControllerList200ItemsItem } from '@/api/generated/model';
import { usePartnerControllerListInfinite } from '@/api/generated/partner/partner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { createDataTableColumns, DataTable } from '@/components/ui/data-table';
import { PageHeader } from '@/components/ui/page-header';
import { EmptyState } from '@/components/ui/states';
import { StatusPill, type StatusTone } from '@/components/ui/status-pill';
import { useAuth } from '@/lib/auth/auth-provider';
import { useIsPartnerWorkspace, useWorkspaceReadOnly } from '@/lib/auth/entitlements';
import { useMe } from '@/lib/auth/me';
import { formatRelative } from '@/lib/format';
import { OnboardClientSheet } from '../components/onboard-client-sheet';

type Client = PartnerControllerList200ItemsItem;

const STATUS_TONE: Record<Client['status'], StatusTone> = {
  active: 'success',
  trial: 'info',
  suspended: 'warning',
  closed: 'neutral',
};

/** Partner console `/partner/clients` (M02 §9, US-02-1): client workspaces + quick "open workspace". */
export function PartnerClientsPage() {
  const { t, i18n } = useTranslation('partner');
  const { isPending: meLoading } = useMe();
  const isPartner = useIsPartnerWorkspace();
  const readOnly = useWorkspaceReadOnly();
  const [params, setParams] = useSearchParams();
  const { startSession } = useAuth();
  const clients = usePartnerControllerListInfinite(
    { limit: 25 },
    { query: { enabled: isPartner, initialPageParam: undefined, getNextPageParam: (p) => p.nextCursor ?? undefined } },
  );
  const items = useMemo(() => clients.data?.pages.flatMap((p) => p.items) ?? [], [clients.data]);
  const usage = clients.data?.pages[0]?.usage;
  const full = !!usage && typeof usage.limit === 'number' && usage.clientWorkspaces >= usage.limit;
  const open = useMeControllerSwitchWorkspace({
    mutation: {
      onSuccess: (session) => startSession(session.accessToken),
      onError: () => toast.error(t('common:workspace.switchFailed')),
    },
  });
  const setOnboard = (o: boolean) =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (o) next.set('new', '1');
        else next.delete('new');
        return next;
      },
      { replace: true },
    );

  const columns = useMemo(() => {
    const col = createDataTableColumns<Client>();
    return col.columns([
      col.display({
        id: 'name',
        header: () => t('column.name'),
        cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
      }),
      col.display({
        id: 'status',
        header: () => t('column.status'),
        cell: ({ row }) => (
          <StatusPill
            tone={STATUS_TONE[row.original.status]}
            label={t(`common:workspaceStatus.${row.original.status}`)}
          />
        ),
      }),
      col.display({
        id: 'companies',
        header: () => t('column.companies'),
        cell: ({ row }) => new Intl.NumberFormat(i18n.language).format(row.original.companies),
      }),
      col.display({
        id: 'lastActivity',
        header: () => t('column.lastActivity'),
        cell: ({ row }) =>
          row.original.lastActivityAt ? formatRelative(row.original.lastActivityAt, i18n.language) : '—',
      }),
      col.display({
        id: 'open',
        header: () => <span className="sr-only">{t('column.actions')}</span>,
        cell: ({ row }) => (
          <Button
            size="sm"
            variant="secondary"
            loading={open.isPending && open.variables.data.workspaceId === row.original.workspaceId}
            aria-label={t('open.for', { name: row.original.name })}
            onClick={() => open.mutate({ data: { workspaceId: row.original.workspaceId } })}
          >
            {t('open.action')}
          </Button>
        ),
      }),
    ]);
  }, [t, i18n.language, open]);

  if (!meLoading && !isPartner) {
    return (
      <Card>
        <EmptyState
          icon={<Handshake aria-hidden />}
          title={t('notPartner.title')}
          description={t('notPartner.description')}
        />
      </Card>
    );
  }
  const canOnboard = !readOnly && !full;

  return (
    <>
      <PageHeader
        title={t('title')}
        description={
          usage && typeof usage.limit === 'number'
            ? t('usage', { used: usage.clientWorkspaces, max: usage.limit })
            : t('description')
        }
        actions={
          <Button onClick={() => setOnboard(true)} disabled={!canOnboard} title={full ? t('error.limit') : undefined}>
            <Plus aria-hidden />
            {t('onboard.open')}
          </Button>
        }
      />
      {full ? <p className="pb-4 text-body text-warning">{t('error.limit')}</p> : null}
      <div className="rounded-md border border-border bg-surface">
        <DataTable
          label={t('table')}
          columns={columns}
          data={items}
          getRowId={(c) => c.grantId}
          isPending={clients.isPending}
          isError={clients.isError}
          onRetry={() => void clients.refetch()}
          hasMore={clients.hasNextPage}
          loadingMore={clients.isFetchingNextPage}
          onLoadMore={() => void clients.fetchNextPage()}
          labels={{
            loading: t('common:state.loading'),
            errorTitle: t('loadFailed'),
            retry: t('common:action.retry'),
            loadMore: t('loadMore'),
          }}
          empty={
            <EmptyState
              icon={<Handshake aria-hidden />}
              title={t('empty.title')}
              description={t('empty.description')}
              action={
                canOnboard ? (
                  <Button onClick={() => setOnboard(true)}>
                    <Plus aria-hidden />
                    {t('onboard.open')}
                  </Button>
                ) : undefined
              }
            />
          }
        />
      </div>
      <OnboardClientSheet open={canOnboard && params.get('new') === '1'} onOpenChange={setOnboard} />
    </>
  );
}

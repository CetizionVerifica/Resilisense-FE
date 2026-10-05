import { Building2, Plus, RotateCcw, SearchX } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { useCompaniesControllerRestore } from '@/api/generated/companies/companies';
import { type CompaniesControllerList200ItemsItem } from '@/api/generated/model';
import { Button } from '@/components/ui/button';
import { createDataTableColumns, DataTable } from '@/components/ui/data-table';
import { EmptyState } from '@/components/ui/states';
import { formatDate, formatRelative } from '@/lib/format';
import { useDisplayNames, useSectors } from '@/lib/reference';
import { useCompanies, useInvalidateCompanies } from '../hooks';
import { companyProblem } from '../problem-message';

type Company = CompaniesControllerList200ItemsItem;

/** Companies DataTable (M02 §9): name, sector, country, size, last activity. */
export function CompaniesTable({
  q,
  onClearSearch,
  onCreate,
}: {
  q: string;
  onClearSearch: () => void;
  /** Absent when the user cannot create companies. */
  onCreate?: (() => void) | undefined;
}) {
  const { t, i18n } = useTranslation('companies');
  const companies = useCompanies({ q: q || undefined });
  const sectors = useSectors();
  const names = useDisplayNames();

  const columns = useMemo(() => {
    const col = createDataTableColumns<Company>();
    return col.columns([
      col.display({
        id: 'name',
        header: () => t('column.name'),
        cell: ({ row }) => (
          <div className="grid min-w-48 gap-0.5">
            <Link to={`/companies/${row.original.id}`} className="font-medium text-link hover:underline">
              {row.original.displayName}
            </Link>
            {row.original.legalName !== row.original.displayName ? (
              <span className="text-small text-fg-muted">{row.original.legalName}</span>
            ) : null}
          </div>
        ),
      }),
      col.display({
        id: 'sector',
        header: () => t('column.sector'),
        cell: ({ row }) =>
          row.original.sectorCode
            ? (sectors.byCode.get(row.original.sectorCode)?.label ?? row.original.sectorCode)
            : '—',
      }),
      col.display({
        id: 'country',
        header: () => t('column.country'),
        cell: ({ row }) => names.country(row.original.country) || '—',
      }),
      col.display({
        id: 'size',
        header: () => t('column.size'),
        cell: ({ row }) => (row.original.sizeBand ? t(`size.${row.original.sizeBand}`) : '—'),
      }),
      col.display({
        id: 'lastActivity',
        header: () => t('column.lastActivity'),
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-fg-secondary">
            {row.original.lastActivityAt ? formatRelative(row.original.lastActivityAt, i18n.language) : '—'}
          </span>
        ),
      }),
    ]);
  }, [t, i18n.language, sectors.byCode, names]);

  return (
    <div className="rounded-md border border-border bg-surface">
      <DataTable
        label={t('table.active')}
        columns={columns}
        data={companies.items}
        getRowId={(c) => c.id}
        isPending={companies.isPending}
        isError={companies.isError}
        onRetry={() => void companies.refetch()}
        hasMore={companies.hasNextPage}
        loadingMore={companies.isFetchingNextPage}
        onLoadMore={() => void companies.fetchNextPage()}
        labels={{
          loading: t('common:state.loading'),
          errorTitle: t('loadFailed'),
          retry: t('common:action.retry'),
          loadMore: t('loadMore'),
        }}
        empty={
          q ? (
            <EmptyState
              icon={<SearchX aria-hidden />}
              title={t('empty.searchTitle')}
              description={t('empty.searchDescription', { q })}
              action={
                <Button variant="secondary" onClick={onClearSearch}>
                  {t('search.clear')}
                </Button>
              }
            />
          ) : (
            <EmptyState
              icon={<Building2 aria-hidden />}
              title={t('empty.title')}
              description={t('empty.description')}
              action={
                onCreate ? (
                  <Button onClick={onCreate}>
                    <Plus aria-hidden />
                    {t('create.open')}
                  </Button>
                ) : undefined
              }
            />
          )
        }
      />
    </div>
  );
}

/** Soft-deleted companies within the 30-day window (M02 §4.1), with Restore. */
export function DeletedCompaniesTable() {
  const { t, i18n } = useTranslation('companies');
  const companies = useCompanies({ status: 'deleted' });
  const invalidate = useInvalidateCompanies();
  const restore = useCompaniesControllerRestore({
    mutation: {
      onSuccess: (c) => {
        toast.success(t('toast.restored', { name: c.displayName }));
        void invalidate(c.id);
      },
      onError: (e) => toast.error(companyProblem(t, e)),
    },
  });

  const columns = useMemo(() => {
    const col = createDataTableColumns<Company>();
    return col.columns([
      col.display({
        id: 'name',
        header: () => t('column.name'),
        cell: ({ row }) => <span className="font-medium">{row.original.displayName}</span>,
      }),
      col.display({
        id: 'deletedAt',
        header: () => t('column.deletedAt'),
        cell: ({ row }) => (row.original.deletedAt ? formatDate(row.original.deletedAt, i18n.language) : '—'),
      }),
      col.display({
        id: 'restorableUntil',
        header: () => t('column.restorableUntil'),
        cell: ({ row }) =>
          row.original.restorableUntil ? formatDate(row.original.restorableUntil, i18n.language) : '—',
      }),
      col.display({
        id: 'actions',
        header: () => <span className="sr-only">{t('column.actions')}</span>,
        cell: ({ row }) => (
          <Button
            size="sm"
            variant="secondary"
            loading={restore.isPending && restore.variables.id === row.original.id}
            onClick={() => restore.mutate({ id: row.original.id })}
            aria-label={t('restore.for', { name: row.original.displayName })}
          >
            <RotateCcw aria-hidden />
            {t('restore.action')}
          </Button>
        ),
      }),
    ]);
  }, [t, i18n.language, restore]);

  return (
    <div className="rounded-md border border-border bg-surface">
      <DataTable
        label={t('table.deleted')}
        columns={columns}
        data={companies.items}
        getRowId={(c) => c.id}
        isPending={companies.isPending}
        isError={companies.isError}
        onRetry={() => void companies.refetch()}
        hasMore={companies.hasNextPage}
        loadingMore={companies.isFetchingNextPage}
        onLoadMore={() => void companies.fetchNextPage()}
        labels={{
          loading: t('common:state.loading'),
          errorTitle: t('loadFailed'),
          retry: t('common:action.retry'),
          loadMore: t('loadMore'),
        }}
        empty={
          <EmptyState
            icon={<RotateCcw aria-hidden />}
            title={t('empty.deletedTitle')}
            description={t('empty.deletedDescription')}
          />
        }
      />
    </div>
  );
}

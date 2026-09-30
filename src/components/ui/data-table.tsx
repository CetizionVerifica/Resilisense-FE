import { type ColumnDef, createColumnHelper, type RowData, tableFeatures, useTable } from '@tanstack/react-table';
import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Skeleton } from './skeleton';
import { ErrorState } from './states';

/**
 * Feature set of the base `DataTable` (02 §4). Server-paginated lists sort and filter on the API,
 * so no client row models are registered; add features here (sorting, selection…) when a screen needs them.
 */
export const dataTableFeatures = tableFeatures({});
export type DataTableFeatures = typeof dataTableFeatures;
export type DataTableColumn<T extends RowData> = ColumnDef<DataTableFeatures, T>;
export const createDataTableColumns = <T extends RowData>() => createColumnHelper<DataTableFeatures, T>();

interface DataTableProps<T extends RowData> {
  /** Accessible name of the table (visually hidden caption). */
  label: string;
  columns: DataTableColumn<T>[];
  data: T[];
  getRowId: (row: T) => string;
  isPending: boolean;
  isError: boolean;
  /** Shown when loaded with zero rows: explains the object and offers the create action. */
  empty: ReactNode;
  labels: { loading: string; errorTitle: string; retry: string; loadMore: string };
  onRetry: () => void;
  hasMore?: boolean;
  loadingMore?: boolean;
  onLoadMore?: () => void;
}

/** List-page table with the mandatory loading / empty / error states and cursor "Load more". */
export function DataTable<T extends RowData>({
  label,
  columns,
  data,
  getRowId,
  isPending,
  isError,
  empty,
  labels,
  onRetry,
  hasMore,
  loadingMore,
  onLoadMore,
}: DataTableProps<T>) {
  const table = useTable({ features: dataTableFeatures, columns, data, getRowId });

  if (isError) return <ErrorState title={labels.errorTitle} retryLabel={labels.retry} onRetry={onRetry} />;
  if (isPending) {
    return (
      <div className="grid gap-2 p-4" role="status" aria-label={labels.loading}>
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={i} className="h-10" />
        ))}
      </div>
    );
  }
  if (data.length === 0) return <>{empty}</>;

  return (
    <div className="grid">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-body">
          <caption className="sr-only">{label}</caption>
          <thead>
            {table.getHeaderGroups().map((group) => (
              <tr key={group.id} className="border-b border-border">
                {group.headers.map((header) => (
                  <th
                    key={header.id}
                    scope="col"
                    className="h-10 px-4 text-start text-small font-medium whitespace-nowrap text-fg-muted"
                  >
                    {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b border-border last:border-0 hover:bg-subtle/50">
                {row.getAllCells().map((cell) => (
                  <td key={cell.id} className={cn('px-4 py-2.5 align-middle')}>
                    <table.FlexRender cell={cell} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {hasMore && onLoadMore ? (
        <div className="flex justify-center border-t border-border p-3">
          <Button variant="secondary" loading={loadingMore} onClick={onLoadMore}>
            {labels.loadMore}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

import { useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import {
  getCompaniesControllerActivityInfiniteQueryKey,
  getCompaniesControllerGetQueryKey,
  getCompaniesControllerListInfiniteQueryKey,
  useCompaniesControllerActivityInfinite,
  useCompaniesControllerListInfinite,
} from '@/api/generated/companies/companies';
import { type CompaniesControllerListParams } from '@/api/generated/model';
import { getWorkspacesControllerEntitlementsQueryKey } from '@/api/generated/workspaces/workspaces';

const PAGE_SIZE = 25;
const nextCursor = (page: { nextCursor: string | null }) => page.nextCursor ?? undefined;

/** Companies of the current workspace, cursor-paginated (M02 §8 `GET /companies`). */
export function useCompanies(filters: Pick<CompaniesControllerListParams, 'q' | 'status'> = {}, limit = PAGE_SIZE) {
  const params = {
    limit,
    ...(filters.q ? { q: filters.q } : {}),
    ...(filters.status ? { status: filters.status } : {}),
  };
  const query = useCompaniesControllerListInfinite(params, {
    query: { initialPageParam: undefined, getNextPageParam: nextCursor },
  });
  const items = useMemo(() => query.data?.pages.flatMap((p) => p.items) ?? [], [query.data]);
  return { ...query, items };
}

export function useCompanyActivity(id: string) {
  const query = useCompaniesControllerActivityInfinite(
    id,
    { limit: PAGE_SIZE },
    { query: { initialPageParam: undefined, getNextPageParam: nextCursor } },
  );
  const items = useMemo(() => query.data?.pages.flatMap((p) => p.items) ?? [], [query.data]);
  return { ...query, items };
}

/** After a company mutation: lists (all filters), the company, its activity and the plan usage. */
export function useInvalidateCompanies() {
  const queryClient = useQueryClient();
  return (id?: string) =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: getCompaniesControllerListInfiniteQueryKey() }),
      queryClient.invalidateQueries({ queryKey: getWorkspacesControllerEntitlementsQueryKey() }),
      ...(id
        ? [
            queryClient.invalidateQueries({ queryKey: getCompaniesControllerGetQueryKey(id) }),
            queryClient.invalidateQueries({ queryKey: getCompaniesControllerActivityInfiniteQueryKey(id) }),
          ]
        : []),
    ]);
}

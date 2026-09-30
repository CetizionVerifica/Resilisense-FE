import { useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import {
  getMembersControllerInvitationsInfiniteQueryKey,
  getMembersControllerListInfiniteQueryKey,
  useMembersControllerInvitationsInfinite,
  useMembersControllerListInfinite,
} from '@/api/generated/members/members';
import { type MembersControllerListParams } from '@/api/generated/model';

const PAGE_SIZE = 25;
const nextCursor = (page: { nextCursor: string | null }) => page.nextCursor ?? undefined;

/** Members of the current workspace, cursor-paginated (M01 §8 `GET /workspaces/:wid/members`). */
export function useMembers(wid: string, filters: Pick<MembersControllerListParams, 'role' | 'status'>) {
  const query = useMembersControllerListInfinite(
    wid,
    { limit: PAGE_SIZE, ...filters },
    { query: { initialPageParam: undefined, getNextPageParam: nextCursor } },
  );
  const items = useMemo(() => query.data?.pages.flatMap((p) => p.items) ?? [], [query.data]);
  return { ...query, items };
}

export function useInvitations(wid: string) {
  const query = useMembersControllerInvitationsInfinite(
    wid,
    { limit: PAGE_SIZE },
    { query: { initialPageParam: undefined, getNextPageParam: nextCursor } },
  );
  const items = useMemo(() => query.data?.pages.flatMap((p) => p.items) ?? [], [query.data]);
  return { ...query, items };
}

/** After any member/invitation mutation: refetch both lists (every filter combination). */
export function useInvalidateMembers(wid: string) {
  const queryClient = useQueryClient();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: getMembersControllerListInfiniteQueryKey(wid) }),
      queryClient.invalidateQueries({ queryKey: getMembersControllerInvitationsInfiniteQueryKey(wid) }),
    ]);
}

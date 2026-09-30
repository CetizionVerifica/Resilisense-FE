import { useMeControllerGet } from '@/api/generated/me/me';
import { type MeControllerGet200PermissionsItem } from '@/api/generated/model';
import { useAuth } from './auth-provider';

export type Permission = MeControllerGet200PermissionsItem;

/** `GET /v1/me`: user, current workspace, memberships, permissions, entitlements (M01 §8). */
export function useMe() {
  const { status } = useAuth();
  return useMeControllerGet({ query: { enabled: status === 'signed-in', staleTime: 60_000 } });
}

/**
 * UI hint only — the API enforces permissions (M01 §2). Returns false while `/me` is loading.
 */
export function usePermission(permission: Permission): boolean {
  const { data } = useMe();
  return !!data?.permissions.includes(permission);
}

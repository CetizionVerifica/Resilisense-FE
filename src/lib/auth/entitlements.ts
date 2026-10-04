import { type WorkspacesControllerEntitlements200ModulesItem } from '@/api/generated/model';
import { useMe } from './me';

/** Entitlement modules (M02 §4.1); same list as the API. */
export type ModuleName = WorkspacesControllerEntitlements200ModulesItem;

/**
 * Whether the current workspace has bought a module (`GET /me` entitlements). UI hint only: the
 * API answers `403 entitlement_required` (M02 §4.1). `undefined` while `/me` loads.
 */
export function useEntitlement(module: ModuleName): boolean | undefined {
  const { data } = useMe();
  if (!data) return undefined;
  return !!data.entitlements?.modules.includes(module);
}

/** The current workspace is a partner: its plan allows client workspaces (M02 §9 notes). */
export function useIsPartnerWorkspace(): boolean {
  const { data } = useMe();
  const max = data?.entitlements?.limits.clientWorkspaces;
  return !!data?.permissions.includes('partner:manage') && typeof max === 'number' && max > 0;
}

/** Suspended or closed workspaces are read-only (M02 US-02-5). */
export function useWorkspaceReadOnly(): boolean {
  const { data } = useMe();
  const status = data?.currentWorkspace?.status;
  return status === 'suspended' || status === 'closed';
}

import { type MeControllerGet200 } from '@/api/generated/model';

export const MEMBER_ROLES = ['workspace_owner', 'workspace_admin', 'contributor', 'viewer', 'auditor'] as const;
export type MemberRole = (typeof MEMBER_ROLES)[number];

/**
 * Roles offered in the invite / change-role pickers. UI hint only: M01 §7 "grant roles ≤ your own"
 * is enforced by the API, which answers 403 for anything else. Only owners (and platform owners)
 * are offered the owner role.
 */
export function grantableRoles(me: MeControllerGet200 | undefined): MemberRole[] {
  const canGrantOwner = me?.currentWorkspace?.role === 'workspace_owner' || me?.user.platformRole === 'platform_owner';
  return MEMBER_ROLES.filter((r) => r !== 'workspace_owner' || canGrantOwner);
}

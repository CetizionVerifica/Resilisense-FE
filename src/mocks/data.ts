import { type MeControllerGet200 } from '@/api/generated/model';

/** Fixture identities for MSW (dev with VITE_API_MOCKS=1, unit tests, Playwright). Not real accounts. */
export const MOCK_PASSWORD = 'correct horse battery staple';
export const MOCK_MFA_CODE = '123456';
export const MOCK_TOKENS = { reset: 'reset-token-valid-0123456789', invite: 'invite-token-valid-0123456789' } as const;

export const WS_ACME = '01920000-0000-7000-8000-00000000a001';
export const WS_BETA = '01920000-0000-7000-8000-00000000b002';

export interface MockUser {
  id: string;
  email: string;
  name: string;
  mfa: boolean;
  platform: boolean;
}

export const USERS: MockUser[] = [
  {
    id: '01920000-0000-7000-8000-0000000000a1',
    email: 'alice@example.com',
    name: 'Alice Admin',
    mfa: false,
    platform: false,
  },
  {
    id: '01920000-0000-7000-8000-0000000000b2',
    email: 'mfa@example.com',
    name: 'Mia Factor',
    mfa: true,
    platform: false,
  },
  {
    id: '01920000-0000-7000-8000-0000000000c3',
    email: 'owner@example.com',
    name: 'Paula Platform',
    mfa: false,
    platform: true,
  },
];

const WORKSPACES = {
  [WS_ACME]: {
    id: WS_ACME,
    name: 'Acme Industries',
    slug: 'acme',
    status: 'active' as const,
    role: 'workspace_admin' as const,
  },
  [WS_BETA]: { id: WS_BETA, name: 'Beta Foods', slug: 'beta', status: 'trial' as const, role: 'viewer' as const },
};

export function meFor(user: MockUser, workspaceId: string): MeControllerGet200 {
  const ws = WORKSPACES[workspaceId as keyof typeof WORKSPACES] ?? WORKSPACES[WS_ACME];
  return {
    user: {
      id: user.id,
      email: user.email,
      emailVerified: true,
      name: user.name,
      jobTitle: null,
      phone: null,
      locale: 'en',
      timezone: 'UTC',
      theme: 'system',
      avatarFileId: null,
      platformRole: user.platform ? 'platform_owner' : null,
      mfaEnabled: user.mfa,
      status: 'active',
      lastLoginAt: null,
      termsVersion: '2026-09',
      termsAcceptedAt: '2026-09-30T10:00:00.000Z',
    },
    currentWorkspace: { ...ws, crossTenant: false, scope: { companyIds: [], projectIds: [] } },
    memberships: Object.values(WORKSPACES).map((w) => ({
      workspaceId: w.id,
      workspaceName: w.name,
      role: w.role,
      via: 'membership' as const,
    })),
    permissions:
      ws.role === 'workspace_admin'
        ? [
            'company:create',
            'company:update',
            'org:manage-users',
            'project:configure',
            'project:create',
            'project:read',
            'report:export',
          ]
        : ['project:read', 'report:export'],
    entitlements: { plan: 'test', modules: ['gap'], limits: {} },
    impersonatedBy: null,
    termsAcceptanceRequired: false,
    currentTermsVersion: '2026-09',
  };
}

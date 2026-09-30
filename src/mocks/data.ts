import {
  type MeControllerGet200,
  type MeControllerGet200User,
  type MembersControllerInvitations200ItemsItem,
  type MembersControllerList200ItemsItem,
} from '@/api/generated/model';

/** Fixture identities for MSW (dev with VITE_API_MOCKS=1, unit tests, Playwright). Not real accounts. */
export const MOCK_PASSWORD = 'correct horse battery staple';
export const MOCK_MFA_CODE = '123456';
export const MOCK_TERMS_VERSION = '2026-09';
export const MOCK_TOKENS = {
  reset: 'reset-token-valid-0123456789',
  invite: 'invite-token-valid-0123456789',
  verify: 'verify-token-valid-0123456789',
  verifyEmailChange: 'verify-email-change-0123456789',
} as const;

export const WS_ACME = '01920000-0000-7000-8000-00000000a001';
export const WS_BETA = '01920000-0000-7000-8000-00000000b002';

export interface MockUser {
  id: string;
  email: string;
  name: string;
  mfa: boolean;
  platform: boolean;
  /** Accepted terms version; differs from MOCK_TERMS_VERSION → terms gate. */
  termsVersion?: string;
  /** Signed in as this user by a platform owner (impersonation banner). */
  impersonatedBy?: { id: string; name: string };
}

const OWNER_ID = '01920000-0000-7000-8000-0000000000c3';

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
  { id: OWNER_ID, email: 'owner@example.com', name: 'Paula Platform', mfa: false, platform: true },
  {
    id: '01920000-0000-7000-8000-0000000000d4',
    email: 'terms@example.com',
    name: 'Terry Terms',
    mfa: false,
    platform: false,
    termsVersion: '2025-01',
  },
  {
    id: '01920000-0000-7000-8000-0000000000e5',
    email: 'impersonated@example.com',
    name: 'Ian Impersonated',
    mfa: false,
    platform: false,
    impersonatedBy: { id: OWNER_ID, name: 'Paula Platform' },
  },
];

export const OWNER = USERS.find((u) => u.id === OWNER_ID)!;

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

/** Mutable profile fields per user (PATCH /me, MFA, terms) — reset with the mock state. */
export type Profile = Pick<
  MeControllerGet200User,
  'name' | 'jobTitle' | 'phone' | 'locale' | 'timezone' | 'theme' | 'mfaEnabled' | 'termsVersion' | 'email'
>;

export function initialProfile(user: MockUser): Profile {
  return {
    email: user.email,
    name: user.name,
    jobTitle: null,
    phone: null,
    locale: 'en',
    timezone: 'UTC',
    theme: 'system',
    mfaEnabled: user.mfa,
    termsVersion: user.termsVersion ?? MOCK_TERMS_VERSION,
  };
}

export function meFor(
  user: MockUser,
  workspaceId: string,
  profile: Profile = initialProfile(user),
): MeControllerGet200 {
  const ws = WORKSPACES[workspaceId as keyof typeof WORKSPACES] ?? WORKSPACES[WS_ACME];
  return {
    user: {
      id: user.id,
      emailVerified: true,
      avatarFileId: null,
      platformRole: user.platform ? 'platform_owner' : null,
      status: 'active',
      lastLoginAt: null,
      termsAcceptedAt: '2026-09-30T10:00:00.000Z',
      ...profile,
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
    impersonatedBy: user.impersonatedBy ?? null,
    termsAcceptanceRequired: profile.termsVersion !== MOCK_TERMS_VERSION,
    currentTermsVersion: MOCK_TERMS_VERSION,
  };
}

const PROJECT_2026 = '01920000-0000-7000-8000-000000002026';

export function initialMembers(): MembersControllerList200ItemsItem[] {
  return [
    {
      id: '01920000-0000-7000-8000-000000000301',
      userId: '01920000-0000-7000-8000-0000000000f6',
      name: 'Olga Owner',
      email: 'olga@example.com',
      role: 'workspace_owner',
      companyIds: [],
      projectIds: [],
      status: 'active',
      lastLoginAt: '2026-09-29T08:15:00.000Z',
      expiresAt: null,
      createdAt: '2025-01-10T09:00:00.000Z',
    },
    {
      id: '01920000-0000-7000-8000-000000000302',
      userId: USERS[0]!.id,
      name: 'Alice Admin',
      email: 'alice@example.com',
      role: 'workspace_admin',
      companyIds: [],
      projectIds: [],
      status: 'active',
      lastLoginAt: '2026-09-30T07:00:00.000Z',
      expiresAt: null,
      createdAt: '2025-02-01T09:00:00.000Z',
    },
    {
      id: '01920000-0000-7000-8000-000000000303',
      userId: '01920000-0000-7000-8000-000000000107',
      name: 'Carl Contributor',
      email: 'carl@example.com',
      role: 'contributor',
      companyIds: [],
      projectIds: [PROJECT_2026],
      status: 'active',
      lastLoginAt: null,
      expiresAt: null,
      createdAt: '2026-03-12T09:00:00.000Z',
    },
    {
      id: '01920000-0000-7000-8000-000000000304',
      userId: '01920000-0000-7000-8000-000000000108',
      name: 'Vera Viewer',
      email: 'vera@example.com',
      role: 'viewer',
      companyIds: [],
      projectIds: [],
      status: 'deactivated',
      lastLoginAt: '2026-05-02T12:00:00.000Z',
      expiresAt: null,
      createdAt: '2026-04-20T09:00:00.000Z',
    },
  ];
}

export function initialInvitations(): MembersControllerInvitations200ItemsItem[] {
  return [
    {
      id: '01920000-0000-7000-8000-000000000201',
      email: 'dana@example.com',
      role: 'contributor',
      companyIds: [],
      projectIds: [],
      expiresAt: '2026-10-05T09:00:00.000Z',
      expired: false,
      invitedBy: USERS[0]!.id,
      createdAt: '2026-09-28T09:00:00.000Z',
    },
    {
      id: '01920000-0000-7000-8000-000000000202',
      email: 'eli@example.com',
      role: 'viewer',
      companyIds: [],
      projectIds: [],
      expiresAt: '2026-09-01T09:00:00.000Z',
      expired: true,
      invitedBy: USERS[0]!.id,
      createdAt: '2026-08-25T09:00:00.000Z',
    },
  ];
}

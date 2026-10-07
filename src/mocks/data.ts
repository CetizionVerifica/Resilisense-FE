import {
  type CompaniesControllerActivity200ItemsItem,
  type CompaniesControllerGet200,
  type MeControllerGet200,
  type MeControllerGet200User,
  type MembersControllerInvitations200ItemsItem,
  type MembersControllerList200ItemsItem,
  type PartnerControllerList200ItemsItem,
  type ReferenceControllerCountries200ItemsItem,
  type ReferenceControllerSectors200ItemsItem,
  type WorkspacesControllerCurrent200,
  type WorkspacesControllerEntitlements200,
  type WorkspacesControllerPartnerGrants200ItemsItem,
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
/** Partner workspace (plan allows client workspaces) and one of its clients (M02 US-02-1). */
export const WS_PARTNER = '01920000-0000-7000-8000-00000000c003';
export const WS_CLIENT = '01920000-0000-7000-8000-00000000d004';
/** Suspended workspace (M02 US-02-5). */
export const WS_HALT = '01920000-0000-7000-8000-00000000e005';

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
  /** Workspaces in the switcher (default Acme + Beta); the first one is the sign-in default. */
  workspaces?: string[];
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
  {
    id: '01920000-0000-7000-8000-0000000000f7',
    email: 'partner@example.com',
    name: 'Pat Partner',
    mfa: false,
    platform: false,
    workspaces: [WS_PARTNER, WS_CLIENT],
  },
  {
    id: '01920000-0000-7000-8000-0000000000f8',
    email: 'suspended@example.com',
    name: 'Sam Suspended',
    mfa: false,
    platform: false,
    workspaces: [WS_HALT],
  },
];

export const OWNER = USERS.find((u) => u.id === OWNER_ID)!;

type Role = 'workspace_owner' | 'workspace_admin' | 'viewer' | 'partner_admin';
type Limits = WorkspacesControllerEntitlements200['limits'];
interface MockWorkspace {
  id: string;
  name: string;
  slug: string;
  status: 'trial' | 'active' | 'suspended' | 'closed';
  role: Role;
  plan: string;
  modules: WorkspacesControllerEntitlements200['modules'];
  limits: Limits;
}

export const WORKSPACES: Record<string, MockWorkspace> = {
  [WS_ACME]: {
    id: WS_ACME,
    name: 'Acme Industries',
    slug: 'acme',
    status: 'active',
    role: 'workspace_admin',
    plan: 'professional',
    modules: ['gap', 'materiality', 'actions'],
    limits: { companies: 3, users: 25, projectsPerYear: 10, storageMb: 1024 },
  },
  [WS_BETA]: {
    id: WS_BETA,
    name: 'Beta Foods',
    slug: 'beta',
    status: 'trial',
    role: 'viewer',
    plan: 'trial',
    modules: ['gap'],
    limits: { companies: 1, users: 5, projectsPerYear: 1 },
  },
  [WS_PARTNER]: {
    id: WS_PARTNER,
    name: 'Verde Advisory',
    slug: 'verde',
    status: 'active',
    role: 'workspace_owner',
    plan: 'enterprise',
    modules: ['gap', 'materiality', 'actions', 'surveys'],
    limits: { companies: 5, users: 50, projectsPerYear: null, clientWorkspaces: 3 },
  },
  [WS_CLIENT]: {
    id: WS_CLIENT,
    name: 'Nordwind Logistics',
    slug: 'nordwind',
    status: 'active',
    role: 'partner_admin',
    plan: 'partner_client',
    modules: ['gap', 'materiality', 'actions', 'surveys'],
    limits: { companies: 1, users: 5, projectsPerYear: 1 },
  },
  [WS_HALT]: {
    id: WS_HALT,
    name: 'Halted Holdings',
    slug: 'halted',
    status: 'suspended',
    role: 'workspace_admin',
    plan: 'professional',
    modules: ['gap'],
    limits: { companies: 3, users: 25, projectsPerYear: 10 },
  },
};

/** Role → permissions, mirroring CSR_BE `engine/permissions.ts` (M01 §2). */
const OWNER_PERMISSIONS = [
  'workspace:manage',
  'billing:manage',
  'org:manage-users',
  'company:create',
  'company:update',
  'project:create',
  'project:configure',
  'project:read',
  'gap:answer',
  'evidence:upload',
  'gap:submit-for-review',
  'materiality:rate',
  'stakeholder:manage',
  'survey:send',
  'kpi:enter',
  'supplier:manage',
  'supplier:rank',
  'report:export',
  'audit:read',
  'partner:manage',
] as const satisfies MeControllerGet200['permissions'];
const without = (...drop: string[]) => OWNER_PERMISSIONS.filter((p) => !drop.includes(p));
const ROLE_PERMISSIONS: Record<Role, MeControllerGet200['permissions']> = {
  workspace_owner: [...OWNER_PERMISSIONS],
  workspace_admin: without('workspace:manage', 'billing:manage'),
  viewer: ['project:read', 'report:export'],
  partner_admin: without('workspace:manage', 'billing:manage', 'audit:read', 'partner:manage'),
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
  const ids = user.workspaces ?? [WS_ACME, WS_BETA];
  const ws = WORKSPACES[ids.includes(workspaceId) ? workspaceId : ids[0]!]!;
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
    currentWorkspace: {
      id: ws.id,
      name: ws.name,
      slug: ws.slug,
      status: ws.status,
      role: ws.role,
      crossTenant: false,
      scope: { companyIds: [], projectIds: [] },
    },
    memberships: ids.map((id) => {
      const w = WORKSPACES[id]!;
      return {
        workspaceId: w.id,
        workspaceName: w.name,
        role: w.role,
        via: w.role === 'partner_admin' ? ('partner_grant' as const) : ('membership' as const),
      };
    }),
    permissions: ROLE_PERMISSIONS[ws.role],
    entitlements: { plan: ws.plan, modules: ws.modules, limits: ws.limits },
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

// ─── M02: workspaces, companies, reference data, partner clients ───

export function initialWorkspaceProfiles(): Record<string, WorkspacesControllerCurrent200> {
  return Object.fromEntries(
    Object.values(WORKSPACES).map((w) => [
      w.id,
      {
        id: w.id,
        name: w.name,
        slug: w.slug,
        status: w.status,
        country: w.id === WS_ACME ? 'DE' : null,
        defaultLocale: 'en',
        timezone: 'Europe/Berlin',
        dataRegion: 'eu' as const,
        trialEndsAt: w.status === 'trial' ? '2026-10-31T00:00:00.000Z' : null,
        createdVia: w.role === 'partner_admin' ? ('partner' as const) : ('platform' as const),
        logoFileId: null,
        branding: {},
        createdAt: '2025-01-10T09:00:00.000Z',
        updatedAt: '2026-09-01T09:00:00.000Z',
      },
    ]),
  );
}

export const SECTOR_FIXTURES: ReferenceControllerSectors200ItemsItem[] = [
  ['manufacturing', null, 'Manufacturing'],
  ['automotive', 'manufacturing', 'Automotive'],
  ['chemicals', 'manufacturing', 'Chemicals'],
  ['services', null, 'Services'],
  ['logistics', 'services', 'Transport and logistics'],
  ['consulting', 'services', 'Consulting'],
].map(([code, parentCode, label], i) => ({
  code: code!,
  parentCode: parentCode ?? null,
  label: label!,
  labelKey: `sector.${code}`,
  sortOrder: i,
  isicCode: null,
  naceCode: null,
}));

export const COUNTRY_FIXTURES: ReferenceControllerCountries200ItemsItem[] = [
  ['DE', 'europe'],
  ['FR', 'europe'],
  ['IN', 'asia'],
  ['RO', 'europe'],
  ['US', 'americas'],
].map(([code, region]) => ({ code: code!, region: region!, labelKey: `country.${code}` }));

export type MockCompany = CompaniesControllerGet200 & { workspaceId: string };

const company = (
  id: string,
  workspaceId: string,
  fields: Partial<CompaniesControllerGet200> & Pick<CompaniesControllerGet200, 'legalName'>,
): MockCompany => ({
  id,
  workspaceId,
  displayName: fields.legalName,
  registrationNo: null,
  sectorCode: 'automotive',
  sizeBand: 'large',
  employeeCount: null,
  country: 'DE',
  region: null,
  website: null,
  description: null,
  address: null,
  logoFileId: null,
  fiscalYearStartMonth: 1,
  currency: 'EUR',
  parentCompanyId: null,
  createdAt: '2025-01-10T09:00:00.000Z',
  updatedAt: '2026-09-20T09:00:00.000Z',
  deletedAt: null,
  restorableUntil: null,
  lastActivityAt: '2026-09-28T09:00:00.000Z',
  ...fields,
});

export const COMPANY_ACME = '01920000-0000-7000-8000-000000000401';
export const COMPANY_ACME_EAST = '01920000-0000-7000-8000-000000000402';
export const COMPANY_ACME_OLD = '01920000-0000-7000-8000-000000000403';

export function initialCompanies(): MockCompany[] {
  return [
    company(COMPANY_ACME, WS_ACME, {
      legalName: 'Acme Industries GmbH',
      displayName: 'Acme Industries',
      registrationNo: 'HRB 12345',
      employeeCount: 1200,
      website: 'https://acme.example.com',
      address: { line1: 'Industriestraße 1', line2: null, city: 'Stuttgart', postalCode: '70173', state: null },
    }),
    company(COMPANY_ACME_EAST, WS_ACME, {
      legalName: 'Acme East SRL',
      displayName: 'Acme East',
      country: 'RO',
      sizeBand: 'medium',
      currency: 'RON',
      parentCompanyId: COMPANY_ACME,
      lastActivityAt: null,
    }),
    company(COMPANY_ACME_OLD, WS_ACME, {
      legalName: 'Acme Legacy Parts GmbH',
      displayName: 'Acme Legacy Parts',
      sizeBand: 'small',
      deletedAt: '2026-09-25T09:00:00.000Z',
      restorableUntil: '2026-10-25T09:00:00.000Z',
    }),
    company('01920000-0000-7000-8000-000000000404', WS_BETA, {
      legalName: 'Beta Foods SAS',
      country: 'FR',
      sectorCode: 'consulting',
      sizeBand: 'small',
    }),
    company('01920000-0000-7000-8000-000000000405', WS_PARTNER, {
      legalName: 'Verde Advisory Ltd',
      country: 'IN',
      sectorCode: 'consulting',
      sizeBand: 'small',
      currency: 'INR',
    }),
    company('01920000-0000-7000-8000-000000000406', WS_HALT, { legalName: 'Halted Holdings AG' }),
  ];
}

export function initialActivity(): Record<string, CompaniesControllerActivity200ItemsItem[]> {
  return {
    [COMPANY_ACME]: [
      {
        id: '01920000-0000-7000-8000-000000000501',
        occurredAt: '2026-09-20T09:00:00.000Z',
        action: 'company.updated',
        actor: { id: USERS[0]!.id, name: 'Alice Admin' },
        fields: ['employeeCount', 'website'],
      },
      {
        id: '01920000-0000-7000-8000-000000000502',
        occurredAt: '2025-01-10T09:00:00.000Z',
        action: 'company.created',
        actor: null,
        fields: [],
      },
    ],
  };
}

export function initialPartnerGrants(): Record<string, WorkspacesControllerPartnerGrants200ItemsItem[]> {
  return {
    [WS_ACME]: [
      {
        id: '01920000-0000-7000-8000-000000000601',
        partnerWorkspaceId: WS_PARTNER,
        partnerName: 'Verde Advisory',
        createdAt: '2026-02-01T09:00:00.000Z',
      },
    ],
  };
}

export function initialPartnerClients(): PartnerControllerList200ItemsItem[] {
  return [
    {
      grantId: '01920000-0000-7000-8000-000000000602',
      workspaceId: WS_CLIENT,
      name: 'Nordwind Logistics',
      status: 'active',
      companies: 1,
      lastActivityAt: '2026-09-30T09:00:00.000Z',
      createdAt: '2026-03-01T09:00:00.000Z',
    },
  ];
}

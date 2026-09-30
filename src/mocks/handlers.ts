import { http, HttpResponse } from 'msw';
import {
  type MembersControllerInvitations200ItemsItem,
  type MembersControllerList200ItemsItem,
} from '@/api/generated/model';
import {
  initialInvitations,
  initialMembers,
  initialProfile,
  MOCK_MFA_CODE,
  MOCK_PASSWORD,
  MOCK_TERMS_VERSION,
  MOCK_TOKENS,
  meFor,
  type MockUser,
  OWNER,
  type Profile,
  USERS,
  WS_ACME,
} from './data';

/**
 * In-memory M01 API (docs/revamp/modules/M01 §8) with the same shapes and problem codes as
 * CSR_BE. State resets with `resetMockState()` (tests) or a page reload (browser).
 */
const problem = (status: number, type: string, title: string, extra: Record<string, unknown> = {}) =>
  HttpResponse.json(
    { type: `https://resilisense.org/problems/${type}`, title, status, ...extra },
    { status, headers: { 'content-type': 'application/problem+json' } },
  );

interface Session {
  user: MockUser;
  workspaceId: string;
}

type Member = MembersControllerList200ItemsItem;
type Invitation = MembersControllerInvitations200ItemsItem;

function freshState() {
  return {
    sessions: new Map<string, Session>(),
    cookie: null as Session | null,
    counter: 0,
    usedTokens: new Set<string>(),
    profiles: new Map<string, Profile>(),
    members: initialMembers(),
    invitations: initialInvitations(),
    otherSessionRevoked: false,
  };
}

let state = freshState();

export function resetMockState(): void {
  state = freshState();
}

function profileOf(user: MockUser): Profile {
  let p = state.profiles.get(user.id);
  if (!p) {
    p = initialProfile(user);
    state.profiles.set(user.id, p);
  }
  return p;
}

function issue(session: Session) {
  const accessToken = `mock-access-${++state.counter}`;
  state.sessions.set(accessToken, session);
  // Impersonation tokens are access-only: the refresh cookie stays the platform owner's (M01 §7.1).
  state.cookie = session.user.impersonatedBy ? { user: OWNER, workspaceId: WS_ACME } : session;
  return { accessToken, tokenType: 'Bearer' as const, expiresIn: 900, workspaceId: session.workspaceId };
}

function sessionOf(request: Request): Session | undefined {
  const token = request.headers.get('authorization')?.replace(/^Bearer /, '');
  return token ? state.sessions.get(token) : undefined;
}

const unauthenticated = () => problem(401, 'unauthenticated', 'Authentication required');
const notFound = () => problem(404, 'not_found', 'Not found');

type Json = Record<string, unknown>;
const body = async (request: Request): Promise<Json> => ((await request.json()) as Json | null) ?? {};

/** Cursor pagination over an array (cursor = id of the last item of the previous page). */
function page<T extends { id: string }>(items: T[], url: URL) {
  const limit = Number(url.searchParams.get('limit') ?? 25);
  const cursor = url.searchParams.get('cursor');
  const start = cursor ? items.findIndex((i) => i.id === cursor) + 1 : 0;
  const slice = items.slice(start, start + limit);
  const more = start + limit < items.length;
  return { items: slice, nextCursor: more ? (slice[slice.length - 1]?.id ?? null) : null };
}

/** Workspace-scoped admin routes: `:wid` must be the session's workspace and the role must manage users. */
function adminOf(request: Request, wid: unknown): Session | Response {
  const session = sessionOf(request);
  if (!session) return unauthenticated();
  if (wid !== session.workspaceId) return notFound();
  if (!meFor(session.user, session.workspaceId).permissions.includes('org:manage-users')) {
    return problem(403, 'forbidden', 'You do not have permission to do this');
  }
  return session;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ROLES = ['workspace_owner', 'workspace_admin', 'contributor', 'viewer', 'auditor'];

function inviteRows(rows: Array<{ email: string; role: string }>) {
  return rows.map(({ email, role }) => {
    const address = email.toLowerCase();
    if (state.members.some((m) => m.email === address))
      return { email: address, status: 'already_member' as const, invitationId: null };
    const inv: Invitation = {
      id: `01920000-0000-7000-8000-${String(900000000000 + state.invitations.length + ++state.counter)}`,
      email: address,
      role: role as Invitation['role'],
      companyIds: [],
      projectIds: [],
      expiresAt: '2026-10-07T09:00:00.000Z',
      expired: false,
      invitedBy: USERS[0]!.id,
      createdAt: '2026-09-30T09:00:00.000Z',
    };
    state.invitations.unshift(inv);
    return { email: address, status: 'invited' as const, invitationId: inv.id };
  });
}

export const handlers = [
  http.post('*/v1/auth/login', async ({ request }) => {
    const { email, password } = await body(request);
    const user = USERS.find((u) => u.email === String(email).toLowerCase());
    if (!user || password !== MOCK_PASSWORD) return problem(401, 'unauthenticated', 'Invalid email or password');
    if (user.mfa) return HttpResponse.json({ mfaRequired: true, mfaToken: `mfa-${user.id}` });
    if (user.platform) return HttpResponse.json({ mfaEnrollmentRequired: true, mfaToken: `enroll-${user.id}` });
    return HttpResponse.json(issue({ user, workspaceId: WS_ACME }));
  }),

  http.post('*/v1/auth/signup', async ({ request }) => {
    const { password } = await body(request);
    if (password === 'password1234') {
      return problem(400, 'validation_failed', 'Password does not meet the policy', {
        errors: [{ path: 'password', message: 'Choose a less predictable password' }],
      });
    }
    return HttpResponse.json({ status: 'accepted' }, { status: 202 });
  }),

  http.post('*/v1/auth/verify-email', async ({ request }) => {
    const { token } = await body(request);
    const t = String(token);
    if (state.usedTokens.has(t) || (t !== MOCK_TOKENS.verify && t !== MOCK_TOKENS.verifyEmailChange)) {
      return problem(400, 'invalid_token', 'This link is invalid or has expired');
    }
    state.usedTokens.add(t);
    return HttpResponse.json({ status: 'verified', purpose: t === MOCK_TOKENS.verify ? 'signup' : 'email_change' });
  }),

  http.post('*/v1/auth/verify-email/resend', () => HttpResponse.json({ status: 'accepted' }, { status: 202 })),

  http.post('*/v1/auth/mfa/verify', async ({ request }) => {
    const { mfaToken, code, recoveryCode } = await body(request);
    const user = USERS.find((u) => `mfa-${u.id}` === mfaToken);
    if (!user) return problem(401, 'unauthenticated', 'Sign in again');
    if (code !== MOCK_MFA_CODE && recoveryCode !== 'abcde-12345')
      return problem(401, 'unauthenticated', 'Invalid code');
    return HttpResponse.json(issue({ user, workspaceId: WS_ACME }));
  }),

  http.post('*/v1/auth/mfa/setup', ({ request }) => {
    const auth = request.headers.get('authorization') ?? '';
    const session = sessionOf(request);
    if (!USERS.some((u) => auth === `Bearer enroll-${u.id}`) && !session) return unauthenticated();
    if (session && profileOf(session.user).mfaEnabled) {
      return problem(409, 'conflict', 'Two-factor authentication is already enabled');
    }
    return HttpResponse.json({
      secret: 'JBSWY3DPEHPK3PXP',
      otpauthUri: 'otpauth://totp/ResiliSense:owner@example.com?secret=JBSWY3DPEHPK3PXP',
    });
  }),

  http.post('*/v1/auth/mfa/confirm', async ({ request }) => {
    const auth = request.headers.get('authorization') ?? '';
    const enrolling = USERS.find((u) => auth === `Bearer enroll-${u.id}`);
    const session = sessionOf(request);
    if (!enrolling && !session) return unauthenticated();
    const { code } = await body(request);
    if (code !== MOCK_MFA_CODE) {
      return problem(400, 'validation_failed', 'Invalid code', { errors: [{ path: 'code', message: 'Invalid code' }] });
    }
    profileOf((enrolling ?? session?.user)!).mfaEnabled = true;
    return HttpResponse.json({
      recoveryCodes: ['abcde-12345', 'fghij-67890'],
      session: enrolling ? issue({ user: enrolling, workspaceId: WS_ACME }) : null,
    });
  }),

  http.delete('*/v1/auth/mfa', async ({ request }) => {
    const session = sessionOf(request);
    if (!session) return unauthenticated();
    if (session.user.platform) {
      return problem(403, 'forbidden', 'Two-factor authentication is mandatory for platform roles');
    }
    const { password, code } = await body(request);
    if (password !== MOCK_PASSWORD || code !== MOCK_MFA_CODE) {
      return problem(403, 'forbidden', 'Password or code is incorrect');
    }
    profileOf(session.user).mfaEnabled = false;
    return new HttpResponse(null, { status: 204 });
  }),

  http.post('*/v1/auth/impersonation/end', ({ request }) => {
    const session = sessionOf(request);
    if (!session) return unauthenticated();
    if (!session.user.impersonatedBy) return problem(409, 'conflict', 'Not impersonating');
    const token = request.headers.get('authorization')?.replace(/^Bearer /, '');
    if (token) state.sessions.delete(token);
    state.cookie = { user: OWNER, workspaceId: WS_ACME };
    return new HttpResponse(null, { status: 204 });
  }),

  http.post('*/v1/auth/refresh', () =>
    state.cookie ? HttpResponse.json(issue(state.cookie)) : problem(401, 'unauthenticated', 'Session expired'),
  ),

  http.post('*/v1/auth/logout', ({ request }) => {
    const token = request.headers.get('authorization')?.replace(/^Bearer /, '');
    if (token) state.sessions.delete(token);
    state.cookie = null;
    return new HttpResponse(null, { status: 204 });
  }),

  http.post('*/v1/auth/password/forgot', () => HttpResponse.json({ status: 'accepted' }, { status: 202 })),

  http.post('*/v1/auth/password/reset', async ({ request }) => {
    const { token, password } = await body(request);
    if (token !== MOCK_TOKENS.reset || state.usedTokens.has(String(token))) {
      return problem(400, 'invalid_token', 'This link is invalid or has expired');
    }
    if (password === 'password1234') {
      return problem(400, 'validation_failed', 'Password does not meet the policy', {
        errors: [{ path: 'password', message: 'Choose a less predictable password', code: 'too_weak' }],
      });
    }
    state.usedTokens.add(String(token));
    return new HttpResponse(null, { status: 204 });
  }),

  http.post('*/v1/invitations/accept', async ({ request }) => {
    const { token, name, password } = await body(request);
    if (token !== MOCK_TOKENS.invite || state.usedTokens.has(String(token))) {
      return problem(400, 'invalid_token', 'This invitation is invalid or has expired');
    }
    if (!name || !password) {
      return problem(400, 'validation_failed', 'Name and password are required', {
        errors: [
          ...(!name ? [{ path: 'name', message: 'Required' }] : []),
          ...(!password ? [{ path: 'password', message: 'Required' }] : []),
        ],
      });
    }
    state.usedTokens.add(String(token));
    return HttpResponse.json({ status: 'accepted', workspaceId: WS_ACME, newUser: true });
  }),

  http.get('*/v1/me', ({ request }) => {
    const session = sessionOf(request);
    return session
      ? HttpResponse.json(meFor(session.user, session.workspaceId, profileOf(session.user)))
      : unauthenticated();
  }),

  http.patch('*/v1/me', async ({ request }) => {
    const session = sessionOf(request);
    if (!session) return unauthenticated();
    const input = await body(request);
    if (typeof input.name === 'string' && !input.name.trim()) {
      return problem(400, 'validation_failed', 'Invalid profile', { errors: [{ path: 'name', message: 'Required' }] });
    }
    const profile = Object.assign(profileOf(session.user), input);
    return HttpResponse.json(meFor(session.user, session.workspaceId, profile).user);
  }),

  http.post('*/v1/me/password', async ({ request }) => {
    const session = sessionOf(request);
    if (!session) return unauthenticated();
    const { currentPassword, newPassword } = await body(request);
    if (currentPassword !== MOCK_PASSWORD) return problem(403, 'forbidden', 'Current password is incorrect');
    if (newPassword === 'password1234') {
      return problem(400, 'validation_failed', 'Password does not meet the policy', {
        errors: [{ path: 'newPassword', message: 'Choose a less predictable password' }],
      });
    }
    return new HttpResponse(null, { status: 204 });
  }),

  http.post('*/v1/me/email', async ({ request }) => {
    const session = sessionOf(request);
    if (!session) return unauthenticated();
    const { password } = await body(request);
    if (password !== MOCK_PASSWORD) return problem(403, 'forbidden', 'Password is incorrect');
    return HttpResponse.json({ status: 'accepted' }, { status: 202 });
  }),

  http.post('*/v1/me/terms', async ({ request }) => {
    const session = sessionOf(request);
    if (!session) return unauthenticated();
    const { version } = await body(request);
    if (version !== MOCK_TERMS_VERSION) {
      return problem(400, 'validation_failed', 'Unknown terms version', {
        errors: [{ path: 'version', message: 'Unknown terms version' }],
      });
    }
    profileOf(session.user).termsVersion = MOCK_TERMS_VERSION;
    return new HttpResponse(null, { status: 204 });
  }),

  http.post('*/v1/me/workspace', async ({ request }) => {
    const session = sessionOf(request);
    if (!session) return unauthenticated();
    const { workspaceId } = await body(request);
    return HttpResponse.json(issue({ user: session.user, workspaceId: String(workspaceId) }));
  }),

  http.get('*/v1/me/sessions', ({ request }) => {
    if (!sessionOf(request)) return unauthenticated();
    return HttpResponse.json({
      items: [
        {
          id: '01920000-0000-7000-8000-000000000501',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_6) AppleWebKit/605.1.15 Version/18.0 Safari/605.1.15',
          ip: '203.0.113.10',
          lastActiveAt: '2026-09-30T09:00:00.000Z',
          expiresAt: '2026-10-30T09:00:00.000Z',
          current: true,
        },
        ...(state.otherSessionRevoked
          ? []
          : [
              {
                id: '01920000-0000-7000-8000-000000000502',
                userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:131.0) Gecko/20100101 Firefox/131.0',
                ip: '198.51.100.7',
                lastActiveAt: '2026-09-27T16:30:00.000Z',
                expiresAt: '2026-10-27T16:30:00.000Z',
                current: false,
              },
            ]),
      ],
    });
  }),

  http.delete('*/v1/me/sessions/:id', ({ request, params }) => {
    if (!sessionOf(request)) return unauthenticated();
    if (params.id !== '01920000-0000-7000-8000-000000000502' || state.otherSessionRevoked) {
      return problem(404, 'not_found', 'Session not found');
    }
    state.otherSessionRevoked = true;
    return new HttpResponse(null, { status: 204 });
  }),

  http.get('*/v1/workspaces/:wid/members', ({ request, params }) => {
    const admin = adminOf(request, params.wid);
    if (admin instanceof Response) return admin;
    const url = new URL(request.url);
    const role = url.searchParams.get('role');
    const status = url.searchParams.get('status');
    const items = state.members.filter((m) => (!role || m.role === role) && (!status || m.status === status));
    return HttpResponse.json(page(items, url));
  }),

  http.patch('*/v1/workspaces/:wid/members/:id', async ({ request, params }) => {
    const admin = adminOf(request, params.wid);
    if (admin instanceof Response) return admin;
    const member = state.members.find((m) => m.id === params.id);
    if (!member) return notFound();
    if (member.userId === admin.user.id) {
      return problem(403, 'forbidden', 'You cannot change your own role or status');
    }
    const { role, active } = await body(request);
    if (role === 'workspace_owner') return problem(403, 'forbidden', 'You cannot grant this role');
    if (member.role === 'workspace_owner' && state.members.filter((m) => m.role === 'workspace_owner').length === 1) {
      return problem(409, 'conflict', 'A workspace must keep at least one owner');
    }
    if (typeof role === 'string') member.role = role as Member['role'];
    if (typeof active === 'boolean') member.status = active ? 'active' : 'deactivated';
    return HttpResponse.json(member);
  }),

  http.delete('*/v1/workspaces/:wid/members/:id', ({ request, params }) => {
    const admin = adminOf(request, params.wid);
    if (admin instanceof Response) return admin;
    const member = state.members.find((m) => m.id === params.id);
    if (!member) return notFound();
    if (member.role === 'workspace_owner' && state.members.filter((m) => m.role === 'workspace_owner').length === 1) {
      return problem(409, 'conflict', 'A workspace must keep at least one owner');
    }
    state.members = state.members.filter((m) => m !== member);
    return new HttpResponse(null, { status: 204 });
  }),

  http.get('*/v1/workspaces/:wid/invitations', ({ request, params }) => {
    const admin = adminOf(request, params.wid);
    if (admin instanceof Response) return admin;
    return HttpResponse.json(page(state.invitations, new URL(request.url)));
  }),

  http.post('*/v1/workspaces/:wid/invitations', async ({ request, params }) => {
    const admin = adminOf(request, params.wid);
    if (admin instanceof Response) return admin;
    const { invitations } = (await body(request)) as { invitations?: Array<{ email: string; role: string }> };
    const rows = invitations ?? [];
    if (rows.some((r) => r.role === 'workspace_owner')) {
      return problem(403, 'forbidden', 'You cannot grant this role', { detail: 'workspace_owner' });
    }
    if (rows.length > 10) {
      return problem(403, 'limit_exceeded', 'User limit reached', { detail: 'The plan allows 10 users' });
    }
    return HttpResponse.json({ results: inviteRows(rows) }, { status: 201 });
  }),

  http.post('*/v1/workspaces/:wid/invitations/csv', async ({ request, params }) => {
    const admin = adminOf(request, params.wid);
    if (admin instanceof Response) return admin;
    const { csv } = await body(request);
    const lines = String(csv).trim().split(/\r?\n/);
    const errors: Array<{ path: string; message: string }> = [];
    if (lines[0]?.replace(/\s/g, '') !== 'email,role,company_ids,project_ids') {
      errors.push({ path: 'csv:1', message: 'Header must be email,role,company_ids,project_ids' });
    }
    const rows = lines.slice(1).map((line, i) => {
      const [email = '', role = ''] = line.split(',').map((c) => c.trim());
      if (!EMAIL.test(email)) errors.push({ path: `csv:${i + 2}`, message: 'Invalid email' });
      else if (!ROLES.includes(role)) errors.push({ path: `csv:${i + 2}`, message: 'Unknown role' });
      return { email, role };
    });
    if (errors.length) return problem(400, 'validation_failed', 'CSV is invalid', { errors });
    return HttpResponse.json({ results: inviteRows(rows) }, { status: 201 });
  }),

  http.post('*/v1/workspaces/:wid/invitations/:id/resend', ({ request, params }) => {
    const admin = adminOf(request, params.wid);
    if (admin instanceof Response) return admin;
    const inv = state.invitations.find((i) => i.id === params.id);
    if (!inv) return notFound();
    Object.assign(inv, { expired: false, expiresAt: '2026-10-07T09:00:00.000Z' });
    return HttpResponse.json(inv);
  }),

  http.delete('*/v1/workspaces/:wid/invitations/:id', ({ request, params }) => {
    const admin = adminOf(request, params.wid);
    if (admin instanceof Response) return admin;
    if (!state.invitations.some((i) => i.id === params.id)) return notFound();
    state.invitations = state.invitations.filter((i) => i.id !== params.id);
    return new HttpResponse(null, { status: 204 });
  }),
];

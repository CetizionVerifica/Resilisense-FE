import { http, HttpResponse } from 'msw';
import { MOCK_MFA_CODE, MOCK_PASSWORD, MOCK_TOKENS, meFor, type MockUser, USERS, WS_ACME } from './data';

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

const state: { sessions: Map<string, Session>; cookie: Session | null; counter: number; usedTokens: Set<string> } = {
  sessions: new Map(),
  cookie: null,
  counter: 0,
  usedTokens: new Set(),
};

export function resetMockState(): void {
  state.sessions.clear();
  state.cookie = null;
  state.counter = 0;
  state.usedTokens.clear();
}

function issue(session: Session) {
  const accessToken = `mock-access-${++state.counter}`;
  state.sessions.set(accessToken, session);
  state.cookie = session;
  return { accessToken, tokenType: 'Bearer' as const, expiresIn: 900, workspaceId: session.workspaceId };
}

function sessionOf(request: Request): Session | undefined {
  const token = request.headers.get('authorization')?.replace(/^Bearer /, '');
  return token ? state.sessions.get(token) : undefined;
}

type Json = Record<string, unknown>;
const body = async (request: Request): Promise<Json> => ((await request.json()) as Json | null) ?? {};

export const handlers = [
  http.post('*/v1/auth/login', async ({ request }) => {
    const { email, password } = await body(request);
    const user = USERS.find((u) => u.email === String(email).toLowerCase());
    if (!user || password !== MOCK_PASSWORD) return problem(401, 'unauthenticated', 'Invalid email or password');
    if (user.mfa) return HttpResponse.json({ mfaRequired: true, mfaToken: `mfa-${user.id}` });
    if (user.platform) return HttpResponse.json({ mfaEnrollmentRequired: true, mfaToken: `enroll-${user.id}` });
    return HttpResponse.json(issue({ user, workspaceId: WS_ACME }));
  }),

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
    if (!USERS.some((u) => auth === `Bearer enroll-${u.id}`) && !sessionOf(request)) {
      return problem(401, 'unauthenticated', 'Authentication required');
    }
    return HttpResponse.json({
      secret: 'JBSWY3DPEHPK3PXP',
      otpauthUri: 'otpauth://totp/ResiliSense:owner@example.com?secret=JBSWY3DPEHPK3PXP',
    });
  }),

  http.post('*/v1/auth/mfa/confirm', async ({ request }) => {
    const auth = request.headers.get('authorization') ?? '';
    const user = USERS.find((u) => auth === `Bearer enroll-${u.id}`);
    const { code } = await body(request);
    if (code !== MOCK_MFA_CODE) {
      return problem(400, 'validation_failed', 'Invalid code', { errors: [{ path: 'code', message: 'Invalid code' }] });
    }
    return HttpResponse.json({
      recoveryCodes: ['abcde-12345', 'fghij-67890'],
      session: user ? issue({ user, workspaceId: WS_ACME }) : null,
    });
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
      ? HttpResponse.json(meFor(session.user, session.workspaceId))
      : problem(401, 'unauthenticated', 'Authentication required');
  }),

  http.post('*/v1/me/workspace', async ({ request }) => {
    const session = sessionOf(request);
    if (!session) return problem(401, 'unauthenticated', 'Authentication required');
    const { workspaceId } = await body(request);
    return HttpResponse.json(issue({ user: session.user, workspaceId: String(workspaceId) }));
  }),
];

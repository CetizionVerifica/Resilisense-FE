import { http, HttpResponse } from 'msw';
import { server } from '@/test/server';
import { apiFetch, refreshSession, setSessionExpiredHandler } from './api-client';
import { authToken } from './auth-token';
import { ApiError } from './problem';

describe('apiFetch', () => {
  it('sends the in-memory bearer token and parses JSON', async () => {
    authToken.set('t1');
    server.use(
      http.get('*/v1/ping', ({ request }) => HttpResponse.json({ auth: request.headers.get('authorization') })),
    );
    await expect(apiFetch('/v1/ping')).resolves.toEqual({ auth: 'Bearer t1' });
  });

  it('throws ApiError with the problem+json body and a stable code', async () => {
    server.use(
      http.get('*/v1/ping', () =>
        HttpResponse.json(
          { type: 'https://resilisense.org/problems/forbidden', title: 'Not allowed', status: 403 },
          { status: 403 },
        ),
      ),
    );
    const err = await apiFetch('/v1/ping').catch((e: unknown) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect((err as ApiError).code).toBe('forbidden');
    expect((err as ApiError).status).toBe(403);
  });

  it('on 401 refreshes once (single-flight) and retries each request', async () => {
    authToken.set('stale');
    let refreshes = 0;
    server.use(
      http.post('*/v1/auth/refresh', () => {
        refreshes++;
        return HttpResponse.json({ accessToken: 'fresh', tokenType: 'Bearer', expiresIn: 900, workspaceId: null });
      }),
      http.get('*/v1/ping', ({ request }) =>
        request.headers.get('authorization') === 'Bearer fresh'
          ? HttpResponse.json({ ok: true })
          : HttpResponse.json({ type: 'x/unauthenticated', title: 'no', status: 401 }, { status: 401 }),
      ),
    );
    await expect(Promise.all([apiFetch('/v1/ping'), apiFetch('/v1/ping'), apiFetch('/v1/ping')])).resolves.toEqual([
      { ok: true },
      { ok: true },
      { ok: true },
    ]);
    expect(refreshes).toBe(1);
    expect(authToken.get()).toBe('fresh');
  });

  it('signals an expired session when the refresh fails', async () => {
    authToken.set('stale');
    const expired = vi.fn();
    setSessionExpiredHandler(expired);
    server.use(
      http.get('*/v1/ping', () =>
        HttpResponse.json({ type: 'x/unauthenticated', title: 'no', status: 401 }, { status: 401 }),
      ),
    );
    await expect(apiFetch('/v1/ping')).rejects.toBeInstanceOf(ApiError);
    expect(expired).toHaveBeenCalledOnce();
    expect(authToken.get()).toBeNull();
  });

  it('never refreshes for the login call itself', async () => {
    authToken.set('stale');
    const refresh = vi.fn();
    server.use(http.post('*/v1/auth/refresh', () => (refresh(), HttpResponse.json({}))));
    await expect(apiFetch('/v1/auth/login', { method: 'POST', body: '{}' })).rejects.toBeInstanceOf(ApiError);
    expect(refresh).not.toHaveBeenCalled();
  });

  it('returns undefined for 204 and handles network errors in refresh', async () => {
    server.use(http.post('*/v1/auth/logout', () => new HttpResponse(null, { status: 204 })));
    await expect(apiFetch('/v1/auth/logout', { method: 'POST' })).resolves.toBeUndefined();
    server.use(http.post('*/v1/auth/refresh', () => HttpResponse.error()));
    await expect(refreshSession()).resolves.toBe(false);
  });
});

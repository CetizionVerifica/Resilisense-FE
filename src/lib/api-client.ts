import { authToken } from './auth-token';
import { ApiError, toProblem } from './problem';

/** Empty in development (Vite proxies /v1 to the API); https://api.… in deployed builds. */
export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? '';

interface SessionResponse {
  accessToken: string;
  workspaceId: string | null;
}

let refreshing: Promise<boolean> | null = null;
let onSessionExpired: (() => void) | null = null;

/** Called once by the auth provider: what to do when the session cannot be refreshed. */
export function setSessionExpiredHandler(handler: () => void): void {
  onSessionExpired = handler;
}

let impersonating = false;
let onImpersonationExpired: (() => void) | null = null;

/**
 * Impersonation tokens are access-only (M01 §7.1) while the refresh cookie belongs to the platform
 * owner. On a 401 during impersonation a silent refresh would continue *as the owner* behind the
 * impersonated user's screen, so the auth provider ends the impersonation cleanly instead.
 */
export function setImpersonating(active: boolean): void {
  impersonating = active;
}

export function setImpersonationExpiredHandler(handler: () => void): void {
  onImpersonationExpired = handler;
}

/**
 * Silent refresh via the httpOnly cookie. Single-flight: concurrent 401s share one refresh
 * (the API rotates refresh tokens and treats reuse as theft).
 */
export function refreshSession(): Promise<boolean> {
  refreshing ??= (async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/v1/auth/refresh`, { method: 'POST', credentials: 'include' });
      if (!res.ok) {
        authToken.set(null);
        return false;
      }
      authToken.set(((await res.json()) as SessionResponse).accessToken);
      return true;
    } catch {
      return false;
    } finally {
      refreshing = null;
    }
  })();
  return refreshing;
}

const NO_REFRESH = ['/v1/auth/login', '/v1/auth/refresh', '/v1/auth/mfa/verify'];

async function send(url: string, init: RequestInit): Promise<Response> {
  const headers = new Headers(init.headers);
  const token = authToken.get();
  if (token && !headers.has('authorization')) headers.set('authorization', `Bearer ${token}`);
  if (init.body !== undefined && !headers.has('content-type')) headers.set('content-type', 'application/json');
  headers.set('accept', 'application/json, application/problem+json');
  return fetch(`${API_BASE_URL}${url}`, { ...init, headers, credentials: 'include' });
}

/**
 * orval mutator: every generated hook calls this. Adds the bearer token, retries once after a
 * silent refresh on 401, and throws ApiError with the problem+json body on failure.
 */
export async function apiFetch<T>(url: string, init: RequestInit = {}): Promise<T> {
  let res = await send(url, init);
  const path = url.split('?')[0] ?? url;
  if (res.status === 401 && authToken.get() && !NO_REFRESH.includes(path)) {
    if (impersonating) onImpersonationExpired?.();
    else if (await refreshSession()) res = await send(url, init);
    else onSessionExpired?.();
  }
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  const body: unknown = text ? JSON.parse(text) : undefined;
  if (!res.ok) throw new ApiError(res.status, toProblem(res.status, body));
  return body as T;
}

/** orval uses these for the TError / body types of generated hooks. */
export type ErrorType<_E> = ApiError;
export type BodyType<B> = B;

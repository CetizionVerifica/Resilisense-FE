/**
 * Access token kept in memory only (CLAUDE.md "Auth"): never localStorage/sessionStorage.
 * The refresh token is an httpOnly cookie the browser sends to /v1/auth/refresh.
 */
type Listener = (token: string | null) => void;

let accessToken: string | null = null;
const listeners = new Set<Listener>();

export const authToken = {
  get: (): string | null => accessToken,
  set(token: string | null): void {
    accessToken = token;
    listeners.forEach((l) => l(token));
  },
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

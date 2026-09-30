import { useQueryClient } from '@tanstack/react-query';
import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authControllerLogout } from '@/api/generated/auth/auth';
import { refreshSession, setSessionExpiredHandler } from '../api-client';
import { authToken } from '../auth-token';

export type AuthStatus = 'bootstrapping' | 'signed-in' | 'signed-out';

interface AuthContextValue {
  status: AuthStatus;
  /** True when the last session ended because it expired (shown on the sign-in page). */
  expired: boolean;
  /** Stores the access token of a session issued by login / MFA / workspace switch. */
  startSession: (accessToken: string) => void;
  signOut: (opts?: { allDevices?: boolean }) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Session lifecycle (ADR-005): on load, try a silent refresh with the httpOnly cookie; the access
 * token only ever lives in memory. A failed refresh during use signs the user out.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<AuthStatus>(() => (authToken.get() ? 'signed-in' : 'bootstrapping'));
  const [expired, setExpired] = useState(false);

  useEffect(() => authToken.subscribe((t) => setStatus(t ? 'signed-in' : 'signed-out')), []);

  useEffect(() => {
    if (authToken.get()) return;
    let cancelled = false;
    void refreshSession().then((ok) => {
      if (!cancelled && !ok) setStatus('signed-out');
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setSessionExpiredHandler(() => {
      authToken.set(null);
      queryClient.clear();
      setExpired(true);
    });
  }, [queryClient]);

  const startSession = useCallback(
    (accessToken: string) => {
      setExpired(false);
      queryClient.clear();
      authToken.set(accessToken);
    },
    [queryClient],
  );

  const signOut = useCallback(
    async (opts?: { allDevices?: boolean }) => {
      try {
        await authControllerLogout(opts?.allDevices ? { all: 'true' } : undefined);
      } finally {
        authToken.set(null);
        queryClient.clear();
      }
    },
    [queryClient],
  );

  const value = useMemo(() => ({ status, expired, startSession, signOut }), [status, expired, startSession, signOut]);
  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth outside AuthProvider');
  return ctx;
}

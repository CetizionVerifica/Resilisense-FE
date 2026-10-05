import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { useMe } from './auth/me';

interface CompanyContextValue {
  /** Selected company in the current workspace; null = all companies. */
  companyId: string | null;
  setCompanyId: (id: string | null) => void;
}

const CompanyContext = createContext<CompanyContextValue>({ companyId: null, setCompanyId: () => {} });

/**
 * Company context of the top bar (M02 US-02-4): one selection per workspace, kept in memory for
 * the tab (browser storage is off-limits, CLAUDE.md "Auth"). Project lists (M03) filter by it; it
 * is a view preference, never sent to the API as authorisation.
 */
export function CompanyContextProvider({ children }: { children: ReactNode }) {
  const { data: me } = useMe();
  const wid = me?.currentWorkspace?.id;
  const [byWorkspace, setByWorkspace] = useState<Record<string, string | null>>({});

  const setCompanyId = useCallback(
    (id: string | null) => {
      if (wid) setByWorkspace((prev) => ({ ...prev, [wid]: id }));
    },
    [wid],
  );
  const companyId = wid ? (byWorkspace[wid] ?? null) : null;
  const value = useMemo(() => ({ companyId, setCompanyId }), [companyId, setCompanyId]);
  return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>;
}

export const useCompanyContext = () => useContext(CompanyContext);

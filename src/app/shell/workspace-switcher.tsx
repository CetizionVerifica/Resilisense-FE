import { useQueryClient } from '@tanstack/react-query';
import { Building2, ChevronsUpDown } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useMeControllerSwitchWorkspace } from '@/api/generated/me/me';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth/auth-provider';
import { useMe } from '@/lib/auth/me';

const SEARCH_THRESHOLD = 5;

/** Top-bar workspace switcher (US-01-3, M01 §9): search when > 5 workspaces. */
export function WorkspaceSwitcher() {
  const { t } = useTranslation();
  const { data: me } = useMe();
  const { startSession } = useAuth();
  const queryClient = useQueryClient();
  const [query, setQuery] = useState('');
  const switchWorkspace = useMeControllerSwitchWorkspace({
    mutation: {
      onSuccess: (session) => {
        startSession(session.accessToken);
        void queryClient.invalidateQueries();
      },
      onError: () => toast.error(t('workspace.switchFailed')),
    },
  });

  const memberships = useMemo(() => me?.memberships ?? [], [me]);
  const visible = useMemo(() => {
    const q = query.trim().toLocaleLowerCase();
    return q ? memberships.filter((m) => m.workspaceName.toLocaleLowerCase().includes(q)) : memberships;
  }, [memberships, query]);

  const current = me?.currentWorkspace;
  if (!me) return null;

  return (
    <DropdownMenu onOpenChange={(open) => !open && setQuery('')}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="max-w-64 justify-start px-2" aria-label={t('workspace.switch')}>
          <Building2 aria-hidden />
          <span className="truncate">{current?.name ?? t('workspace.none')}</span>
          <ChevronsUpDown className="ms-auto text-fg-muted" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72">
        <DropdownMenuLabel>{t('workspace.label')}</DropdownMenuLabel>
        {memberships.length > SEARCH_THRESHOLD ? (
          <div className="p-1">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
              placeholder={t('workspace.search')}
              aria-label={t('workspace.search')}
              className="h-8"
            />
          </div>
        ) : null}
        {visible.length === 0 ? (
          <p className="px-2 py-3 text-body text-fg-muted">{t('workspace.noMatch')}</p>
        ) : (
          <DropdownMenuRadioGroup
            value={current?.id ?? ''}
            onValueChange={(workspaceId) => {
              if (workspaceId !== current?.id) switchWorkspace.mutate({ data: { workspaceId } });
            }}
          >
            {visible.map((m) => (
              <DropdownMenuRadioItem key={m.workspaceId} value={m.workspaceId}>
                <span className="truncate">{m.workspaceName}</span>
                <span className="ms-auto text-small text-fg-muted">
                  {t(`role.${m.role}`, { defaultValue: m.role })}
                </span>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

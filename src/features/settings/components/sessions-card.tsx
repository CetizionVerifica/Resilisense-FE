import { useQueryClient } from '@tanstack/react-query';
import { Laptop } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import {
  getMeControllerSessionsQueryKey,
  useMeControllerRevokeSession,
  useMeControllerSessions,
} from '@/api/generated/me/me';
import { type MeControllerSessions200ItemsItem } from '@/api/generated/model';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState, ErrorState } from '@/components/ui/states';
import { useAuth } from '@/lib/auth/auth-provider';
import { describeUserAgent, formatRelative } from '@/lib/format';

type SessionItem = MeControllerSessions200ItemsItem;

/** `GET /v1/me/sessions` + revoke one, or sign out everywhere (M01 §4.1, §8). */
export function SessionsCard() {
  const { t, i18n } = useTranslation('settings');
  const queryClient = useQueryClient();
  const { signOut } = useAuth();
  const sessions = useMeControllerSessions();
  const [target, setTarget] = useState<SessionItem | 'all' | null>(null);
  const revoke = useMeControllerRevokeSession({
    mutation: {
      onSuccess: () => {
        setTarget(null);
        toast.success(t('sessions.revoked'));
        void queryClient.invalidateQueries({ queryKey: getMeControllerSessionsQueryKey() });
      },
      onError: () => toast.error(t('common:error.title')),
    },
  });
  const [signingOut, setSigningOut] = useState(false);

  const label = (s: SessionItem) => {
    const { browser, os } = describeUserAgent(s.userAgent ?? '');
    if (browser && os) return t('sessions.device', { browser, os });
    return browser ?? os ?? t('sessions.unknownDevice');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('sessions.title')}</CardTitle>
        <CardDescription>{t('sessions.description')}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {sessions.isPending ? (
          <div className="grid gap-2" role="status" aria-label={t('common:state.loading')}>
            <Skeleton className="h-14" />
            <Skeleton className="h-14" />
          </div>
        ) : sessions.isError ? (
          <ErrorState
            title={t('sessions.loadFailed')}
            retryLabel={t('common:action.retry')}
            onRetry={() => void sessions.refetch()}
          />
        ) : sessions.data.items.length === 0 ? (
          <EmptyState title={t('sessions.empty')} />
        ) : (
          <ul className="divide-y divide-border rounded-sm border border-border" aria-label={t('sessions.title')}>
            {sessions.data.items.map((s) => (
              <li key={s.id} className="flex flex-wrap items-center gap-3 p-3">
                <Laptop className="size-5 shrink-0 text-fg-muted" aria-hidden />
                <div className="grid min-w-0 flex-1 gap-0.5">
                  <p className="flex flex-wrap items-center gap-2 text-body font-medium">
                    {label(s)}
                    {s.current ? <Badge tone="info">{t('sessions.current')}</Badge> : null}
                  </p>
                  <p className="text-small text-fg-muted">
                    {t('sessions.meta', {
                      ip: s.ip ?? '—',
                      when: s.lastActiveAt ? formatRelative(s.lastActiveAt, i18n.language) : '—',
                    })}
                  </p>
                </div>
                {s.current ? null : (
                  <Button
                    size="sm"
                    variant="secondary"
                    aria-label={t('sessions.revokeNamed', { device: label(s) })}
                    onClick={() => setTarget(s)}
                  >
                    {t('sessions.revoke')}
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
        <div>
          <Button variant="secondary" onClick={() => setTarget('all')}>
            {t('sessions.signOutAll')}
          </Button>
        </div>
        <ConfirmDialog
          open={target !== null}
          onOpenChange={(open) => !open && setTarget(null)}
          title={target === 'all' ? t('sessions.signOutAllTitle') : t('sessions.revokeTitle')}
          description={
            target === 'all'
              ? t('sessions.signOutAllDescription')
              : t('sessions.revokeDescription', { device: target ? label(target) : '' })
          }
          confirmLabel={target === 'all' ? t('sessions.signOutAll') : t('sessions.revoke')}
          cancelLabel={t('common:action.cancel')}
          closeLabel={t('common:action.close')}
          destructive
          pending={revoke.isPending || signingOut}
          onConfirm={() => {
            if (target === 'all') {
              setSigningOut(true);
              void signOut({ allDevices: true });
            } else if (target) revoke.mutate({ id: target.id });
          }}
        />
      </CardContent>
    </Card>
  );
}

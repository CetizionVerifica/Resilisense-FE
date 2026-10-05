import { Handshake } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { type WorkspacesControllerPartnerGrants200ItemsItem } from '@/api/generated/model';
import {
  useWorkspacesControllerPartnerGrants,
  useWorkspacesControllerRevokePartnerGrant,
} from '@/api/generated/workspaces/workspaces';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/ui/states';
import { formatDate } from '@/lib/format';
import { workspaceProblem } from '../problem-message';

type Grant = WorkspacesControllerPartnerGrants200ItemsItem;

/** Partners with access to this workspace; the owner revokes them (M02 US-02-2). */
export function PartnerAccessCard() {
  const { t, i18n } = useTranslation('workspace');
  const grants = useWorkspacesControllerPartnerGrants();
  const [revoking, setRevoking] = useState<Grant | null>(null);
  const revoke = useWorkspacesControllerRevokePartnerGrant({
    mutation: {
      onSuccess: () => {
        toast.success(t('partners.revoked', { name: revoking?.partnerName ?? '' }));
        setRevoking(null);
        void grants.refetch();
      },
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('partners.title')}</CardTitle>
        <CardDescription>{t('partners.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        {grants.isPending ? (
          <Skeleton className="h-12" role="status" aria-label={t('common:state.loading')} />
        ) : grants.isError ? (
          <ErrorState
            title={t('partners.loadFailed')}
            retryLabel={t('common:action.retry')}
            onRetry={() => void grants.refetch()}
          />
        ) : grants.data.items.length === 0 ? (
          <p className="flex items-center gap-2 text-body text-fg-muted">
            <Handshake className="size-4" aria-hidden />
            {t('partners.none')}
          </p>
        ) : (
          <ul className="divide-y divide-border" aria-label={t('partners.title')}>
            {grants.data.items.map((g) => (
              <li key={g.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div className="grid gap-0.5">
                  <span className="font-medium">{g.partnerName}</span>
                  <span className="text-small text-fg-muted">
                    {t('partners.since', { date: formatDate(g.createdAt, i18n.language) })}
                  </span>
                </div>
                <Button variant="secondary" size="sm" onClick={() => setRevoking(g)}>
                  {t('partners.revoke')}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
      <ConfirmDialog
        open={revoking !== null}
        onOpenChange={(o) => {
          if (!o) {
            setRevoking(null);
            revoke.reset();
          }
        }}
        title={t('partners.confirmTitle', { name: revoking?.partnerName ?? '' })}
        description={t('partners.confirmDescription', { name: revoking?.partnerName ?? '' })}
        confirmLabel={t('partners.revoke')}
        cancelLabel={t('common:action.cancel')}
        closeLabel={t('common:action.close')}
        destructive
        pending={revoke.isPending}
        onConfirm={() => revoking && revoke.mutate({ id: revoking.id })}
      >
        {revoke.error ? <Alert tone="danger">{workspaceProblem(t, revoke.error)}</Alert> : null}
      </ConfirmDialog>
    </Card>
  );
}

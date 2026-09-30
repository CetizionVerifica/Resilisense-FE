import { useMutation } from '@tanstack/react-query';
import { MailPlus, UserPlus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { membersControllerResend, useMembersControllerRevoke } from '@/api/generated/members/members';
import { type MembersControllerInvitations200ItemsItem } from '@/api/generated/model';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { createDataTableColumns, DataTable } from '@/components/ui/data-table';
import { EmptyState } from '@/components/ui/states';
import { StatusPill } from '@/components/ui/status-pill';
import { formatDate } from '@/lib/format';
import { useInvalidateMembers, useInvitations } from '../hooks';
import { memberProblem } from '../problem-message';
import { ScopeSummary } from './scope-summary';

type Invitation = MembersControllerInvitations200ItemsItem;

/** Pending invitations with resend / revoke (M01 §8 `…/invitations`). */
export function InvitationsTable({ wid, onInvite }: { wid: string; onInvite: () => void }) {
  const { t, i18n } = useTranslation('members');
  const invitations = useInvitations(wid);
  const invalidate = useInvalidateMembers(wid);
  const [revoking, setRevoking] = useState<Invitation | null>(null);

  const resend = useMutation({
    // Each click is a new resend; the key only protects a network retry of the same click.
    mutationFn: (inv: Invitation) =>
      membersControllerResend(wid, inv.id, { headers: { 'Idempotency-Key': crypto.randomUUID() } }),
    onSuccess: (inv) => {
      toast.success(t('toast.resent', { email: inv.email }));
      void invalidate();
    },
    onError: (e) => toast.error(memberProblem(t, e)),
  });
  const revoke = useMembersControllerRevoke({
    mutation: {
      onSuccess: () => {
        toast.success(t('toast.revoked', { email: revoking?.email ?? '' }));
        setRevoking(null);
        void invalidate();
      },
    },
  });

  const { mutate: resendInvitation } = resend;
  const resendingId = resend.isPending ? resend.variables.id : undefined;

  const columns = useMemo(() => {
    const col = createDataTableColumns<Invitation>();
    return col.columns([
      col.display({
        id: 'email',
        header: () => t('column.email'),
        cell: ({ row }) => <span className="font-medium text-fg">{row.original.email}</span>,
      }),
      col.display({
        id: 'role',
        header: () => t('column.role'),
        cell: ({ row }) => t(`common:role.${row.original.role}`),
      }),
      col.display({
        id: 'scope',
        header: () => t('column.scope'),
        cell: ({ row }) => <ScopeSummary companyIds={row.original.companyIds} projectIds={row.original.projectIds} />,
      }),
      col.display({
        id: 'status',
        header: () => t('column.status'),
        cell: ({ row }) =>
          row.original.expired ? (
            <StatusPill tone="warning" label={t('invitation.expired')} />
          ) : (
            <StatusPill
              tone="info"
              label={t('invitation.expires', { date: formatDate(row.original.expiresAt, i18n.language) })}
            />
          ),
      }),
      col.display({
        id: 'sent',
        header: () => t('column.sent'),
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-fg-secondary">
            {formatDate(row.original.createdAt, i18n.language)}
          </span>
        ),
      }),
      col.display({
        id: 'actions',
        header: () => <span className="sr-only">{t('column.actions')}</span>,
        cell: ({ row }) => (
          <div className="flex justify-end gap-1">
            <Button
              size="sm"
              variant="ghost"
              aria-label={t('invitation.resendFor', { email: row.original.email })}
              loading={resendingId === row.original.id}
              onClick={() => resendInvitation(row.original)}
            >
              <MailPlus aria-hidden />
              <span className="hidden sm:inline">{t('invitation.resend')}</span>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-danger"
              aria-label={t('invitation.revokeFor', { email: row.original.email })}
              onClick={() => setRevoking(row.original)}
            >
              {t('invitation.revoke')}
            </Button>
          </div>
        ),
      }),
    ]);
  }, [t, i18n.language, resendInvitation, resendingId]);

  return (
    <div className="rounded-md border border-border bg-surface">
      <DataTable
        label={t('tab.invitations')}
        columns={columns}
        data={invitations.items}
        getRowId={(i) => i.id}
        isPending={invitations.isPending}
        isError={invitations.isError}
        onRetry={() => void invitations.refetch()}
        hasMore={invitations.hasNextPage}
        loadingMore={invitations.isFetchingNextPage}
        onLoadMore={() => void invitations.fetchNextPage()}
        labels={{
          loading: t('common:state.loading'),
          errorTitle: t('invitation.loadFailed'),
          retry: t('common:action.retry'),
          loadMore: t('loadMore'),
        }}
        empty={
          <EmptyState
            icon={<MailPlus aria-hidden />}
            title={t('invitation.emptyTitle')}
            description={t('invitation.emptyDescription')}
            action={
              <Button onClick={onInvite}>
                <UserPlus aria-hidden />
                {t('invite.open')}
              </Button>
            }
          />
        }
      />
      <ConfirmDialog
        open={revoking !== null}
        onOpenChange={(open) => {
          if (!open) {
            revoke.reset();
            setRevoking(null);
          }
        }}
        title={t('confirm.revoke.title')}
        description={t('confirm.revoke.description', { email: revoking?.email ?? '' })}
        confirmLabel={t('invitation.revoke')}
        cancelLabel={t('common:action.cancel')}
        closeLabel={t('common:action.close')}
        destructive
        pending={revoke.isPending}
        onConfirm={() => revoking && revoke.mutate({ wid, id: revoking.id })}
      >
        {revoke.error ? <Alert tone="danger">{memberProblem(t, revoke.error)}</Alert> : null}
      </ConfirmDialog>
    </div>
  );
}

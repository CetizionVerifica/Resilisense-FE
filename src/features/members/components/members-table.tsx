import { MoreHorizontal, UserPlus, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useMembersControllerRemove, useMembersControllerUpdate } from '@/api/generated/members/members';
import {
  type MembersControllerList200ItemsItem,
  type MembersControllerListRole,
  type MembersControllerListStatus,
} from '@/api/generated/model';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { createDataTableColumns, DataTable } from '@/components/ui/data-table';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FormField } from '@/components/ui/form-field';
import { Select } from '@/components/ui/select';
import { EmptyState } from '@/components/ui/states';
import { StatusPill, type StatusTone } from '@/components/ui/status-pill';
import { formatDate, formatRelative } from '@/lib/format';
import { useInvalidateMembers, useMembers } from '../hooks';
import { memberProblem } from '../problem-message';
import { MEMBER_ROLES, type MemberRole } from '../roles';
import { ScopeSummary } from './scope-summary';

type Member = MembersControllerList200ItemsItem;
type Action = { kind: 'role' | 'deactivate' | 'reactivate' | 'remove'; member: Member };

const STATUS_TONE: Record<Member['status'], StatusTone> = {
  active: 'success',
  deactivated: 'neutral',
  disabled: 'danger',
};

export interface MemberFilters {
  role?: MembersControllerListRole | undefined;
  status?: MembersControllerListStatus | undefined;
}

/** Members DataTable (M01 §9): name, email, role, scope, status, last active; filters by role/status. */
export function MembersTable({
  wid,
  currentUserId,
  grantable,
  filters,
  onFiltersChange,
  onInvite,
}: {
  wid: string;
  currentUserId: string;
  grantable: MemberRole[];
  filters: MemberFilters;
  onFiltersChange: (filters: MemberFilters) => void;
  onInvite: () => void;
}) {
  const { t, i18n } = useTranslation('members');
  const members = useMembers(wid, filters);
  const [action, setAction] = useState<Action | null>(null);
  const filtered = Boolean(filters.role ?? filters.status);

  const columns = useMemo(() => {
    const col = createDataTableColumns<Member>();
    return col.columns([
      col.display({
        id: 'member',
        header: () => t('column.member'),
        cell: ({ row }) => (
          <div className="grid min-w-48 gap-0.5">
            <span className="flex items-center gap-2 font-medium text-fg">
              {row.original.name}
              {row.original.userId === currentUserId ? <Badge>{t('you')}</Badge> : null}
            </span>
            <span className="text-small text-fg-muted">{row.original.email}</span>
          </div>
        ),
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
        cell: ({ row }) => (
          <StatusPill tone={STATUS_TONE[row.original.status]} label={t(`status.${row.original.status}`)} />
        ),
      }),
      col.display({
        id: 'lastActive',
        header: () => t('column.lastActive'),
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-fg-secondary">
            {row.original.lastLoginAt ? formatRelative(row.original.lastLoginAt, i18n.language) : t('never')}
          </span>
        ),
      }),
      col.display({
        id: 'actions',
        header: () => <span className="sr-only">{t('column.actions')}</span>,
        cell: ({ row }) =>
          row.original.userId === currentUserId ? null : <MemberActions member={row.original} onAction={setAction} />,
      }),
    ]);
  }, [t, i18n.language, currentUserId]);

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-end gap-3" role="group" aria-label={t('filters')}>
        <FormField label={t('column.role')}>
          <Select
            className="w-44"
            value={filters.role ?? ''}
            onChange={(e) =>
              onFiltersChange({ ...filters, role: (e.target.value || undefined) as MemberFilters['role'] })
            }
          >
            <option value="">{t('filter.allRoles')}</option>
            {MEMBER_ROLES.map((r) => (
              <option key={r} value={r}>
                {t(`common:role.${r}`)}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label={t('column.status')}>
          <Select
            className="w-44"
            value={filters.status ?? ''}
            onChange={(e) =>
              onFiltersChange({ ...filters, status: (e.target.value || undefined) as MemberFilters['status'] })
            }
          >
            <option value="">{t('filter.allStatuses')}</option>
            <option value="active">{t('status.active')}</option>
            <option value="deactivated">{t('status.deactivated')}</option>
          </Select>
        </FormField>
        {filtered ? (
          <Button variant="link" onClick={() => onFiltersChange({})}>
            {t('filter.clear')}
          </Button>
        ) : null}
      </div>
      <div className="rounded-md border border-border bg-surface">
        <DataTable
          label={t('tab.members')}
          columns={columns}
          data={members.items}
          getRowId={(m) => m.id}
          isPending={members.isPending}
          isError={members.isError}
          onRetry={() => void members.refetch()}
          hasMore={members.hasNextPage}
          loadingMore={members.isFetchingNextPage}
          onLoadMore={() => void members.fetchNextPage()}
          labels={{
            loading: t('common:state.loading'),
            errorTitle: t('loadFailed'),
            retry: t('common:action.retry'),
            loadMore: t('loadMore'),
          }}
          empty={
            filtered ? (
              <EmptyState
                icon={<Users aria-hidden />}
                title={t('empty.filteredTitle')}
                description={t('empty.filteredDescription')}
                action={
                  <Button variant="secondary" onClick={() => onFiltersChange({})}>
                    {t('filter.clear')}
                  </Button>
                }
              />
            ) : (
              <EmptyState
                icon={<Users aria-hidden />}
                title={t('empty.title')}
                description={t('empty.description')}
                action={
                  <Button onClick={onInvite}>
                    <UserPlus aria-hidden />
                    {t('invite.open')}
                  </Button>
                }
              />
            )
          }
        />
      </div>
      <ChangeRoleDialog
        wid={wid}
        member={action?.kind === 'role' ? action.member : null}
        grantable={grantable}
        onClose={() => setAction(null)}
      />
      <MemberConfirm wid={wid} action={action?.kind === 'role' ? null : action} onClose={() => setAction(null)} />
    </div>
  );
}

function MemberActions({ member, onAction }: { member: Member; onAction: (a: Action) => void }) {
  const { t } = useTranslation('members');
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t('actions.for', { name: member.name })}>
          <MoreHorizontal aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => onAction({ kind: 'role', member })}>
          {t('actions.changeRole')}
        </DropdownMenuItem>
        {member.status === 'active' ? (
          <DropdownMenuItem onSelect={() => onAction({ kind: 'deactivate', member })}>
            {t('actions.deactivate')}
          </DropdownMenuItem>
        ) : member.status === 'deactivated' ? (
          <DropdownMenuItem onSelect={() => onAction({ kind: 'reactivate', member })}>
            {t('actions.reactivate')}
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-danger" onSelect={() => onAction({ kind: 'remove', member })}>
          {t('actions.remove')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ChangeRoleDialog({
  wid,
  member,
  grantable,
  onClose,
}: {
  wid: string;
  member: Member | null;
  grantable: MemberRole[];
  onClose: () => void;
}) {
  const { t } = useTranslation('members');
  const invalidate = useInvalidateMembers(wid);
  const [role, setRole] = useState<MemberRole | ''>('');
  const update = useMembersControllerUpdate();
  // One close path for Cancel, success, X, Esc and overlay: the dialog stays mounted, so a
  // leftover choice would otherwise be preselected (and submitted) for the next member.
  const close = () => {
    setRole('');
    update.reset();
    onClose();
  };
  const options = member && !grantable.includes(member.role) ? [member.role, ...grantable] : grantable;
  const selected = role || member?.role || '';

  return (
    <Dialog
      open={member !== null}
      onOpenChange={(open) => {
        if (!open) close();
      }}
    >
      <DialogContent closeLabel={t('common:action.close')}>
        {member ? (
          <form
            className="grid gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (selected && selected !== member.role) {
                update.mutate(
                  { wid, id: member.id, data: { role: selected } },
                  {
                    onSuccess: (m) => {
                      toast.success(t('toast.roleChanged', { name: m.name, role: t(`common:role.${m.role}`) }));
                      void invalidate();
                      close();
                    },
                  },
                );
              } else close();
            }}
          >
            <div className="grid gap-2 pe-8">
              <DialogTitle>{t('changeRole.title', { name: member.name })}</DialogTitle>
              <DialogDescription>{t('changeRole.description')}</DialogDescription>
            </div>
            {update.error ? <Alert tone="danger">{memberProblem(t, update.error, 'member')}</Alert> : null}
            <FormField label={t('column.role')}>
              <Select value={selected} onChange={(e) => setRole(e.target.value as MemberRole)}>
                {options.map((r) => (
                  <option key={r} value={r}>
                    {t(`common:role.${r}`)}
                  </option>
                ))}
              </Select>
            </FormField>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={close}>
                {t('common:action.cancel')}
              </Button>
              <Button type="submit" loading={update.isPending}>
                {t('changeRole.submit')}
              </Button>
            </div>
          </form>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function MemberConfirm({ wid, action, onClose }: { wid: string; action: Action | null; onClose: () => void }) {
  const { t, i18n } = useTranslation('members');
  const invalidate = useInvalidateMembers(wid);
  const done = (message: string) => {
    toast.success(message);
    void invalidate();
    onClose();
  };
  const update = useMembersControllerUpdate({
    mutation: {
      onSuccess: (m) =>
        done(
          m.status === 'active' ? t('toast.reactivated', { name: m.name }) : t('toast.deactivated', { name: m.name }),
        ),
    },
  });
  const remove = useMembersControllerRemove();
  const error = update.error ?? remove.error;
  if (!action) return null;
  const { member, kind } = action;
  const since = formatDate(member.createdAt, i18n.language);

  return (
    <ConfirmDialog
      open
      onOpenChange={(open) => {
        if (!open) {
          update.reset();
          remove.reset();
          onClose();
        }
      }}
      title={t(`confirm.${kind}.title`, { name: member.name })}
      description={t(`confirm.${kind}.description`, { name: member.name, email: member.email, since })}
      confirmLabel={t(`confirm.${kind}.confirm`)}
      cancelLabel={t('common:action.cancel')}
      closeLabel={t('common:action.close')}
      destructive={kind !== 'reactivate'}
      pending={update.isPending || remove.isPending}
      onConfirm={() => {
        if (kind === 'remove') {
          remove.mutate({ wid, id: member.id }, { onSuccess: () => done(t('toast.removed', { name: member.name })) });
        } else update.mutate({ wid, id: member.id, data: { active: kind === 'reactivate' } });
      }}
    >
      {error ? <Alert tone="danger">{memberProblem(t, error, 'member')}</Alert> : null}
    </ConfirmDialog>
  );
}

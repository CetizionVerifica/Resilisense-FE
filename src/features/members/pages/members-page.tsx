import { Lock, UserPlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState, ErrorState, PageSkeleton } from '@/components/ui/states';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMe } from '@/lib/auth/me';
import { InvitationsTable } from '../components/invitations-table';
import { InviteSheet } from '../components/invite-sheet';
import { type MemberFilters, MembersTable } from '../components/members-table';
import { grantableRoles, MEMBER_ROLES } from '../roles';

const TABS = ['members', 'invitations'] as const;
type Tab = (typeof TABS)[number];

/**
 * `/settings/members` (M01 §9): members and pending invitations of the current workspace.
 * Tab, filters and the invite sheet live in the URL (`?tab=`, `?role=`, `?status=`, `?invite=1`).
 */
export function MembersPage() {
  const { t } = useTranslation('members');
  const { data: me, isPending, isError, refetch } = useMe();
  const [params, setParams] = useSearchParams();

  if (isPending) return <PageSkeleton label={t('common:state.loading')} />;
  if (isError) {
    return (
      <ErrorState
        title={t('common:error.title')}
        retryLabel={t('common:action.retry')}
        onRetry={() => void refetch()}
      />
    );
  }
  const wid = me.currentWorkspace?.id;
  if (!wid || !me.permissions.includes('org:manage-users')) {
    return (
      <Card>
        <EmptyState icon={<Lock aria-hidden />} title={t('forbidden.title')} description={t('forbidden.description')} />
      </Card>
    );
  }

  const tab: Tab = (TABS as readonly string[]).includes(params.get('tab') ?? '')
    ? (params.get('tab') as Tab)
    : 'members';
  const role = params.get('role');
  const status = params.get('status');
  const filters: MemberFilters = {
    role: MEMBER_ROLES.find((r) => r === role),
    status: status === 'active' || status === 'deactivated' ? status : undefined,
  };
  const update = (changes: Record<string, string | undefined>) =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        for (const [k, v] of Object.entries(changes)) {
          if (v) next.set(k, v);
          else next.delete(k);
        }
        return next;
      },
      { replace: true },
    );
  const openInvite = () => update({ invite: '1' });
  const grantable = grantableRoles(me);

  return (
    <section aria-labelledby="members-heading" className="grid gap-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="grid gap-1">
          <h2 id="members-heading" className="text-h2 font-semibold">
            {t('title')}
          </h2>
          <p className="text-body text-fg-muted">{t('description', { workspace: me.currentWorkspace?.name ?? '' })}</p>
        </div>
        <Button onClick={openInvite}>
          <UserPlus aria-hidden />
          {t('invite.open')}
        </Button>
      </div>
      <Tabs value={tab} onValueChange={(v) => update({ tab: v === 'members' ? undefined : v })}>
        <TabsList>
          <TabsTrigger value="members">{t('tab.members')}</TabsTrigger>
          <TabsTrigger value="invitations">{t('tab.invitations')}</TabsTrigger>
        </TabsList>
        <TabsContent value="members">
          <MembersTable
            wid={wid}
            currentUserId={me.user.id}
            grantable={grantable}
            filters={filters}
            onFiltersChange={(f) => update({ role: f.role, status: f.status })}
            onInvite={openInvite}
          />
        </TabsContent>
        <TabsContent value="invitations">
          <InvitationsTable wid={wid} onInvite={openInvite} />
        </TabsContent>
      </Tabs>
      <InviteSheet
        wid={wid}
        open={params.get('invite') === '1'}
        onOpenChange={(open) => update({ invite: open ? '1' : undefined })}
        grantable={grantable}
      />
    </section>
  );
}

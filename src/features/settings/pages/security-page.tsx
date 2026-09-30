import { useTranslation } from 'react-i18next';
import { Alert } from '@/components/ui/alert';
import { ErrorState, PageSkeleton } from '@/components/ui/states';
import { useMe } from '@/lib/auth/me';
import { ChangeEmailCard } from '../components/change-email-card';
import { ChangePasswordCard } from '../components/change-password-card';
import { SessionsCard } from '../components/sessions-card';
import { TwoFactorCard } from '../components/two-factor-card';

/** `/settings/security` (M01 §9): password, email, two-factor authentication, sessions. */
export function SecurityPage() {
  const { t } = useTranslation();
  const { data: me, isPending, isError, refetch } = useMe();

  if (isPending) return <PageSkeleton label={t('state.loading')} />;
  if (isError) {
    return <ErrorState title={t('error.title')} retryLabel={t('action.retry')} onRetry={() => void refetch()} />;
  }
  // Credentials belong to the impersonated user: the API refuses these changes (M01 §7.1).
  if (me.impersonatedBy) return <Alert tone="warning">{t('settings:impersonating')}</Alert>;
  return (
    <div className="grid gap-6">
      <ChangePasswordCard />
      <ChangeEmailCard currentEmail={me.user.email} />
      <TwoFactorCard user={me.user} />
      <SessionsCard />
    </div>
  );
}

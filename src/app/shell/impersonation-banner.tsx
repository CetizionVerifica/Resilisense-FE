import { useMutation } from '@tanstack/react-query';
import { UserRoundCog } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth/auth-provider';
import { useMe } from '@/lib/auth/me';

/**
 * Always-visible banner while a platform owner acts as another user (M01 §4.2, §7.1: `GET /me`
 * returns `impersonatedBy`). Every action in this session is audited under the owner.
 */
export function ImpersonationBanner() {
  const { t } = useTranslation();
  const { data: me } = useMe();
  const { endImpersonation } = useAuth();
  const end = useMutation({
    mutationFn: endImpersonation,
    onError: () => toast.error(t('impersonation.endFailed')),
  });

  if (!me?.impersonatedBy) return null;
  return (
    <div
      role="status"
      className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-warning/30 bg-warning-subtle px-4 py-2 text-body text-fg"
    >
      <UserRoundCog className="size-4 shrink-0 text-warning" aria-hidden />
      <p className="min-w-0 flex-1">
        {t('impersonation.banner', { user: me.user.name, email: me.user.email, by: me.impersonatedBy.name })}
      </p>
      <Button size="sm" variant="secondary" loading={end.isPending} onClick={() => end.mutate()}>
        {t('impersonation.end')}
      </Button>
    </div>
  );
}

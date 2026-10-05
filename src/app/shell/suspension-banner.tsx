import { CircleSlash } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useMe } from '@/lib/auth/me';

/**
 * Suspended/closed workspace notice (M02 US-02-5): users can read but not write; the API answers
 * `403 workspace_suspended` to every change.
 */
export function SuspensionBanner() {
  const { t } = useTranslation();
  const { data: me } = useMe();
  const status = me?.currentWorkspace?.status;
  if (status !== 'suspended' && status !== 'closed') return null;
  return (
    <div
      role="status"
      className="flex items-center gap-3 border-b border-danger/30 bg-danger-subtle px-4 py-2 text-body text-fg"
    >
      <CircleSlash className="size-4 shrink-0 text-danger" aria-hidden />
      <p className="min-w-0 flex-1">
        {t(`suspended.banner.${status}`, { workspace: me?.currentWorkspace?.name ?? '' })}
      </p>
    </div>
  );
}

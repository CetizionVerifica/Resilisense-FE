import { Bell } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

/** Notification centre entry point; the feed arrives with M12 (`GET /v1/notifications`). */
export function NotificationBell() {
  const { t } = useTranslation();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t('notifications.label')}>
          <Bell aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>{t('notifications.label')}</DropdownMenuLabel>
        <p className="px-2 pb-3 text-body text-fg-muted">{t('notifications.empty')}</p>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

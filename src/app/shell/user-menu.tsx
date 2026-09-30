import { Languages, LogOut, Monitor, Moon, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/lib/auth/auth-provider';
import { useMe } from '@/lib/auth/me';
import { SUPPORTED_LOCALES } from '@/lib/i18n';
import { type ThemePreference, useTheme } from '@/lib/theme';

/** Profile, theme, language and sign-out (02 §3). */
export function UserMenu() {
  const { t, i18n } = useTranslation();
  const { data: me } = useMe();
  const { signOut } = useAuth();
  const { preference, setPreference } = useTheme();
  const name = me?.user.name ?? '';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full" aria-label={t('user.menu')}>
          <Avatar name={name} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="grid">
          <span className="truncate text-body font-medium text-fg">{name}</span>
          <span className="truncate">{me?.user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Monitor aria-hidden />
            {t('theme.label')}
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={preference} onValueChange={(v) => setPreference(v as ThemePreference)}>
              <DropdownMenuRadioItem value="system">{t('theme.system')}</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="light">
                <Sun aria-hidden />
                {t('theme.light')}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="dark">
                <Moon aria-hidden />
                {t('theme.dark')}
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        {SUPPORTED_LOCALES.length > 1 ? (
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Languages aria-hidden />
              {t('language.label')}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={i18n.language} onValueChange={(l) => void i18n.changeLanguage(l)}>
                {SUPPORTED_LOCALES.map((l) => (
                  <DropdownMenuRadioItem key={l} value={l}>
                    {t(`language.${l}`)}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        ) : null}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => void signOut()}>
          <LogOut aria-hidden />
          {t('user.signOut')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

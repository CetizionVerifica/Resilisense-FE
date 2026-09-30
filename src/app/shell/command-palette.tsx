import { Home, LogOut, Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/lib/auth/auth-provider';
import { useTheme } from '@/lib/theme';

/** ⌘K / Ctrl K command palette (02 §3): navigate and run global actions. */
export function CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { resolved, setPreference } = useTheme();

  const run = (fn: () => void) => () => {
    onOpenChange(false);
    fn();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent closeLabel={t('action.close')} className="p-0" aria-describedby={undefined}>
        <DialogTitle className="sr-only">{t('command.title')}</DialogTitle>
        <Command label={t('command.title')}>
          <CommandInput placeholder={t('command.placeholder')} />
          <CommandList>
            <CommandEmpty>{t('command.empty')}</CommandEmpty>
            <CommandGroup heading={t('command.navigate')}>
              <CommandItem onSelect={run(() => void navigate('/'))}>
                <Home aria-hidden />
                {t('nav.home')}
              </CommandItem>
            </CommandGroup>
            <CommandGroup heading={t('command.actions')}>
              <CommandItem onSelect={run(() => setPreference(resolved === 'dark' ? 'light' : 'dark'))}>
                {resolved === 'dark' ? <Sun aria-hidden /> : <Moon aria-hidden />}
                {resolved === 'dark' ? t('theme.useLight') : t('theme.useDark')}
              </CommandItem>
              <CommandItem onSelect={run(() => void signOut())}>
                <LogOut aria-hidden />
                {t('user.signOut')}
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}

/** Global shortcut; returns [open, setOpen]. */
export function useCommandPaletteShortcut(): [boolean, (open: boolean) => void] {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  return [open, setOpen];
}

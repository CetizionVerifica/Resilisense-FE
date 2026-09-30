import { Menu, Search } from 'lucide-react';
import { Dialog as SheetPrimitive } from 'radix-ui';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router';
import { Button } from '@/components/ui/button';
import { CommandPalette, useCommandPaletteShortcut } from './command-palette';
import { NotificationBell } from './notification-bell';
import { Sidebar } from './sidebar';
import { UserMenu } from './user-menu';
import { WorkspaceSwitcher } from './workspace-switcher';

const SIDEBAR_KEY = 'rs.sidebar.collapsed';

function readCollapsed(): boolean {
  try {
    return localStorage.getItem(SIDEBAR_KEY) === '1';
  } catch {
    return false;
  }
}

/** App shell (02 §3): sidebar (icon rail when collapsed, sheet under lg) + 56px top bar. */
export function AppShell() {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(readCollapsed);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useCommandPaletteShortcut();

  const toggle = () =>
    setCollapsed((c) => {
      try {
        localStorage.setItem(SIDEBAR_KEY, c ? '0' : '1');
      } catch {
        // storage unavailable: keep the in-memory state
      }
      return !c;
    });

  return (
    <div className="flex min-h-dvh">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:start-2 focus:top-2 focus:z-50 focus:rounded-sm focus:bg-surface focus:p-2"
      >
        {t('nav.skipToContent')}
      </a>
      <div className="sticky top-0 hidden h-dvh lg:block">
        <Sidebar collapsed={collapsed} onToggle={toggle} />
      </div>
      <SheetPrimitive.Root open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetPrimitive.Portal>
          <SheetPrimitive.Overlay className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden" />
          <SheetPrimitive.Content className="fixed inset-y-0 start-0 z-50 lg:hidden" aria-describedby={undefined}>
            <SheetPrimitive.Title className="sr-only">{t('nav.label')}</SheetPrimitive.Title>
            <Sidebar collapsed={false} onNavigate={() => setMobileOpen(false)} />
          </SheetPrimitive.Content>
        </SheetPrimitive.Portal>
      </SheetPrimitive.Root>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border bg-surface px-3 lg:px-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label={t('nav.open')}
            onClick={() => setMobileOpen(true)}
          >
            <Menu aria-hidden />
          </Button>
          <WorkspaceSwitcher />
          <div className="ms-auto flex items-center gap-1">
            <Button
              variant="secondary"
              className="hidden w-56 justify-start text-fg-muted md:inline-flex"
              onClick={() => setPaletteOpen(true)}
            >
              <Search aria-hidden />
              <span>{t('command.open')}</span>
              <kbd className="ms-auto rounded-sm border border-border px-1.5 font-mono text-small">⌘K</kbd>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label={t('command.open')}
              onClick={() => setPaletteOpen(true)}
            >
              <Search aria-hidden />
            </Button>
            <NotificationBell />
            <UserMenu />
          </div>
        </header>
        <main id="main" tabIndex={-1} className="mx-auto w-full max-w-[1440px] flex-1 p-4 outline-none lg:p-8">
          <Outlet />
        </main>
      </div>
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </div>
  );
}

import { CheckCircle2 } from 'lucide-react';
import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router';
import { Logo } from '@/app/shell/logo';

/** Minimal shell for public auth pages (M01 §9, 02 §3): brand panel on the start side, form on the end side. */
export function AuthLayout({ children }: { children?: ReactNode }) {
  const { t } = useTranslation('auth');
  const points = ['layout.point1', 'layout.point2', 'layout.point3'] as const;
  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <aside className="hidden flex-col justify-between bg-sidebar p-10 text-sidebar-text lg:flex">
        <Logo className="text-white" />
        <div className="grid max-w-md gap-6">
          <h2 className="text-display font-semibold text-white">{t('layout.tagline')}</h2>
          <ul className="grid gap-3">
            {points.map((p) => (
              <li key={p} className="flex gap-3 text-body-lg">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden />
                {t(p)}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-small text-sidebar-muted">{t('layout.footer', { year: new Date().getFullYear() })}</p>
      </aside>
      <main className="flex flex-col items-center justify-center p-6 sm:p-10">
        <Logo className="mb-8 text-fg lg:hidden" />
        <div className="w-full max-w-sm">{children ?? <Outlet />}</div>
      </main>
    </div>
  );
}

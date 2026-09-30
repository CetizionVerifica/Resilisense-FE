import { useTranslation } from 'react-i18next';
import { isRouteErrorResponse, Link, useRouteError } from 'react-router';
import { Button } from '@/components/ui/button';
import { ErrorState, PageSkeleton } from '@/components/ui/states';

/** Route-level error boundary: a crash in one page never blanks the app. */
export function RouteError() {
  const error = useRouteError();
  const { t } = useTranslation();
  if (isRouteErrorResponse(error) && error.status === 404) return <NotFound />;
  return (
    <main className="mx-auto max-w-xl p-8">
      <ErrorState
        title={t('error.title')}
        description={t('error.description')}
        retryLabel={t('action.reload')}
        onRetry={() => window.location.reload()}
      />
    </main>
  );
}

export function NotFound() {
  const { t } = useTranslation();
  return (
    <main className="mx-auto flex max-w-xl flex-col items-center gap-4 p-12 text-center">
      <p className="font-mono text-small text-fg-muted">404</p>
      <h1 className="text-h1 font-semibold">{t('notFound.title')}</h1>
      <p className="text-body text-fg-muted">{t('notFound.description')}</p>
      <Button asChild variant="secondary">
        <Link to="/">{t('notFound.home')}</Link>
      </Button>
    </main>
  );
}

/** Shown while the first lazy route module loads. */
export function RouteFallback() {
  const { t } = useTranslation();
  return (
    <div className="mx-auto max-w-5xl p-8">
      <PageSkeleton label={t('state.loading')} />
    </div>
  );
}

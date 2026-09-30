import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router';
import { getMeControllerGetQueryKey, useMeControllerAcceptTerms } from '@/api/generated/me/me';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ErrorState, PageSkeleton } from '@/components/ui/states';
import { useAuth } from '@/lib/auth/auth-provider';
import { useMe } from '@/lib/auth/me';
import { AuthHeading } from './auth-card';
import { AuthLayout } from './auth-layout';
import { problemMessage } from '../problem-message';
import { type TermsValues, termsSchema } from '../schemas';

/**
 * Blocks the app until the current terms & licence version is accepted (M01 §4.1, §7.1:
 * `GET /me` → `termsAcceptanceRequired`). The API records version + timestamp but does not
 * enforce acceptance, so the gate fails closed: no `/me`, no app.
 *
 * Once the app has been shown in this session it stays mounted while `/me` refetches (a workspace
 * switch resets queries), so the shell isn't torn down and rebuilt on every switch.
 */
export function TermsGate() {
  const { t } = useTranslation();
  const { data: me, isError, refetch } = useMe();
  const [admitted, setAdmitted] = useState(false);
  const mustAccept = !!me?.termsAcceptanceRequired && !me.impersonatedBy;
  if (me && !mustAccept && !admitted) setAdmitted(true);

  if (mustAccept) {
    return (
      <AuthLayout>
        <TermsForm version={me.currentTermsVersion} />
      </AuthLayout>
    );
  }
  if (me || admitted) return <Outlet />;
  return (
    <div className="mx-auto max-w-5xl p-8">
      {isError ? (
        <ErrorState title={t('error.title')} retryLabel={t('action.retry')} onRetry={() => void refetch()} />
      ) : (
        <PageSkeleton label={t('state.loading')} />
      )}
    </div>
  );
}

function TermsForm({ version }: { version: string }) {
  const { t } = useTranslation('auth');
  const { signOut } = useAuth();
  const queryClient = useQueryClient();
  const form = useForm<TermsValues>({ resolver: zodResolver(termsSchema) });
  const accept = useMeControllerAcceptTerms({
    mutation: { onSuccess: () => queryClient.invalidateQueries({ queryKey: getMeControllerGetQueryKey() }) },
  });
  const documentUrl = import.meta.env.VITE_TERMS_URL?.replace('{version}', encodeURIComponent(version));
  const error = form.formState.errors.accepted?.message;

  return (
    <>
      <AuthHeading title={t('terms.title')} description={t('terms.description', { version })} />
      <form noValidate className="grid gap-4" onSubmit={form.handleSubmit(() => accept.mutate({ data: { version } }))}>
        {accept.error ? <Alert tone="danger">{problemMessage(t, accept.error)}</Alert> : null}
        {documentUrl ? (
          <a
            href={documentUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-body text-link hover:underline"
          >
            {t('terms.read', { version })}
            <ExternalLink className="size-4" aria-hidden />
          </a>
        ) : null}
        <Checkbox label={t('terms.accept')} error={error && t(error)} {...form.register('accepted')} />
        <Button type="submit" size="lg" loading={accept.isPending}>
          {t('terms.submit')}
        </Button>
        <Button type="button" variant="link" onClick={() => void signOut()}>
          {t('terms.signOut')}
        </Button>
      </form>
    </>
  );
}

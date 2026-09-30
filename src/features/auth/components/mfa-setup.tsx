import { zodResolver } from '@hookform/resolvers/zod';
import { type ReactNode, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useAuthControllerConfirmMfa, useAuthControllerSetupMfa } from '@/api/generated/auth/auth';
import { type AuthControllerConfirmMfa200Session } from '@/api/generated/model';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { isApiError } from '@/lib/problem';
import { problemMessage } from '../problem-message';
import { type MfaValues, mfaSchema } from '../schemas';

/**
 * Two-step TOTP setup (M01 §7.1): `POST /auth/mfa/setup` returns the secret + otpauth URI,
 * `POST /auth/mfa/confirm` enables MFA and returns 10 one-time recovery codes (and a session
 * when completing a mandatory enrolment). Used at sign-in and in Settings → Security.
 */
export function MfaSetup({
  headers,
  heading,
  finishLabel,
  onFinish,
}: {
  /** Enrolment token for the sign-in flow; omitted when signed in. */
  headers?: Record<string, string>;
  heading: (stage: 'setup' | 'codes') => ReactNode;
  finishLabel: string;
  onFinish: (session: AuthControllerConfirmMfa200Session) => void;
}) {
  const { t } = useTranslation('auth');
  const request = headers ? { headers } : undefined;
  const setup = useAuthControllerSetupMfa({ request });
  const form = useForm<MfaValues>({ resolver: zodResolver(mfaSchema), defaultValues: { code: '' } });
  const confirm = useAuthControllerConfirmMfa({
    request,
    mutation: {
      onError: (e) => {
        if (isApiError(e, 'validation_failed')) form.setError('code', { type: 'server', message: 'auth:mfa.invalid' });
      },
    },
  });
  const codeError = form.formState.errors.code?.message;

  const { mutate: startSetup } = setup;
  useEffect(() => startSetup(), [startSetup]);

  if (confirm.data) {
    const { session, recoveryCodes } = confirm.data;
    return (
      <>
        {heading('codes')}
        <ul
          className="grid grid-cols-2 gap-2 rounded-sm border border-border bg-surface p-4 font-mono text-body"
          dir="ltr"
          aria-label={t('enroll.codesTitle')}
        >
          {recoveryCodes.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
        <Button size="lg" className="mt-6 w-full" onClick={() => onFinish(session)}>
          {finishLabel}
        </Button>
      </>
    );
  }

  return (
    <>
      {heading('setup')}
      {setup.error ? <Alert tone="danger">{problemMessage(t, setup.error)}</Alert> : null}
      {setup.isPending || !setup.data ? (
        setup.error ? null : (
          <Skeleton className="h-16" />
        )
      ) : (
        <div className="grid gap-2 pb-4">
          <p className="text-small font-medium text-fg-secondary">{t('enroll.secret')}</p>
          <code className="break-all rounded-sm bg-subtle p-3 font-mono text-body" dir="ltr">
            {setup.data.secret}
          </code>
          <a href={setup.data.otpauthUri} className="text-body text-link hover:underline">
            {t('enroll.openApp')}
          </a>
        </div>
      )}
      <form noValidate className="grid gap-4" onSubmit={form.handleSubmit((v) => confirm.mutate({ data: v }))}>
        {confirm.error && !isApiError(confirm.error, 'validation_failed') ? (
          <Alert tone="danger">{problemMessage(t, confirm.error)}</Alert>
        ) : null}
        <FormField label={t('mfa.code')} error={codeError && t(codeError)}>
          <Input inputMode="numeric" autoComplete="one-time-code" maxLength={6} {...form.register('code')} />
        </FormField>
        <Button type="submit" size="lg" loading={confirm.isPending} disabled={!setup.data}>
          {t('enroll.confirm')}
        </Button>
      </form>
    </>
  );
}

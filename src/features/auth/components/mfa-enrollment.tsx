import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useAuthControllerConfirmMfa, useAuthControllerSetupMfa } from '@/api/generated/auth/auth';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { AuthHeading } from './auth-card';
import { problemMessage } from '../problem-message';
import { type MfaValues, mfaSchema } from '../schemas';

/**
 * Mandatory MFA enrolment for platform users (M01 §7.1): the enrolment token authorises only
 * setup/confirm; confirm returns recovery codes and the session.
 */
export function MfaEnrollment({
  enrollmentToken,
  onDone,
}: {
  enrollmentToken: string;
  onDone: (token: string) => void;
}) {
  const { t } = useTranslation('auth');
  const auth = { headers: { authorization: `Bearer ${enrollmentToken}` } };
  const setup = useAuthControllerSetupMfa({ request: auth });
  const confirm = useAuthControllerConfirmMfa({ request: auth });
  const form = useForm<MfaValues>({ resolver: zodResolver(mfaSchema), defaultValues: { code: '' } });
  const codeError = form.formState.errors.code?.message;

  const { mutate: startSetup } = setup;
  useEffect(() => startSetup(), [startSetup]);

  if (confirm.data) {
    const session = confirm.data.session;
    return (
      <>
        <AuthHeading title={t('enroll.codesTitle')} description={t('enroll.codesDescription')} />
        <ul
          className="grid grid-cols-2 gap-2 rounded-sm border border-border bg-surface p-4 font-mono text-body"
          dir="ltr"
        >
          {confirm.data.recoveryCodes.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
        <Button
          size="lg"
          className="mt-6 w-full"
          disabled={!session}
          onClick={() => session && onDone(session.accessToken)}
        >
          {t('enroll.continue')}
        </Button>
      </>
    );
  }

  return (
    <>
      <AuthHeading title={t('enroll.title')} description={t('enroll.description')} />
      {setup.error ? <Alert tone="danger">{problemMessage(t, setup.error)}</Alert> : null}
      {setup.isPending || !setup.data ? (
        <Skeleton className="h-16" />
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
        {confirm.error ? <Alert tone="danger">{problemMessage(t, confirm.error)}</Alert> : null}
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

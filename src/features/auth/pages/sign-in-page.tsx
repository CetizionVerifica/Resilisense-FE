import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router';
import { useAuthControllerLogin, useAuthControllerVerifyMfa } from '@/api/generated/auth/auth';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth/auth-provider';
import { returnPath } from '@/lib/auth/guards';
import { AuthHeading } from '../components/auth-card';
import { MfaEnrollment } from '../components/mfa-enrollment';
import { problemMessage } from '../problem-message';
import {
  type MfaValues,
  mfaSchema,
  type RecoveryValues,
  recoverySchema,
  type SignInValues,
  signInSchema,
} from '../schemas';

type Step = { kind: 'credentials' } | { kind: 'mfa'; mfaToken: string } | { kind: 'enroll'; mfaToken: string };

/** `/sign-in` (M01 §4.1, §7.1): email + password, then a TOTP/recovery code or MFA enrolment. */
export function SignInPage() {
  const { startSession, expired } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = returnPath(location.state);
  const [step, setStep] = useState<Step>({ kind: 'credentials' });

  const finish = (accessToken: string) => {
    startSession(accessToken);
    void navigate(from, { replace: true });
  };

  if (step.kind === 'mfa')
    return <MfaStep mfaToken={step.mfaToken} onDone={finish} onBack={() => setStep({ kind: 'credentials' })} />;
  if (step.kind === 'enroll') return <MfaEnrollment enrollmentToken={step.mfaToken} onDone={finish} />;
  return (
    <CredentialsStep
      expired={expired}
      onSession={finish}
      onMfa={(mfaToken) => setStep({ kind: 'mfa', mfaToken })}
      onEnroll={(mfaToken) => setStep({ kind: 'enroll', mfaToken })}
    />
  );
}

function CredentialsStep({
  expired,
  onSession,
  onMfa,
  onEnroll,
}: {
  expired: boolean;
  onSession: (token: string) => void;
  onMfa: (token: string) => void;
  onEnroll: (token: string) => void;
}) {
  const { t } = useTranslation('auth');
  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });
  const login = useAuthControllerLogin({
    mutation: {
      onSuccess: (res) => {
        if ('accessToken' in res) onSession(res.accessToken);
        else if ('mfaRequired' in res) onMfa(res.mfaToken);
        else onEnroll(res.mfaToken);
      },
    },
  });
  const { errors } = form.formState;

  return (
    <>
      <AuthHeading title={t('signIn.title')} description={t('signIn.description')} />
      <form noValidate className="grid gap-4" onSubmit={form.handleSubmit((values) => login.mutate({ data: values }))}>
        {expired && !login.error ? <Alert tone="info">{t('signIn.expired')}</Alert> : null}
        {login.error ? <Alert tone="danger">{problemMessage(t, login.error)}</Alert> : null}
        <FormField label={t('field.email')} error={errors.email?.message && t(errors.email.message)}>
          <Input type="email" autoComplete="username" autoFocus {...form.register('email')} />
        </FormField>
        <FormField label={t('field.password')} error={errors.password?.message && t(errors.password.message)}>
          <Input type="password" autoComplete="current-password" {...form.register('password')} />
        </FormField>
        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-body text-link hover:underline">
            {t('signIn.forgot')}
          </Link>
        </div>
        <Button type="submit" size="lg" loading={login.isPending}>
          {t('signIn.submit')}
        </Button>
        <p className="text-center text-body text-fg-muted">
          {t('signIn.noAccount')}{' '}
          <Link to="/sign-up" className="text-link underline underline-offset-4">
            {t('signIn.createWorkspace')}
          </Link>
        </p>
      </form>
    </>
  );
}

function MfaStep({
  mfaToken,
  onDone,
  onBack,
}: {
  mfaToken: string;
  onDone: (token: string) => void;
  onBack: () => void;
}) {
  const { t } = useTranslation('auth');
  const [useRecovery, setUseRecovery] = useState(false);
  const verify = useAuthControllerVerifyMfa({ mutation: { onSuccess: (s) => onDone(s.accessToken) } });
  const codeForm = useForm<MfaValues>({ resolver: zodResolver(mfaSchema), defaultValues: { code: '' } });
  const recoveryForm = useForm<RecoveryValues>({
    resolver: zodResolver(recoverySchema),
    defaultValues: { recoveryCode: '' },
  });
  const codeError = codeForm.formState.errors.code?.message;
  const recoveryError = recoveryForm.formState.errors.recoveryCode?.message;

  return (
    <>
      <AuthHeading
        title={t('mfa.title')}
        description={useRecovery ? t('mfa.recoveryDescription') : t('mfa.description')}
      />
      {verify.error ? (
        <Alert tone="danger" className="mb-4">
          {verify.error.code === 'unauthenticated' ? t('mfa.invalid') : problemMessage(t, verify.error)}
        </Alert>
      ) : null}
      {useRecovery ? (
        <form
          noValidate
          className="grid gap-4"
          onSubmit={recoveryForm.handleSubmit((v) =>
            verify.mutate({ data: { mfaToken, recoveryCode: v.recoveryCode } }),
          )}
        >
          <FormField label={t('mfa.recoveryCode')} error={recoveryError && t(recoveryError)}>
            <Input autoComplete="off" autoFocus {...recoveryForm.register('recoveryCode')} />
          </FormField>
          <Button type="submit" size="lg" loading={verify.isPending}>
            {t('mfa.submit')}
          </Button>
        </form>
      ) : (
        <form
          noValidate
          className="grid gap-4"
          onSubmit={codeForm.handleSubmit((v) => verify.mutate({ data: { mfaToken, code: v.code } }))}
        >
          <FormField label={t('mfa.code')} error={codeError && t(codeError)}>
            <Input
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              autoFocus
              {...codeForm.register('code')}
            />
          </FormField>
          <Button type="submit" size="lg" loading={verify.isPending}>
            {t('mfa.submit')}
          </Button>
        </form>
      )}
      <div className="flex justify-between pt-4">
        <Button variant="link" className="px-0" onClick={onBack}>
          {t('action.back')}
        </Button>
        <Button variant="link" className="px-0" onClick={() => setUseRecovery((r) => !r)}>
          {useRecovery ? t('mfa.useCode') : t('mfa.useRecovery')}
        </Button>
      </div>
    </>
  );
}

import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, MailCheck } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router';
import { useAuthControllerResendVerification, useAuthControllerVerifyEmail } from '@/api/generated/auth/auth';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth/auth-provider';
import { isApiError } from '@/lib/problem';
import { AuthHeading } from '../components/auth-card';
import { problemMessage } from '../problem-message';
import { type EmailValues, emailSchema } from '../schemas';

/**
 * `/verify-email/:token` (M01 §4.1, §7.1): confirms a sign-up (creates the trial workspace) or an
 * email change. The token is single-use, so it is only sent on an explicit click — never on page
 * load, where mail-scanner prefetches or a double-mounted effect would burn it.
 */
export function VerifyEmailPage() {
  const { t } = useTranslation('auth');
  const { token = '' } = useParams();
  const { status } = useAuth();
  const verify = useAuthControllerVerifyEmail();

  if (verify.data) {
    const emailChange = verify.data.purpose === 'email_change';
    const signedIn = status === 'signed-in';
    return (
      <>
        <CheckCircle2 className="mb-4 size-10 text-success" aria-hidden />
        <AuthHeading
          title={t('verify.doneTitle')}
          description={emailChange ? t('verify.emailChangedDescription') : t('verify.signupDescription')}
        />
        <Button asChild size="lg" className="w-full">
          {signedIn ? (
            <Link to={emailChange ? '/settings/security' : '/'}>{t('invite.open')}</Link>
          ) : (
            <Link to="/sign-in">{t('signIn.submit')}</Link>
          )}
        </Button>
      </>
    );
  }

  if (isApiError(verify.error, 'invalid_token')) return <ResendVerification />;

  return (
    <>
      <AuthHeading title={t('verify.title')} description={t('verify.description')} />
      <div className="grid gap-4">
        {verify.error ? <Alert tone="danger">{problemMessage(t, verify.error)}</Alert> : null}
        <Button size="lg" loading={verify.isPending} onClick={() => verify.mutate({ data: { token } })}>
          {t('verify.submit')}
        </Button>
      </div>
    </>
  );
}

function ResendVerification() {
  const { t } = useTranslation('auth');
  const form = useForm<EmailValues>({ resolver: zodResolver(emailSchema), defaultValues: { email: '' } });
  const resend = useAuthControllerResendVerification();
  const emailError = form.formState.errors.email?.message;

  if (resend.isSuccess) {
    return (
      <>
        <MailCheck className="mb-4 size-10 text-success" aria-hidden />
        <AuthHeading title={t('forgot.sentTitle')} description={t('verify.resentDescription')} />
        <Button asChild variant="secondary" className="w-full">
          <Link to="/sign-in">{t('action.backToSignIn')}</Link>
        </Button>
      </>
    );
  }

  return (
    <>
      <AuthHeading title={t('verify.invalidTitle')} description={t('verify.invalidDescription')} />
      <form noValidate className="grid gap-4" onSubmit={form.handleSubmit((v) => resend.mutate({ data: v }))}>
        {resend.error ? <Alert tone="danger">{problemMessage(t, resend.error)}</Alert> : null}
        <FormField label={t('field.email')} error={emailError && t(emailError)}>
          <Input type="email" autoComplete="email" autoFocus {...form.register('email')} />
        </FormField>
        <Button type="submit" size="lg" loading={resend.isPending}>
          {t('verify.resend')}
        </Button>
      </form>
    </>
  );
}

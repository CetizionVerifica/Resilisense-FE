import { zodResolver } from '@hookform/resolvers/zod';
import { MailCheck } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { useAuthControllerResendVerification, useAuthControllerSignup } from '@/api/generated/auth/auth';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { applyFieldErrors } from '@/lib/form-errors';
import { AuthHeading } from '../components/auth-card';
import { problemMessage } from '../problem-message';
import { MIN_PASSWORD, type SignUpValues, signUpSchema } from '../schemas';

/**
 * `/sign-up` (M01 §4.1, §7.1): self-signup creates a new trial workspace after email
 * verification. The API answers the same whether or not the address already has an account.
 */
export function SignUpPage() {
  const { t } = useTranslation('auth');
  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: '', email: '', password: '', workspaceName: '' },
  });
  const signup = useAuthControllerSignup({
    mutation: { onError: (e) => applyFieldErrors(e, form.setError, ['name', 'email', 'password', 'workspaceName']) },
  });
  const resend = useAuthControllerResendVerification();
  const { errors } = form.formState;
  const hasFieldError = Object.keys(errors).length > 0;

  if (signup.isSuccess) {
    const email = signup.variables.data.email;
    return (
      <>
        <MailCheck className="mb-4 size-10 text-success" aria-hidden />
        <AuthHeading title={t('forgot.sentTitle')} description={t('signUp.sentDescription', { email })} />
        <div className="grid gap-3">
          {resend.isSuccess ? <Alert tone="success">{t('verify.resent')}</Alert> : null}
          {resend.error ? <Alert tone="danger">{problemMessage(t, resend.error)}</Alert> : null}
          <Button variant="secondary" loading={resend.isPending} onClick={() => resend.mutate({ data: { email } })}>
            {t('verify.resend')}
          </Button>
          <Button asChild variant="link">
            <Link to="/sign-in">{t('action.backToSignIn')}</Link>
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <AuthHeading title={t('signUp.title')} description={t('signUp.description')} />
      <form noValidate className="grid gap-4" onSubmit={form.handleSubmit((v) => signup.mutate({ data: v }))}>
        {signup.error && !hasFieldError ? <Alert tone="danger">{problemMessage(t, signup.error)}</Alert> : null}
        <FormField label={t('field.name')} error={errors.name?.message && t(errors.name.message)}>
          <Input autoComplete="name" autoFocus {...form.register('name')} />
        </FormField>
        <FormField label={t('field.workEmail')} error={errors.email?.message && t(errors.email.message)}>
          <Input type="email" autoComplete="email" {...form.register('email')} />
        </FormField>
        <FormField
          label={t('field.newPassword')}
          error={errors.password?.message && t(errors.password.message)}
          hint={t('password.hint', { min: MIN_PASSWORD })}
        >
          <Input type="password" autoComplete="new-password" {...form.register('password')} />
        </FormField>
        <FormField
          label={t('field.workspaceName')}
          error={errors.workspaceName?.message && t(errors.workspaceName.message)}
          hint={t('signUp.workspaceHint')}
        >
          <Input autoComplete="organization" {...form.register('workspaceName')} />
        </FormField>
        <Button type="submit" size="lg" loading={signup.isPending}>
          {t('signUp.submit')}
        </Button>
        <p className="text-center text-body text-fg-muted">
          {t('signUp.haveAccount')}{' '}
          <Link to="/sign-in" className="text-link underline underline-offset-4">
            {t('signIn.submit')}
          </Link>
        </p>
      </form>
    </>
  );
}

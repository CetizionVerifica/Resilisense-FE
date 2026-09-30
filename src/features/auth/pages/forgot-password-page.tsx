import { zodResolver } from '@hookform/resolvers/zod';
import { MailCheck } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { useAuthControllerForgot } from '@/api/generated/auth/auth';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { AuthHeading } from '../components/auth-card';
import { problemMessage } from '../problem-message';
import { type EmailValues, emailSchema } from '../schemas';

/** `/forgot-password` (US-01-2): the same confirmation whether or not the email exists. */
export function ForgotPasswordPage() {
  const { t } = useTranslation('auth');
  const form = useForm<EmailValues>({ resolver: zodResolver(emailSchema), defaultValues: { email: '' } });
  const forgot = useAuthControllerForgot();
  const emailError = form.formState.errors.email?.message;

  if (forgot.isSuccess) {
    return (
      <>
        <MailCheck className="mb-4 size-10 text-success" aria-hidden />
        <AuthHeading
          title={t('forgot.sentTitle')}
          description={t('forgot.sentDescription', { email: forgot.variables.data.email })}
        />
        <Button asChild variant="secondary" className="w-full">
          <Link to="/sign-in">{t('action.backToSignIn')}</Link>
        </Button>
      </>
    );
  }

  return (
    <>
      <AuthHeading title={t('forgot.title')} description={t('forgot.description')} />
      <form noValidate className="grid gap-4" onSubmit={form.handleSubmit((v) => forgot.mutate({ data: v }))}>
        {forgot.error ? <Alert tone="danger">{problemMessage(t, forgot.error)}</Alert> : null}
        <FormField label={t('field.email')} error={emailError && t(emailError)}>
          <Input type="email" autoComplete="email" autoFocus {...form.register('email')} />
        </FormField>
        <Button type="submit" size="lg" loading={forgot.isPending}>
          {t('forgot.submit')}
        </Button>
        <Link to="/sign-in" className="text-center text-body text-link hover:underline">
          {t('action.backToSignIn')}
        </Link>
      </form>
    </>
  );
}

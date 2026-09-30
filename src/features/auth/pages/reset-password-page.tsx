import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router';
import { useAuthControllerReset } from '@/api/generated/auth/auth';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { applyFieldErrors } from '@/lib/form-errors';
import { isApiError } from '@/lib/problem';
import { AuthHeading } from '../components/auth-card';
import { problemMessage } from '../problem-message';
import { MIN_PASSWORD, type ResetValues, resetSchema } from '../schemas';

/** `/reset-password/:token` (US-01-2): single-use 15-minute link; all sessions end afterwards. */
export function ResetPasswordPage() {
  const { t } = useTranslation('auth');
  const { token = '' } = useParams();
  const form = useForm<ResetValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: '', confirm: '' },
  });
  const reset = useAuthControllerReset({
    mutation: { onError: (e) => applyFieldErrors(e, form.setError, ['password']) },
  });
  const { errors } = form.formState;

  if (reset.isSuccess) {
    return (
      <>
        <CheckCircle2 className="mb-4 size-10 text-success" aria-hidden />
        <AuthHeading title={t('reset.doneTitle')} description={t('reset.doneDescription')} />
        <Button asChild size="lg" className="w-full">
          <Link to="/sign-in">{t('signIn.submit')}</Link>
        </Button>
      </>
    );
  }

  if (isApiError(reset.error, 'invalid_token')) {
    return (
      <>
        <AuthHeading title={t('reset.invalidTitle')} description={t('error.invalidLink')} />
        <Button asChild variant="secondary" className="w-full">
          <Link to="/forgot-password">{t('reset.requestNew')}</Link>
        </Button>
      </>
    );
  }

  return (
    <>
      <AuthHeading title={t('reset.title')} description={t('reset.description', { min: MIN_PASSWORD })} />
      <form
        noValidate
        className="grid gap-4"
        onSubmit={form.handleSubmit((v) => reset.mutate({ data: { token, password: v.password } }))}
      >
        {reset.error && !errors.password ? <Alert tone="danger">{problemMessage(t, reset.error)}</Alert> : null}
        <FormField
          label={t('field.newPassword')}
          error={errors.password?.message && t(errors.password.message)}
          hint={t('password.hint', { min: MIN_PASSWORD })}
        >
          <Input type="password" autoComplete="new-password" autoFocus {...form.register('password')} />
        </FormField>
        <FormField label={t('field.confirmPassword')} error={errors.confirm?.message && t(errors.confirm.message)}>
          <Input type="password" autoComplete="new-password" {...form.register('confirm')} />
        </FormField>
        <Button type="submit" size="lg" loading={reset.isPending}>
          {t('reset.submit')}
        </Button>
      </form>
    </>
  );
}

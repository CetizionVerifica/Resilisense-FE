import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useMeControllerChangePassword } from '@/api/generated/me/me';
import { MIN_PASSWORD } from '@/features/auth';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { applyFieldErrors } from '@/lib/form-errors';
import { isApiError } from '@/lib/problem';
import { type ChangePasswordValues, changePasswordSchema } from '../schemas';

/** `POST /v1/me/password`: other sessions are revoked, this one stays signed in. */
export function ChangePasswordCard() {
  const { t } = useTranslation('settings');
  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirm: '' },
  });
  const change = useMeControllerChangePassword({
    mutation: {
      onSuccess: () => {
        form.reset();
        toast.success(t('password.changed'));
      },
      onError: (e) => {
        if (isApiError(e, 'forbidden')) {
          form.setError('currentPassword', { type: 'server', message: 'settings:password.currentWrong' });
        } else applyFieldErrors(e, form.setError, ['newPassword']);
      },
    },
  });
  const { errors } = form.formState;
  const err = (m?: string) => (m ? t(m) : undefined);
  const generalError =
    change.error && !isApiError(change.error, 'forbidden') && !isApiError(change.error, 'validation_failed');

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('password.title')}</CardTitle>
        <CardDescription>{t('password.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          noValidate
          className="grid max-w-md gap-4"
          onSubmit={form.handleSubmit((v) =>
            change.mutate({ data: { currentPassword: v.currentPassword, newPassword: v.newPassword } }),
          )}
        >
          {generalError ? <Alert tone="danger">{t('common:error.title')}</Alert> : null}
          <FormField label={t('password.current')} error={err(errors.currentPassword?.message)}>
            <Input type="password" autoComplete="current-password" {...form.register('currentPassword')} />
          </FormField>
          <FormField
            label={t('auth:field.newPassword')}
            error={err(errors.newPassword?.message)}
            hint={t('auth:password.hint', { min: MIN_PASSWORD })}
          >
            <Input type="password" autoComplete="new-password" {...form.register('newPassword')} />
          </FormField>
          <FormField label={t('auth:field.confirmPassword')} error={err(errors.confirm?.message)}>
            <Input type="password" autoComplete="new-password" {...form.register('confirm')} />
          </FormField>
          <div>
            <Button type="submit" loading={change.isPending}>
              {t('password.submit')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

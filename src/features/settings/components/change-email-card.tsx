import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMeControllerChangeEmail } from '@/api/generated/me/me';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { applyFieldErrors } from '@/lib/form-errors';
import { isApiError } from '@/lib/problem';
import { type ChangeEmailValues, changeEmailSchema } from '../schemas';

/**
 * `POST /v1/me/email` (M01 §7.1): a 24 h link goes to the new address; the change applies when
 * it is opened (`/verify-email/:token`) and the old address is notified.
 */
export function ChangeEmailCard({ currentEmail }: { currentEmail: string }) {
  const { t } = useTranslation('settings');
  // One key per attempt so a retried request is not applied twice (Idempotency-Key).
  const [idempotencyKey, setIdempotencyKey] = useState(() => crypto.randomUUID());
  const form = useForm<ChangeEmailValues>({
    resolver: zodResolver(changeEmailSchema),
    defaultValues: { newEmail: '', password: '' },
  });
  const change = useMeControllerChangeEmail({
    request: { headers: { 'Idempotency-Key': idempotencyKey } },
    mutation: {
      onSuccess: () => setIdempotencyKey(crypto.randomUUID()),
      onError: (e) => {
        if (isApiError(e, 'forbidden')) {
          form.setError('password', { type: 'server', message: 'settings:password.currentWrong' });
        } else applyFieldErrors(e, form.setError, ['newEmail', 'password']);
      },
    },
  });
  const { errors } = form.formState;
  const err = (m?: string) => (m ? t(m) : undefined);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('email.title')}</CardTitle>
        <CardDescription>{t('email.description', { email: currentEmail })}</CardDescription>
      </CardHeader>
      <CardContent>
        {change.isSuccess ? (
          <Alert tone="success" className="max-w-md">
            {t('email.sent', { email: change.variables.data.newEmail })}
          </Alert>
        ) : (
          <form
            noValidate
            className="grid max-w-md gap-4"
            onSubmit={form.handleSubmit((v) => change.mutate({ data: v }))}
          >
            {change.error &&
            !isApiError(change.error, 'forbidden') &&
            !isApiError(change.error, 'validation_failed') ? (
              <Alert tone="danger">
                {isApiError(change.error, 'conflict') ? t('email.inProgress') : t('common:error.title')}
              </Alert>
            ) : null}
            <FormField label={t('email.new')} error={err(errors.newEmail?.message)}>
              <Input type="email" autoComplete="email" {...form.register('newEmail')} />
            </FormField>
            <FormField label={t('password.current')} error={err(errors.password?.message)}>
              <Input type="password" autoComplete="current-password" {...form.register('password')} />
            </FormField>
            <div>
              <Button type="submit" loading={change.isPending}>
                {t('email.submit')}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

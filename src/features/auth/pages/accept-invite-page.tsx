import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router';
import { useInvitationsControllerAccept } from '@/api/generated/members/members';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth/auth-provider';
import { applyFieldErrors } from '@/lib/form-errors';
import { isApiError } from '@/lib/problem';
import { AuthHeading } from '../components/auth-card';
import { problemMessage } from '../problem-message';
import { type AcceptNewUserValues, acceptNewUserSchema, MIN_PASSWORD } from '../schemas';

/**
 * `/accept-invite/:token` (US-01-1). New users set a name + password; existing users accept with
 * one click unless the API asks for a password (unverified account, M01 §7.1).
 */
export function AcceptInvitePage() {
  const { t } = useTranslation('auth');
  const { token = '' } = useParams();
  const { status } = useAuth();
  const [hasAccount, setHasAccount] = useState(false);
  const form = useForm<AcceptNewUserValues>({
    resolver: zodResolver(acceptNewUserSchema),
    defaultValues: { name: '', password: '' },
  });
  const accept = useInvitationsControllerAccept({
    mutation: {
      onError: (e) => {
        if (applyFieldErrors(e, form.setError, ['name', 'password'])) setHasAccount(false);
      },
    },
  });
  const { errors } = form.formState;

  if (accept.isSuccess) {
    return (
      <>
        <CheckCircle2 className="mb-4 size-10 text-success" aria-hidden />
        <AuthHeading title={t('invite.doneTitle')} description={t('invite.doneDescription')} />
        <Button asChild size="lg" className="w-full">
          <Link to={status === 'signed-in' ? '/' : '/sign-in'}>
            {status === 'signed-in' ? t('invite.open') : t('signIn.submit')}
          </Link>
        </Button>
      </>
    );
  }

  if (isApiError(accept.error, 'invalid_token')) {
    return <AuthHeading title={t('invite.invalidTitle')} description={t('invite.invalidDescription')} />;
  }

  const generalError =
    accept.error && !errors.name && !errors.password ? (
      <Alert tone="danger">
        {isApiError(accept.error, 'conflict') ? t('invite.alreadyMember') : problemMessage(t, accept.error)}
      </Alert>
    ) : null;

  if (hasAccount) {
    return (
      <>
        <AuthHeading title={t('invite.title')} description={t('invite.existingDescription')} />
        <div className="grid gap-4">
          {generalError}
          <Button size="lg" loading={accept.isPending} onClick={() => accept.mutate({ data: { token } })}>
            {t('invite.accept')}
          </Button>
          <Button variant="link" onClick={() => setHasAccount(false)}>
            {t('invite.iAmNew')}
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <AuthHeading title={t('invite.title')} description={t('invite.description')} />
      <form
        noValidate
        className="grid gap-4"
        onSubmit={form.handleSubmit((v) => accept.mutate({ data: { token, ...v } }))}
      >
        {generalError}
        <FormField label={t('field.name')} error={errors.name?.message && t(errors.name.message)}>
          <Input autoComplete="name" autoFocus {...form.register('name')} />
        </FormField>
        <FormField
          label={t('field.newPassword')}
          error={errors.password?.message && t(errors.password.message)}
          hint={t('password.hint', { min: MIN_PASSWORD })}
        >
          <Input type="password" autoComplete="new-password" {...form.register('password')} />
        </FormField>
        <Button type="submit" size="lg" loading={accept.isPending}>
          {t('invite.create')}
        </Button>
        <Button variant="link" type="button" onClick={() => setHasAccount(true)}>
          {t('invite.haveAccount')}
        </Button>
      </form>
    </>
  );
}

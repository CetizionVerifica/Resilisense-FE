import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useAuthControllerDisableMfa } from '@/api/generated/auth/auth';
import { getMeControllerGetQueryKey } from '@/api/generated/me/me';
import { type MeControllerGet200User } from '@/api/generated/model';
import { MfaSetup } from '@/features/auth';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { StatusPill } from '@/components/ui/status-pill';
import { isApiError } from '@/lib/problem';
import { type DisableMfaValues, disableMfaSchema } from '../schemas';

/**
 * TOTP two-factor authentication (M01 §4.2, §7.1). Platform roles cannot turn it off; the API
 * enforces that too.
 */
export function TwoFactorCard({ user }: { user: MeControllerGet200User }) {
  const { t } = useTranslation('settings');
  const queryClient = useQueryClient();
  const [mode, setMode] = useState<'idle' | 'setup' | 'disable'>('idle');
  const refreshMe = () => queryClient.invalidateQueries({ queryKey: getMeControllerGetQueryKey() });

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center gap-3">
          <CardTitle>{t('mfa.title')}</CardTitle>
          <StatusPill
            tone={user.mfaEnabled ? 'success' : 'neutral'}
            label={user.mfaEnabled ? t('mfa.on') : t('mfa.off')}
          />
        </div>
        <CardDescription>{user.platformRole ? t('mfa.platformRequired') : t('mfa.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        {mode === 'setup' ? (
          <div className="grid max-w-md gap-2">
            <MfaSetup
              heading={(stage) =>
                stage === 'codes' ? (
                  <Alert tone="warning" className="mb-2">
                    {t('auth:enroll.codesDescription')}
                  </Alert>
                ) : (
                  <p className="pb-2 text-body text-fg-muted">{t('mfa.setupDescription')}</p>
                )
              }
              finishLabel={t('mfa.done')}
              onFinish={() => {
                setMode('idle');
                toast.success(t('mfa.enabled'));
                void refreshMe();
              }}
            />
            <Button variant="link" className="justify-self-start px-0" onClick={() => setMode('idle')}>
              {t('common:action.cancel')}
            </Button>
          </div>
        ) : user.mfaEnabled ? (
          user.platformRole ? null : (
            <Button variant="secondary" onClick={() => setMode('disable')}>
              {t('mfa.disable')}
            </Button>
          )
        ) : (
          <Button onClick={() => setMode('setup')}>
            <ShieldCheck aria-hidden />
            {t('mfa.enable')}
          </Button>
        )}
        <DisableMfaDialog
          open={mode === 'disable'}
          onOpenChange={(open) => setMode(open ? 'disable' : 'idle')}
          onDone={() => {
            setMode('idle');
            toast.success(t('mfa.disabled'));
            void refreshMe();
          }}
        />
      </CardContent>
    </Card>
  );
}

function DisableMfaDialog({
  open,
  onOpenChange,
  onDone,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDone: () => void;
}) {
  const { t } = useTranslation('settings');
  const form = useForm<DisableMfaValues>({
    resolver: zodResolver(disableMfaSchema),
    defaultValues: { password: '', code: '' },
  });
  const disable = useAuthControllerDisableMfa({
    mutation: {
      onSuccess: () => {
        form.reset();
        onDone();
      },
    },
  });
  const { errors } = form.formState;
  const err = (m?: string) => (m ? t(m) : undefined);
  // Cancel, X, Esc and overlay all clear the typed password and code.
  const setOpen = (o: boolean) => {
    if (!o) {
      form.reset();
      disable.reset();
    }
    onOpenChange(o);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent closeLabel={t('common:action.close')}>
        <form noValidate className="grid gap-4" onSubmit={form.handleSubmit((v) => disable.mutate({ data: v }))}>
          <div className="grid gap-2 pe-8">
            <DialogTitle>{t('mfa.disableTitle')}</DialogTitle>
            <DialogDescription>{t('mfa.disableDescription')}</DialogDescription>
          </div>
          {disable.error ? (
            <Alert tone="danger">
              {isApiError(disable.error, 'forbidden') ? t('mfa.disableWrong') : t('common:error.title')}
            </Alert>
          ) : null}
          <FormField label={t('password.current')} error={err(errors.password?.message)}>
            <Input type="password" autoComplete="current-password" {...form.register('password')} />
          </FormField>
          <FormField label={t('auth:mfa.code')} error={err(errors.code?.message)}>
            <Input inputMode="numeric" autoComplete="one-time-code" maxLength={6} {...form.register('code')} />
          </FormField>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              {t('common:action.cancel')}
            </Button>
            <Button type="submit" variant="destructive" loading={disable.isPending}>
              {t('mfa.disable')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

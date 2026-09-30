import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { type MeControllerGet200User } from '@/api/generated/model';
import { Alert } from '@/components/ui/alert';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { ErrorState, PageSkeleton } from '@/components/ui/states';
import { useMe } from '@/lib/auth/me';
import { useUpdateProfile } from '@/lib/auth/preferences';
import { applyFieldErrors } from '@/lib/form-errors';
import { SUPPORTED_LOCALES } from '@/lib/i18n';
import { isApiError } from '@/lib/problem';
import { type ProfileValues, profileSchema } from '../schemas';

/** `/settings/profile` (M01 §4.1): name, job title, phone, language, time zone, theme. */
export function ProfilePage() {
  const { t } = useTranslation();
  const { data: me, isPending, isError, refetch } = useMe();

  if (isPending) return <PageSkeleton label={t('state.loading')} />;
  if (isError) {
    return <ErrorState title={t('error.title')} retryLabel={t('action.retry')} onRetry={() => void refetch()} />;
  }
  return <ProfileForm user={me.user} />;
}

function timeZones(current: string): string[] {
  const all = typeof Intl.supportedValuesOf === 'function' ? Intl.supportedValuesOf('timeZone') : ['UTC'];
  return all.includes(current) ? all : [current, ...all];
}

function ProfileForm({ user }: { user: MeControllerGet200User }) {
  const { t } = useTranslation('settings');
  const zones = useMemo(() => timeZones(user.timezone), [user.timezone]);
  const locales = useMemo(
    () => (SUPPORTED_LOCALES.includes(user.locale) ? SUPPORTED_LOCALES : [user.locale, ...SUPPORTED_LOCALES]),
    [user.locale],
  );
  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    values: {
      name: user.name,
      jobTitle: user.jobTitle ?? '',
      phone: user.phone ?? '',
      locale: user.locale,
      timezone: user.timezone,
      theme: user.theme,
    },
  });
  const update = useUpdateProfile({
    onSuccess: () => toast.success(t('profile.saved')),
    onError: (e) => applyFieldErrors(e, form.setError, ['name', 'jobTitle', 'phone', 'locale', 'timezone']),
  });
  const { errors, isDirty } = form.formState;
  const err = (m?: string) => (m ? t(m) : undefined);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar name={user.name} className="size-14 text-h3" />
        <div className="grid gap-1">
          <CardTitle>{t('profile.title')}</CardTitle>
          <CardDescription>{t('profile.description')}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form
          noValidate
          className="grid max-w-2xl gap-4 md:grid-cols-2"
          onSubmit={form.handleSubmit((v) =>
            update.mutate({ data: { ...v, jobTitle: v.jobTitle || null, phone: v.phone || null } }),
          )}
        >
          {update.error && !isApiError(update.error, 'validation_failed') ? (
            <Alert tone="danger" className="md:col-span-2">
              {t('common:error.title')}
            </Alert>
          ) : null}
          <FormField label={t('profile.name')} error={err(errors.name?.message)}>
            <Input autoComplete="name" {...form.register('name')} />
          </FormField>
          <FormField label={t('profile.email')} hint={t('profile.emailHint')}>
            <Input type="email" value={user.email} readOnly disabled />
          </FormField>
          <FormField label={t('profile.jobTitle')} error={err(errors.jobTitle?.message)}>
            <Input autoComplete="organization-title" {...form.register('jobTitle')} />
          </FormField>
          <FormField label={t('profile.phone')} error={err(errors.phone?.message)}>
            <Input type="tel" autoComplete="tel" dir="ltr" {...form.register('phone')} />
          </FormField>
          <FormField label={t('profile.language')} error={err(errors.locale?.message)}>
            <Select {...form.register('locale')}>
              {locales.map((l) => (
                <option key={l} value={l}>
                  {t(`common:language.${l}`, { defaultValue: l })}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label={t('profile.timezone')} error={err(errors.timezone?.message)}>
            <Select {...form.register('timezone')}>
              {zones.map((z) => (
                <option key={z} value={z}>
                  {z}
                </option>
              ))}
            </Select>
          </FormField>
          <fieldset className="grid gap-2 md:col-span-2">
            <legend className="pb-1.5 text-small font-medium text-fg-secondary">{t('profile.theme')}</legend>
            <div className="flex flex-wrap gap-4">
              {(['system', 'light', 'dark'] as const).map((theme) => (
                <label key={theme} className="flex min-h-6 cursor-pointer items-center gap-2 text-body">
                  <input type="radio" value={theme} className="size-4 accent-primary" {...form.register('theme')} />
                  {t(`common:theme.${theme}`)}
                </label>
              ))}
            </div>
          </fieldset>
          <div className="flex gap-2 md:col-span-2">
            <Button type="submit" loading={update.isPending} disabled={!isDirty}>
              {t('action.save')}
            </Button>
            <Button type="button" variant="secondary" disabled={!isDirty} onClick={() => form.reset()}>
              {t('action.discard')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

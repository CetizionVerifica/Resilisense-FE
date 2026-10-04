import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { getMeControllerGetQueryKey } from '@/api/generated/me/me';
import { type WorkspacesControllerCurrent200 } from '@/api/generated/model';
import {
  getWorkspacesControllerCurrentQueryKey,
  useWorkspacesControllerCurrent,
  useWorkspacesControllerUpdate,
} from '@/api/generated/workspaces/workspaces';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { ErrorState, PageSkeleton } from '@/components/ui/states';
import { Textarea } from '@/components/ui/textarea';
import { useWorkspaceReadOnly } from '@/lib/auth/entitlements';
import { usePermission } from '@/lib/auth/me';
import { applyFieldErrors } from '@/lib/form-errors';
import { SUPPORTED_LOCALES } from '@/lib/i18n';
import { useCountries, useDisplayNames } from '@/lib/reference';
import { PartnerAccessCard } from '../components/partner-access-card';
import { workspaceProblem } from '../problem-message';
import { type WorkspaceValues, workspaceSchema } from '../schemas';

/** `/settings/workspace` (M02 §9): profile and branding (owner), data region read-only, partner access. */
export function WorkspacePage() {
  const { t } = useTranslation('workspace');
  const workspace = useWorkspacesControllerCurrent();
  const canManage = usePermission('workspace:manage');

  if (workspace.isPending) return <PageSkeleton label={t('common:state.loading')} />;
  if (workspace.isError) {
    return (
      <ErrorState
        title={t('loadFailed')}
        retryLabel={t('common:action.retry')}
        onRetry={() => void workspace.refetch()}
      />
    );
  }
  return (
    <div className="grid gap-6">
      <WorkspaceForm workspace={workspace.data} canManage={canManage} />
      {canManage ? <PartnerAccessCard /> : null}
    </div>
  );
}

const valuesOf = (w: WorkspacesControllerCurrent200): WorkspaceValues => ({
  name: w.name,
  country: w.country ?? '',
  defaultLocale: w.defaultLocale,
  timezone: w.timezone,
  accentColor: w.branding.accentColor ?? '',
  reportFooter: w.branding.reportFooter ?? '',
});

function WorkspaceForm({ workspace, canManage }: { workspace: WorkspacesControllerCurrent200; canManage: boolean }) {
  const { t } = useTranslation('workspace');
  const queryClient = useQueryClient();
  const readOnly = useWorkspaceReadOnly();
  const countries = useCountries();
  const names = useDisplayNames();
  const editable = canManage && !readOnly;
  const values = useMemo(() => valuesOf(workspace), [workspace]);
  const form = useForm<WorkspaceValues>({ resolver: zodResolver(workspaceSchema), values });
  const update = useWorkspacesControllerUpdate({
    mutation: {
      onSuccess: (w) => {
        toast.success(t('saved'));
        queryClient.setQueryData(getWorkspacesControllerCurrentQueryKey(), w);
        // The switcher and header show the workspace name from /me.
        void queryClient.invalidateQueries({ queryKey: getMeControllerGetQueryKey() });
      },
      onError: (e) => applyFieldErrors(e, form.setError, ['name', 'country', 'defaultLocale', 'timezone']),
    },
  });
  const zones = useMemo(() => {
    const all = typeof Intl.supportedValuesOf === 'function' ? Intl.supportedValuesOf('timeZone') : ['UTC'];
    return all.includes(workspace.timezone) ? all : [workspace.timezone, ...all];
  }, [workspace.timezone]);
  const locales = SUPPORTED_LOCALES.includes(workspace.defaultLocale)
    ? SUPPORTED_LOCALES
    : [workspace.defaultLocale, ...SUPPORTED_LOCALES];
  const countryOptions = useMemo(
    () =>
      (countries.data?.items ?? [])
        .map((c) => ({ code: c.code, name: names.country(c.code) }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [countries.data, names],
  );
  const { errors, isDirty } = form.formState;
  const err = (m?: string) => (m ? t(m) : undefined);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('profile.title')}</CardTitle>
        <CardDescription>{canManage ? t('profile.description') : t('profile.readOnlyDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          noValidate
          className="grid max-w-3xl gap-4 md:grid-cols-2"
          onSubmit={form.handleSubmit((v) =>
            update.mutate({
              data: {
                name: v.name,
                country: v.country || null,
                defaultLocale: v.defaultLocale,
                timezone: v.timezone,
                branding: { accentColor: v.accentColor || null, reportFooter: v.reportFooter || null },
              },
            }),
          )}
        >
          {readOnly ? (
            <Alert tone="warning" className="md:col-span-2">
              {t('common:suspended.readOnly')}
            </Alert>
          ) : null}
          {update.error && Object.keys(errors).length === 0 ? (
            <Alert tone="danger" className="md:col-span-2">
              {workspaceProblem(t, update.error)}
            </Alert>
          ) : null}
          <fieldset disabled={!editable} className="contents">
            <FormField label={t('field.name')} error={err(errors.name?.message)}>
              <Input {...form.register('name')} />
            </FormField>
            <FormField label={t('field.country')} error={err(errors.country?.message)}>
              <Select {...form.register('country')}>
                <option value="">{t('field.noCountry')}</option>
                {countryOptions.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField label={t('field.defaultLocale')} error={err(errors.defaultLocale?.message)}>
              <Select {...form.register('defaultLocale')}>
                {locales.map((l) => (
                  <option key={l} value={l}>
                    {t(`common:language.${l}`, { defaultValue: l })}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField label={t('field.timezone')} error={err(errors.timezone?.message)}>
              <Select {...form.register('timezone')}>
                {zones.map((z) => (
                  <option key={z} value={z}>
                    {z}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField
              label={t('field.accentColor')}
              hint={t('field.accentColorHint')}
              error={err(errors.accentColor?.message)}
            >
              <Input dir="ltr" placeholder="#D8882A" {...form.register('accentColor')} />
            </FormField>
            <FormField label={t('field.dataRegion')} hint={t('field.dataRegionHint')}>
              <Input value={t(`region.${workspace.dataRegion}`)} readOnly disabled />
            </FormField>
            <div className="md:col-span-2">
              <FormField label={t('field.reportFooter')} error={err(errors.reportFooter?.message)}>
                <Textarea rows={2} {...form.register('reportFooter')} />
              </FormField>
            </div>
          </fieldset>
          {editable ? (
            <div className="flex gap-2 md:col-span-2">
              <Button type="submit" loading={update.isPending} disabled={!isDirty}>
                {t('common:action.save')}
              </Button>
              <Button type="button" variant="secondary" disabled={!isDirty} onClick={() => form.reset()}>
                {t('common:action.discard')}
              </Button>
            </div>
          ) : null}
        </form>
      </CardContent>
    </Card>
  );
}

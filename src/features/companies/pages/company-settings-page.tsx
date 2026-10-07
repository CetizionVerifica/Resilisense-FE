import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useCompaniesControllerUpdate } from '@/api/generated/companies/companies';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useWorkspaceReadOnly } from '@/lib/auth/entitlements';
import { usePermission } from '@/lib/auth/me';
import { LogoField } from '@/features/files/components/logo-field';
import { CompanyFields } from '../components/company-fields';
import { DeleteCompanyDialog } from '../components/delete-company-dialog';
import { applyCompanyErrors } from '../form-errors';
import { useCompanies, useInvalidateCompanies } from '../hooks';
import { companyProblem } from '../problem-message';
import { type CompanyValues, companySchema, toFormValues, toUpdateBody } from '../schemas';
import { useCompany } from './company-layout';

/** `/companies/:id/settings`: edit the profile; delete (typed name, restorable 30 days). */
export function CompanySettingsPage() {
  const { t } = useTranslation('companies');
  const c = useCompany();
  const canUpdate = usePermission('company:update');
  const readOnly = useWorkspaceReadOnly();
  const [deleting, setDeleting] = useState(false);
  const invalidate = useInvalidateCompanies();
  const all = useCompanies({}, 100);
  // A company cannot be its own parent; the API also rejects cycles.
  const parents = useMemo(() => all.items.filter((p) => p.id !== c.id), [all.items, c.id]);
  const values = useMemo(() => toFormValues(c), [c]);
  const form = useForm<CompanyValues>({ resolver: zodResolver(companySchema), values });
  const update = useCompaniesControllerUpdate({
    mutation: {
      onSuccess: (updated) => {
        toast.success(t('toast.saved', { name: updated.displayName }));
        void invalidate(updated.id);
      },
      onError: (e) => applyCompanyErrors(e, form.setError),
    },
  });

  // Separate from the profile form: a logo is saved as soon as its upload is ready.
  const logo = useCompaniesControllerUpdate({
    mutation: {
      onSuccess: (updated) => {
        toast.success(updated.logoFileId ? t('files:logo.saved') : t('files:logo.removed'));
        void invalidate(updated.id);
      },
      onError: (e) => toast.error(companyProblem(t, e)),
    },
  });

  if (!canUpdate) {
    return <Alert tone="info">{t('error.forbidden')}</Alert>;
  }
  const disabled = readOnly;
  const { isDirty } = form.formState;

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('settings.title')}</CardTitle>
          <CardDescription>{t('settings.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <FormProvider {...form}>
            <form
              noValidate
              className="grid max-w-3xl gap-6"
              onSubmit={form.handleSubmit((v) => update.mutate({ id: c.id, data: toUpdateBody(v) }))}
            >
              {readOnly ? <Alert tone="warning">{t('common:suspended.readOnly')}</Alert> : null}
              {update.error && Object.keys(form.formState.errors).length === 0 ? (
                <Alert tone="danger">{companyProblem(t, update.error)}</Alert>
              ) : null}
              <fieldset disabled={disabled} className="grid gap-6">
                <CompanyFields parents={parents} />
              </fieldset>
              <div className="flex gap-2">
                <Button type="submit" loading={update.isPending} disabled={!isDirty || disabled}>
                  {t('common:action.save')}
                </Button>
                <Button type="button" variant="secondary" disabled={!isDirty} onClick={() => form.reset()}>
                  {t('common:action.discard')}
                </Button>
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{t('files:logo.title')}</CardTitle>
          <CardDescription>{t('files:logo.companyDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="max-w-xl">
          <LogoField
            ownerName={c.displayName}
            fileId={c.logoFileId}
            editable={!disabled}
            saving={logo.isPending}
            onSave={(logoFileId) => logo.mutate({ id: c.id, data: { logoFileId } })}
          />
        </CardContent>
      </Card>
      <Card className="border-danger/40">
        <CardHeader>
          <CardTitle>{t('delete.section')}</CardTitle>
          <CardDescription>{t('delete.sectionDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" disabled={disabled} onClick={() => setDeleting(true)}>
            <Trash2 aria-hidden />
            {t('delete.open')}
          </Button>
        </CardContent>
      </Card>
      <DeleteCompanyDialog company={c} open={deleting} onOpenChange={setDeleting} />
    </div>
  );
}

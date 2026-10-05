import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Info } from 'lucide-react';
import { useMemo, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { getMeControllerGetQueryKey } from '@/api/generated/me/me';
import { getPartnerControllerListInfiniteQueryKey, partnerControllerCreate } from '@/api/generated/partner/partner';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { CompanyFields } from '@/features/companies/components/company-fields';
import { applyCompanyErrors } from '@/features/companies/form-errors';
import { EMPTY_COMPANY } from '@/features/companies/schemas';
import { isApiError } from '@/lib/problem';
import { useCountries, useDisplayNames } from '@/lib/reference';
import { type ClientValues, clientSchema, toClientBody } from '../schemas';

/** Partner onboarding sheet (M02 US-02-1): the owner is invited by email; nobody types their password. */
export function OnboardClientSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { t } = useTranslation('partner');
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent closeLabel={t('common:action.close')} className="max-w-2xl">
        <SheetHeader>
          <SheetTitle>{t('onboard.title')}</SheetTitle>
          <SheetDescription>{t('onboard.description')}</SheetDescription>
        </SheetHeader>
        {open ? <OnboardForm onClose={() => onOpenChange(false)} /> : null}
      </SheetContent>
    </Sheet>
  );
}

function OnboardForm({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation('partner');
  const queryClient = useQueryClient();
  const countries = useCountries();
  const names = useDisplayNames();
  // One key per form instance: a retried submit is the same request (Idempotency-Key).
  const idempotencyKey = useRef(crypto.randomUUID());
  const form = useForm<ClientValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: { ...EMPTY_COMPANY, workspaceName: '', workspaceCountry: '', ownerEmail: '' },
  });
  const create = useMutation({
    mutationFn: (v: ClientValues) =>
      partnerControllerCreate(toClientBody(v), { headers: { 'Idempotency-Key': idempotencyKey.current } }),
    onSuccess: (_res, v) => {
      toast.success(t('onboard.done', { name: v.workspaceName, email: v.ownerEmail }));
      void queryClient.invalidateQueries({ queryKey: getPartnerControllerListInfiniteQueryKey() });
      // The new client appears in the workspace switcher (via the partner grant).
      void queryClient.invalidateQueries({ queryKey: getMeControllerGetQueryKey() });
      onClose();
    },
    onError: (e) => {
      idempotencyKey.current = crypto.randomUUID();
      applyCompanyErrors(e, form.setError, {
        'workspace.name': 'workspaceName',
        'workspace.country': 'workspaceCountry',
        'owner.email': 'ownerEmail',
      });
    },
  });
  const countryOptions = useMemo(
    () =>
      (countries.data?.items ?? [])
        .map((c) => ({ code: c.code, name: names.country(c.code) }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [countries.data, names],
  );
  const { errors } = form.formState;
  const err = (m?: string) => (m ? t(m) : undefined);
  const banner =
    create.error && !(isApiError(create.error, 'validation_failed') && Object.keys(errors).length > 0)
      ? isApiError(create.error, 'limit_exceeded')
        ? t('error.limit')
        : isApiError(create.error, 'forbidden')
          ? t('error.notPartner')
          : isApiError(create.error)
            ? t('common:error.title')
            : t('auth:error.network')
      : null;

  return (
    <FormProvider {...form}>
      <form noValidate className="flex flex-1 flex-col" onSubmit={form.handleSubmit((v) => create.mutate(v))}>
        <SheetBody className="gap-6">
          {banner ? <Alert tone="danger">{banner}</Alert> : null}
          <fieldset className="grid gap-4 md:grid-cols-2">
            <legend className="pb-2 text-h3 font-semibold">{t('onboard.workspace')}</legend>
            <FormField label={t('field.workspaceName')} error={err(errors.workspaceName?.message)}>
              <Input autoFocus {...form.register('workspaceName')} />
            </FormField>
            <FormField label={t('field.workspaceCountry')} error={err(errors.workspaceCountry?.message)}>
              <Select {...form.register('workspaceCountry')}>
                <option value="">{t('companies:form.choose')}</option>
                {countryOptions.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </FormField>
            <div className="md:col-span-2">
              <FormField
                label={t('field.ownerEmail')}
                hint={t('field.ownerEmailHint')}
                error={err(errors.ownerEmail?.message)}
              >
                <Input type="email" autoComplete="off" dir="ltr" {...form.register('ownerEmail')} />
              </FormField>
            </div>
          </fieldset>
          <CompanyFields />
          <p className="flex gap-2 text-small text-fg-muted">
            <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
            {t('onboard.note')}
          </p>
        </SheetBody>
        <SheetFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            {t('common:action.cancel')}
          </Button>
          <Button type="submit" loading={create.isPending}>
            {t('onboard.submit')}
          </Button>
        </SheetFooter>
      </form>
    </FormProvider>
  );
}

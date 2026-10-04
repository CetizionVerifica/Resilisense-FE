import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { useCompaniesControllerCreate } from '@/api/generated/companies/companies';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { applyCompanyErrors } from '../form-errors';
import { useCompanies, useInvalidateCompanies } from '../hooks';
import { companyProblem } from '../problem-message';
import { type CompanyValues, companySchema, EMPTY_COMPANY, toCreateBody } from '../schemas';
import { CompanyFields } from './company-fields';

/**
 * Create company (M02 §9): a Sheet with the identity and profile sections. There is no contact
 * password: people are invited through Members (M01).
 */
export function CreateCompanySheet({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { t } = useTranslation('companies');
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent closeLabel={t('common:action.close')} className="max-w-2xl">
        <SheetHeader>
          <SheetTitle>{t('create.title')}</SheetTitle>
          <SheetDescription>{t('create.description')}</SheetDescription>
        </SheetHeader>
        {open ? <CreateCompanyForm onClose={() => onOpenChange(false)} /> : null}
      </SheetContent>
    </Sheet>
  );
}

function CreateCompanyForm({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation('companies');
  const navigate = useNavigate();
  const invalidate = useInvalidateCompanies();
  const parents = useCompanies({}, 100);
  const form = useForm<CompanyValues>({ resolver: zodResolver(companySchema), defaultValues: EMPTY_COMPANY });
  const create = useCompaniesControllerCreate({
    mutation: {
      onSuccess: (company) => {
        toast.success(t('toast.created', { name: company.displayName }));
        void invalidate();
        onClose();
        void navigate(`/companies/${company.id}`);
      },
      onError: (e) => applyCompanyErrors(e, form.setError),
    },
  });
  const showBanner = create.error && !(form.formState.errors && Object.keys(form.formState.errors).length > 0);

  return (
    <FormProvider {...form}>
      <form
        noValidate
        className="flex flex-1 flex-col"
        onSubmit={form.handleSubmit((v) => create.mutate({ data: toCreateBody(v) }))}
      >
        <SheetBody>
          {showBanner ? <Alert tone="danger">{companyProblem(t, create.error)}</Alert> : null}
          <CompanyFields parents={parents.items} />
        </SheetBody>
        <SheetFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            {t('common:action.cancel')}
          </Button>
          <Button type="submit" loading={create.isPending}>
            {t('create.submit')}
          </Button>
        </SheetFooter>
      </form>
    </FormProvider>
  );
}

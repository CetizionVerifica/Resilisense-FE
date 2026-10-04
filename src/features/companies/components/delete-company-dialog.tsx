import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { useCompaniesControllerRemove } from '@/api/generated/companies/companies';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { useInvalidateCompanies } from '../hooks';
import { companyProblem } from '../problem-message';

/**
 * Delete a company (M02 §7): the user types the company name; the company stays restorable for
 * 30 days under "Recently deleted".
 */
export function DeleteCompanyDialog({
  company,
  open,
  onOpenChange,
}: {
  company: { id: string; displayName: string };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useTranslation('companies');
  const navigate = useNavigate();
  const invalidate = useInvalidateCompanies();
  const [typed, setTyped] = useState('');
  const remove = useCompaniesControllerRemove();
  const matches = typed.trim().toLocaleLowerCase() === company.displayName.trim().toLocaleLowerCase();
  const setOpen = (o: boolean) => {
    if (!o) {
      setTyped('');
      remove.reset();
    }
    onOpenChange(o);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent closeLabel={t('common:action.close')}>
        <form
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!matches) return;
            remove.mutate(
              { id: company.id, params: { confirmName: typed.trim() } },
              {
                onSuccess: () => {
                  toast.success(t('toast.deleted', { name: company.displayName }));
                  void invalidate(company.id);
                  setOpen(false);
                  void navigate('/companies');
                },
              },
            );
          }}
        >
          <div className="grid gap-2 pe-8">
            <DialogTitle>{t('delete.title', { name: company.displayName })}</DialogTitle>
            <DialogDescription>{t('delete.description')}</DialogDescription>
          </div>
          {remove.error ? <Alert tone="danger">{companyProblem(t, remove.error)}</Alert> : null}
          <FormField label={t('delete.typeName', { name: company.displayName })}>
            <Input value={typed} autoComplete="off" onChange={(e) => setTyped(e.target.value)} />
          </FormField>
          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                {t('common:action.cancel')}
              </Button>
            </DialogClose>
            <Button type="submit" variant="destructive" disabled={!matches} loading={remove.isPending}>
              {t('delete.confirm')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { currencyCodes, useCountries, useDisplayNames, useSectors } from '@/lib/reference';
import { type CompanyValues, SIZE_BANDS } from '../schemas';

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

/**
 * Company identity + profile fields (M02 §9: two sections, no contact password). Used by the
 * create sheet, the company settings page and partner onboarding (inside a FormProvider).
 */
export function CompanyFields({
  parents,
  section = 'all',
}: {
  /** Companies that can be the parent (omit to hide the field). */
  parents?: Array<{ id: string; displayName: string }>;
  section?: 'all' | 'identity' | 'profile';
}) {
  const { t } = useTranslation('companies');
  const form = useFormContext<CompanyValues>();
  const { errors } = form.formState;
  const err = (m?: string) => (m ? t(m) : undefined);
  const sectors = useSectors();
  const countries = useCountries();
  const names = useDisplayNames();
  const countryOptions = useMemo(
    () =>
      (countries.data?.items ?? [])
        .map((c) => ({ code: c.code, name: names.country(c.code) }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [countries.data, names],
  );
  const currencies = useMemo(() => currencyCodes().map((c) => ({ code: c, name: names.currency(c) })), [names]);

  const identity = (
    <fieldset className="grid gap-4 md:grid-cols-2">
      <legend className="pb-2 text-h3 font-semibold">{t('form.identity')}</legend>
      <FormField label={t('field.legalName')} error={err(errors.legalName?.message)}>
        <Input autoComplete="organization" {...form.register('legalName')} />
      </FormField>
      <FormField
        label={t('field.displayName')}
        hint={t('field.displayNameHint')}
        error={err(errors.displayName?.message)}
      >
        <Input {...form.register('displayName')} />
      </FormField>
      <FormField label={t('field.registrationNo')} error={err(errors.registrationNo?.message)}>
        <Input dir="ltr" {...form.register('registrationNo')} />
      </FormField>
      <FormField label={t('field.country')} error={err(errors.country?.message)}>
        <Select disabled={countries.isPending} {...form.register('country')}>
          <option value="">{countries.isError ? t('form.loadFailed') : t('form.choose')}</option>
          {countryOptions.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </Select>
      </FormField>
      <FormField label={t('field.region')} error={err(errors.region?.message)}>
        <Input {...form.register('region')} />
      </FormField>
      <FormField label={t('field.website')} error={err(errors.website?.message)}>
        <Input type="url" dir="ltr" placeholder="https://" {...form.register('website')} />
      </FormField>
      <div className="grid gap-4 md:col-span-2 md:grid-cols-2">
        <FormField label={t('field.addressLine1')} error={err(errors.addressLine1?.message)}>
          <Input autoComplete="address-line1" {...form.register('addressLine1')} />
        </FormField>
        <FormField label={t('field.addressLine2')} error={err(errors.addressLine2?.message)}>
          <Input autoComplete="address-line2" {...form.register('addressLine2')} />
        </FormField>
        <FormField label={t('field.city')} error={err(errors.city?.message)}>
          <Input autoComplete="address-level2" {...form.register('city')} />
        </FormField>
        <FormField label={t('field.postalCode')} error={err(errors.postalCode?.message)}>
          <Input autoComplete="postal-code" dir="ltr" {...form.register('postalCode')} />
        </FormField>
        <FormField label={t('field.state')} error={err(errors.state?.message)}>
          <Input autoComplete="address-level1" {...form.register('state')} />
        </FormField>
      </div>
    </fieldset>
  );

  const profile = (
    <fieldset className="grid gap-4 md:grid-cols-2">
      <legend className="pb-2 text-h3 font-semibold">{t('form.profile')}</legend>
      <FormField label={t('field.sectorCode')} error={err(errors.sectorCode?.message)}>
        <Select disabled={sectors.isPending} {...form.register('sectorCode')}>
          <option value="">{sectors.isError ? t('form.loadFailed') : t('form.choose')}</option>
          {sectors.groups.map(({ group, items }) => (
            <optgroup key={group.code} label={group.label}>
              {items.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.label}
                </option>
              ))}
            </optgroup>
          ))}
        </Select>
      </FormField>
      <FormField label={t('field.sizeBand')} error={err(errors.sizeBand?.message)}>
        <Select {...form.register('sizeBand')}>
          <option value="">{t('form.choose')}</option>
          {SIZE_BANDS.map((b) => (
            <option key={b} value={b}>
              {t(`size.${b}`)}
            </option>
          ))}
        </Select>
      </FormField>
      <FormField label={t('field.employeeCount')} error={err(errors.employeeCount?.message)}>
        <Input inputMode="numeric" {...form.register('employeeCount')} />
      </FormField>
      <FormField label={t('field.currency')} error={err(errors.currency?.message)}>
        <Select {...form.register('currency')}>
          <option value="">{t('form.choose')}</option>
          {currencies.map((c) => (
            <option key={c.code} value={c.code}>
              {t('form.currencyOption', { code: c.code, name: c.name })}
            </option>
          ))}
        </Select>
      </FormField>
      <FormField label={t('field.fiscalYearStartMonth')} error={err(errors.fiscalYearStartMonth?.message)}>
        <Select {...form.register('fiscalYearStartMonth')}>
          {MONTHS.map((m) => (
            <option key={m} value={String(m)}>
              {names.month(m)}
            </option>
          ))}
        </Select>
      </FormField>
      {parents ? (
        <FormField
          label={t('field.parentCompanyId')}
          hint={t('field.parentCompanyIdHint')}
          error={err(errors.parentCompanyId?.message)}
        >
          <Select {...form.register('parentCompanyId')}>
            <option value="">{t('form.noParent')}</option>
            {parents.map((p) => (
              <option key={p.id} value={p.id}>
                {p.displayName}
              </option>
            ))}
          </Select>
        </FormField>
      ) : null}
      <div className="md:col-span-2">
        <FormField label={t('field.description')} error={err(errors.description?.message)}>
          <Textarea rows={3} {...form.register('description')} />
        </FormField>
      </div>
    </fieldset>
  );

  if (section === 'identity') return identity;
  if (section === 'profile') return profile;
  return (
    <div className="grid gap-6">
      {identity}
      {profile}
    </div>
  );
}

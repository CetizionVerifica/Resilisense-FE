import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { useCompaniesControllerGet } from '@/api/generated/companies/companies';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/format';
import { useDisplayNames, useSectors } from '@/lib/reference';
import { useCompany } from './company-layout';

function Facts({ items }: { items: Array<[label: string, value: ReactNode]> }) {
  return (
    <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
      {items.map(([label, value]) => (
        <div key={label} className="grid gap-0.5">
          <dt className="text-small text-fg-muted">{label}</dt>
          <dd className="text-body text-fg">{value ?? '—'}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Company overview: identity and profile facts (M02 §4.1). */
export function CompanyOverviewPage() {
  const { t, i18n } = useTranslation('companies');
  const c = useCompany();
  const sectors = useSectors();
  const names = useDisplayNames();
  const parent = useCompaniesControllerGet(c.parentCompanyId ?? '', { query: { enabled: !!c.parentCompanyId } });
  const address = c.address
    ? [
        c.address.line1,
        c.address.line2,
        [c.address.postalCode, c.address.city].filter(Boolean).join(' '),
        c.address.state,
      ]
        .filter(Boolean)
        .join(', ')
    : null;
  const sector = c.sectorCode ? sectors.byCode.get(c.sectorCode) : undefined;
  const group = sector?.parentCode ? sectors.byCode.get(sector.parentCode) : undefined;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>{t('form.identity')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Facts
            items={[
              [t('field.legalName'), c.legalName],
              [t('field.displayName'), c.displayName],
              [t('field.registrationNo'), c.registrationNo],
              [t('field.country'), names.country(c.country) || null],
              [t('field.region'), c.region],
              [t('field.address'), address],
              [
                t('field.website'),
                c.website ? (
                  <a
                    href={c.website}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-link hover:underline"
                    dir="ltr"
                  >
                    {c.website}
                  </a>
                ) : null,
              ],
            ]}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{t('form.profile')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Facts
            items={[
              [
                t('field.sectorCode'),
                sector
                  ? group
                    ? t('overview.sectorPath', { group: group.label, sector: sector.label })
                    : sector.label
                  : null,
              ],
              [t('field.sizeBand'), c.sizeBand ? t(`size.${c.sizeBand}`) : null],
              [
                t('field.employeeCount'),
                c.employeeCount === null ? null : new Intl.NumberFormat(i18n.language).format(c.employeeCount),
              ],
              [t('field.currency'), t('form.currencyOption', { code: c.currency, name: names.currency(c.currency) })],
              [t('field.fiscalYearStartMonth'), names.month(c.fiscalYearStartMonth)],
              [
                t('field.parentCompanyId'),
                c.parentCompanyId ? (
                  <Link to={`/companies/${c.parentCompanyId}`} className="text-link hover:underline">
                    {parent.data?.displayName ?? t('common:state.loading')}
                  </Link>
                ) : null,
              ],
              [t('overview.created'), formatDate(c.createdAt, i18n.language)],
            ]}
          />
          {c.description ? (
            <p className="mt-4 whitespace-pre-line text-body text-fg-secondary">{c.description}</p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

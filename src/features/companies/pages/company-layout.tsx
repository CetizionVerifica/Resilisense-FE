import { Building2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, Outlet, useOutletContext, useParams } from 'react-router';
import { useCompaniesControllerGet } from '@/api/generated/companies/companies';
import { type CompaniesControllerGet200 } from '@/api/generated/model';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { EmptyState, ErrorState, PageSkeleton } from '@/components/ui/states';
import { TabNav, TabNavLink } from '@/components/ui/tabs';
import { FileImage } from '@/features/files/components/file-image';
import { usePermission } from '@/lib/auth/me';
import { isApiError } from '@/lib/problem';
import { useDisplayNames, useSectors } from '@/lib/reference';

export type CompanyOutlet = { company: CompaniesControllerGet200 };
export const useCompany = () => useOutletContext<CompanyOutlet>().company;

/**
 * `/companies/:id` (M02 §9 detail pattern): header with key facts and URL-backed tabs. Projects,
 * Stakeholders and Suppliers tabs arrive with M03, M07 and M10.
 */
export function CompanyLayout() {
  const { t } = useTranslation('companies');
  const { id = '' } = useParams();
  const company = useCompaniesControllerGet(id);
  const sectors = useSectors();
  const names = useDisplayNames();
  const canUpdate = usePermission('company:update');

  if (company.isPending) return <PageSkeleton label={t('common:state.loading')} />;
  if (company.isError) {
    if (isApiError(company.error, 'not_found')) {
      return (
        <Card>
          <EmptyState
            icon={<Building2 aria-hidden />}
            title={t('notFound.title')}
            description={t('notFound.description')}
            action={
              <Button asChild variant="secondary">
                <Link to="/companies">{t('notFound.back')}</Link>
              </Button>
            }
          />
        </Card>
      );
    }
    return (
      <ErrorState
        title={t('loadOneFailed')}
        retryLabel={t('common:action.retry')}
        onRetry={() => void company.refetch()}
      />
    );
  }

  const c = company.data;
  const facts = [
    c.sectorCode ? (sectors.byCode.get(c.sectorCode)?.label ?? c.sectorCode) : null,
    names.country(c.country) || null,
    c.sizeBand ? t(`size.${c.sizeBand}`) : null,
  ].filter(Boolean);

  return (
    <>
      <nav aria-label={t('breadcrumb')} className="pb-2 text-small text-fg-muted">
        <Link to="/companies" className="hover:underline">
          {t('title')}
        </Link>
      </nav>
      <PageHeader
        title={c.displayName}
        media={
          c.logoFileId ? (
            <FileImage fileId={c.logoFileId} alt={t('files:logo.alt', { name: c.displayName })} className="size-12" />
          ) : undefined
        }
        description={[c.legalName !== c.displayName ? c.legalName : null, ...facts].filter(Boolean).join(' · ')}
      />
      <TabNav label={t('sections')} className="mb-6">
        <TabNavLink to={`/companies/${c.id}`} end>
          {t('tab.overview')}
        </TabNavLink>
        <TabNavLink to={`/companies/${c.id}/activity`}>{t('tab.activity')}</TabNavLink>
        {canUpdate ? <TabNavLink to={`/companies/${c.id}/settings`}>{t('tab.settings')}</TabNavLink> : null}
      </TabNav>
      <Outlet context={{ company: c } satisfies CompanyOutlet} />
    </>
  );
}

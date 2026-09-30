import { useTranslation } from 'react-i18next';

/**
 * Membership scope (M01 §6 `company_ids` / `project_ids`). Shown as counts until companies (M02)
 * and projects (M03) have endpoints to resolve names.
 */
export function ScopeSummary({ companyIds, projectIds }: { companyIds: string[]; projectIds: string[] }) {
  const { t } = useTranslation('members');
  if (companyIds.length === 0 && projectIds.length === 0) {
    return <span className="text-fg-secondary">{t('scope.all')}</span>;
  }
  return (
    <span className="text-fg-secondary">
      {t('scope.limited', { companies: companyIds.length, projects: projectIds.length })}
    </span>
  );
}

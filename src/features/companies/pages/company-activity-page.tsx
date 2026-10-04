import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ActivityFeed } from '../components/activity-feed';
import { useCompany } from './company-layout';

/** `/companies/:id/activity` (M02 §4.1): real activity from audit events. */
export function CompanyActivityPage() {
  const { t } = useTranslation('companies');
  const c = useCompany();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('activity.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <ActivityFeed companyId={c.id} />
      </CardContent>
    </Card>
  );
}

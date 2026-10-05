import { type TFunction } from 'i18next';
import { isApiError } from '@/lib/problem';

/** Message for a failed company action (problem codes from M02 §7, CSR_BE companies.service). */
export function companyProblem(t: TFunction<'companies'>, error: unknown): string {
  if (!isApiError(error)) return t('auth:error.network');
  switch (error.code) {
    case 'limit_exceeded':
      return t('error.limit', { max: typeof error.problem.max === 'number' ? error.problem.max : 0 });
    case 'workspace_suspended':
      return t('common:suspended.readOnly');
    case 'forbidden':
      return t('error.forbidden');
    case 'not_found':
      return t('error.notFound');
    case 'validation_failed':
      return t('error.invalid');
    default:
      return t('common:error.title');
  }
}

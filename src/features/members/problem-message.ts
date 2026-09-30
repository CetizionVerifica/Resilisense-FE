import { type TFunction } from 'i18next';
import { isApiError } from '@/lib/problem';

/** Message for a failed member / invitation action (problem codes from M01 §7, CSR_BE members.service). */
export function memberProblem(t: TFunction<'members'>, error: unknown): string {
  if (!isApiError(error)) return t('auth:error.network');
  switch (error.code) {
    case 'forbidden':
      return t('error.forbidden');
    case 'conflict':
      return t('error.lastOwner');
    case 'limit_exceeded':
      return t('error.limit');
    case 'not_found':
      return t('error.notFound');
    case 'rate_limited':
      return t('auth:error.rateLimited');
    default:
      return t('common:error.title');
  }
}

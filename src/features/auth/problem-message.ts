import { type TFunction } from 'i18next';
import { isApiError } from '@/lib/problem';

/** Human message for an auth API failure; field errors are mapped separately. */
export function problemMessage(t: TFunction<'auth'>, error: unknown): string {
  if (!isApiError(error)) return t('error.network');
  switch (error.code) {
    case 'rate_limited':
      return t('error.rateLimited');
    case 'invalid_token':
      return t('error.invalidLink');
    case 'email_not_verified':
      return t('error.emailNotVerified');
    case 'unauthenticated':
      return t('error.invalidCredentials');
    case 'validation_failed':
      return t('error.validation');
    default:
      return t('error.generic');
  }
}

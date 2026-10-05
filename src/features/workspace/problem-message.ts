import { type TFunction } from 'i18next';
import { isApiError } from '@/lib/problem';

/** Message for a failed workspace action (M02 §8 problem codes). */
export function workspaceProblem(t: TFunction<'workspace'>, error: unknown): string {
  if (!isApiError(error)) return t('auth:error.network');
  switch (error.code) {
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

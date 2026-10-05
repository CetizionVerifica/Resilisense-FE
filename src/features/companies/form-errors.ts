import { type FieldValues, type Path, type UseFormSetError } from 'react-hook-form';
import { isApiError } from '@/lib/problem';
import { companyFieldOf } from './schemas';

/**
 * Maps problem+json `errors[]` of a company request onto the form (CLAUDE.md "Forms"). The API's
 * English messages are not shown; each field gets the translated "check this value" message.
 * Returns true when a field error was applied.
 */
export function applyCompanyErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  extra: Record<string, Path<T>> = {},
): boolean {
  if (!isApiError(error, 'validation_failed') || !error.problem.errors) return false;
  let applied = false;
  for (const e of error.problem.errors) {
    const field = extra[e.path] ?? (companyFieldOf(e.path) as Path<T> | null);
    if (field) {
      setError(field, { type: 'server', message: 'companies:validation.server' });
      applied = true;
    }
  }
  return applied;
}

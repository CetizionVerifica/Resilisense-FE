import { type FieldValues, type Path, type UseFormSetError } from 'react-hook-form';
import { isApiError } from './problem';

/**
 * Maps problem+json `errors[]` onto form fields (CLAUDE.md "Forms"). Returns true when at least
 * one field error was applied, so the caller can skip the generic banner.
 */
export function applyFieldErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  fields: readonly Path<T>[],
): boolean {
  if (!isApiError(error) || !error.problem.errors) return false;
  let applied = false;
  for (const e of error.problem.errors) {
    const field = fields.find((f) => f === e.path);
    if (field) {
      setError(field, { type: 'server', message: e.message });
      applied = true;
    }
  }
  return applied;
}

import { type ReactElement, cloneElement, useId } from 'react';
import { Label } from './label';

interface FormFieldProps {
  label: string;
  /** Validation or server error (problem+json `errors[]`), announced and linked via aria-describedby. */
  error?: string | undefined;
  hint?: string | undefined;
  children: ReactElement<{ id?: string; 'aria-invalid'?: boolean; 'aria-describedby'?: string }>;
}

/** Label + control + hint/error, wired for screen readers (02 §8: labels, aria-describedby). */
export function FormField({ label, error, hint, children }: FormFieldProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      {cloneElement(children, { id, 'aria-invalid': error ? true : undefined, 'aria-describedby': describedBy })}
      {hint ? (
        <p id={hintId} className="text-small text-fg-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-small text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

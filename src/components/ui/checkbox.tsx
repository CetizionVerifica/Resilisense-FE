import { type ComponentProps, type ReactNode, useId } from 'react';
import { cn } from '@/lib/utils';

/**
 * Native checkbox with its label as part of the target (≥ 24×24 px, 02 §8), React Hook Form
 * `register`-compatible. The error is linked via aria-describedby.
 */
export function Checkbox({
  label,
  error,
  className,
  ...props
}: Omit<ComponentProps<'input'>, 'type'> & { label: ReactNode; error?: string | undefined }) {
  const id = useId();
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div className={cn('grid gap-1.5', className)}>
      <label htmlFor={id} className="flex min-h-6 cursor-pointer items-start gap-2.5 text-body text-fg">
        <input
          id={id}
          type="checkbox"
          className="mt-0.5 size-4 shrink-0 accent-primary"
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          {...props}
        />
        <span>{label}</span>
      </label>
      {error ? (
        <p id={errorId} className="text-small text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

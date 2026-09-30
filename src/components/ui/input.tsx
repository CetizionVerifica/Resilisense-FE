import { type ComponentProps } from 'react';
import { cn } from '@/lib/utils';

export function Input({ className, ...props }: ComponentProps<'input'>) {
  return (
    <input
      className={cn(
        'h-9 w-full rounded-sm border border-border-strong bg-surface px-3 text-body text-fg placeholder:text-fg-muted',
        'aria-invalid:border-danger disabled:cursor-not-allowed disabled:opacity-60',
        className,
      )}
      {...props}
    />
  );
}

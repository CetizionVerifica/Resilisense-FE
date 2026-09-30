import { type ComponentProps } from 'react';
import { cn } from '@/lib/utils';

export function Textarea({ className, ...props }: ComponentProps<'textarea'>) {
  return (
    <textarea
      className={cn(
        'min-h-24 w-full rounded-sm border border-border-strong bg-surface px-3 py-2 text-body text-fg placeholder:text-fg-muted',
        'aria-invalid:border-danger disabled:cursor-not-allowed disabled:opacity-60',
        className,
      )}
      {...props}
    />
  );
}

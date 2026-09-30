import { ChevronDown } from 'lucide-react';
import { type ComponentProps } from 'react';
import { cn } from '@/lib/utils';

/**
 * Native `<select>` styled like `Input`: keyboard, screen-reader and mobile pickers for free, and
 * it registers directly with React Hook Form. Use for short-to-long option lists (roles, time zones).
 */
export function Select({ className, children, ...props }: ComponentProps<'select'>) {
  return (
    <div className={cn('relative', className)}>
      <select
        className={cn(
          'h-9 w-full appearance-none rounded-sm border border-border-strong bg-surface ps-3 pe-9 text-body text-fg',
          'aria-invalid:border-danger disabled:cursor-not-allowed disabled:opacity-60',
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-fg-muted"
        aria-hidden
      />
    </div>
  );
}

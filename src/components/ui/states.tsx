import { AlertTriangle, Inbox } from 'lucide-react';
import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Skeleton } from './skeleton';

/** Empty state: explains why it is empty and what to do next (02 §7). */
export function EmptyState({
  title,
  description,
  action,
  icon,
  className,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col items-center gap-3 px-6 py-12 text-center', className)}>
      <div className="flex size-12 items-center justify-center rounded-full bg-subtle text-fg-muted [&_svg]:size-6">
        {icon ?? <Inbox aria-hidden />}
      </div>
      <h2 className="text-h3 font-semibold">{title}</h2>
      {description ? <p className="max-w-[48ch] text-body text-fg-muted">{description}</p> : null}
      {action}
    </div>
  );
}

/** Error state with retry (CLAUDE.md: every async view). */
export function ErrorState({
  title,
  description,
  retryLabel,
  onRetry,
}: {
  title: string;
  description?: string | undefined;
  retryLabel: string;
  onRetry?: () => void;
}) {
  return (
    <div role="alert" className="flex flex-col items-center gap-3 px-6 py-12 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-danger-subtle text-danger">
        <AlertTriangle className="size-6" aria-hidden />
      </div>
      <h2 className="text-h3 font-semibold">{title}</h2>
      {description ? <p className="max-w-[48ch] text-body text-fg-muted">{description}</p> : null}
      {onRetry ? (
        <Button variant="secondary" onClick={onRetry}>
          {retryLabel}
        </Button>
      ) : null}
    </div>
  );
}

/** Page-level loading skeleton (never an empty div while loading). */
export function PageSkeleton({ label }: { label: string }) {
  return (
    <div className="grid gap-4" role="status" aria-label={label}>
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-96 max-w-full" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
      <Skeleton className="h-64" />
    </div>
  );
}

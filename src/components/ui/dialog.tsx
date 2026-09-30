import { X } from 'lucide-react';
import { Dialog as Primitive } from 'radix-ui';
import { type ComponentProps } from 'react';
import { cn } from '@/lib/utils';

export const Dialog = Primitive.Root;
export const DialogTrigger = Primitive.Trigger;
export const DialogClose = Primitive.Close;

export function DialogContent({
  className,
  children,
  closeLabel,
  ...props
}: ComponentProps<typeof Primitive.Content> & { closeLabel: string }) {
  return (
    <Primitive.Portal>
      <Primitive.Overlay className="fixed inset-0 z-50 bg-slate-950/50" />
      <Primitive.Content
        className={cn(
          'fixed start-1/2 top-[15vh] z-50 w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 rtl:translate-x-1/2',
          'rounded-lg border border-border bg-surface p-5 text-fg shadow-lg',
          className,
        )}
        {...props}
      >
        {children}
        <Primitive.Close
          className="absolute end-3 top-3 inline-flex size-8 items-center justify-center rounded-sm text-fg-muted hover:bg-subtle"
          aria-label={closeLabel}
        >
          <X className="size-4" aria-hidden />
        </Primitive.Close>
      </Primitive.Content>
    </Primitive.Portal>
  );
}

export function DialogTitle({ className, ...props }: ComponentProps<typeof Primitive.Title>) {
  return <Primitive.Title className={cn('text-h2 font-semibold', className)} {...props} />;
}

export function DialogDescription({ className, ...props }: ComponentProps<typeof Primitive.Description>) {
  return <Primitive.Description className={cn('text-body text-fg-muted', className)} {...props} />;
}

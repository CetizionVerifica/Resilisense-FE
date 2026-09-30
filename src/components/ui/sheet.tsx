import { X } from 'lucide-react';
import { Dialog as Primitive } from 'radix-ui';
import { type ComponentProps } from 'react';
import { cn } from '@/lib/utils';

export const Sheet = Primitive.Root;
export const SheetTrigger = Primitive.Trigger;
export const SheetClose = Primitive.Close;

/** Side panel for create/edit (02 §5): slides in from the end side, full width on phones. */
export function SheetContent({
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
          'fixed inset-y-0 end-0 z-50 flex w-full max-w-lg flex-col overflow-y-auto',
          'border-s border-border bg-surface text-fg shadow-lg',
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

export function SheetHeader({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('grid gap-1 border-b border-border p-5 pe-12', className)} {...props} />;
}

export function SheetBody({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('grid flex-1 content-start gap-4 p-5', className)} {...props} />;
}

export function SheetFooter({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('flex justify-end gap-2 border-t border-border p-5', className)} {...props} />;
}

export function SheetTitle({ className, ...props }: ComponentProps<typeof Primitive.Title>) {
  return <Primitive.Title className={cn('text-h2 font-semibold', className)} {...props} />;
}

export function SheetDescription({ className, ...props }: ComponentProps<typeof Primitive.Description>) {
  return <Primitive.Description className={cn('text-body text-fg-muted', className)} {...props} />;
}

import { type ReactNode } from 'react';
import { Button } from './button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from './dialog';

/** Confirmation for destructive or consequential actions; stays open while the action runs. */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel,
  closeLabel,
  destructive,
  pending,
  onConfirm,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  closeLabel: string;
  destructive?: boolean;
  pending?: boolean;
  onConfirm: () => void;
  /** Extra content, e.g. an error alert. */
  children?: ReactNode;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent closeLabel={closeLabel} className="grid gap-4">
        <div className="grid gap-2 pe-8">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </div>
        {children}
        <div className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="secondary">{cancelLabel}</Button>
          </DialogClose>
          <Button variant={destructive ? 'destructive' : 'primary'} loading={pending} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

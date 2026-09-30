import { cva, type VariantProps } from 'class-variance-authority';
import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';
import { type ComponentProps } from 'react';
import { cn } from '@/lib/utils';

const alertVariants = cva('flex gap-3 rounded-sm border p-3 text-body [&>svg]:mt-0.5 [&>svg]:size-4 [&>svg]:shrink-0', {
  variants: {
    tone: {
      info: 'border-info/30 bg-info-subtle text-fg [&>svg]:text-info',
      success: 'border-success/30 bg-success-subtle text-fg [&>svg]:text-success',
      warning: 'border-warning/30 bg-warning-subtle text-fg [&>svg]:text-warning',
      danger: 'border-danger/30 bg-danger-subtle text-fg [&>svg]:text-danger',
    },
  },
  defaultVariants: { tone: 'info' },
});

const ICONS = { info: Info, success: CheckCircle2, warning: AlertTriangle, danger: XCircle } as const;

/** Status is always icon + text, never colour alone (02 §2.3). */
export function Alert({
  className,
  tone,
  children,
  ...props
}: ComponentProps<'div'> & VariantProps<typeof alertVariants>) {
  const Icon = ICONS[tone ?? 'info'];
  return (
    <div role={tone === 'danger' ? 'alert' : 'status'} className={cn(alertVariants({ tone }), className)} {...props}>
      <Icon aria-hidden />
      <div className="grid gap-1">{children}</div>
    </div>
  );
}

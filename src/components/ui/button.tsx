import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { Slot } from 'radix-ui';
import { type ComponentProps } from 'react';
import { cn } from '@/lib/utils';

export const buttonVariants = cva(
  'inline-flex min-h-6 items-center justify-center gap-2 whitespace-nowrap rounded-sm font-medium transition-colors duration-[120ms] disabled:pointer-events-none disabled:opacity-60 [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-on-primary hover:bg-primary-hover',
        secondary: 'border border-border-strong bg-surface text-fg hover:bg-subtle',
        ghost: 'text-fg hover:bg-subtle',
        destructive: 'bg-danger text-white hover:opacity-90 dark:text-canvas',
        link: 'text-link underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-8 px-3 text-small',
        md: 'h-9 px-4 text-body',
        lg: 'h-11 px-5 text-body-lg',
        icon: 'size-9',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export interface ButtonProps extends ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
  /** Render the child element (e.g. a router Link) with button styles. */
  asChild?: boolean;
  /** Shows a spinner, sets aria-busy and disables the button. */
  loading?: boolean;
}

export function Button({ className, variant, size, asChild, loading, disabled, children, ...props }: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size }), className);
  if (asChild) {
    // Slot needs exactly one child element (e.g. a router <Link>).
    return (
      <Slot.Root className={classes} {...props}>
        {children}
      </Slot.Root>
    );
  }
  return (
    <button className={classes} disabled={disabled || loading} aria-busy={loading || undefined} {...props}>
      {loading ? <Loader2 className="animate-spin" aria-hidden /> : null}
      {children}
    </button>
  );
}

import { Tabs as Primitive } from 'radix-ui';
import { type ComponentProps } from 'react';
import { NavLink, type NavLinkProps } from 'react-router';
import { cn } from '@/lib/utils';

export const Tabs = Primitive.Root;

const list = 'flex gap-1 overflow-x-auto border-b border-border';
const trigger =
  'relative -mb-px inline-flex h-10 shrink-0 items-center gap-2 border-b-2 border-transparent px-3 text-body text-fg-muted hover:text-fg [&_svg]:size-4';
const active = 'border-accent font-medium text-fg';

export function TabsList({ className, ...props }: ComponentProps<typeof Primitive.List>) {
  return <Primitive.List className={cn(list, className)} {...props} />;
}

export function TabsTrigger({ className, ...props }: ComponentProps<typeof Primitive.Trigger>) {
  return (
    <Primitive.Trigger
      className={cn(
        trigger,
        'data-[state=active]:border-accent data-[state=active]:font-medium data-[state=active]:text-fg',
        className,
      )}
      {...props}
    />
  );
}

export function TabsContent({ className, ...props }: ComponentProps<typeof Primitive.Content>) {
  return <Primitive.Content className={cn('pt-6 outline-none', className)} {...props} />;
}

/**
 * Route-backed tabs (02 §5 "URL-synced tabs"): each tab is a link, so tabs are shareable and
 * the browser back button works. Renders a `nav` landmark with `aria-current` on the active tab.
 */
export function TabNav({ label, className, ...props }: ComponentProps<'nav'> & { label: string }) {
  return <nav aria-label={label} className={cn(list, className)} {...props} />;
}

export function TabNavLink({ className, ...props }: NavLinkProps & { className?: string }) {
  return <NavLink className={({ isActive }) => cn(trigger, isActive && active, className)} {...props} />;
}

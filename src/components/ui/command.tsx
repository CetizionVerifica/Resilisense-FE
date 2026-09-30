import { Command as Cmdk } from 'cmdk';
import { Search } from 'lucide-react';
import { type ComponentProps } from 'react';
import { cn } from '@/lib/utils';

export function Command({ className, ...props }: ComponentProps<typeof Cmdk>) {
  return <Cmdk className={cn('flex flex-col overflow-hidden text-fg', className)} {...props} />;
}

export function CommandInput({ className, ...props }: ComponentProps<typeof Cmdk.Input>) {
  return (
    <div className="flex items-center gap-2 border-b border-border px-3">
      <Search className="size-4 text-fg-muted" aria-hidden />
      <Cmdk.Input
        className={cn('h-11 w-full bg-transparent text-body outline-none placeholder:text-fg-muted', className)}
        {...props}
      />
    </div>
  );
}

export function CommandList({ className, ...props }: ComponentProps<typeof Cmdk.List>) {
  return <Cmdk.List className={cn('max-h-80 overflow-y-auto p-1', className)} {...props} />;
}

export function CommandEmpty(props: ComponentProps<typeof Cmdk.Empty>) {
  return <Cmdk.Empty className="py-6 text-center text-body text-fg-muted" {...props} />;
}

export function CommandGroup({ className, ...props }: ComponentProps<typeof Cmdk.Group>) {
  return (
    <Cmdk.Group
      className={cn(
        '[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-small [&_[cmdk-group-heading]]:text-fg-muted',
        className,
      )}
      {...props}
    />
  );
}

export function CommandItem({ className, ...props }: ComponentProps<typeof Cmdk.Item>) {
  return (
    <Cmdk.Item
      className={cn(
        'flex min-h-9 cursor-default items-center gap-2 rounded-sm px-2 text-body data-[selected=true]:bg-subtle [&_svg]:size-4 [&_svg]:text-fg-muted',
        className,
      )}
      {...props}
    />
  );
}

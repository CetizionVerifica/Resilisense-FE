import { Check } from 'lucide-react';
import { DropdownMenu as Primitive } from 'radix-ui';
import { type ComponentProps } from 'react';
import { cn } from '@/lib/utils';

export const DropdownMenu = Primitive.Root;
export const DropdownMenuTrigger = Primitive.Trigger;
export const DropdownMenuGroup = Primitive.Group;
export const DropdownMenuRadioGroup = Primitive.RadioGroup;
export const DropdownMenuSub = Primitive.Sub;

export function DropdownMenuContent({ className, sideOffset = 6, ...props }: ComponentProps<typeof Primitive.Content>) {
  return (
    <Primitive.Portal>
      <Primitive.Content
        sideOffset={sideOffset}
        className={cn('z-50 min-w-48 rounded-md border border-border bg-surface p-1 text-fg shadow-md', className)}
        {...props}
      />
    </Primitive.Portal>
  );
}

const item =
  'relative flex min-h-8 cursor-default select-none items-center gap-2 rounded-sm px-2 text-body outline-none data-[disabled]:opacity-50 data-[highlighted]:bg-subtle [&_svg]:size-4';

export function DropdownMenuItem({ className, ...props }: ComponentProps<typeof Primitive.Item>) {
  return <Primitive.Item className={cn(item, className)} {...props} />;
}

export function DropdownMenuRadioItem({ className, children, ...props }: ComponentProps<typeof Primitive.RadioItem>) {
  return (
    <Primitive.RadioItem className={cn(item, 'ps-8', className)} {...props}>
      <span className="absolute start-2 inline-flex">
        <Primitive.ItemIndicator>
          <Check aria-hidden />
        </Primitive.ItemIndicator>
      </span>
      {children}
    </Primitive.RadioItem>
  );
}

export function DropdownMenuLabel({ className, ...props }: ComponentProps<typeof Primitive.Label>) {
  return <Primitive.Label className={cn('px-2 py-1.5 text-small text-fg-muted', className)} {...props} />;
}

export function DropdownMenuSeparator({ className, ...props }: ComponentProps<typeof Primitive.Separator>) {
  return <Primitive.Separator className={cn('-mx-1 my-1 h-px bg-border', className)} {...props} />;
}

export function DropdownMenuSubTrigger({ className, ...props }: ComponentProps<typeof Primitive.SubTrigger>) {
  return <Primitive.SubTrigger className={cn(item, className)} {...props} />;
}

export function DropdownMenuSubContent({ className, ...props }: ComponentProps<typeof Primitive.SubContent>) {
  return (
    <Primitive.Portal>
      <Primitive.SubContent
        className={cn('z-50 min-w-40 rounded-md border border-border bg-surface p-1 text-fg shadow-md', className)}
        {...props}
      />
    </Primitive.Portal>
  );
}

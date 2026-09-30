import { Avatar as AvatarPrimitive } from 'radix-ui';
import { type ComponentProps } from 'react';
import { cn } from '@/lib/utils';

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] ?? '') + (parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '')).toUpperCase() || '?';
}

export function Avatar({ name, src, className }: { name: string; src?: string | undefined; className?: string }) {
  return (
    <AvatarPrimitive.Root
      className={cn(
        'inline-flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-subtle',
        className,
      )}
    >
      {src ? <AvatarPrimitive.Image src={src} alt="" className="size-full object-cover" /> : null}
      <AvatarPrimitive.Fallback className="text-small font-semibold text-fg-secondary" aria-hidden>
        {initials(name)}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
}

export type AvatarProps = ComponentProps<typeof Avatar>;

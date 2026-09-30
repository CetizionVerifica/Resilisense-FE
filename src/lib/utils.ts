import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * tailwind-merge must know our type scale (02 §2.4): otherwise `text-body` looks like a colour
 * and silently removes `text-on-primary` etc.
 */
const twMerge = extendTailwindMerge({
  extend: { theme: { text: ['display', 'h1', 'h2', 'h3', 'body', 'body-lg', 'small'] } },
});

/** Merge class names; later Tailwind utilities win. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

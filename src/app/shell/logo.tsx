import { cn } from '@/lib/utils';

/**
 * ResiliSense wordmark: slate text + amber sun-burst (02 §0). The raster logo is replaced by the
 * SVG from the brand kit when available; this mark keeps both themes legible on the dark sidebar.
 */
export function Logo({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2 font-semibold', className)}>
      <svg viewBox="0 0 32 32" className="size-7 shrink-0" aria-hidden>
        <circle cx="16" cy="16" r="6" fill="var(--color-amber-500)" />
        {Array.from({ length: 8 }, (_, i) => (
          <rect
            key={i}
            x="15"
            y="2"
            width="2"
            height="6"
            rx="1"
            fill="var(--color-amber-500)"
            transform={`rotate(${i * 45} 16 16)`}
          />
        ))}
      </svg>
      <span className={cn('text-h3', compact && 'sr-only')}>ResiliSense</span>
    </span>
  );
}

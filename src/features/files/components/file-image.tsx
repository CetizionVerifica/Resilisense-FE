import { ImageOff } from 'lucide-react';
import { useState } from 'react';
import { useFilesControllerDownload } from '@/api/generated/files/files';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

/**
 * An image file (logo) shown through its short-lived download link (M14 §8 notes: the access token
 * lives in memory, so `<img>` cannot call the API itself). Links last 5 minutes; refetched after 4.
 */
export function FileImage({ fileId, alt, className }: { fileId: string; alt: string; className?: string }) {
  const link = useFilesControllerDownload(fileId, undefined, {
    query: { staleTime: 4 * 60_000, refetchInterval: 4 * 60_000, retry: 1 },
  });
  const [broken, setBroken] = useState(false);
  const box = cn('size-16 rounded-sm border border-border bg-surface object-contain p-1', className);

  if (link.isPending) return <Skeleton className={box} />;
  if (link.isError || broken) {
    return (
      <span className={cn(box, 'grid place-items-center text-fg-muted')} role="img" aria-label={alt}>
        <ImageOff className="size-5" aria-hidden />
      </span>
    );
  }
  return <img src={link.data.url} alt={alt} className={box} onError={() => setBroken(true)} />;
}

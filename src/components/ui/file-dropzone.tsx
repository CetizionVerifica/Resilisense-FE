import { UploadCloud } from 'lucide-react';
import { type DragEvent, type ReactNode, useId, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';

export interface FileDropzoneProps {
  /** Visible label of the zone, e.g. "Drop a logo here or browse". */
  label: string;
  /** Text of the browse button (keyboard and pointer users). */
  browseLabel: string;
  /** Allowed types and size, e.g. "PNG, JPG or SVG · up to 2 MB". */
  hint?: string;
  /** `accept` of the file input. */
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  onFiles: (files: File[]) => void;
  /** Progress, status or error of the current upload, announced politely. */
  children?: ReactNode;
  className?: string;
}

/**
 * Drop zone with a real file input behind a button (M14 §9 `FileDropzone`): dragging is optional,
 * the browse button works with keyboard and screen readers. Upload state is rendered by the caller.
 */
export function FileDropzone({
  label,
  browseLabel,
  hint,
  accept,
  multiple,
  disabled,
  onFiles,
  children,
  className,
}: FileDropzoneProps) {
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const labelId = useId();
  const hintId = useId();

  const take = (list: FileList | null) => {
    const files = Array.from(list ?? []);
    if (files.length) onFiles(multiple ? files : files.slice(0, 1));
  };
  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setOver(false);
    if (!disabled) take(e.dataTransfer.files);
  };

  return (
    <div
      role="group"
      aria-labelledby={labelId}
      aria-describedby={hint ? hintId : undefined}
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={onDrop}
      className={cn(
        'grid justify-items-center gap-2 rounded-md border border-dashed border-border-strong bg-surface p-6 text-center transition-colors',
        over && 'border-primary bg-subtle',
        disabled && 'opacity-60',
        className,
      )}
    >
      <UploadCloud className="size-6 text-fg-muted" aria-hidden />
      <p id={labelId} className="text-body text-fg">
        {label}
      </p>
      {hint ? (
        <p id={hintId} className="text-small text-fg-muted">
          {hint}
        </p>
      ) : null}
      <Button type="button" variant="secondary" size="sm" disabled={disabled} onClick={() => input.current?.click()}>
        {browseLabel}
      </Button>
      <input
        ref={input}
        type="file"
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        data-testid="file-input"
        onChange={(e) => {
          take(e.target.files);
          e.target.value = '';
        }}
      />
      {children ? (
        <div aria-live="polite" className="grid w-full gap-2">
          {children}
        </div>
      ) : null}
    </div>
  );
}

/** Determinate progress bar for an upload (value 0–1). */
export function UploadProgress({ label, value }: { label: string; value: number }) {
  const pct = Math.round(value * 100);
  return (
    <div className="grid gap-1 text-start">
      <div className="flex justify-between text-small text-fg-secondary">
        <span className="truncate">{label}</span>
        <span>{pct}%</span>
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        className="h-2 overflow-hidden rounded-full bg-subtle"
      >
        <div className="h-full bg-primary transition-[width]" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

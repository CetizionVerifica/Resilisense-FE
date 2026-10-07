import { useCallback, useEffect, useRef, useState } from 'react';
import { type FilesControllerGet200 } from '@/api/generated/model';
import { type UploadFailure, UploadError, uploadFile, type UploadPurpose } from './upload';

export type UploadState =
  | { phase: 'idle' }
  | { phase: 'uploading'; name: string; progress: number }
  | { phase: 'checking'; name: string }
  | { phase: 'done'; file: FilesControllerGet200 }
  | { phase: 'failed'; name: string; failure: UploadFailure };

/** Drives one upload at a time and exposes its phase for the UI (progress, checking, error, retry). */
export function useFileUpload(purpose: UploadPurpose, onReady?: (file: FilesControllerGet200) => void) {
  const [state, setState] = useState<UploadState>({ phase: 'idle' });
  const abort = useRef<AbortController | null>(null);
  const last = useRef<File | null>(null);
  const ready = useRef(onReady);

  useEffect(() => {
    ready.current = onReady;
  });
  useEffect(() => () => abort.current?.abort(), []);

  const start = useCallback(
    async (file: File) => {
      abort.current?.abort();
      const controller = new AbortController();
      abort.current = controller;
      last.current = file;
      setState({ phase: 'uploading', name: file.name, progress: 0 });
      try {
        const done = await uploadFile(file, {
          purpose,
          signal: controller.signal,
          onProgress: (progress) => setState({ phase: 'uploading', name: file.name, progress }),
          onChecking: () => setState({ phase: 'checking', name: file.name }),
        });
        setState({ phase: 'done', file: done });
        ready.current?.(done);
      } catch (e) {
        if (controller.signal.aborted) return;
        const failure: UploadFailure = e instanceof UploadError ? e.failure : { kind: 'transfer' };
        setState({ phase: 'failed', name: file.name, failure });
      }
    },
    [purpose],
  );

  const retry = useCallback(() => {
    if (last.current) void start(last.current);
  }, [start]);

  const reset = useCallback(() => {
    abort.current?.abort();
    setState({ phase: 'idle' });
  }, []);

  return { state, start, retry, reset, busy: state.phase === 'uploading' || state.phase === 'checking' };
}

import { filesControllerComplete, filesControllerCreateUpload, filesControllerGet } from '@/api/generated/files/files';
import { type FilesControllerCreateUpload201Upload, type FilesControllerGet200 } from '@/api/generated/model';
import { type ApiError, isApiError } from '@/lib/problem';

export type UploadPurpose = 'evidence' | 'logo';

const MB = 1024 * 1024;

/**
 * What the file picker offers per purpose (M14 §4). A hint for the user only: the API checks the
 * declaration, the real content and the size again and is authoritative.
 */
export const UPLOAD_RULES: Record<UploadPurpose, { accept: string; types: string[]; maxBytes: number }> = {
  logo: {
    accept: '.png,.jpg,.jpeg,.svg,image/png,image/jpeg,image/svg+xml',
    types: ['PNG', 'JPG', 'SVG'],
    maxBytes: 2 * MB,
  },
  evidence: {
    accept: '.pdf,.docx,.xlsx,.pptx,.png,.jpg,.jpeg,.txt,.csv',
    types: ['PDF', 'DOCX', 'XLSX', 'PPTX', 'PNG', 'JPG', 'TXT', 'CSV'],
    maxBytes: 50 * MB,
  },
};

/** Browsers leave `file.type` empty for some extensions; the API wants the declared MIME type. */
const BY_EXTENSION: Record<string, string> = {
  pdf: 'application/pdf',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  svg: 'image/svg+xml',
  txt: 'text/plain',
  csv: 'text/csv',
};

export function mimeTypeOf(file: File): string {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  return file.type || BY_EXTENSION[ext] || 'application/octet-stream';
}

/** Why an upload did not become available; each has its own message (US-14-3). */
export type UploadFailure =
  | { kind: 'tooLarge'; maxBytes: number }
  /** The API refused the declaration (`mimeType`, `name`, `size`) or the uploaded content (`file`). */
  | { kind: 'rejected'; field: 'mimeType' | 'name' | 'size' | 'file' }
  | { kind: 'infected' }
  | { kind: 'transfer' }
  | { kind: 'timeout' }
  | { kind: 'api'; error: ApiError };

export class UploadError extends Error {
  constructor(readonly failure: UploadFailure) {
    super(failure.kind);
    this.name = 'UploadError';
  }
}

/**
 * Sends the file straight to the object store with the signed request the API returned (M14 §4):
 * `PUT` the body (S3-API stores, local) or `POST` a multipart form (Cloudinary). This is the only
 * request not made through the API client, because it does not go to the API. XHR for progress.
 */
export function transfer(
  upload: FilesControllerCreateUpload201Upload,
  file: File,
  onProgress: (fraction: number) => void,
  signal?: AbortSignal,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(upload.method, upload.url);
    let body: XMLHttpRequestBodyInit = file;
    if (upload.method === 'POST') {
      const form = new FormData();
      for (const [k, v] of Object.entries(upload.fields)) form.append(k, v);
      form.append('file', file);
      body = form;
    } else {
      for (const [k, v] of Object.entries(upload.headers)) xhr.setRequestHeader(k, v);
    }
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(e.loaded / e.total);
    };
    xhr.onload = () =>
      xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new UploadError({ kind: 'transfer' }));
    xhr.onerror = () => reject(new UploadError({ kind: 'transfer' }));
    xhr.onabort = () => reject(new DOMException('Aborted', 'AbortError'));
    signal?.addEventListener('abort', () => xhr.abort(), { once: true });
    xhr.send(body);
  });
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export interface UploadOptions {
  purpose: UploadPurpose;
  onProgress?: (fraction: number) => void;
  onChecking?: () => void;
  signal?: AbortSignal;
  /** How often and how long to wait for the malware scan. */
  pollMs?: number;
  timeoutMs?: number;
}

/**
 * The whole upload (M14 §4): declare → transfer → complete (size, type, SVG checks) → wait for the
 * scan. Resolves with the ready file; rejects with UploadError.
 */
export async function uploadFile(file: File, opts: UploadOptions): Promise<FilesControllerGet200> {
  const rules = UPLOAD_RULES[opts.purpose];
  if (file.size > rules.maxBytes) throw new UploadError({ kind: 'tooLarge', maxBytes: rules.maxBytes });
  const asUploadError = (e: unknown): unknown => {
    if (!isApiError(e)) return e;
    const path = e.problem.errors?.[0]?.path;
    return e.code === 'validation_failed' &&
      (path === 'mimeType' || path === 'name' || path === 'size' || path === 'file')
      ? new UploadError({ kind: 'rejected', field: path })
      : new UploadError({ kind: 'api', error: e });
  };
  try {
    const created = await filesControllerCreateUpload(
      { purpose: opts.purpose, name: file.name, size: file.size, mimeType: mimeTypeOf(file) },
      { signal: opts.signal },
    );
    await transfer(created.upload, file, (f) => opts.onProgress?.(f), opts.signal);
    opts.onProgress?.(1);
    opts.onChecking?.();
    let current: FilesControllerGet200 = await filesControllerComplete(created.file.id, { signal: opts.signal });
    const deadline = Date.now() + (opts.timeoutMs ?? 120_000);
    while (current.status === 'scanning' || current.status === 'pending') {
      if (Date.now() > deadline) throw new UploadError({ kind: 'timeout' });
      await sleep(opts.pollMs ?? 1000);
      current = await filesControllerGet(created.file.id, { signal: opts.signal });
    }
    if (current.status === 'quarantined') throw new UploadError({ kind: 'infected' });
    return current;
  } catch (e) {
    throw asUploadError(e);
  }
}

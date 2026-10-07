import { type FilesControllerGet200 } from '@/api/generated/model';

/**
 * In-memory M14 file store for the mocks (docs/revamp/modules/M14 §4). The object store is faked at
 * {@link MOCK_STORAGE_URL}: the browser sends the bytes there with the signed request the API returns,
 * just as it would to Cloudinary or an S3-API store.
 */
export const MOCK_STORAGE_URL = 'https://storage.mock.resilisense.test';

export type MockFile = FilesControllerGet200 & { workspaceId: string; body?: ArrayBuffer };

const MB = 1024 * 1024;

/** Same purpose rules as CSR_BE `engine/file-rules.ts`. */
export const MOCK_PURPOSE_RULES: Record<'evidence' | 'logo', { maxBytes: number; mimeTypes: string[] }> = {
  logo: { maxBytes: 2 * MB, mimeTypes: ['image/png', 'image/jpeg', 'image/svg+xml'] },
  evidence: {
    maxBytes: 50 * MB,
    mimeTypes: [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'image/png',
      'image/jpeg',
      'text/plain',
      'text/csv',
    ],
  },
};

/**
 * Names that make the mock act like the real checks, so every outcome can be tried in the browser:
 * `infected` → the scan quarantines it; `mismatch` → the content does not match the declared type.
 */
export const MOCK_INFECTED = /infected|eicar/i;
export const MOCK_MISMATCH = /mismatch/i;

/** The public shape (no workspace, no stored bytes). */
export function publicFile({ workspaceId: _w, body: _b, ...f }: MockFile): FilesControllerGet200 {
  return f;
}

export function summary(f: MockFile) {
  const { versions: _v, ...rest } = publicFile(f);
  return rest;
}

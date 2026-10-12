# Files (M14 · SD05 base)

> Spec: `docs/revamp/modules/M14-files-evidence.md` (§1–§9, §14.1) · Status: Draft · Wave: 1 · Backend: `CSR_BE/src/modules/files`

## Purpose

The upload, status and preview building blocks every feature uses for evidence, supplier documents, logos and imports: request an upload intent, send the file straight to Cloudinary with progress, wait for the server's verification (size, magic bytes, ClamAV), then show, preview or download it through a short-lived link. No feature talks to the storage provider any other way.

## Owns

- Routes: none in wave 1. `/projects/:pid/evidence` (evidence register, M14 §6) is added with the projects modules (M03/M04) as a route of this feature (planned).
- Namespace `files` (`src/locales/en/files.json`, planned): upload states, purpose hints ("PDF, DOCX … up to 50 MB"), scan results, errors.
- Query keys: the generated `files` hooks (`useFilesControllerGet`, … after `npm run api:sync`).

## Public surface (`index.ts`)

| Export (all planned)      | Used by                                                                                      |
| ------------------------- | -------------------------------------------------------------------------------------------- |
| `FileUploader`            | supplier-evidence add-document sheet and public request page, questionnaires, M04 evidence   |
| `FileStatusBadge`         | Any list showing a file: Scanning · Ready · Rejected · Blocked (icon + label)                |
| `FileListItem`            | Evidence lists: icon by type, name, size, version, scan badge, linked-to chips, download     |
| `FilePreviewSheet`        | supplier-evidence verification sheet, M05 review: sandboxed pdf.js preview                   |
| `useFileDownload(fileId)` | Download buttons: calls `GET /v1/files/:id/download`, follows the 302, never stores the URL  |
| `PURPOSE_HINTS`           | Display-only copy of the purpose table (types, max size) for dropzone hints; the API decides |

## Depends on

Generated `files` hooks and models; `src/components/ui` (`FileDropzone` primitive — planned, 02 §4 — `Sheet`, `Badge`, `StatusPill`, `Skeleton`, `ErrorState`); `src/lib/format.ts` (`Intl` byte sizes and dates). No other feature.

## Events

No domain events in the frontend. After `complete` and after the status reaches a final value, invalidate the file query key and the caller's list key (passed as `onSettled`).

## Components & behaviour

- `FileUploader` — wraps `FileDropzone` (multiple, drag-and-drop and a real `<button>` to browse; accepted types and max size from `PURPOSE_HINTS` as a hint only). Per file: `requesting` → `uploading` (progress bar with `aria-valuenow`, cancel) → `verifying` ("Scanning…", polls `GET /v1/files/:id` every 2 s, stops after 2 min with "Still scanning — we'll keep checking" and a refresh button) → `ready` | `rejected` (reason from the API: wrong type, size mismatch) | `quarantined` ("Blocked: malware found", no download) | `failed` (network/expired intent, Retry requests a new intent). Calls `onReady(fileId)` only for `ready`. Upload state announced through a polite live region; the file list is keyboard reachable, remove/cancel are buttons with names.
- `upload/direct-upload.ts` (feature-private) — the only code that sends bytes to the provider: `XMLHttpRequest` multipart POST of the intent's `url` + `fields` (Cloudinary) or PUT (local driver) for upload progress; then `POST /v1/files/:id/complete` with the provider's `{ publicId, version, signature }` through the generated hook. Never adds auth headers to the provider request; never logs URLs or fields.
- `FileStatusBadge` — icon + label, colour from status tokens, never colour alone.
- `FilePreviewSheet` — side `Sheet`; PDFs via pdf.js ≥ 4 (`isEvalSupported: false`) inside an iframe whose `sandbox` has no `allow-scripts`; images inline; other types show metadata + download. Loading skeleton, error with retry (a 410 shows "This link expired, open again").
- Motion (02 §9): progress fill uses `--motion-grow` once per file; status changes swap in place without animation; no entrance animation on the uploader; `prefers-reduced-motion` → final values only.

## Invariants

- Bytes go only to the URL of a server intent; no other `fetch`/XHR to storage; API calls only through generated hooks.
- The UI never decides that a file is safe: only `status = ready` from the API enables download and attach.
- CSP (`Caddyfile`): `connect-src` must allow `https://api.cloudinary.com` for uploads (planned change, lead).

## Tests

- `__tests__/file-uploader.test.tsx` (MSW + mocked XHR): happy path to `ready` (US-14-1), `rejected` message (US-14-2), `quarantined` without download (US-14-3), expired intent → Retry (US-14-7), keyboard and screen-reader names.
- `__tests__/file-preview-sheet.test.tsx`: sandbox attributes, 410 state (US-14-4).
- MSW handlers in `src/features/files/mocks.ts` (intents, complete, status progression, download 302), contract-checked.
- Story for `FileDropzone` in `src/components/ui` (light, dark, RTL); stories `files.stories.tsx` for the uploader states.

## Not here

Supplier document metadata, requests and verification (`supplier-evidence`), the evidence review scoring (M05), report generation (`dd-reporting`).

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_API_MOCKS?: string;
  /** Link to the terms & licence document; `{version}` is replaced with the version to accept (M01 §7.1). */
  readonly VITE_TERMS_URL?: string;
}

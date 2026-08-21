/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Absolute URL of the quote-submission API (see src/lib/ghlAdapter.ts).
   * Optional — falls back to a same-origin relative path when unset.
   */
  readonly VITE_QUOTE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// src/lib/seoImage.ts
import { SITE_URL } from './business';

/** Absolute, canonical-host image URL for OG/Twitter/JSON-LD use. */
export function canonicalImage(path: string): string {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

// src/lib/ghlAdapter.ts
import { CONSENT_VERSION, TRANSACTIONAL_CONSENT_TEXT, MARKETING_CONSENT_TEXT } from './consent';

export interface QuotePayload {
  serviceType: string;
  bedrooms: string;
  bathrooms: string;
  sqft: string;
  frequency: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  preferredDate: string;
  notes: string;
  smsTransactionalConsent: boolean;
  smsMarketingConsent: boolean;
}

export type QuoteSubmitResult = { ok: true } | { ok: false; error: string };

/**
 * Confirmed live-site behavior: cleaningbykandi.com is served by GHL, not
 * Vercel, so a same-origin relative fetch('/api/submit-quote') would hit
 * GHL (which doesn't have that path) and 404 — see docs/ARCHITECTURE.md
 * "Unresolved deployment requirement". VITE_QUOTE_API_URL lets the actual
 * deployed origin be configured at build time (set to the Vercel function's
 * absolute URL, e.g. https://cleaning-by-kandi.vercel.app/api/submit-quote,
 * once that's decided/deployed — see .env.example). Read lazily (not hoisted
 * to a module-level constant) so it reflects the environment at call time,
 * not just at first import.
 */
/**
 * TEMPORARY, until the Cloudflare DNS cutover.
 *
 * cleaningbykandi.com is still served by GoHighLevel, which loads this bundle
 * from Vercel but has no /api/submit-quote path of its own — so a relative URL
 * resolves against the GHL origin and fails. The default therefore addresses the
 * Vercel function directly. api/submit-quote.ts allows both cleaningbykandi.com
 * and www.cleaningbykandi.com as CORS origins so this cross-origin POST succeeds.
 *
 * AT DNS CUTOVER: set this back to '/api/submit-quote' so submissions go
 * same-origin. The absolute URL keeps working afterwards, but leaves every
 * submission needlessly cross-origin and dependent on the CORS allowlist.
 *
 * This is a plain constant rather than a build-time env var on purpose:
 * VITE_QUOTE_API_URL is inlined by Vite at build time, so when it was unset or
 * scoped to the wrong Vercel environment the bundle silently shipped a relative
 * path and the live form broke with no build error. The URL is not a secret, so
 * it belongs in code. VITE_QUOTE_API_URL still overrides it when set.
 */
const QUOTE_API_URL = 'https://cleaning-by-kandi.vercel.app/api/submit-quote';

function getQuoteApiUrl(): string {
  return import.meta.env.VITE_QUOTE_API_URL || QUOTE_API_URL;
}

/**
 * Posts a quote request to the configured quote API endpoint (see
 * getQuoteApiUrl above), which holds the GHL API key/location ID
 * server-side and upserts the contact via GHL's Contacts API. When
 * VITE_QUOTE_API_URL is unset, falls back to the same-origin relative path
 * — correct only when this frontend and /api/submit-quote are deployed
 * together on the same origin (e.g. a direct Vercel deployment, or local
 * `vercel dev`), not through the current GHL-fronted domain.
 */
export async function submitQuote(form: QuotePayload): Promise<QuoteSubmitResult> {
  try {
    const res = await fetch(getQuoteApiUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        consentTimestamp: new Date().toISOString(),
        consentVersion: CONSENT_VERSION,
        consentUrl: typeof window !== 'undefined' ? window.location.href : '',
        consentTextTransactional: form.smsTransactionalConsent ? TRANSACTIONAL_CONSENT_TEXT : '',
        consentTextMarketing: form.smsMarketingConsent ? MARKETING_CONSENT_TEXT : '',
      }),
    });
    if (!res.ok) {
      return { ok: false, error: `Request failed (${res.status}). Please try again or call us at (480) 309-7607.` };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: 'Network error. Please check your connection and try again, or call us at (480) 309-7607.' };
  }
}

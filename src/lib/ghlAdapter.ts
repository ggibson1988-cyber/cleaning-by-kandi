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
 * Posts a quote request to our own /api/submit-quote edge function, which
 * holds the GHL API key/location ID server-side and upserts the contact via
 * GHL's Contacts API. This is a same-origin relative path on purpose — it
 * works as long as /api/submit-quote is deployed alongside the frontend and
 * reachable at that same origin (see docs/ARCHITECTURE.md
 * "Form integration contract" for the current status of that deployment).
 */
export async function submitQuote(form: QuotePayload): Promise<QuoteSubmitResult> {
  try {
    const res = await fetch('/api/submit-quote', {
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

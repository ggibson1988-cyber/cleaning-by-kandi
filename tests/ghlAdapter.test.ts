// tests/ghlAdapter.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { submitQuote, type QuotePayload } from '../src/lib/ghlAdapter';

const FORM: QuotePayload = {
  serviceType: 'Residential Cleaning',
  bedrooms: '3',
  bathrooms: '2',
  sqft: '1800',
  frequency: 'Weekly',
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane@example.com',
  phone: '4805551234',
  city: 'Surprise',
  address: '123 Main St',
  preferredDate: '',
  notes: '',
  smsTransactionalConsent: false,
  smsMarketingConsent: false,
};

describe('submitQuote — URL selection', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true }), { status: 200 })));
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it('falls back to the same-origin relative path when VITE_QUOTE_API_URL is unset', async () => {
    vi.stubEnv('VITE_QUOTE_API_URL', '');
    await submitQuote(FORM);
    const [url] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toBe('/api/submit-quote');
  });

  it('uses the configured VITE_QUOTE_API_URL when set', async () => {
    vi.stubEnv('VITE_QUOTE_API_URL', 'https://cleaning-by-kandi.vercel.app/api/submit-quote');
    await submitQuote(FORM);
    const [url] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toBe('https://cleaning-by-kandi.vercel.app/api/submit-quote');
  });
});

describe('submitQuote — failure behavior', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns ok:true on a 2xx response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true }), { status: 200 })));
    const result = await submitQuote(FORM);
    expect(result).toEqual({ ok: true });
  });

  it('returns a retryable ok:false on a non-2xx response, without leaking response body detail', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ error: 'internal detail' }), { status: 500 })));
    const result = await submitQuote(FORM);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/try again|call us/i);
      expect(result.error).not.toContain('internal detail');
    }
  });

  it('returns a retryable ok:false on a network failure (fetch rejects)', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
    const result = await submitQuote(FORM);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/network|try again|call us/i);
    }
  });
});

// tests/submit-quote-contract.test.ts
//
// Locks the outbound GoHighLevel request contract. tests/ghlAdapter.test.ts and
// tests/form.test.tsx cover the browser -> /api/submit-quote hop; this file covers
// the /api/submit-quote -> GHL hop, which is the half that actually creates the
// lead. Every custom-field key below must exist on the live GHL sub-account with
// exactly this spelling, or the value silently lands nowhere.
import { describe, it, expect, beforeEach, vi } from 'vitest';
import handler from '../api/submit-quote';

const FULL_SUBMISSION = {
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane@example.com',
  phone: '(480) 555-0147',
  address: '123 W Test Rd',
  city: 'Peoria',
  serviceType: 'Deep Clean',
  bedrooms: '3',
  bathrooms: '2',
  sqft: '1800',
  frequency: 'Monthly',
  preferredDate: '2026-09-15',
  notes: 'Two cats, gate code 1234.',
  smsTransactionalConsent: true,
  smsMarketingConsent: true,
  consentVersion: '2026-08-09',
  consentUrl: 'https://cleaningbykandi.com/request-quote',
  consentTimestamp: '2026-08-28T12:00:00.000Z',
  consentTextTransactional: 'transactional copy',
  consentTextMarketing: 'marketing copy',
};

let fetchMock: ReturnType<typeof vi.fn>;

function submit(body: Record<string, unknown>, ip: string) {
  return handler(
    new Request('https://cleaningbykandi.com/api/submit-quote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': `${ip}, 70.41.3.18`,
        'user-agent': 'Mozilla/5.0 (TestRunner)',
      },
      body: JSON.stringify(body),
    })
  );
}

/** The JSON body the handler actually sent to GHL. */
function sentToGhl() {
  const [, init] = fetchMock.mock.calls[0];
  return JSON.parse(init.body);
}

function fieldValue(key: string) {
  const body = sentToGhl();
  const match = body.customFields.find((f: { key: string }) => f.key === key);
  expect(match, `custom field "${key}" was not sent to GHL`).toBeDefined();
  return match.field_value;
}

describe('api/submit-quote -> GoHighLevel request contract', () => {
  beforeEach(() => {
    process.env.GHL_API_KEY = 'test-key';
    process.env.GHL_LOCATION_ID = 'test-location';
    fetchMock = vi.fn(async () => new Response(JSON.stringify({ ok: true }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
  });

  it('posts to the GHL contacts upsert endpoint with auth and API version headers', async () => {
    const res = await submit(FULL_SUBMISSION, '203.0.113.40');
    expect(res.status).toBe(200);

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://services.leadconnectorhq.com/contacts/upsert');
    expect(init.method).toBe('POST');
    expect(init.headers.Authorization).toBe('Bearer test-key');
    expect(init.headers.Version).toBe('2021-07-28');
  });

  it('maps the standard contact fields', async () => {
    await submit(FULL_SUBMISSION, '203.0.113.41');
    expect(sentToGhl()).toMatchObject({
      locationId: 'test-location',
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      phone: '(480) 555-0147',
      address1: '123 W Test Rd',
      city: 'Peoria',
      source: 'public api',
    });
  });

  it('sends every quote custom field under its exact GHL key', async () => {
    await submit(FULL_SUBMISSION, '203.0.113.42');
    expect(fieldValue('service_type')).toBe('Deep Clean');
    expect(fieldValue('bedrooms')).toBe('3');
    expect(fieldValue('bathrooms')).toBe('2');
    expect(fieldValue('square_footage')).toBe('1800');
    expect(fieldValue('cleaning_frequency')).toBe('Monthly');
    expect(fieldValue('preferred_date')).toBe('2026-09-15');
    expect(fieldValue('job_description')).toBe('Two cats, gate code 1234.');
  });

  it('sends the full consent-evidence record', async () => {
    await submit(FULL_SUBMISSION, '203.0.113.43');
    expect(fieldValue('sms_transactional_consent')).toBe('true');
    expect(fieldValue('sms_marketing_consent')).toBe('true');
    expect(fieldValue('consent_version')).toBe('2026-08-09');
    expect(fieldValue('consent_url')).toBe('https://cleaningbykandi.com/request-quote');
    expect(fieldValue('consent_timestamp')).toBe('2026-08-28T12:00:00.000Z');
    expect(fieldValue('consent_text__transactional')).toBe('transactional copy');
    expect(fieldValue('consent_text__marketing')).toBe('marketing copy');
  });

  it('captures consent IP and user agent server-side, ignoring client-supplied values', async () => {
    await submit(
      { ...FULL_SUBMISSION, consentIp: '9.9.9.9', consentUserAgent: 'spoofed' },
      '203.0.113.44'
    );
    // First hop of x-forwarded-for, not the spoofed body value.
    expect(fieldValue('consent_ip')).toBe('203.0.113.44');
    expect(fieldValue('consent_user_agent')).toBe('Mozilla/5.0 (TestRunner)');
  });

  it('tags the contact for routing, including per-consent tags', async () => {
    await submit(FULL_SUBMISSION, '203.0.113.45');
    expect(sentToGhl().tags).toEqual([
      'Website Quote Request',
      'Service: Deep Clean',
      'sms-transactional-ok',
      'sms-marketing-ok',
    ]);
  });

  it('omits consent tags and records false when consent is not given', async () => {
    await submit(
      { ...FULL_SUBMISSION, smsTransactionalConsent: false, smsMarketingConsent: false },
      '203.0.113.46'
    );
    expect(sentToGhl().tags).toEqual(['Website Quote Request', 'Service: Deep Clean']);
    expect(fieldValue('sms_transactional_consent')).toBe('false');
    expect(fieldValue('sms_marketing_consent')).toBe('false');
  });

  it('defaults an empty preferred date to "Flexible" so the field is never blank', async () => {
    await submit({ ...FULL_SUBMISSION, preferredDate: '' }, '203.0.113.47');
    expect(fieldValue('preferred_date')).toBe('Flexible');
  });

  it('never returns upstream GHL error detail to the caller', async () => {
    fetchMock.mockResolvedValueOnce(
      new Response('locationId is invalid; token abc123 rejected', { status: 401 })
    );
    const res = await submit(FULL_SUBMISSION, '203.0.113.48');
    expect(res.status).toBe(500);
    const body = await res.text();
    expect(body).not.toMatch(/abc123|locationId is invalid/);
  });

  it('does not call GHL at all when credentials are missing', async () => {
    delete process.env.GHL_API_KEY;
    const res = await submit(FULL_SUBMISSION, '203.0.113.49');
    expect(res.status).toBe(500);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

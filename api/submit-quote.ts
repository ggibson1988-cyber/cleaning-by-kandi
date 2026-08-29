/**
 * Server-side counterpart to `submitQuote()` in `src/lib/ghlAdapter.ts`. The
 * frontend POSTs here (same-origin, relative `/api/submit-quote`) with the
 * quote form fields plus consent metadata; this handler holds the GHL API
 * key/location ID (server-side only, via GHL_API_KEY / GHL_LOCATION_ID env
 * vars — see .env.example) and upserts the contact via GHL's Contacts API.
 */
export const config = { runtime: 'edge' };

/**
 * The public site is reachable at both the apex and the www host, and a browser
 * sends whichever one the page was loaded from. A response can name only ONE
 * origin, so reflect the caller's when it is on the allowlist rather than
 * hardcoding one host (which would break the other) or '*' (which would let any
 * site post leads into the CRM).
 */
const ALLOWED_ORIGINS = new Set([
  'https://cleaningbykandi.com',
  'https://www.cleaningbykandi.com',
]);

function corsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get('origin') ?? '';
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.has(origin) ? origin : 'https://cleaningbykandi.com',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    // Without this a shared cache could hand one origin's header to the other.
    'Vary': 'Origin',
  };
}

/**
 * Best-effort per-IP rate limit: 5 submissions per 10 minutes. This is an
 * in-memory sliding window scoped to a single warm edge instance — it resets
 * on cold start and is not shared across concurrent instances/regions, so it
 * does not provide a precise or durable global limit. It exists to blunt
 * naive scripted abuse (repeated calls from one instance) cheaply, without a
 * new dependency or external service. A real limit (Vercel KV/Upstash-backed,
 * or a challenge like Turnstile) needs a product decision + credentials this
 * pass didn't have — see docs/DEPLOYMENT.md.
 */
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  if (!ip) return false;
  const now = Date.now();
  const timestamps = (requestLog.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (timestamps.length >= RATE_LIMIT_MAX) {
    requestLog.set(ip, timestamps);
    return true;
  }
  timestamps.push(now);
  requestLog.set(ip, timestamps);
  return false;
}

export default async function handler(req: Request): Promise<Response> {
  const CORS = corsHeaders(req);

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS });
  }
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: CORS });
  }

  const requestIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '';
  if (isRateLimited(requestIp)) {
    return new Response(
      JSON.stringify({ error: 'Too many requests. Please try again later.' }),
      { status: 429, headers: CORS }
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const env = (globalThis as any).process?.env as Record<string, string | undefined> | undefined;
  const apiKey = env?.GHL_API_KEY;
  const locationId = env?.GHL_LOCATION_ID;
  if (!apiKey || !locationId) {
    return new Response(JSON.stringify({ error: 'Server misconfiguration' }), { status: 500, headers: CORS });
  }

  let data: Record<string, string | boolean>;
  try {
    data = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers: CORS });
  }

  const str = (v: unknown) => (typeof v === 'string' ? v : '');
  const smsTransactionalConsent = data.smsTransactionalConsent === true;
  const smsMarketingConsent = data.smsMarketingConsent === true;

  // Captured server-side, not trusted from the client. Reuses the IP already
  // extracted above for rate limiting.
  const consentIp = requestIp;
  const consentUserAgent = req.headers.get('user-agent') || '';

  const customFields = [
    { key: 'service_type', field_value: str(data.serviceType) },
    { key: 'bedrooms', field_value: str(data.bedrooms) },
    { key: 'bathrooms', field_value: str(data.bathrooms) },
    { key: 'square_footage', field_value: str(data.sqft) },
    { key: 'cleaning_frequency', field_value: str(data.frequency) },
    { key: 'preferred_date', field_value: str(data.preferredDate) || 'Flexible' },
    { key: 'job_description', field_value: str(data.notes) },
    { key: 'sms_transactional_consent', field_value: smsTransactionalConsent ? 'true' : 'false' },
    { key: 'sms_marketing_consent', field_value: smsMarketingConsent ? 'true' : 'false' },
    { key: 'consent_version', field_value: str(data.consentVersion) },
    { key: 'consent_url', field_value: str(data.consentUrl) },
    { key: 'consent_timestamp', field_value: str(data.consentTimestamp) },
    { key: 'consent_ip', field_value: consentIp },
    { key: 'consent_user_agent', field_value: consentUserAgent },
    { key: 'consent_text__transactional', field_value: str(data.consentTextTransactional) },
    { key: 'consent_text__marketing', field_value: str(data.consentTextMarketing) },
  ];

  const tags = ['Website Quote Request', `Service: ${str(data.serviceType) || 'unknown'}`];
  if (smsTransactionalConsent) tags.push('sms-transactional-ok');
  if (smsMarketingConsent) tags.push('sms-marketing-ok');

  const contact = {
    locationId,
    firstName: str(data.firstName),
    lastName: str(data.lastName),
    email: str(data.email),
    phone: str(data.phone),
    address1: str(data.address),
    city: str(data.city),
    tags,
    source: 'public api',
    customFields,
  };

  const ghlRes = await fetch('https://services.leadconnectorhq.com/contacts/upsert', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'Version': '2021-07-28',
    },
    body: JSON.stringify(contact),
  });

  if (!ghlRes.ok) {
    const text = await ghlRes.text().catch(() => '');
    // Log the upstream error detail server-side only — never return it to the
    // client, which could leak internal GHL error detail to an untrusted caller.
    console.error(`GHL upsert failed: ${ghlRes.status} ${text}`);
    return new Response(
      JSON.stringify({ error: 'Unable to submit at this time. Please try again or call us.' }),
      { status: 500, headers: CORS }
    );
  }

  return new Response(JSON.stringify({ success: true }), { status: 200, headers: CORS });
}

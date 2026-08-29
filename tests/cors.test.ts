// tests/cors.test.ts
//
// The public site answers on both the apex and the www host, and the browser
// sends whichever origin the page was loaded from. A response can name only one
// origin, so the handler reflects the caller's when allowed. These tests pin
// that both hosts work and that nothing else does — the endpoint writes into a
// live CRM, so an over-permissive allowlist would let any site create contacts.
import { describe, it, expect, beforeEach, vi } from 'vitest';
import handler from '../api/submit-quote';

function preflight(origin?: string) {
  const headers: Record<string, string> = { 'Access-Control-Request-Method': 'POST' };
  if (origin) headers.Origin = origin;
  return handler(new Request('https://cleaning-by-kandi.vercel.app/api/submit-quote', {
    method: 'OPTIONS',
    headers,
  }));
}

describe('CORS allowlist', () => {
  beforeEach(() => {
    process.env.GHL_API_KEY = 'k';
    process.env.GHL_LOCATION_ID = 'l';
    vi.stubGlobal('fetch', vi.fn(async () => new Response('{}', { status: 200 })));
  });

  it('allows the apex origin', async () => {
    const res = await preflight('https://cleaningbykandi.com');
    expect(res.status).toBe(204);
    expect(res.headers.get('access-control-allow-origin')).toBe('https://cleaningbykandi.com');
  });

  it('allows the www origin', async () => {
    const res = await preflight('https://www.cleaningbykandi.com');
    expect(res.status).toBe(204);
    expect(res.headers.get('access-control-allow-origin')).toBe('https://www.cleaningbykandi.com');
  });

  it('never answers with a wildcard', async () => {
    for (const o of ['https://cleaningbykandi.com', 'https://www.cleaningbykandi.com', 'https://evil.example']) {
      const res = await preflight(o);
      expect(res.headers.get('access-control-allow-origin')).not.toBe('*');
    }
  });

  it('does not reflect an origin that is not on the allowlist', async () => {
    const res = await preflight('https://evil.example');
    expect(res.headers.get('access-control-allow-origin')).not.toBe('https://evil.example');
  });

  it('sets Vary: Origin so caches cannot cross the two hosts', async () => {
    const res = await preflight('https://www.cleaningbykandi.com');
    expect(res.headers.get('vary')).toMatch(/Origin/i);
  });

  it('carries the CORS headers on real POST responses too, not just preflight', async () => {
    const res = await handler(new Request('https://cleaning-by-kandi.vercel.app/api/submit-quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: 'https://www.cleaningbykandi.com', 'x-forwarded-for': '203.0.113.77' },
      body: JSON.stringify({ firstName: 'Jane', email: 'jane@example.com' }),
    }));
    expect(res.headers.get('access-control-allow-origin')).toBe('https://www.cleaningbykandi.com');
  });
});

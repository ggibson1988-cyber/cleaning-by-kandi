// tests/submit-quote.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import handler from '../api/submit-quote';

function postFrom(ip: string, body: Record<string, unknown> = { firstName: 'Test' }) {
  return handler(
    new Request('https://cleaningbykandi.com/api/submit-quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-forwarded-for': ip },
      body: JSON.stringify(body),
    })
  );
}

describe('api/submit-quote rate limiting', () => {
  beforeEach(() => {
    process.env.GHL_API_KEY = 'test-key';
    process.env.GHL_LOCATION_ID = 'test-location';
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(JSON.stringify({ ok: true }), { status: 200 }))
    );
  });

  it('allows up to the limit, then returns 429 for the same IP', async () => {
    const ip = '203.0.113.10';
    for (let i = 0; i < 5; i++) {
      const res = await postFrom(ip);
      expect(res.status).toBe(200);
    }
    const limited = await postFrom(ip);
    expect(limited.status).toBe(429);
    const payload = await limited.json();
    expect(payload.error).toMatch(/too many requests/i);
  });

  it('does not rate-limit a different IP', async () => {
    for (let i = 0; i < 5; i++) {
      await postFrom('198.51.100.20');
    }
    const res = await postFrom('198.51.100.21');
    expect(res.status).toBe(200);
  });
});

# Deployment

This document covers building and verifying the site locally. **Nothing in this repo has been
deployed anywhere by this branch.** Cloudflare hosting was investigated in an earlier revision of
this document and this branch's work — that was a mistake; Cloudflare Workers/Pages were never an
approved hosting target and all Cloudflare-specific configuration has been removed. See
`docs/ARCHITECTURE.md` for the corrected current production architecture (GoHighLevel-hosted
domain, Vercel-built frontend) and the unresolved GHL/Vercel delivery design that blocks any real
staging or production migration.

## Local development

```bash
npm ci
npm run dev
```

Runs Vite's dev server with HMR. Uses the SPA history fallback (`appType: 'spa'` in dev mode), so
refreshing on a sub-route like `/services` works locally even though nothing is prerendered yet.

## Full build

```bash
npm run build
```

This chains, in order (see `package.json`):

1. `tsc -b` — typecheck, no emit.
2. `vite build` (`build:client`) — client bundle, hashed filenames, `dist/`.
3. `vite build --ssr src/entry-server.tsx --outDir dist-ssr` (`build:ssr`) — server-render entry,
   output to `dist-ssr/entry-server.js`.
4. `node scripts/prerender.mjs` (`prerender`) — imports `dist-ssr/entry-server.js`, server-renders
   each of the 7 public routes from `src/lib/routes.ts`, injects per-route `<head>` metadata and
   JSON-LD, and writes `dist/<route>/index.html` for each plus `dist/404.html`.
5. `node scripts/generate-sitemap.mjs` (`sitemap`) — writes `dist/sitemap.xml` from the same route
   registry, so it can never drift from the actual set of routes being served.

Output: a fully static `dist/` directory — real per-route HTML, hashed JS/CSS, optimized images,
sitemap, and a real 404 page. No server render happens at request time, and none of this build
pipeline is tied to any specific hosting platform.

## Verification

```bash
npm run test            # Vitest — routes, JSON-LD, form, contrast
npm run verify:static   # cheerio-based assertions against the built dist/ output
npm run lint             # oxlint
```

`npm run test` runs the automated suite (`tests/`) — per-route rendering, LocalBusiness JSON-LD
shape, the GHL form adapter (fully mocked `fetch`, no real network calls), and computed contrast
ratios for the token pairs fixed in this plan. `npm run verify:static` must run **after**
`npm run build` — it inspects the actual `dist/` output on disk (canonical URLs, H1s, JSON-LD,
sitemap completeness) rather than the React source, catching build-pipeline regressions that
unit tests against source alone wouldn't.

## Local preview (generic, not tied to any hosting platform)

```bash
npm run preview
```

Vite's own build-preview server. Useful for a quick sanity check that the build serves and that
unmatched paths get a real 404 (`appType: 'mpa'` in preview mode disables the SPA fallback) — but
it has a known limitation: **Vite's bundled preview server can't resolve an extensionless
nested-route request like `/about` to `dist/about/index.html` without a trailing slash** (a
limitation of Vite's own static-file middleware, not a bug in this repo's output —
`/about/` serves correctly). This means `npm run preview` **cannot** be used to verify that the
canonical no-trailing-slash URLs (`/about`, as used throughout this codebase's sitemap, JSON-LD,
and OG tags) will actually return HTTP 200 in production — see `docs/ARCHITECTURE.md`'s
"Route/canonical limitation" section. That verification requires the real (or a faithful
equivalent of the real) production hosting layer, which is not yet decided.

## Staging deployment prerequisites — none of this is done yet

Getting this branch onto a real staging environment requires, at minimum:

1. **A GHL/Vercel delivery design** — see `docs/ARCHITECTURE.md`'s "Unresolved deployment
   requirement" section for the exact open questions. This is the primary blocker; nothing below
   can be meaningfully verified until this is decided.
2. **Confirmation that `/api/submit-quote` (a Vercel Edge Function) is reachable from wherever
   the production frontend is actually served**, and that `GHL_API_KEY`/`GHL_LOCATION_ID` are set
   as real Vercel environment variables — never committed to the repo. `.env.example` documents
   the variable names only.
3. **Real GHL credentials and field-mapping confirmation** against the live GHL sub-account (see
   `docs/ARCHITECTURE.md`'s "Open questions for the owner," item 3).
4. **Rate limiting and/or bot protection on `/api/submit-quote`.** This is a public lead-capture
   endpoint with no abuse protection today. Every successful call fires real GHL workflows
   (contact creation, owner notification), so an unprotected endpoint is a spam/abuse vector once
   live. Adding this requires product decisions and credentials not available during this work.

A Vercel preview deployment of just the frontend, on its own, would **not** answer item 1 above
— it would only demonstrate that the React app itself builds and runs; it says nothing about how
GHL would route real production traffic to it. It is not presented here as a substitute for
deciding the delivery design.

## Rollback

This work exists only on the local branch `feature/seo-foundation-cloudflare` and has not been
pushed, merged, or deployed anywhere. "Rollback," for this branch, currently just means: don't
merge or deploy it.

A real rollback procedure for a production migration cannot be written until the delivery design
(item 1 above) exists — rollback mechanics depend entirely on what mechanism ends up connecting
GHL to this frontend.

## What's intentionally unresolved

- 2 of the "Open questions for the owner" in `docs/ARCHITECTURE.md` remain open: real GHL
  credentials + field-mapping confirmation, and real business hours. (Organization
  Services/Eco-Friendly Cleaning status, `priceRange`, and the service-area list mismatch were
  resolved 2026-08-20; see that section for details. `/cleaning-tips` is not part of the current
  website and is no longer tracked here.)
- The full GHL/Vercel delivery design described in `docs/ARCHITECTURE.md`'s "Unresolved
  deployment requirement" section.
- A per-IP, in-memory rate limit was added to `/api/submit-quote` (see that file), but it resets
  on every cold start and is not shared across concurrent edge instances/regions — it is a
  best-effort stopgap, not a durable or precise limit. It also includes no CAPTCHA/challenge-based
  bot protection. A real solution (e.g. Vercel KV/Upstash-backed limiting, or a challenge like
  Turnstile) needs a product decision and credentials neither of which this pass had.

None of these block building, testing, or locally previewing the static site — all of them block
treating this branch as production-ready.

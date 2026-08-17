# Deployment

This document covers building, verifying, and previewing the site locally, and what's still
needed before it can actually be deployed to Cloudflare. **Nothing in this repo has been
deployed** — see "What's intentionally unresolved" below.

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
sitemap, and a real 404 page. No server render happens at request time.

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

## Local Cloudflare preview

```bash
npm run preview:cf
```

Runs `npm run build` followed by `wrangler dev`, which serves the built `dist/` directory through
Cloudflare's local Workers runtime emulation, reading `wrangler.jsonc` directly. This is
**localhost only** — no Cloudflare account, API token, or network deployment involved. Use it to
confirm asset routing behavior (trailing-slash handling, 404s) matches what a real Cloudflare
deployment would do, before anything is actually deployed.

Plain `npm run preview` (Vite's own build-preview server, separate from `preview:cf`) is still
useful for a quick sanity check that the build serves and that unmatched paths get a real 404 —
but it does not replicate Cloudflare's trailing-slash canonicalization. Vite's bundled preview
server can't resolve an extensionless nested-route request like `/about` to `dist/about/index.html`
without a trailing slash (a limitation of Vite's own static-file middleware, not a bug in this
repo's output — `/about/` serves correctly there). For verifying canonical no-trailing-slash URLs
like `/about`, use `npm run preview:cf`, which exercises `wrangler.jsonc`'s
`html_handling: "drop-trailing-slash"` the way a real Cloudflare deployment would.

## Staging deployment prerequisites — none of this is done yet

Getting this branch onto an actual Cloudflare staging environment requires all of the following,
none of which this plan/branch performs:

1. **A Cloudflare account and API token** available to whoever runs `wrangler deploy`, or a
   Cloudflare Pages project connected to this repo's remote for git-based deploys. Neither
   exists yet from this branch's perspective.
2. **`GHL_API_KEY` and `GHL_LOCATION_ID` set as Cloudflare secrets** — never committed to the
   repo, never placed in `wrangler.jsonc`. `.env.example` documents the variable names only.
3. **A DNS/staging-subdomain decision.** This plan does not touch `cleaningbykandi.com` DNS at
   all — that's a separate, explicit decision for whoever owns the domain, made outside this
   branch.
4. **A Cloudflare-Worker-shaped rewrite of the quote-form API handler — blocking, not optional.**
   `api/submit-quote.ts` is currently written in Vercel's Edge Function convention
   (`export const config = { runtime: 'edge' }`, default-exported `handler(req: Request)`,
   reading secrets via `process.env`-style access). This project's `wrangler.jsonc` uses the
   **Workers static-assets model** (not Cloudflare Pages/Pages Functions — a different product
   with a different config surface). A prior draft of this document described the remedy in terms
   of Pages Functions (`functions/api/submit-quote.ts`, `onRequestPost(context)`,
   `context.env.GHL_API_KEY`); that was incorrect for this project and has been corrected below.
   **A Workers project serving static assets handles API routes via the Worker's own script entry
   point** — declared with a top-level `main` field in `wrangler.jsonc` (for example
   `"main": "src/worker.ts"`) — whose default export is a `fetch(request, env, ctx)` handler, not
   via a `functions/` directory (that convention is Pages-specific and isn't read by a Workers
   project at all). Per Cloudflare's current static-assets routing docs, a request that doesn't
   match a file in the assets directory is passed to that `fetch` handler by default when a
   `main` script is configured; the Worker can handle it directly or defer to
   `env.ASSETS.fetch(request)` for anything it doesn't own. The existing file **will not run
   unmodified** on this Workers setup — the quote form's server-side submission path is currently
   Vercel-only. This rewrite was deliberately not done as part of this plan (production-critical
   form/consent code, out of this plan's scope per its own stop conditions — see
   `docs/ARCHITECTURE.md`'s "Form integration contract and known blocker" section for full detail,
   including the exact migration shape) and must happen, and be verified against a real GHL
   sub-account, before staging is meaningfully usable for testing the quote flow. The exact
   Workers routing config (`main`, `assets.binding`, and whether `run_worker_first` is needed)
   should be re-verified against Cloudflare's current documentation immediately before
   implementing — this is a fast-moving part of the platform.
5. **Rate limiting and/or bot protection on `/api/submit-quote`.** This is a public lead-capture
   endpoint with no abuse protection today — no rate limiting, no CAPTCHA/Turnstile challenge.
   Every successful call fires real GHL workflows (contact creation, owner notification), so an
   unprotected endpoint is a spam/abuse vector once this is actually deployed. Adding this
   requires product decisions (which mechanism, what thresholds) and credentials (for example a
   Cloudflare Turnstile site key from the dashboard) that weren't available during this fix wave,
   so it was deliberately not implemented — but it should be added before real deployment.

Until all five of the above are addressed, "deploy to Cloudflare" means, at most, pushing static
pages live with a non-functional (or unprotected) quote form.

## Rollback

This work exists only on the local branch `feature/seo-foundation-cloudflare` and has not been
pushed, merged, or deployed anywhere. "Rollback," for this branch, currently just means: don't
merge or deploy it.

Once something is actually staged on Cloudflare Pages, rollback would mean reverting to the prior
Cloudflare Pages deployment via the Cloudflare dashboard or API (Cloudflare Pages keeps prior
deployments and supports promoting an older one back to the active alias) — an action taken
outside this repo, not covered here since nothing has been deployed yet.

## What's intentionally unresolved

- The 6 "Open questions for the owner" listed in `docs/ARCHITECTURE.md` (Organization
  Services/Eco-Friendly Cleaning status, `priceRange`, `/cleaning-tips` resolution, real GHL
  credentials + field-mapping confirmation, real business hours, and the service-area list
  mismatch between `SERVICE_AREAS`/JSON-LD and the visible `/service-areas` page content).
- The Cloudflare Worker rewrite of `api/submit-quote.ts` described above.
- Rate limiting and/or Turnstile bot protection on `/api/submit-quote`, described above.

None of these block building, testing, or locally previewing the static site — all of them block
treating a Cloudflare deployment of this branch as production-ready.

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
2. `vite build` (`build:client`) — client bundle, `dist/`. The entry JS/CSS are pinned to stable
   filenames (`assets/cbk.js`, `assets/cbk.css` — see `vite.config.ts`) so production's GHL page,
   which hardcodes those paths via `<script>`/`<link>` tags, keeps working across rebuilds;
   everything else (code-split chunks, images) keeps normal content-hashed filenames.
3. `vite build --ssr src/entry-server.tsx --outDir dist-ssr` (`build:ssr`) — server-render entry,
   output to `dist-ssr/entry-server.js`.
4. `node scripts/prerender.mjs` (`prerender`) — imports `dist-ssr/entry-server.js`, server-renders
   each of the 7 public routes from `src/lib/routes.ts`, injects per-route `<head>` metadata and
   JSON-LD, and writes `dist/<route>/index.html` for each plus `dist/404.html`.
5. `node scripts/generate-sitemap.mjs` (`sitemap`) — writes `dist/sitemap.xml` from the same route
   registry, so it can never drift from the actual set of routes being served.

Output: a fully static `dist/` directory — real per-route HTML, stable-named entry JS/CSS with
hashed supporting assets, optimized images, sitemap, and a real 404 page. No server render happens
at request time, and none of this build pipeline is tied to any specific hosting platform.

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

Two of the code-side blockers to a GHL/Vercel delivery design are now resolved (2026-08-20):

- The client build emits stable `assets/cbk.js`/`assets/cbk.css` filenames, matching what
  production's GHL page already hardcodes — see "Full build" above and
  `docs/ARCHITECTURE.md`'s "Unresolved deployment requirement," item 5.
- `src/lib/ghlAdapter.ts`'s quote submission now reads a configurable `VITE_QUOTE_API_URL`
  instead of assuming a same-origin relative path — see `docs/ARCHITECTURE.md`'s "Form
  integration contract."

Neither of these deploys anything or configures GHL — they only mean the pieces GHL will need to
reference (a stable bundle, a real API URL to point at) exist and are ready to be wired up. See
"Remaining GHL-admin work" below for what's still actually undone.

Getting this branch onto a real staging environment requires, at minimum:

1. **The remaining GHL-admin work below** — this is the primary blocker; nothing else here can be
   meaningfully verified until it's done.
2. **Set `VITE_QUOTE_API_URL` to the real deployed function URL** (e.g.
   `https://cleaning-by-kandi.vercel.app/api/submit-quote`) as a Vercel build-time environment
   variable, and confirm `/api/submit-quote` is actually reachable at that URL from production.
   `GHL_API_KEY`/`GHL_LOCATION_ID` must also be set as real (server-side only) Vercel environment
   variables — never committed to the repo. `.env.example` documents all three variable names
   only, with no real values.
3. **Real GHL credentials and field-mapping confirmation** against the live GHL sub-account (see
   `docs/ARCHITECTURE.md`'s "Open questions for the owner," item 3).
4. **Rate limiting and/or bot protection on `/api/submit-quote`** beyond the best-effort per-IP
   limit already added (see "What's intentionally unresolved" below) — a durable, cross-instance
   solution (Vercel KV/Upstash, or a challenge like Turnstile) needs a product decision and
   credentials not available during this work.

A Vercel preview deployment of just the frontend, on its own, would **not** answer item 1 above
— it would only demonstrate that the React app itself builds and runs; it says nothing about how
GHL would route real production traffic to it. It is not presented here as a substitute for
doing that GHL-admin work.

## Remaining GHL-admin work

This is GHL dashboard/admin configuration, not a code change — nothing in this repo can do it.
None of it has been done:

1. Create/configure the six clean GHL paths (`/about`, `/services`, `/service-areas`,
   `/request-quote`, `/privacy`, `/terms`) — today they all 404 in production (verified directly
   against the live site).
2. Load the stable Vercel `cbk.js`/`cbk.css` files (see "Full build" above) on each of those
   pages, the same way the current GHL homepage already does.
3. Verify pathname routing — that each canonical no-trailing-slash URL (e.g. `/about`, not
   `/about/`) actually returns HTTP 200 with the intended page content once configured (see
   `docs/ARCHITECTURE.md`'s "Route/canonical limitation").
4. Configure each page's metadata (title, description, canonical, OG/Twitter tags) in GHL to
   match `src/lib/routes.ts` — or confirm GHL will pass through this build's own prerendered
   `<head>` content instead of overriding it.
5. Verify GHL's sitemap includes the six configured paths — production's current
   `/sitemap.xml` is a live, empty `<urlset>` (confirmed by direct fetch), not this branch's
   generated one.
6. Test the real GHL field mapping and workflow end-to-end (contact creation, tagging, owner
   notification) against the live GHL sub-account — see `docs/ARCHITECTURE.md`'s "Open questions
   for the owner," item 3, for the specific custom-field keys this code assumes.
7. Document the actual rollback procedure once the delivery mechanism above is chosen — it can't
   be written generically; it depends entirely on what that mechanism turns out to be (see
   "Rollback" below).

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
  deployment requirement" section — two of its seven questions have code-side groundwork now
  (stable entry filenames; a configurable quote API URL), but none of the actual GHL-admin
  configuration work in "Remaining GHL-admin work" above has been done.
- A per-IP, in-memory rate limit was added to `/api/submit-quote` (see that file), but it resets
  on every cold start and is not shared across concurrent edge instances/regions — it is a
  best-effort stopgap, not a durable or precise limit. It also includes no CAPTCHA/challenge-based
  bot protection. A real solution (e.g. Vercel KV/Upstash-backed limiting, or a challenge like
  Turnstile) needs a product decision and credentials neither of which this pass had.

None of these block building, testing, or locally previewing the static site — all of them block
treating this branch as production-ready.

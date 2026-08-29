# Deployment

This document covers building, verifying, and deploying the site.

> **Updated 2026-08-28 — hosting decided.** `cleaningbykandi.com` is being cut over from
> GoHighLevel to **Vercel**, which serves this branch's prerendered static output directly. See
> "Vercel deployment" below for the live procedure, and `docs/ARCHITECTURE.md`'s "Hosting
> decision, 2026-08-28" for the rationale. Sections describing GHL-admin work are superseded and
> marked as such.

Historical note: **nothing in this repo had been deployed anywhere by this branch as of 2026-08-21.** Cloudflare hosting was investigated in an earlier revision of
this document and this branch's work — that was a mistake; Cloudflare Workers/Pages were never an
approved hosting target and all Cloudflare-specific configuration has been removed. See
`docs/ARCHITECTURE.md` for the corrected current production architecture (GoHighLevel-hosted
domain, Vercel-built frontend) and the unresolved GHL/Vercel delivery design that blocks any real
staging or production migration.

## Vercel deployment

The project deploys as a **static site plus one Edge Function**:

- `dist/` — prerendered HTML for all 7 routes, `404.html`, `sitemap.xml`, `robots.txt`, images,
  and the pinned `assets/cbk.js` / `assets/cbk.css` entry files.
- `api/submit-quote.ts` — a Vercel Edge Function, deployed automatically from the `api/`
  directory. It holds the GHL credentials server-side.

### Build settings

`vercel.json` pins these so the dashboard cannot drift from the repo:

| Setting | Value |
| --- | --- |
| Framework | `vite` |
| Build command | `npm run build` |
| Output directory | `dist` |

The explicit `buildCommand` matters: Vite's Vercel preset would otherwise run bare `vite build`,
which skips the SSR, prerender, and sitemap steps and would ship a bundle with no per-route HTML.

`vercel.json` contains **no `rewrites`**, deliberately. Vercel's directory-index resolution already
serves `/about` from `dist/about/index.html` with a real `200`, and unmatched paths fall through to
`dist/404.html`. A catch-all rewrite to `/index.html` would turn every 404 into a soft-404 — the
defect that was found and removed on 2026-08-21. `npm run verify:static` fails the build if one
reappears.

### Required environment variables

Set in the Vercel dashboard (Project → Settings → Environment Variables), for **Production** and
**Preview**:

| Variable | Scope | Value |
| --- | --- | --- |
| `GHL_API_KEY` | Server-side only | GHL private integration token |
| `GHL_LOCATION_ID` | Server-side only | GHL sub-account (location) ID |

Neither has a `VITE_` prefix, so neither can be inlined into the client bundle by Vite.
**Do not add `VITE_QUOTE_API_URL`** — the site and its API now share one origin, and leaving it
unset makes `src/lib/ghlAdapter.ts` post to the relative `/api/submit-quote`. See `.env.example`.

### Domains

Add both `cleaningbykandi.com` and `www.cleaningbykandi.com` to the Vercel project, with `www`
configured to redirect to the apex. Vercel's dashboard shows the exact A record value for the apex
and the project-specific CNAME target for `www`; use the values it displays, since they are
assigned per project. The DNS records themselves live in Cloudflare.

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
unit tests against source alone wouldn't. It also fails the build if `vercel.json` is ever
reintroduced with a catch-all-to-homepage rewrite (see docs/ARCHITECTURE.md, "Route/canonical
limitation") — that config file doesn't exist in this branch as of 2026-08-21.

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

> **Superseded 2026-08-28.** Items 1–5 below no longer apply: with Vercel serving the domain, the
> six clean paths, their metadata, and the sitemap come from this build rather than from hand
> configuration in the GHL dashboard. **Item 6's field mapping was resolved 2026-08-28** — the GHL
> custom field `sms_transactional_constent` was renamed to `sms_transactional_consent`, matching
> what `api/submit-quote.ts` sends. What remains of item 6 is a single real end-to-end submission
> against the live sub-account (contact creation, tagging, owner notification), which should be run
> against the Vercel deployment URL *before* DNS is cut over. Item 7's rollback procedure is now
> writable — see "Rollback" below.

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

Now writable, since the delivery mechanism is decided (Vercel serves the domain).

**During DNS cutover** — the fastest path back is DNS, because the GoHighLevel site is not deleted
by any of this:

1. In Cloudflare, restore the previous GHL-pointing records for `cleaningbykandi.com` and `www`
   (capture their exact current values *before* changing anything — see step 1 of the cutover).
2. Because the pre-cutover TTL determines how fast this takes effect, set TTL to a low value
   (60–300s) **before** the cutover, not during the rollback.
3. GHL still holds the original site and all CRM data, so this restores the previous site intact.

**After cutover, for a bad deploy** (DNS already on Vercel): use Vercel's **Instant Rollback**
(Project → Deployments → previous production deployment → Promote to Production). This does not
touch DNS and takes effect immediately.

**For the quote form specifically:** if `/api/submit-quote` misbehaves, the failure is contained —
`src/lib/ghlAdapter.ts` returns a user-facing error with the business phone number rather than
silently dropping the lead, so submissions degrade to phone calls rather than vanishing.

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

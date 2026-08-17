# Architecture

This is the decision record for the `feature/seo-foundation-cloudflare` work: replacing a
HashRouter single-page app (only crawlable/functional when embedded inside a GoHighLevel page
shell) with a directly-hosted, prerendered static site. It exists so the next person who touches
this repo doesn't have to re-derive *why* things are shaped the way they are.

For historical context on the abandoned "rebuild natively in GHL" direction, see the superseded
notice at the top of `CLAUDE.md`.

## System diagram

```
                     ┌─────────────────────────────┐
  Browser ─────────▶ │  Cloudflare (static assets)  │
                     │  dist/ — prerendered HTML,    │
                     │  hashed JS/CSS, images,       │
                     │  sitemap.xml, robots.txt      │
                     └───────────────┬───────────────┘
                                      │ quote form POST
                                      ▼
                     ┌─────────────────────────────┐
                     │  /api/submit-quote            │
                     │  (Cloudflare Worker fetch     │
                     │   handler — NOT YET WRITTEN,   │
                     │   see below)                   │
                     └───────────────┬───────────────┘
                                      │ Contacts API (upsert)
                                      ▼
                     ┌─────────────────────────────┐
                     │  GoHighLevel                  │
                     │  CRM, tags, opportunity,       │
                     │  owner notification, workflows │
                     └─────────────────────────────┘
```

The frontend is fully static — every public route is prerendered HTML served directly from
Cloudflare's asset layer, no server render on request. GoHighLevel is no longer the page shell;
it's the CRM/workflow backend sitting behind one API endpoint that the quote form calls.

## Why prerendering via a Node SSR entry (not Next/Astro/Remix)

The app is a small, already-built Vite + React 19 + react-router-dom site — 7 public routes, no
per-request dynamic data, no auth, no personalization. Pulling in a new meta-framework (Next,
Astro, Remix) to get static generation would mean:

- a new build system and routing convention layered on top of (or replacing) the existing Vite
  config, Tailwind setup, and component tree
- new dependencies with their own version-compatibility surface against React 19
- rewriting working page components to fit that framework's data/loader conventions

Instead, this plan uses Vite's documented "manual SSG" recipe: `src/entry-server.tsx` exports a
`render(url)` function built on `react-dom/server`'s `renderToString` + react-router-dom's
`StaticRouter`, built via `vite build --ssr`. `scripts/prerender.mjs` then walks the route
registry (`src/lib/routes.ts`), calls `render()` for each path, injects the per-route `<head>`
block (title/description/canonical/OG/Twitter/JSON-LD), and writes real
`dist/<route>/index.html` files plus `dist/404.html`. This reuses dependencies already installed
(`react-dom`, `react-router-dom`) and keeps the entire page/component tree — including Tailwind
styling — untouched. Smallest-footprint path to real per-route static HTML.

The client hydrates the same tree via `src/entry-client.tsx` (`hydrateRoot` + `BrowserRouter`),
so the prerendered HTML and the client-hydrated app are the same component graph rendered two
ways, not two divergent implementations.

## Why `--color-primary` changed value instead of overriding call sites

`--color-primary` (`#0284C7`) was measured at 4.09:1 contrast on white — below WCAG AA's 4.5:1
text threshold. Rather than patching each of the ~20 individual call sites that reference the
token (buttons, links, icons, focus rings) with per-instance overrides, the token itself was
darkened to `#0369A1` (and `--color-primary-dark` to `#075985`, one step darker, to preserve the
existing contrast relationship between the two). `--color-primary-light` (`#0EA5E9`) was left
unchanged since it's decorative-only, never used for text-on-background contrast.

A single-token fix guarantees every current and future consumer of `--color-primary` inherits the
AA-compliant value automatically, and preserves the intended visual relationship between the
primary/primary-dark pair instead of letting 20 call sites drift independently over time.

## Why the GHL-shell-era absolute URLs, pinned filenames, and vercel.json cache headers were removed

The prior iteration of this site was designed to be embedded inside a GoHighLevel page (loaded
via `<script>`/`<link>` tags pointing at a separately-hosted bundle), which required:

- **Absolute `cleaning-by-kandi.vercel.app` URLs** hardcoded into image `src` attributes and the
  form's fetch target, because the bundle wasn't necessarily served from the same origin as the
  page embedding it.
- **Pinned output filenames** (`assets/cbk.js`, `assets/cbk.css`) via a `build.rollupOptions`
  block in `vite.config.ts`, so the GHL page's hand-written `<script>`/`<link>` tags could
  reference stable, predictable filenames instead of Vite's normal content-hashed output.
  Pinning also broke `dist-ssr/entry-server.js`'s expected filename, since the same rollup config
  applied to the SSR build.
  This is now solved differently, and better, for direct hosting: `scripts/prerender.mjs`
  injects each page's actual (hashed) asset paths straight from the SSR-built HTML, so there's
  never a need to guess a filename.
- **`vercel.json` cache-control headers** targeting those literal `cbk.js`/`cbk.css` filenames,
  which stop making sense once output filenames are content-hashed (hashed filenames are
  immutable by construction — the filename itself changes on every content change — so
  aggressive long-TTL caching is safe by default without bespoke header rules).

Direct hosting means the site is served from its own canonical origin
(`https://cleaningbykandi.com`), so none of the above cross-origin accommodations are needed.
`vercel.json` was reverted to a minimal SPA rewrite (kept only as a Vercel fallback — Cloudflare
is the actual staging target and doesn't read this file), and `vite.config.ts` no longer pins
output filenames.

**`vercel.json`'s catch-all rewrite is a latent soft-404 conflict if ever deployed to Vercel.**
`vercel.json` still reads `{"rewrites": [{"source": "/(.*)", "destination": "/index.html"}]}` — a
catch-all that would return a `200` with `index.html` for every unmatched path if this project
were ever actually deployed to Vercel. Cloudflare never reads this file (it reads
`wrangler.jsonc`, whose `assets.not_found_handling: "404-page"` correctly returns a real 404), so
today this has zero effect on the actual deployment target. But it's a real landmine if the
deployment target ever changed: that rewrite would reintroduce exactly the soft-404 behavior this
whole migration exists to remove — every unmatched path would 200 with the homepage instead of a
real 404. Achieving parity with the current Cloudflare config on Vercel would require, at minimum,
`cleanUrls: true` plus real 404 handling (for example a Vercel Edge Middleware checking requested
paths against the `src/lib/routes.ts` registry) — neither of which this project has built or
verified. `vercel.json` is deliberately left as-is (not deleted, not "fixed") since Cloudflare is
the only target this branch actually supports; this paragraph exists so a future deploy-target
change doesn't silently reintroduce the soft-404 bug this migration removed.

## Cloudflare-specific config decisions

`wrangler.jsonc`'s `assets.html_handling` defaults to `"auto-trailing-slash"`, which makes the
trailing-slash form of a path (e.g. `/about/`) canonical and 307-redirects the bare form
(`/about`) to it. That's backwards from every canonical URL already established in this
codebase — the sitemap, JSON-LD `url` fields, and OG tags all use the no-trailing-slash form
(`/about`, not `/about/`) everywhere. Left at the default, every real route on the site would
307-redirect away from its own canonical URL on first load. This was caught empirically during
Task 13 by running `wrangler dev` and observing the redirect, then confirmed against
Cloudflare's own docs. Fixed by setting `html_handling: "drop-trailing-slash"` explicitly in
`wrangler.jsonc`, which makes the bare (no-slash) path canonical and redirects the slash variant
instead — matching this codebase's existing URL convention rather than fighting it.

Similarly, `assets.not_found_handling` is set to `"404-page"` (serving `dist/404.html` with a
real 404 status) rather than `"single-page-application"` (which would serve `index.html` with a
200 for every unmatched path) — the latter is exactly the soft-404 behavior this whole migration
exists to remove.

Both of these needed research into Cloudflare's asset-routing behavior specifically — they
weren't things that could be transcribed unchanged from a generic Vite/Cloudflare template.

## Image optimization: AVIF variants are generated but not wired into `<picture>`

`scripts/optimize-images.mjs` generates a full-size `.avif` per source image (alongside the
per-width `.webp`/`.jpg` variants) for potential future use — for example a manual
`<link rel="preload" as="image" type="image/avif">` on the LCP hero image, if AVIF's smaller file
size is ever worth chasing for that specific request. `ResponsiveImage.tsx`'s `<picture>` element
only wires up `webp` (via `<source>`) with a `jpg` fallback (via `<img src>`/`srcset`) — it does
not add a third `<source type="image/avif">`. This is a deliberate scope tradeoff from the
image-optimization task, not an oversight: webp already covers the large majority of traffic with
solid compression, and a 3-source-per-image `<picture>` (avif → webp → jpg) adds real markup and
maintenance complexity that wasn't judged worth it for this site's traffic profile. The `.avif`
files exist on disk (and ship in `dist/images/`) so that decision can be revisited later without
regenerating source assets.

## Known limitations

- **React 19's client-side head-tag hoisting inserts a duplicate `<title>`/`<link rel="canonical">`
  after hydration.** `src/components/Seo.tsx` renders `<title>`/`<link rel="canonical">`/OG/Twitter
  tags on the client (guarded off during SSR — see that file's `import.meta.env.SSR` check).
  React 19 hoists these elements into the real `document.head` on mount/route change. The
  prerendered `<head>` tag written by `scripts/prerender.mjs` is never removed, so after hydration
  there are, briefly, two `<title>` elements and two canonical `<link>` elements in `document.head`
  — one from the static prerendered HTML, one inserted by React. This has been verified in the
  actual built output and is harmless today because both copies are derived from the same
  `src/lib/routes.ts` registry and are therefore always identical in content. It would become a
  real duplicate-canonical bug if the prerender script and the client `Seo` component ever derived
  their content from different sources (for example, if route metadata were fetched dynamically
  client-side instead of imported from the same static registry) — worth remembering before adding
  any dynamic/CMS-driven metadata later.
- **This plan's base commit (`d3fc586`) already excluded some GHL-shell-era cleanup.** Some
  cleanup described in this document as part of the overall migration story — reverting pinned
  output filenames, removing `vercel.json`'s GHL-shell-era cache-control headers — actually
  happened in earlier local development, before this branch's commit range began, and is baked
  into the base commit this branch was built on. A reviewer diffing this branch against that base
  commit will not see those specific removals as part of this diff, even though this document
  (correctly) describes them as part of the migration's overall story. Noted here so that isn't
  mistaken for an inaccuracy in this document versus a quirk of where the branch's history starts.

## Open questions for the owner

These are not guessed or resolved anywhere in the repo — they need real answers from the business
owner before certain content/config can be finalized:

1. **Are "Organization Services" and "Eco-Friendly Cleaning" active offerings?** They're listed
   in `CLAUDE.md`'s business facts but don't appear on `/services` or anywhere else visible on
   the site. If yes, they need a visible page section before they can appear in metadata/JSON-LD
   (per this plan's Global Constraint against exposing unverified/non-visible services in public
   schema). If no, `CLAUDE.md`'s business list should be corrected to match the 5 services
   actually offered.
2. **`priceRange: "$$"`** was present in an early JSON-LD draft with no verifiable basis anywhere
   in the repo. Confirm a real value with the owner, or drop the field entirely — it is currently
   omitted from `BusinessSchema.tsx`'s output pending that confirmation.
3. **`/cleaning-tips`** currently 404s, both in production and in this build. Per this plan's
   scope, no new article/content is being invented this phase. Confirm whether the intended
   resolution is a permanent 404 (current behavior, no action needed), a 410 Gone (if the page
   used to exist and was intentionally retired), or a future replacement page (would need actual
   content before it's built).
4. **Real GHL API key, GHL location ID, and field-mapping confirmation.** None of this is
   verifiable from the repo or from a logged-out view of the production site.
   `api/submit-quote.ts`'s `customFields` array assumes GHL custom-field keys like
   `service_type`, `cleaning_frequency`, `bedrooms`, `bathrooms`, `square_footage`,
   `preferred_date`, `job_description`, and several `consent_*`/`sms_*` keys — these need to be
   confirmed against the actual custom-field keys configured in the live GHL sub-account before
   the form can be trusted to write data GHL's workflows can actually use. **This — combined with
   the Cloudflare Worker rewrite below — blocks calling the form integration "production-ready."**
   One key name was corrected during this branch's development: the transactional-SMS-consent
   custom field key was `sms_transactional_constent` (missing the "n" in "consent") and is now
   `sms_transactional_consent`. If the owner's live GHL sub-account already has a custom field
   configured with the old, typo'd spelling from prior testing, they'll need to either rename it
   in GHL or override this code — a mismatched key means that field will silently fail to
   populate, with no error surfaced anywhere.
5. **Real business hours**, if any are ever to be published. Currently correctly omitted from
   JSON-LD as unverified (fabricating hours would violate this plan's Global Constraint against
   unsupported/unverified business facts in structured data).
6. **Service-area list mismatch between visible page content and JSON-LD.** `src/lib/business.ts`'s
   `SERVICE_AREAS` constant (which feeds `BusinessSchema.tsx`'s JSON-LD `areaServed`) lists:
   Surprise, Peoria, Glendale, Sun City, Goodyear, Buckeye. `src/pages/ServiceAreas.tsx`'s visible
   `cities` array lists: Peoria, Surprise, Glendale, Goodyear, Phoenix, "And More" — it omits Sun
   City and Buckeye, and includes Phoenix, which does not appear in the schema list. This is a
   real content/schema consistency gap of exactly the kind this plan's SEO work was built to
   catch (compare the services-list allowlist in `SERVICES` above), but for service areas instead
   of services offered. Neither list has been assumed correct here — this needs a real answer from
   the owner on the accurate, current set of service areas before either list (or the page copy
   and meta description that reference these cities) can be trusted as canonical.

## Form integration contract and known blocker: `api/submit-quote.ts` will not run unmodified on a Cloudflare Worker

This was discovered while documenting deployment (Task 14), not part of the original spec's
problem list, and is significant enough to repeat here in full.

**Important correction (this fix wave):** an earlier draft of this section described the remedy
in terms of **Cloudflare Pages Functions** (a `functions/api/submit-quote.ts` file exporting
`onRequestPost(context)`, reading secrets from `context.env`). That was wrong for this project.
`wrangler.jsonc` in this repo uses the **Workers static-assets model**
(`assets.directory`/`assets.html_handling`/`assets.not_found_handling`, already built and
verified working live via `wrangler dev`) — a different Cloudflare product from Pages, with a
different config surface and a different Functions convention. The description below has been
corrected to match the Workers model this project actually uses.

`api/submit-quote.ts` is written in **Vercel's Edge Function convention**:

```ts
export const config = { runtime: 'edge' };
export default async function handler(req: Request): Promise<Response> { ... }
```

**A Cloudflare Worker serving static assets (this project's actual shape) does not use a
`functions/` directory at all — that convention is Pages-specific.** Instead, a Worker project has
a single script entry point declared via the top-level `main` field in `wrangler.jsonc` (for
example `"main": "src/worker.ts"`), which exports a `fetch(request, env, ctx)` handler. Per
Cloudflare's current static-assets routing docs: when a `main` script is configured alongside
`assets`, a request that matches a file in the assets directory is served directly (no Worker
code runs); a request that does **not** match any static asset is passed to the Worker's `fetch`
handler if one is configured (this is the default — no extra config needed for a same-origin
`fetch()` POST like the quote form's, since it isn't a top-level navigation request and
`/api/submit-quote` doesn't correspond to a file in `dist/`). The Worker can then handle the
request itself, or fall back to serving assets via an assets binding (`env.ASSETS.fetch(request)`)
if it decides the path isn't one it owns.

The concrete migration path, based on Cloudflare's current documented Workers static-assets
behavior:

- Add `"main": "src/worker.ts"` (or similar) to `wrangler.jsonc`, pointing at a small Worker
  entry script.
- Add a `"binding": "ASSETS"` key inside the existing `assets` block, so the Worker can
  explicitly defer to the static-asset handler for anything it doesn't own
  (`env.ASSETS.fetch(request)`).
- In `src/worker.ts`, check the request URL/method inside `fetch(request, env, ctx)`: if it's a
  POST to `/api/submit-quote`, run (a Worker-flavored port of) the current handler's logic; for
  anything else, defer to `env.ASSETS.fetch(request)`.
- Optionally, add `"run_worker_first": ["/api/*"]` to the `assets` block for explicit, unambiguous
  routing of API paths to the Worker regardless of request type, rather than relying on the
  implicit "unmatched-asset requests fall through to the Worker" default behavior.
- Secrets (`GHL_API_KEY`, `GHL_LOCATION_ID`) are read from the Worker's own `env` parameter (the
  binding-based environment object Workers pass into `fetch(request, env, ctx)`), not from
  `process.env` or a Pages-style `context.env` — the current file's
  `(globalThis as any).process?.env` access pattern is a Vercel-Edge-Function-specific
  accommodation and doesn't map onto this model either.

**This shape (the `main`/`fetch`/`env.ASSETS` mechanism, and specifically the
`run_worker_first` route-pattern option) was confirmed against Cloudflare's current Workers
static-assets documentation during this fix wave, but the exact config surface is a fast-moving
part of the platform — re-verify against current Cloudflare docs immediately before implementing,
rather than transcribing this section verbatim into code.**

**Net effect: the quote form's server-side handler will not run as-is if this site is deployed to
Cloudflare with the current `api/submit-quote.ts` file.** It needs a real rewrite — new file
location and entry point, new export shape (`fetch(request, env, ctx)` instead of a default
`handler(req)`), new env-var access pattern (Worker `env`, not `process.env`) — before form
submissions will work in a Cloudflare-hosted deployment.

This rewrite was deliberately **not** attempted as part of this plan. It touches
production-critical form/consent code (the same handler that upserts real contacts into GHL and
records SMS-consent metadata), and this plan's own stop conditions call out exactly this class of
change ("direct hosting would break the current quote workflow") as out of scope pending explicit
confirmation. See `docs/DEPLOYMENT.md` for this listed as a staging prerequisite.

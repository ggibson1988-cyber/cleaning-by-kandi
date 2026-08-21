# Architecture

This is the decision record for the `feature/seo-foundation-cloudflare` work (branch name is
historical — see "Correction" below): replacing a HashRouter single-page app (only
crawlable/functional when embedded inside a GoHighLevel page shell) with clean routes and real
prerendered HTML for every public page. It exists so the next person who touches this repo
doesn't have to re-derive *why* things are shaped the way they are.

For historical context on the abandoned "rebuild natively in GHL" direction, see the superseded
notice at the top of `CLAUDE.md`.

**Correction (this revision):** an earlier version of this document, and this branch's name,
assumed Cloudflare Workers/Pages as the hosting target. **That was a mistake — Cloudflare hosting
was never approved.** Cloudflare-specific implementation (`wrangler.jsonc`, the
`@cloudflare/vite-plugin` dev-mode integration, the `preview:cf` script, and the Cloudflare
staging instructions previously in this document and `docs/DEPLOYMENT.md`) has been removed. The
branch retains its original name and git history for traceability; nothing about the name implies
Cloudflare is still in scope.

## Current production architecture (verified facts)

- `cleaningbykandi.com` is served through **GoHighLevel**.
- The custom React frontend/build assets were created and deployed through **Vercel**.
- GoHighLevel remains responsible for CRM, workflows, and the existing live form/lead integration.
- **Cloudflare Workers/Pages are not part of the approved hosting architecture.**
- DNS management is a separate concern from website hosting and must not be conflated with it —
  the presence of any Cloudflare DNS records does not imply Cloudflare hosting is authorized.

## What this branch produces

- Platform-neutral prerendered HTML files for all 7 public routes (`dist/<route>/index.html`)
  plus a real `dist/404.html`.
- Per-route metadata, canonicals, LocalBusiness/BreadcrumbList JSON-LD, a generated
  `dist/sitemap.xml`, and the existing `dist/robots.txt`.
- This output has passed local structural verification (`npm run verify:static`, cheerio
  assertions against the built files) and local browser checks (a generic Vite preview server —
  see "Route/canonical limitation" below).
- **It has not been integrated with GHL, and has not been deployed to Vercel.** It is not yet
  known how GHL will serve these clean prerendered routes — see "Unresolved deployment
  requirement" below. Nothing in this document should be read as claiming otherwise.

## System diagram (target shape — routing mechanism not yet designed)

```
  Browser ─────────▶  cleaningbykandi.com (served through GoHighLevel)
                                │
                                │  ??? — undesigned: how does GHL route
                                │  /about, /services, etc. to this
                                │  frontend's prerendered HTML?
                                ▼
                       Custom React frontend
                       (built assets deployed via Vercel)
                                │
                                │  quote form POST
                                ▼
                       /api/submit-quote
                       (Vercel Edge Function —
                        see "Form integration
                        contract" below)
                                │
                                │  Contacts API (upsert)
                                ▼
                       GoHighLevel
                       CRM, tags, opportunity,
                       owner notification, workflows
```

The frontend build is fully static/prerendered — every public route has real per-route HTML, no
server render needed at request time for the page content itself. GoHighLevel remains the CRM,
workflow, and (per current production) public-domain host; whether/how it fronts this Vercel-built
frontend for the six clean sub-routes is the open question this document does not resolve.

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
styling — untouched. Smallest-footprint path to real per-route static HTML, and this output is
host-agnostic: it's plain files, not tied to any specific hosting product.

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

## Why the GHL-shell-era absolute URLs and pinned filenames were removed

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
  This is now solved differently, for direct/clean-URL hosting of any kind: `scripts/prerender.mjs`
  injects each page's actual (hashed) asset paths straight from the SSR-built HTML, so there's
  never a need to guess a filename.
- **`vercel.json` cache-control headers** targeting those literal `cbk.js`/`cbk.css` filenames,
  which stop making sense once output filenames are content-hashed (hashed filenames are
  immutable by construction — the filename itself changes on every content change — so
  aggressive long-TTL caching is safe by default without bespoke header rules).

If this frontend is ever served from its own canonical origin end-to-end
(`https://cleaningbykandi.com`) rather than embedded via a page shell, none of the above
cross-origin accommodations would be needed. `vercel.json` was reverted to a minimal SPA rewrite.

**`vercel.json`'s catch-all rewrite is a live soft-404 concern, not a historical footnote.**
`vercel.json` still reads `{"rewrites": [{"source": "/(.*)", "destination": "/index.html"}]}` — a
catch-all that returns a `200` with `index.html` for every unmatched path. **Because Vercel is
the confirmed host for this project's build assets**, this rewrite is directly relevant to
whatever the eventual GHL/Vercel delivery design turns out to be: if Vercel ever serves this
frontend's routes directly (rather than only as a build-asset source consumed some other way),
this catch-all would reintroduce exactly the soft-404 behavior this SEO work exists to remove —
every unmatched path would `200` with the homepage instead of a real 404. Achieving real
per-route 404s on Vercel would require, at minimum, `cleanUrls: true` plus real 404 handling (for
example a Vercel Edge Middleware checking requested paths against the `src/lib/routes.ts`
registry) — neither of which this project has built or verified. This is called out explicitly
here because it is now an open item for whoever designs the GHL/Vercel delivery mechanism, not
something already solved.

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

## Route/canonical limitation (verified, do not overclaim)

- The build's prerender step (`scripts/prerender.mjs`) produces real, route-specific
  `dist/<route>/index.html` files — this is a file-level fact, verified directly against the
  files on disk (`npm run verify:static`).
- Locally previewing this output with Vite's own generic preview server (`npm run preview`)
  serves the **trailing-slash** form of each route correctly (e.g. `/about/` → 200, correct
  content) but returns 404 for the **canonical, no-trailing-slash** form (`/about`) — this is a
  documented limitation of Vite's own static-file middleware, unrelated to any specific hosting
  platform.
- **This does not establish that the canonical no-trailing-slash URL (`/about`, as used
  everywhere in this codebase's sitemap, JSON-LD, and OG tags) will return HTTP 200 under
  whatever actually serves `cleaningbykandi.com` in production.** The production hosting layer —
  once the GHL/Vercel delivery design is decided — must make each exact canonical URL return
  HTTP 200 with the intended HTML, and must return a genuine HTTP 404 (not a 200 with the
  homepage) for unmatched paths. Neither has been verified against the real production path.
- **Canonical URL style (trailing-slash vs. not) must be decided together with the eventual
  hosting behavior, not changed unilaterally to make a local preview tool happy.** No canonicals
  were changed to trailing-slash form to satisfy Vite preview's limitation above.
- No generic SPA fallback (serving `index.html` with a 200 for every unmatched path) has been
  added anywhere in this branch. `vercel.json`'s pre-existing catch-all rewrite (see above) is the
  one already-present exception to be aware of if Vercel ever serves routes directly.

## Open questions for the owner

These are not guessed or resolved anywhere in the repo — they need real answers from the business
owner before certain content/config can be finalized:

1. ~~Are "Organization Services" and "Eco-Friendly Cleaning" active offerings?~~ **Resolved
   2026-08-20:** not currently offered. `CLAUDE.md`'s business list was corrected to match the 5
   services actually shown on `/services`. If either becomes a real offering later, it needs a
   visible page section before it can appear in metadata/JSON-LD (per this plan's Global
   Constraint against exposing unverified/non-visible services in public schema).
2. ~~`priceRange: "$$"`~~ **Resolved (no action needed):** no verified value exists, so the field
   remains omitted from `BusinessSchema.tsx`'s output, as it already was. Add it only if the owner
   supplies a real, verifiable value.
3. **Real GHL API key, GHL location ID, and field-mapping confirmation.** None of this is
   verifiable from the repo or from a logged-out view of the production site.
   `api/submit-quote.ts`'s `customFields` array assumes GHL custom-field keys like
   `service_type`, `cleaning_frequency`, `bedrooms`, `bathrooms`, `square_footage`,
   `preferred_date`, `job_description`, and several `consent_*`/`sms_*` keys — these need to be
   confirmed against the actual custom-field keys configured in the live GHL sub-account before
   the form can be trusted to write data GHL's workflows can actually use. **This — combined with
   the unresolved GHL/Vercel delivery design below — blocks calling the form integration
   "production-ready."** One key name was corrected during this branch's development: the
   transactional-SMS-consent custom field key was `sms_transactional_constent` (missing the "n"
   in "consent") and is now `sms_transactional_consent`. If the owner's live GHL sub-account
   already has a custom field configured with the old, typo'd spelling from prior testing,
   they'll need to either rename it in GHL or override this code — a mismatched key means that
   field will silently fail to populate, with no error surfaced anywhere.
4. **Real business hours**, if any are ever to be published. Currently correctly omitted from
   JSON-LD as unverified (fabricating hours would violate this plan's Global Constraint against
   unsupported/unverified business facts in structured data).
5. ~~Service-area list mismatch between visible page content and JSON-LD~~ **Resolved 2026-08-20:**
   `src/pages/ServiceAreas.tsx` was updated to Surprise, Peoria, Glendale, Sun City, Goodyear,
   Buckeye, matching `SERVICE_AREAS`/JSON-LD, the footer, `RequestQuote.tsx`'s city dropdown,
   `Home.tsx`, `About.tsx`, and `routes.ts`'s meta description — it had been the sole outlier
   (Phoenix instead of Sun City/Buckeye). The list was selected to align `ServiceAreas.tsx` with
   the existing footer, JSON-LD, Home, About, and Request Quote implementation. Formal
   verification of the business's complete service territory remains an owner-review item. Sun
   City and Buckeye have no verified zip list yet, so their entries on that page ship with empty
   zip arrays rather than guessed ones; their map-pin coordinates are placed decoratively along
   the Loop 101 / I-10 labels already in that file, consistent with the rest of that hand-drawn,
   "Approximate area"-labeled map — not a claim of precise geography.

## Unresolved deployment requirement — production migration is blocked until this is designed

**This is the central open question and it has not been guessed or invented anywhere in this
repo.** Production migration cannot proceed until the delivery design answers, at minimum:

1. **How will GHL serve `/about`, `/services`, `/service-areas`, `/request-quote`, `/privacy`,
   and `/terms`?** GHL currently hosts `cleaningbykandi.com`. This branch's prerendered output
   assumes something serves those exact paths with this project's built HTML — the mechanism
   (GHL-side proxy/rewrite? a different DNS/routing arrangement? something else?) is undesigned.
2. **Will each clean URL return the correct initial HTML** — the actual prerendered page content,
   not a generic GHL page-shell fallback or an error page?
3. **Will the canonical no-trailing-slash URL (e.g. `/about`) return HTTP 200?** Not verified for
   any real hosting arrangement — see "Route/canonical limitation" above.
4. **Will missing URLs return a genuine HTTP 404?** Not a `200` with the homepage, and not a GHL
   default/soft-404 page silently substituted for a real 404 status.
5. **How will Vercel-built assets or pages be connected to GHL?** I.e., what is the actual
   mechanism by which a request that GHL receives for `cleaningbykandi.com/services` ends up
   being answered by this Vercel-built frontend's content? **Partially addressed code-side
   (2026-08-20):** the client build now emits stable `assets/cbk.js`/`assets/cbk.css` filenames
   (see `vite.config.ts`) instead of content-hashed ones, matching what production's GHL page
   already hardcodes via `<script>`/`<link>` tags — so a rebuilt bundle won't silently 404 that
   existing embed. This does **not** answer the question: it only means the six clean paths, once
   GHL is configured to serve them, can load the same stable bundle GHL already knows how to
   reference. The GHL-admin work of actually creating those six pages and pointing them at this
   bundle is still undone — see docs/DEPLOYMENT.md's "Remaining GHL-admin work."
6. **How will the current GHL form/workflow behavior be preserved?** The live site's existing
   lead-capture behavior (contact creation, tagging, owner notification, workflows) must not
   regress during any migration.
7. **What is the rollback procedure** if a delivery-mechanism change causes a regression on the
   live domain?

A Vercel preview URL, on its own, would only test the frontend artifact in isolation — it would
not answer any of the seven questions above, since none of them are about whether the React app
itself works. It is not presented here as an answer to this open question.

## Form integration contract

`api/submit-quote.ts` is written in **Vercel's Edge Function convention**
(`export const config = { runtime: 'edge' }`, default-exported `handler(req: Request)`, reading
`GHL_API_KEY`/`GHL_LOCATION_ID` server-side via `process.env`-style access, never exposed to the
client bundle). **Since Vercel is the confirmed host for this project's build assets, this shape
is plausibly already correctly targeted** — unlike the Cloudflare-Worker-shaped rewrite an earlier
version of this document incorrectly said was required, no rewrite of this handler's export shape
is currently known to be needed.

**Resolved code-side (2026-08-20):** `src/lib/ghlAdapter.ts` no longer hardcodes a same-origin
relative path. It now reads `VITE_QUOTE_API_URL` (a build-time env var, see `.env.example`) and
falls back to the relative `/api/submit-quote` only when that's unset — same-origin remains
correct for a direct Vercel deployment or local `vercel dev`, but under the current GHL-fronted
domain, `VITE_QUOTE_API_URL` must be set to the function's real absolute URL (e.g.
`https://cleaning-by-kandi.vercel.app/api/submit-quote`) as a Vercel build-time environment
variable before this is production-correct. Setting that real value is GHL-admin/Vercel-config
work, not a code change — see docs/DEPLOYMENT.md's "Remaining GHL-admin work."

What remains genuinely unverified, regardless of hosting question:

- **Whether this Vercel Edge Function is actually deployed and reachable** at whatever URL
  `VITE_QUOTE_API_URL` ends up pointing to.
- **Real GHL API key, GHL location ID, and field-mapping confirmation** against the live GHL
  sub-account (see "Open questions for the owner," item 3).
- **Rate limiting and/or bot protection on `/api/submit-quote`.** This is a public lead-capture
  endpoint with no abuse protection today — no rate limiting, no CAPTCHA/challenge. Every
  successful call fires real GHL workflows (contact creation, owner notification), so an
  unprotected endpoint is a spam/abuse vector once this is actually live. Adding this requires
  product decisions (which mechanism, what thresholds) and credentials that weren't available
  during this work, so it was deliberately not implemented — but it should be added before real
  deployment, regardless of hosting choice.

This form/consent code was deliberately not further modified in this pass — it's
production-critical (the same handler that would upsert real contacts into GHL and record
SMS-consent metadata), and remains blocked on the items above, not on any hosting-platform-shape
mismatch.

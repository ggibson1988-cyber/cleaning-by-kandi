> **Superseded 2026-08-17: the Cloudflare hosting decision below was a mistake and was never
> approved.** This plan's choice of Cloudflare Pages/Workers as the staging/hosting target (see
> "Architecture" and "Tech Stack" immediately below, and the Cloudflare-specific tasks throughout)
> has been reverted — `wrangler.jsonc`, the `@cloudflare/vite-plugin` integration, the
> `preview:cf` script, and the Cloudflare-specific documentation it produced have all been removed
> in a later corrective commit. The actual approved production architecture is: GoHighLevel hosts
> `cleaningbykandi.com`; the custom frontend/build assets are created and deployed through Vercel;
> how GHL will serve this frontend's clean routes is undesigned. See `docs/ARCHITECTURE.md`'s
> "Unresolved deployment requirement" section for the current, accurate status. This plan is kept
> as-is (not rewritten) for historical accuracy — it genuinely was the plan followed, Cloudflare
> included; this note exists so a future reader doesn't mistake the Cloudflare content below for
> still-current direction.

# SEO Foundation + Cloudflare Static Hosting Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the HashRouter SPA (currently only crawlable/functional when embedded in a GoHighLevel page shell) with a directly-hosted, prerendered static site — clean URLs, real per-route HTML/metadata/JSON-LD, populated sitemap/robots, real 404s, optimized images, AA-compliant contrast, a documented GHL form adapter, and automated tests — buildable and verifiable locally, staging-ready for Cloudflare, **not deployed**.

**Architecture:** Keep the existing Vite + React 19 + react-router-dom app almost entirely as-is (components, Tailwind design, page content). Swap `HashRouter` for `BrowserRouter`, split the router out of `App.tsx` so it can be wrapped by either `BrowserRouter` (client) or `StaticRouter` (prerender). Add a minimal Node prerender script that server-renders each of the 7 routes via `react-dom/server` + a Vite SSR build, writes real `dist/<route>/index.html` files, and injects per-route `<head>` metadata + JSON-LD from one centralized route registry (also used by the sitemap generator and a static-output verification script). This is the smallest-footprint SSG approach for a Vite app — no new framework (no Next/Astro/Remix), reuses dependencies already installed (`react-dom`, `react-router-dom`), and is the documented Vite "manual SSG" recipe. Cloudflare Pages/Workers static-assets hosting serves the resulting `dist/` directly with `wrangler.jsonc`.

**Tech Stack:** Vite 8, React 19, react-router-dom 7, TypeScript, Tailwind CSS, Vitest + Testing Library (new), cheerio (new, for static-HTML verification), sharp (new, for image optimization), wrangler + `@cloudflare/vite-plugin` (new, for Cloudflare staging config).

**Spec:** Full task spec provided inline in this conversation (13-step SEO/Cloudflare migration brief for Cleaning By Kandi, LLC). No separate spec file exists in-repo; this plan is the authoritative decomposition of that spec.

## Global Constraints

- Canonical origin: `https://cleaningbykandi.com` — every canonical/OG/Twitter/JSON-LD URL uses this apex host, never `www`, never the Vercel preview host.
- Business facts (do not deviate): Cleaning By Kandi, LLC · Surprise / Arizona West Valley · (480) 309-7607 · cleaningbykandi@yahoo.com.
- Verified visible services (exactly these 5, in this order, everywhere public-facing metadata/schema lists services): Residential Cleaning, Deep Cleaning, Move-In / Move-Out Cleaning, Short-Term Rental / Airbnb Cleaning, Commercial Cleaning.
- Do NOT expose "Organization Services" or "Eco-Friendly Cleaning" in any public metadata/schema — they appear in `CLAUDE.md`'s business list and in the baseline `BusinessSchema.tsx` draft but are not on any visible page. Flag as an owner-confirmation item; do not silently add or silently drop from CLAUDE.md's historical record.
- No AggregateRating, fabricated reviews, fabricated prices, unsupported guarantees, unsupported hours, exact street address, or unverified geo coordinates in JSON-LD.
- Never commit secrets, webhook URLs, API keys, or account IDs (e.g. GHL `locationId`) — always via env vars, `.env.example` only holds variable names.
- Never submit a real lead to the live GHL webhook/API during testing — all form-submission tests use mocked `fetch`.
- Do not push, merge, or deploy. All commits stay local on `feature/seo-foundation-cloudflare`.
- Base commit: `d3fc586141b31ac59d518bcfe6cedfb7c282ef93` (latest `origin/main`). Prior uncommitted work was checkpointed separately on local `main` at `3ad96c89a8ee831a9cb7be819a504b382ef243b8` — reuse via cherry-pick, not rewritten from scratch.
- `git commit` only after the relevant verification for that task's commit group passes (see Commit Groups below). Never `git push`.

## Commit Groups (from the spec — use as the 5 logical commits)

1. Clean routing and static/prerendered output
2. Metadata, schema, sitemap, robots, and 404 handling
3. Performance and accessibility fixes
4. Form adapter and automated tests
5. Cloudflare staging configuration and documentation

---

## File Structure

New/changed files, by responsibility:

```
src/
  App.tsx                  # MODIFY: drop <HashRouter> wrapper, export router-agnostic tree
  entry-client.tsx         # NEW: hydrateRoot + BrowserRouter (replaces most of main.tsx)
  entry-server.tsx         # NEW: renderToString + StaticRouter, exported render(url)
  main.tsx                 # MODIFY: thin re-export of entry-client for `vite dev`
  lib/
    routes.ts              # NEW: single source of truth — path, title, description, h1, ogImage per route
    consent.ts              # KEEP (from baseline commit, unchanged)
    seoImage.ts             # NEW: canonical-host image URL helper
  components/
    Seo.tsx                 # MODIFY (from baseline): SSR-safe (no-op during import.meta.env.SSR), reads lib/routes.ts
    BusinessSchema.tsx       # MODIFY (from baseline): fix services list, drop geo, centralize via lib/routes.ts + lib/business.ts
    Breadcrumbs.tsx          # NEW: visible + JSON-LD breadcrumb, non-home pages only
    ResponsiveImage.tsx      # NEW: width/height/srcset/sizes/lazy-loading wrapper
    Header.tsx                # MODIFY: mobile menu focus trap
  lib/
    business.ts               # NEW: verified business facts (name, phone, email, services, areas) — single source
    ghlAdapter.ts              # NEW: extracted fetch-to-adapter logic from RequestQuote.tsx, testable in isolation
  pages/*.tsx                 # MODIFY: reuse baseline Seo wiring, fix image paths (relative, not absolute vercel.app), add Breadcrumbs
api/
  submit-quote.ts             # KEEP (from baseline, already fixed locationId), minor: env var docs
scripts/
  prerender.mjs                # NEW: SSR each route, inject head, write dist/<route>/index.html + dist/404.html
  generate-sitemap.mjs          # NEW: dist/sitemap.xml from lib/routes.ts
  verify-static-output.mjs      # NEW: cheerio-based assertions over built dist/
  optimize-images.mjs           # NEW: sharp — webp/avif + responsive sizes from public/images/*.jpg
public/
  images/                      # MODIFY: add generated responsive/webp/avif variants (originals kept)
  sitemap.xml                  # DELETE: superseded by generated dist/sitemap.xml (avoid drift)
  404.html                     # generated by prerender script, not hand-authored
tests/
  routes.test.tsx               # NEW: per-route render — H1, Seo tags, internal links
  jsonld.test.ts                 # NEW: LocalBusiness schema shape/validity
  sitemap.test.ts                # NEW: sitemap completeness vs lib/routes.ts
  form.test.tsx                  # NEW: validation, mocked success/4xx/network-error, duplicate-submit guard
  a11y-contrast.test.ts          # NEW: computed contrast ratios for the 3 flagged token pairs
  static-output.test.ts          # NEW: vitest wrapper that runs after build, or documents manual `npm run verify:static`
vite.config.ts                  # MODIFY: base '/', appType by command, cloudflare() plugin, drop cbk.js filename pinning
wrangler.jsonc                  # NEW: adapted from origin/cloudflare/workers-autoconfig, not_found_handling fixed
package.json                    # MODIFY: new scripts + devDependencies
.env.example                    # MODIFY: GHL vars replace Formspree
docs/
  ARCHITECTURE.md                # NEW: direct-hosting + GHL-backend decision record
  DEPLOYMENT.md                  # NEW: Cloudflare staging steps, rollback, migration prerequisites
CLAUDE.md                        # MODIFY: reconcile with new direction, preserve history
README.md                        # MODIFY: dev/build/test commands
```

---

### Task 1: Port baseline work onto the feature branch

**Files:**
- No new files — this is a `git cherry-pick` of `3ad96c8` onto `feature/seo-foundation-cloudflare`.

- [ ] **Step 1: Cherry-pick the baseline commit**

```bash
git checkout feature/seo-foundation-cloudflare
git cherry-pick 3ad96c89a8ee831a9cb7be819a504b382ef243b8
```

Expect a clean cherry-pick (no conflicts — the baseline commit and `d3fc586` touch disjoint files: baseline touches `src/`, `api/`, `vercel.json`, `vite.config.ts`; `d3fc586` only adds `CLAUDE.md`).

- [ ] **Step 2: Verify**

```bash
git log --oneline -3
git status --short --branch
```

Expected: HEAD is the cherry-picked commit, one commit ahead of `origin/main`, clean tree.

- [ ] **Step 3: Confirm `CLAUDE.md` still present and untouched**

```bash
test -f CLAUDE.md && echo OK
```

This task produces no independent tests (it's a mechanical port); Task 2 immediately starts correcting the ported code for the new architecture, and existing `npm run build` (old config, still HashRouter/relative-base at this point) should still succeed as a smoke check:

```bash
npm ci
npm run build
```

Expected: build succeeds (this is the *old* HashRouter+relative-base config still, so this only proves the cherry-pick didn't break compilation — routing/prerendering correctness comes later).

---

### Task 2: Router split — `App.tsx` / `entry-client.tsx` / `entry-server.tsx`

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/main.tsx`
- Create: `src/entry-client.tsx`
- Create: `src/entry-server.tsx`
- Create: `src/pages/NotFound.tsx`

**Interfaces:**
- Produces: `AppShell` (default export of `App.tsx`) — router-agnostic, takes no props, renders `<Header/><ScrollToTop/><AnimatedRoutes/><Footer/>`.
- Produces: `render(url: string): string` from `entry-server.tsx` — used by `scripts/prerender.mjs`.
- Produces: `NotFound` (default export of `src/pages/NotFound.tsx`) — consumed by `App.tsx`'s catch-all route below. Created in this task (not Task 3) because `App.tsx`'s new router-agnostic tree imports it directly, and this task's own Step 6 sanity-build would fail to compile without it.

- [ ] **Step 1: Strip the router wrapper out of `App.tsx`**

Current `src/App.tsx` (post cherry-pick) wraps everything in `<HashRouter>`. Change the default export to no longer own the router:

```tsx
// src/App.tsx
import { useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import BusinessSchema from './components/BusinessSchema';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import ServiceAreas from './pages/ServiceAreas';
import RequestQuote from './pages/RequestQuote';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import NotFound from './pages/NotFound';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="flex-1 flex flex-col"
      >
        <Routes location={location}>
          <Route path="/"              element={<Home />} />
          <Route path="/about"         element={<About />} />
          <Route path="/services"      element={<Services />} />
          <Route path="/service-areas" element={<ServiceAreas />} />
          <Route path="/request-quote" element={<RequestQuote />} />
          <Route path="/privacy"       element={<Privacy />} />
          <Route path="/terms"         element={<Terms />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <BusinessSchema />
      <Header />
      <ScrollToTop />
      <main id="main-content" className="flex-1 flex flex-col">
        <AnimatedRoutes />
      </main>
      <Footer />
    </div>
  );
}
```

Notes:
- The inline 404 JSX moves to a real `src/pages/NotFound.tsx` (created in Step 2 below) so the prerender script can render it standalone for `dist/404.html`.
- `<main id="main-content">` + the skip link satisfies Step 8's landmark/skip-link requirement — added here since it's the single wrapper point for every route.
- `<BusinessSchema />` mounted once at the app root (unchanged from baseline placement).

- [ ] **Step 2: Create `src/pages/NotFound.tsx`** (extracted from the old inline `App.tsx` 404 JSX above, unchanged content)

```tsx
// src/pages/NotFound.tsx
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-24 text-center px-4">
      <title>Page Not Found | Cleaning By Kandi</title>
      <meta name="robots" content="noindex" />
      <p className="text-8xl font-bold text-slate-200 mb-4">404</p>
      <h1 className="text-2xl font-bold text-slate-900 mb-3">Page Not Found</h1>
      <p className="text-slate-500 mb-8">The page you're looking for doesn't exist.</p>
      <Link to="/" className="bg-brand-primary hover:bg-brand-primary-dark text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-200 cursor-pointer">
        Back to Home
      </Link>
    </div>
  );
}
```

`<title>`/`<meta name="robots">` render inline here (not via `Seo.tsx`, which doesn't exist with this shape until Task 3) since 404 isn't in the route registry and must never be indexed; during SSR these still land inside `<body>`, which is fine for this one page — `scripts/prerender.mjs` (Task 5) writes `dist/404.html`'s `<head>` explicitly anyway and does not rely on this component's tags being hoisted.

- [ ] **Step 3: Create `src/entry-client.tsx`**

```tsx
// src/entry-client.tsx
import { StrictMode } from 'react';
import { hydrateRoot, createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';

const mount = document.getElementById('cbk-root') ?? document.getElementById('root');

if (!mount) {
  throw new Error('Cleaning By Kandi mount element not found. Add <div id="cbk-root"></div> to the page.');
}

const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// Prerendered pages have server-rendered markup already in #cbk-root — hydrate it.
// `npm run dev` has no prerendered markup, so fall back to a plain client render.
if (mount.hasChildNodes()) {
  hydrateRoot(mount, app);
} else {
  createRoot(mount).render(app);
}
```

- [ ] **Step 4: Create `src/entry-server.tsx`**

```tsx
// src/entry-server.tsx
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';

export function render(url: string): string {
  return renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>
  );
}
```

- [ ] **Step 5: Replace `src/main.tsx` with a thin re-export**

```tsx
// src/main.tsx
import './entry-client';
```

(Vite's dev server and `index.html`'s `<script type="module" src="/src/main.tsx">` keep working unchanged; `main.tsx` is kept only so the existing script tag doesn't need editing everywhere.)

- [ ] **Step 6: Sanity-build the SSR bundle in isolation**

```bash
npx vite build --ssr src/entry-server.tsx --outDir dist-ssr
node -e "const { render } = require('./dist-ssr/entry-server.js'); console.log(render('/about').slice(0, 200))"
```

Expected: prints the start of server-rendered HTML for `/about` (starts with the skip link `<a href="#main-content"`), no errors. This exercises the whole module graph including `src/pages/NotFound.tsx` from Step 2 (imported unconditionally by `App.tsx`'s catch-all route), so it also proves that file compiles. If `require` fails because the SSR build emits ESM, use `node --input-type=module -e "import('./dist-ssr/entry-server.js').then(m => console.log(m.render('/about').slice(0,200)))"` instead — note which form works in Task 5's prerender script.

- [ ] **Step 7: Commit** (part of Commit Group 1 — combine with Tasks 3-6 before committing; do not commit yet)

---

### Task 3: Route registry + Seo/BusinessSchema centralization

**Files:**
- Create: `src/lib/routes.ts`
- Create: `src/lib/business.ts`
- Create: `src/lib/seoImage.ts`
- Modify: `src/components/Seo.tsx`
- Modify: `src/components/BusinessSchema.tsx`
- Modify: `src/pages/{Home,About,Services,ServiceAreas,RequestQuote,Privacy,Terms}.tsx` (swap hardcoded `<Seo .../>` props for registry lookups)

(`src/pages/NotFound.tsx` was already created in Task 2 — `App.tsx`'s router tree needed it to compile before Task 3 runs. Nothing in this task creates it.)

**Interfaces:**
- Produces: `ROUTES: RouteMeta[]` and `getRouteMeta(path: string): RouteMeta` from `src/lib/routes.ts`, consumed by `Seo.tsx`, `scripts/prerender.mjs`, `scripts/generate-sitemap.mjs`, `scripts/verify-static-output.mjs`, and tests.
- Produces: `BUSINESS` constant from `src/lib/business.ts` — consumed by `BusinessSchema.tsx` and `Footer.tsx`/`Header.tsx` if they need facts later.
- Produces: `canonicalImage(path: string): string` from `src/lib/seoImage.ts`.

- [ ] **Step 1: Write `src/lib/business.ts`** (single source for verified facts — no unverified geo/hours)

```ts
// src/lib/business.ts
export const SITE_URL = 'https://cleaningbykandi.com';

export const BUSINESS = {
  legalName: 'Cleaning By Kandi, LLC',
  telephone: '+1-480-309-7607',
  telephoneDisplay: '(480) 309-7607',
  telephoneHref: 'tel:4803097607',
  email: 'cleaningbykandi@yahoo.com',
  emailHref: 'mailto:cleaningbykandi@yahoo.com',
  addressLocality: 'Surprise',
  addressRegion: 'AZ',
  addressCountry: 'US',
} as const;

// Exactly the 5 services visible on /services. Do NOT add "Organization
// Services" or "Eco-Friendly Cleaning" here — they appear in CLAUDE.md's
// business list but are not shown on any public page. See docs/ARCHITECTURE.md
// "Open questions for the owner" for the resolution needed before adding them.
export const SERVICES = [
  'Residential Cleaning',
  'Deep Cleaning',
  'Move-In / Move-Out Cleaning',
  'Short-Term Rental / Airbnb Cleaning',
  'Commercial Cleaning',
] as const;

export const SERVICE_AREAS = ['Surprise', 'Peoria', 'Glendale', 'Sun City', 'Goodyear', 'Buckeye'] as const;
```

- [ ] **Step 2: Write `src/lib/seoImage.ts`**

```ts
// src/lib/seoImage.ts
import { SITE_URL } from './business';

/** Absolute, canonical-host image URL for OG/Twitter/JSON-LD use. */
export function canonicalImage(path: string): string {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
```

- [ ] **Step 3: Write `src/lib/routes.ts`**

Titles/descriptions below are ported from the baseline commit's per-page `<Seo>` props (already reviewed — unique, accurate, no fabricated claims). `h1` values match each page's actual rendered `<h1>` text so tests and the verify script can assert against real markup.

```ts
// src/lib/routes.ts
import { canonicalImage } from './seoImage';

export interface RouteMeta {
  path: string;
  title: string;
  description: string;
  h1: string;
  image: string;
  /** Directory this route prerenders to under dist/. "" = dist/index.html */
  outDir: string;
}

const DEFAULT_IMAGE = canonicalImage('/images/hero.jpg');

export const ROUTES: RouteMeta[] = [
  {
    path: '/',
    outDir: '',
    title: 'House Cleaning in Surprise & the West Valley, AZ | Cleaning By Kandi',
    description: "Reliable, detail-obsessed residential and commercial cleaning across Surprise, Peoria, Glendale & the West Valley. Fully insured, locally owned. Get a free quote.",
    h1: 'Book a Cleaning',
    image: DEFAULT_IMAGE,
  },
  {
    path: '/about',
    outDir: 'about',
    title: 'About Cleaning By Kandi | Locally Owned Cleaning Team, West Valley AZ',
    description: "Meet Kandi and the team behind Cleaning By Kandi — a locally owned, fully insured cleaning service trusted by families and businesses across Arizona's West Valley.",
    h1: 'About Cleaning By Kandi',
    image: DEFAULT_IMAGE,
  },
  {
    path: '/services',
    outDir: 'services',
    title: 'Cleaning Services in the West Valley, AZ | Residential, Deep & Commercial',
    description: "Explore Cleaning By Kandi's services: residential, deep, move-in/move-out, short-term rental, and commercial cleaning across Surprise and the West Valley of Arizona.",
    h1: 'Our Cleaning Services',
    image: canonicalImage('/images/residential.jpg'),
  },
  {
    path: '/service-areas',
    outDir: 'service-areas',
    title: 'Service Areas | House Cleaning in Surprise, Peoria & Glendale, AZ',
    description: 'Cleaning By Kandi serves Surprise, Peoria, Glendale, Sun City, Goodyear, and Buckeye. See if your West Valley, Arizona neighborhood is in our cleaning service area.',
    h1: 'Service Areas',
    image: canonicalImage('/images/arizona.jpg'),
  },
  {
    path: '/request-quote',
    outDir: 'request-quote',
    title: 'Request a Free Cleaning Quote | Cleaning By Kandi, Surprise AZ',
    description: "Get a free, no-obligation cleaning quote from Cleaning By Kandi. Tell us about your home or business and we'll respond within 24 hours. Serving the West Valley, AZ.",
    h1: 'Request a Free Quote',
    image: DEFAULT_IMAGE,
  },
  {
    path: '/privacy',
    outDir: 'privacy',
    title: 'Privacy Policy | Cleaning By Kandi',
    description: 'How Cleaning By Kandi collects, uses, and protects your information when you use our website and cleaning services in the West Valley, Arizona.',
    h1: 'Privacy Policy',
    image: DEFAULT_IMAGE,
  },
  {
    path: '/terms',
    outDir: 'terms',
    title: 'Terms of Service | Cleaning By Kandi',
    description: 'The terms and conditions governing use of the Cleaning By Kandi website and cleaning services in the West Valley, Arizona.',
    h1: 'Terms of Service',
    image: DEFAULT_IMAGE,
  },
];

export function getRouteMeta(path: string): RouteMeta {
  const found = ROUTES.find((r) => r.path === path);
  if (!found) throw new Error(`No route metadata registered for path "${path}"`);
  return found;
}
```

Cross-check each page's actual `<h1>` text against Steps below when editing pages — if a page's real H1 text differs from what's guessed above, use the page's real text (do not change page copy to match the registry; change the registry to match the page).

- [ ] **Step 4: Rewrite `src/components/Seo.tsx`** (SSR-safe; single meaningful H1 is the page's job, not Seo's)

```tsx
// src/components/Seo.tsx
import { getRouteMeta } from '../lib/routes';
import { SITE_URL } from '../lib/business';

interface SeoProps {
  path: string;
}

export default function Seo({ path }: SeoProps) {
  // The static <head> for every route is written by scripts/prerender.mjs
  // from the same src/lib/routes.ts registry this component reads. Rendering
  // these tags again during SSR (no <head> ancestor exists in the tree being
  // rendered — index.html's <head> is a static template, not part of the
  // React tree) would just emit stray <title>/<meta> inside <body>, so this
  // component is a no-op server-side. On the client, React 19 hoists these
  // elements to the real document <head> on route change — that's what
  // keeps <title>/canonical/OG tags correct during SPA navigation.
  if (import.meta.env.SSR) return null;

  const { title, description, image } = getRouteMeta(path);
  const url = path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`;

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </>
  );
}
```

Each page now passes only `path`, e.g. `<Seo path="/about" />` — update all 7 call sites accordingly (they currently pass `title`/`description` inline from the baseline commit; delete those two props at each call site since the registry now owns that copy).

- [ ] **Step 5: Rewrite `src/components/BusinessSchema.tsx`** (fix the 3 issues found during investigation: unverified services, unverified geo, non-centralized facts)

```tsx
// src/components/BusinessSchema.tsx
import { BUSINESS, SERVICES, SERVICE_AREAS, SITE_URL } from '../lib/business';
import { canonicalImage } from '../lib/seoImage';

/**
 * LocalBusiness JSON-LD, mounted once at the app root so it's present on
 * every prerendered route.
 *
 * Deliberately omitted (see plan docs/ARCHITECTURE.md for rationale):
 *  - aggregateRating/review: no real third-party review data available.
 *  - geo coordinates: not verified against the actual business location.
 *  - openingHoursSpecification: hours are unconfirmed.
 *  - street address: service-area business, no public storefront.
 *  - "Organization Services" / "Eco-Friendly Cleaning": listed in CLAUDE.md
 *    but not shown on any visible page — owner confirmation required before
 *    they can appear in public metadata (see docs/ARCHITECTURE.md).
 */
const schema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${SITE_URL}/#business`,
  name: BUSINESS.legalName,
  url: `${SITE_URL}/`,
  image: canonicalImage('/images/hero.jpg'),
  telephone: BUSINESS.telephone,
  email: BUSINESS.email,
  address: {
    '@type': 'PostalAddress',
    addressLocality: BUSINESS.addressLocality,
    addressRegion: BUSINESS.addressRegion,
    addressCountry: BUSINESS.addressCountry,
  },
  areaServed: SERVICE_AREAS.map((city) => ({ '@type': 'City', name: `${city}, AZ` })),
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Cleaning Services',
    itemListElement: SERVICES.map((service) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: service },
    })),
  },
};

export default function BusinessSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

Note `priceRange` was also dropped — the baseline had `'$$'` with no verified basis for that specific value; treat as another owner-confirmation item rather than inventing one (documented in Task 15).

- [ ] **Step 6: Update all 7 page files' `<Seo>` call sites**

For each of `Home.tsx`, `About.tsx`, `Services.tsx`, `ServiceAreas.tsx`, `RequestQuote.tsx`, `Privacy.tsx`, `Terms.tsx`: replace the baseline's `<Seo path="..." title="..." description="..." />` with `<Seo path="..." />` only (2-arg props removed). `RequestQuote.tsx` has two render points (`QUOTE_SEO` used in both the success state and the form state) — both stay, just drop the now-unused `title`/`description` args from the shared `QUOTE_SEO` element.

- [ ] **Step 7: Typecheck**

```bash
npx tsc -b --noEmit
```

Expected: no errors. Fix any leftover references to the old `Seo` prop shape.

- [ ] **Step 8: Commit** (defer — combine with Tasks 4–6 into the "Clean routing and static/prerendered output" + "Metadata, schema, sitemap, robots, and 404 handling" commits per the plan's grouping; see Task 8 for the actual commit steps)

---

### Task 4: Fix image paths and vite.config.ts for direct hosting

**Files:**
- Modify: `src/pages/{About,Home,ServiceAreas,Services}.tsx`
- Modify: `vite.config.ts`
- Modify: `vercel.json` (revert the cbk.js/cbk.css cache-header block — see rationale below)

**Interfaces:** none new.

- [ ] **Step 1: Revert absolute Vercel image/API URLs back to relative/root paths**

The baseline commit pointed `<img src="https://cleaning-by-kandi.vercel.app/images/...">` and the form's `fetch('https://cleaning-by-kandi.vercel.app/api/submit-quote')` at the Vercel deployment — a workaround for the old GHL-shell architecture where only the JS/CSS bundle was embedded and images/API had to be fetched from Vercel absolutely. Direct hosting doesn't need this: images and the API route live on the same origin as the page.

In `src/pages/About.tsx`, `Home.tsx` (3 occurrences), `ServiceAreas.tsx`, and `Services.tsx` (5 occurrences), change:

```diff
- src="https://cleaning-by-kandi.vercel.app/images/hero.jpg"
+ src="/images/hero.jpg"
```

(same pattern for `about-team.jpg`, `clean-home.jpg`, `arizona.jpg`, `residential.jpg`, `deep-clean.jpg`, `move-out.jpg`, `rental.jpg`, `commercial.jpg`). The form's fetch URL is handled separately in Task 12 (form adapter task), not here.

- [ ] **Step 2: Fix `vite.config.ts` — absolute base, `appType` by command, drop the GHL-shell filename pin**

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // Absolute root base: required once pages live at nested paths like
  // /about/index.html — a relative base ('./') would resolve their asset
  // references to /about/assets/... instead of /assets/..., 404ing every
  // asset on every non-home route.
  base: '/',
  // 'mpa' disables Vite's SPA history-fallback in `vite preview`, so
  // requests to unmapped paths 404 for real instead of silently serving
  // index.html (see docs/ARCHITECTURE.md). Keep the SPA fallback in `vite
  // dev` so refreshing a sub-route during local development still works,
  // since dev mode has no prerendered dist/<route>/index.html to serve.
  appType: command === 'serve' ? 'spa' : 'mpa',
  plugins: [react()],
}))
```

This drops the baseline's `build.rollupOptions.output` filename-pinning block (`entryFileNames: 'assets/cbk.js'`, etc.) — that existed only so the old GHL page-shell could hardlink a stable script URL. Direct hosting has no external shell referencing the bundle by name, so normal Vite content-hashed filenames (better cache-busting) are strictly better here. Document this removal in `docs/ARCHITECTURE.md` (Task 15) so it isn't a silent, unexplained regression if anyone goes looking for `cbk.js` later.

- [ ] **Step 3: Revert `vercel.json`'s cbk.js/cbk.css cache-header block**

That header block targets filenames that no longer exist once Task 4 Step 2 lands (hashed filenames replace `assets/cbk.js`). Revert `vercel.json` to its `origin/main` state (just the SPA rewrite, no headers block) — Cloudflare deployment (Task 16) doesn't read `vercel.json` at all, so this file is now legacy/unused; leaving the stale cache-header rule in would be actively misleading to a future reader:

```bash
git show d3fc586:vercel.json > vercel.json
```

- [ ] **Step 4: Build smoke test (still pre-prerender at this point)**

```bash
npx tsc -b && npx vite build
ls dist/assets | head
```

Expected: hashed filenames like `index-XXXXXXXX.js`, no `cbk.js`. `dist/index.html` should reference `/assets/index-XXXXXXXX.js` (absolute, not `./assets/...`).

- [ ] **Step 5: Commit** (defer to Task 8)

---

### Task 5: Prerender script — the core of clean-URL static output

**Files:**
- Create: `scripts/prerender.mjs`
- Modify: `package.json` (scripts + new devDependencies)

**Interfaces:**
- Consumes: `render(url)` from `dist-ssr/entry-server.js` (built by Task 2's SSR build), `ROUTES` from `src/lib/routes.ts` (compiled — script imports the built SSR bundle's re-export, see Step 2 note on why routes data is re-exported through the SSR entry rather than imported twice).
- Produces: `dist/index.html`, `dist/about/index.html`, `dist/services/index.html`, `dist/service-areas/index.html`, `dist/request-quote/index.html`, `dist/privacy/index.html`, `dist/terms/index.html`, `dist/404.html`.

- [ ] **Step 1: Add `ROUTES` re-export to `entry-server.tsx`** so the plain-Node prerender script (which cannot import `.ts` under `src/` directly without a loader) gets route metadata from the one SSR bundle it already loads:

```tsx
// src/entry-server.tsx (append)
export { ROUTES } from './lib/routes';
```

- [ ] **Step 2: Write `scripts/prerender.mjs`**

```js
// scripts/prerender.mjs
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const distDir = resolve(root, 'dist');

const template = await readFile(resolve(distDir, 'index.html'), 'utf-8');
const { render, ROUTES } = await import(resolve(root, 'dist-ssr/entry-server.js'));

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function buildHead(route, siteUrl) {
  const url = route.path === '/' ? `${siteUrl}/` : `${siteUrl}${route.path}`;
  const t = escapeHtml(route.title);
  const d = escapeHtml(route.description);
  const img = escapeHtml(route.image);
  return `
    <title>${t}</title>
    <meta name="description" content="${d}" />
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${url}" />
    <meta property="og:title" content="${t}" />
    <meta property="og:description" content="${d}" />
    <meta property="og:image" content="${img}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${t}" />
    <meta name="twitter:description" content="${d}" />
    <meta name="twitter:image" content="${img}" />`;
}

async function writeRoute(outDir, headHtml, bodyHtml) {
  const html = template
    .replace('<!--app-head-->', headHtml)
    .replace('<div id="cbk-root"></div>', `<div id="cbk-root">${bodyHtml}</div>`);
  const target = outDir === '' ? distDir : resolve(distDir, outDir);
  await mkdir(target, { recursive: true });
  await writeFile(resolve(target, 'index.html'), html, 'utf-8');
  console.log(`  wrote ${outDir === '' ? '/' : `/${outDir}/`}index.html`);
}

const SITE_URL = 'https://cleaningbykandi.com';

console.log('Prerendering routes...');
for (const route of ROUTES) {
  const bodyHtml = render(route.path);
  const headHtml = buildHead(route, SITE_URL);
  await writeRoute(route.outDir, headHtml, bodyHtml);
}

// 404 page: real content, robots noindex baked into the head, no canonical
// (a 404 has no canonical URL), status handled by hosting config (Task 16).
const notFoundBody = render('/this-path-does-not-exist-9f3a2b');
const notFoundHead = `
    <title>Page Not Found | Cleaning By Kandi</title>
    <meta name="robots" content="noindex" />`;
const notFoundHtml = template
  .replace('<!--app-head-->', notFoundHead)
  .replace('<div id="cbk-root"></div>', `<div id="cbk-root">${notFoundBody}</div>`);
await writeFile(resolve(distDir, '404.html'), notFoundHtml, 'utf-8');
console.log('  wrote /404.html');

console.log(`Prerendered ${ROUTES.length} routes + 404.`);
```

- [ ] **Step 3: Add the `<!--app-head-->` placeholder to `index.html`**

The version of `index.html` on this branch (from Task 1's cherry-pick) does NOT match a fresh `origin/main` checkout — it already replaced the original title/description/OG/Twitter/canonical block with a single `<title>` and a comment claiming metadata is "managed at runtime by react-helmet-async." That claim is wrong (this project has never depended on `react-helmet-async` — confirmed by Task 1's review: no such package in `package.json`, and `src/components/Seo.tsx`'s own comment explicitly says the opposite). Replace that whole stale comment + title with the placeholder:

```diff
   <head>
     <meta charset="UTF-8" />
     <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
     <meta name="viewport" content="width=device-width, initial-scale=1.0" />

-    <!--
-      Per-route title, description, canonical, OG and Twitter tags are managed at
-      runtime by react-helmet-async (see src/components/Seo.tsx) so they stay unique
-      per route. The static <title> below is only a no-JS fallback; helmet replaces
-      it on load. LocalBusiness JSON-LD is injected via src/components/BusinessSchema.tsx.
-    -->
-    <title>Cleaning By Kandi – Professional Cleaning Services in Arizona</title>
+    <!--app-head-->
```

(Full per-route `<title>`/description/OG/Twitter/canonical block is now injected by `scripts/prerender.mjs` from `src/lib/routes.ts`; keep the static block only as a no-JS/prerender-failure fallback is explicitly NOT needed since prerendering always runs as part of `npm run build` — an un-prerendered `dist/index.html` should never ship. Keep font preconnects and favicon as-is below the placeholder.)

- [ ] **Step 4: Wire the full build pipeline in `package.json`**

```json
{
  "scripts": {
    "dev": "vite",
    "build:client": "vite build",
    "build:ssr": "vite build --ssr src/entry-server.tsx --outDir dist-ssr",
    "prerender": "node scripts/prerender.mjs",
    "sitemap": "node scripts/generate-sitemap.mjs",
    "build": "tsc -b && npm run build:client && npm run build:ssr && npm run prerender && npm run sitemap",
    "verify:static": "node scripts/verify-static-output.mjs",
    "preview": "vite preview",
    "lint": "oxlint",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

(`generate-sitemap.mjs` is Task 6; `verify-static-output.mjs` is Task 7 — this task's build will fail on `npm run sitemap` until Task 6 lands, so run Tasks 5 and 6 back-to-back before the first full `npm run build`.)

- [ ] **Step 5: Commit** (defer to Task 8, once Task 6's sitemap script exists so `npm run build` succeeds end-to-end)

---

### Task 6: Sitemap generator + robots.txt confirmation

**Files:**
- Create: `scripts/generate-sitemap.mjs`
- Delete: `public/sitemap.xml` (superseded — generating at build time from `src/lib/routes.ts` removes any chance of the sitemap and the route registry drifting apart, which is exactly what Step 10's verification script checks for)
- No change needed to `public/robots.txt` — already reads `Sitemap: https://cleaningbykandi.com/sitemap.xml` (apex host, correct) — confirm only, don't edit.

- [ ] **Step 1: Write `scripts/generate-sitemap.mjs`**

```js
// scripts/generate-sitemap.mjs
import { writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const { ROUTES } = await import(resolve(root, 'dist-ssr/entry-server.js'));

const SITE_URL = 'https://cleaningbykandi.com';
const PRIORITY = {
  '/': '1.0',
  '/services': '0.9',
  '/request-quote': '0.9',
  '/about': '0.8',
  '/service-areas': '0.8',
  '/privacy': '0.3',
  '/terms': '0.3',
};
const CHANGEFREQ = {
  '/': 'weekly',
  '/privacy': 'yearly',
  '/terms': 'yearly',
};

const urls = ROUTES.map((r) => {
  const loc = r.path === '/' ? `${SITE_URL}/` : `${SITE_URL}${r.path}`;
  const changefreq = CHANGEFREQ[r.path] ?? 'monthly';
  const priority = PRIORITY[r.path] ?? '0.5';
  return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}).join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

await writeFile(resolve(root, 'dist/sitemap.xml'), xml, 'utf-8');
console.log(`Wrote dist/sitemap.xml with ${ROUTES.length} URLs.`);
```

- [ ] **Step 2: Delete the hand-maintained sitemap**

```bash
git rm public/sitemap.xml
```

- [ ] **Step 3: Run the full build and confirm sitemap + all routes exist**

```bash
npm run build
find dist -name "index.html" | sort
cat dist/sitemap.xml
```

Expected: 7 `index.html` files at the paths listed in Task 5's "Produces" list, plus `dist/404.html`, plus a `dist/sitemap.xml` with exactly 7 `<url>` entries matching `src/lib/routes.ts`.

- [ ] **Step 4: Confirm `robots.txt` made it into `dist/`**

```bash
cat dist/robots.txt
```

Expected: unchanged content, `Sitemap: https://cleaningbykandi.com/sitemap.xml`.

- [ ] **Step 5: Commit** (this completes Commit Group 1 — "Clean routing and static/prerendered output" — together with Tasks 2, 4, 5)

```bash
git add src/App.tsx src/main.tsx src/entry-client.tsx src/entry-server.tsx \
  src/lib/routes.ts src/lib/business.ts src/lib/seoImage.ts \
  src/components/Seo.tsx src/components/BusinessSchema.tsx src/pages/NotFound.tsx \
  src/pages/About.tsx src/pages/Home.tsx src/pages/ServiceAreas.tsx src/pages/Services.tsx \
  src/pages/RequestQuote.tsx src/pages/Privacy.tsx src/pages/Terms.tsx \
  vite.config.ts vercel.json index.html package.json package-lock.json \
  scripts/prerender.mjs scripts/generate-sitemap.mjs
git rm public/sitemap.xml
git commit -m "$(cat <<'EOF'
Replace HashRouter with prerendered clean routes

Splits the router out of App.tsx so it can be wrapped by BrowserRouter
(client) or StaticRouter (a new Node SSR entry), adds a prerender
script that writes real dist/<route>/index.html files for all 7 public
routes plus dist/404.html, and generates dist/sitemap.xml at build
time from a single route registry (src/lib/routes.ts) instead of a
hand-maintained public/sitemap.xml that could drift from it. vite.config.ts
switches to an absolute base and disables SPA fallback for build/preview
(appType 'mpa') so unmatched paths 404 for real. Also reverts the
Vercel-shell-specific absolute image URLs and pinned bundle filenames
introduced while the site was embedded in GoHighLevel — direct hosting
doesn't need either.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 7: Static-output verification script + JSON-LD/H1/canonical checks

**Files:**
- Create: `scripts/verify-static-output.mjs`
- Modify: `package.json` (add `cheerio` devDependency)

**Interfaces:**
- Consumes: `ROUTES` from `src/lib/routes.ts` (via a plain re-implementation import — this script runs pre-build too in CI-style usage, so import the `.ts` file directly via a small `--import tsx` shim, OR simpler: run this script only post-build and read `dist-ssr/entry-server.js`'s re-exported `ROUTES`, consistent with Task 5/6. Use the latter for consistency.)
- Exit code: non-zero on any failure, printed failure list.

- [ ] **Step 1: Add `cheerio` as a devDependency**

```bash
npm install --save-dev cheerio
```

- [ ] **Step 2: Write `scripts/verify-static-output.mjs`**

```js
// scripts/verify-static-output.mjs
import { readFile, access } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as cheerio from 'cheerio';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const distDir = resolve(root, 'dist');
const { ROUTES } = await import(resolve(root, 'dist-ssr/entry-server.js'));
const SITE_URL = 'https://cleaningbykandi.com';

const failures = [];
const fail = (msg) => failures.push(msg);

for (const route of ROUTES) {
  const htmlPath = route.outDir === '' ? resolve(distDir, 'index.html') : resolve(distDir, route.outDir, 'index.html');
  let html;
  try {
    html = await readFile(htmlPath, 'utf-8');
  } catch {
    fail(`${route.path}: missing built file at ${htmlPath}`);
    continue;
  }

  const $ = cheerio.load(html);
  const title = $('title').first().text();
  const description = $('meta[name="description"]').attr('content');
  const canonical = $('link[rel="canonical"]').attr('href');
  const ogImage = $('meta[property="og:image"]').attr('content');
  const twitterImage = $('meta[name="twitter:image"]').attr('content');
  const h1s = $('h1');
  const expectedUrl = route.path === '/' ? `${SITE_URL}/` : `${SITE_URL}${route.path}`;

  if (!title) fail(`${route.path}: missing <title>`);
  else if (title !== route.title) fail(`${route.path}: title mismatch — got "${title}", expected "${route.title}"`);

  if (!description) fail(`${route.path}: missing meta description`);

  if (!canonical) fail(`${route.path}: missing canonical link`);
  else if (canonical !== expectedUrl) fail(`${route.path}: canonical is "${canonical}", expected "${expectedUrl}"`);

  if (h1s.length === 0) fail(`${route.path}: no <h1> found`);
  else if (h1s.length > 1) fail(`${route.path}: ${h1s.length} <h1> elements found, expected exactly 1`);

  for (const [label, url] of [['og:image', ogImage], ['twitter:image', twitterImage]]) {
    if (!url) fail(`${route.path}: missing ${label}`);
    else if (!url.startsWith(SITE_URL)) fail(`${route.path}: ${label} "${url}" is not on the canonical origin`);
  }

  const jsonLdScripts = $('script[type="application/ld+json"]');
  if (jsonLdScripts.length === 0) {
    fail(`${route.path}: no JSON-LD script found`);
  } else {
    jsonLdScripts.each((_, el) => {
      try {
        const data = JSON.parse($(el).contents().text());
        if (data['@type'] === 'LocalBusiness') {
          if (!data.name || !data.telephone || !data.email) {
            fail(`${route.path}: LocalBusiness JSON-LD missing required field (name/telephone/email)`);
          }
          if ('aggregateRating' in data || 'review' in data) {
            fail(`${route.path}: LocalBusiness JSON-LD must not include aggregateRating/review`);
          }
        }
      } catch {
        fail(`${route.path}: invalid JSON in JSON-LD script`);
      }
    });
  }
}

// Sitemap completeness vs. route registry
try {
  const sitemapXml = await readFile(resolve(distDir, 'sitemap.xml'), 'utf-8');
  const $ = cheerio.load(sitemapXml, { xmlMode: true });
  const sitemapLocs = $('loc').map((_, el) => $(el).text()).get();
  const expectedLocs = ROUTES.map((r) => (r.path === '/' ? `${SITE_URL}/` : `${SITE_URL}${r.path}`));
  for (const loc of expectedLocs) {
    if (!sitemapLocs.includes(loc)) fail(`sitemap.xml missing ${loc}`);
  }
  for (const loc of sitemapLocs) {
    if (!expectedLocs.includes(loc)) fail(`sitemap.xml has extra/stale URL not in route registry: ${loc}`);
  }
  if (sitemapLocs.length !== new Set(sitemapLocs).size) fail('sitemap.xml has duplicate URLs');
} catch {
  fail('dist/sitemap.xml is missing');
}

// robots.txt sanity
try {
  const robots = await readFile(resolve(distDir, 'robots.txt'), 'utf-8');
  if (!robots.includes('Sitemap: https://cleaningbykandi.com/sitemap.xml')) {
    fail('robots.txt does not reference the canonical sitemap URL');
  }
} catch {
  fail('dist/robots.txt is missing');
}

// 404 exists
await access(resolve(distDir, '404.html')).catch(() => fail('dist/404.html is missing'));

if (failures.length > 0) {
  console.error(`\nstatic-output verification FAILED (${failures.length} issue(s)):\n`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(`static-output verification passed for ${ROUTES.length} routes.`);
```

- [ ] **Step 3: Run it**

```bash
npm run build
npm run verify:static
```

Expected: `static-output verification passed for 7 routes.` Fix any real failures before proceeding (do not weaken the checks to make them pass).

- [ ] **Step 4: Commit** — fold into Commit Group 2 (Task 9's commit covers this file too; do not commit separately, just leave staged/verified here).

---

### Task 8: Breadcrumb schema + responsive image component

**Files:**
- Create: `src/components/Breadcrumbs.tsx`
- Create: `src/components/ResponsiveImage.tsx`
- Modify: `src/pages/{About,Services,ServiceAreas,RequestQuote,Privacy,Terms}.tsx` (add `<Breadcrumbs>` under each hero; Home has none — it has no parent to breadcrumb from)

**Interfaces:**
- Produces: `<Breadcrumbs items={[{label, path}]} />` — renders a visible trail + `BreadcrumbList` JSON-LD.
- Produces: `<ResponsiveImage src widths alt className ... />` — used by Task 9 once responsive variants exist.

- [ ] **Step 1: Write `src/components/Breadcrumbs.tsx`**

```tsx
// src/components/Breadcrumbs.tsx
import { Link } from 'react-router-dom';
import { SITE_URL } from '../lib/business';

interface Crumb {
  label: string;
  path: string;
}

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  const trail = [{ label: 'Home', path: '/' }, ...items];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.label,
      item: crumb.path === '/' ? `${SITE_URL}/` : `${SITE_URL}${crumb.path}`,
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 text-sm text-slate-500">
      <ol className="flex flex-wrap items-center gap-1">
        {trail.map((crumb, i) => (
          <li key={crumb.path} className="flex items-center gap-1">
            {i > 0 && <span aria-hidden="true">/</span>}
            {i === trail.length - 1 ? (
              <span aria-current="page" className="text-slate-700 font-medium">{crumb.label}</span>
            ) : (
              <Link to={crumb.path} className="hover:text-slate-700 hover:underline">{crumb.label}</Link>
            )}
          </li>
        ))}
      </ol>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </nav>
  );
}
```

Add e.g. `<Breadcrumbs items={[{ label: 'About', path: '/about' }]} />` immediately after `<Seo path="/about" />` in each of the 6 non-home pages.

- [ ] **Step 2: Write `src/components/ResponsiveImage.tsx`**

```tsx
// src/components/ResponsiveImage.tsx
interface ResponsiveImageProps {
  /** Base name without extension/size suffix, e.g. "/images/hero" */
  base: string;
  alt: string;
  widths: number[];
  width: number;
  height: number;
  sizes: string;
  className?: string;
  /** Set true only for the actual LCP image; everything else lazy-loads. */
  priority?: boolean;
}

export default function ResponsiveImage({
  base, alt, widths, width, height, sizes, className, priority = false,
}: ResponsiveImageProps) {
  const webpSrcSet = widths.map((w) => `${base}-${w}.webp ${w}w`).join(', ');
  const jpgSrcSet = widths.map((w) => `${base}-${w}.jpg ${w}w`).join(', ');
  const fallbackSrc = `${base}-${widths[widths.length - 1]}.jpg`;

  return (
    <picture>
      <source type="image/webp" srcSet={webpSrcSet} sizes={sizes} />
      <img
        src={fallbackSrc}
        srcSet={jpgSrcSet}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        decoding={priority ? undefined : 'async'}
      />
    </picture>
  );
}
```

(AVIF omitted from the `<picture>` here deliberately — `sharp`-generated AVIF variants are still written to disk in Task 9 for future use / manual `<link rel=preload as=image type=image/avif>` on the LCP asset, but a 3-source `<picture>` is unnecessary complexity for this site's traffic profile; webp fallback-to-jpg covers effectively all real traffic. Note this tradeoff in `docs/ARCHITECTURE.md`.)

- [ ] **Step 3: Typecheck + visually confirm no regressions**

```bash
npx tsc -b --noEmit
```

- [ ] **Step 4: Commit** — folds into Commit Group 2 alongside Task 7's verify script and Task 6's sitemap/metadata work:

```bash
git add src/components/Breadcrumbs.tsx src/components/ResponsiveImage.tsx \
  src/pages/About.tsx src/pages/Services.tsx src/pages/ServiceAreas.tsx \
  src/pages/RequestQuote.tsx src/pages/Privacy.tsx src/pages/Terms.tsx \
  scripts/verify-static-output.mjs package.json package-lock.json
git commit -m "$(cat <<'EOF'
Add breadcrumb schema, static-output verification, and fix JSON-LD facts

BusinessSchema now sources name/phone/email/services/areas from a single
src/lib/business.ts instead of duplicating them, drops the two services
(Organization Services, Eco-Friendly Cleaning) that appear in CLAUDE.md's
business list but aren't shown on any public page, and drops the
unverified geo coordinates and priceRange that had no basis in the repo.
Adds BreadcrumbList JSON-LD + a visible breadcrumb trail on every non-home
page, and a cheerio-based scripts/verify-static-output.mjs that fails the
build if any route's title/description/canonical/H1/JSON-LD/sitemap entry
is missing or wrong.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 9: Image optimization pipeline

**Files:**
- Create: `scripts/optimize-images.mjs`
- Modify: `package.json` (add `sharp` devDependency, `images:optimize` script)
- Modify: `src/pages/{Home,About,Services,ServiceAreas}.tsx` (swap raw `<img>` for `<ResponsiveImage>` where it's a content photo — not for the 80px mobile hero medallion, which stays a small fixed-size `<img>` but must point at a small generated variant, not the full hero.jpg)

**Interfaces:**
- Consumes: `ResponsiveImage` from Task 8.
- Produces: `public/images/<name>-{400,800,1200,1600}.webp`, `public/images/<name>-{400,800,1200,1600}.jpg`, `public/images/<name>.avif` (full-size only, for future preload use) for each of the 9 source JPEGs.

- [ ] **Step 1: Add `sharp`**

```bash
npm install --save-dev sharp
```

- [ ] **Step 2: Write `scripts/optimize-images.mjs`**

```js
// scripts/optimize-images.mjs
import sharp from 'sharp';
import { readdir } from 'node:fs/promises';
import { resolve, dirname, basename, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const imagesDir = resolve(root, 'public/images');
const WIDTHS = [400, 800, 1200, 1600];

const files = (await readdir(imagesDir)).filter((f) => extname(f).toLowerCase() === '.jpg');

for (const file of files) {
  const name = basename(file, extname(file));
  const srcPath = resolve(imagesDir, file);
  const meta = await sharp(srcPath).metadata();
  const applicableWidths = WIDTHS.filter((w) => w <= (meta.width ?? Infinity));
  if (applicableWidths.length === 0) applicableWidths.push(meta.width ?? 800);

  for (const w of applicableWidths) {
    await sharp(srcPath).resize({ width: w }).jpeg({ quality: 78, mozjpeg: true })
      .toFile(resolve(imagesDir, `${name}-${w}.jpg`));
    await sharp(srcPath).resize({ width: w }).webp({ quality: 78 })
      .toFile(resolve(imagesDir, `${name}-${w}.webp`));
  }
  await sharp(srcPath).avif({ quality: 60 }).toFile(resolve(imagesDir, `${name}.avif`));
  console.log(`  ${file}: ${applicableWidths.join(', ')}w webp/jpg + full avif`);
}
console.log(`Optimized ${files.length} source images.`);
```

- [ ] **Step 3: Run it and check output size**

```bash
npm run images:optimize
du -sh public/images
```

Expected: new `-400/-800/-1200/-1600.webp/.jpg` + `.avif` files alongside the 9 originals; total directory size increases (more variants) but the *served* payload per page drops sharply since pages now request an appropriately-sized variant instead of the full original — this is the ~650 KiB Lighthouse "image-delivery savings" finding from the spec being addressed directly. Keep the original full-size `.jpg` files too (do not delete) — they're a safe fallback and the source of truth for regenerating variants.

- [ ] **Step 4: Swap the largest content photos to `ResponsiveImage`**

Apply to the genuinely large, non-decorative photos: `Home.tsx`'s desktop hero (`HeroPhoto`, currently 800×1000 `aspect-[4/5]`) and "clean-home.jpg" band, `About.tsx`'s team photo, `Services.tsx`'s 5 service photos, `ServiceAreas.tsx`'s Arizona band. Example (`Home.tsx` desktop hero):

```diff
- <img
-   src="/images/hero.jpg"
-   alt="Beautifully maintained West Valley Arizona living room — the result of a Cleaning By Kandi visit"
-   className="w-full h-full object-cover"
-   width={800}
-   height={1000}
- />
+ <ResponsiveImage
+   base="/images/hero"
+   alt="Beautifully maintained West Valley Arizona living room — the result of a Cleaning By Kandi visit"
+   className="w-full h-full object-cover"
+   widths={[400, 800, 1200]}
+   width={800}
+   height={1000}
+   sizes="(min-width: 1024px) 40vw, 100vw"
+   priority
+ />
```

`priority` (→ `loading="eager"` + `fetchPriority="high"`) goes ONLY on the single actual LCP candidate — the desktop hero photo on `Home.tsx`. Every other `ResponsiveImage` usage omits `priority` (defaults to lazy). The existing 80px mobile hero medallion on `Home.tsx` (`w-20 h-20`) is a decorative thumbnail, not a content photo — point it at the smallest generated variant directly instead of using `ResponsiveImage`:

```diff
- <img src="/images/hero.jpg" ... className="w-20 h-20 rounded-full object-cover ..." width={80} height={80} />
+ <img src="/images/hero-400.webp" ... className="w-20 h-20 rounded-full object-cover ..." width={80} height={80} loading="lazy" />
```

- [ ] **Step 5: Rebuild and visually confirm no quality regression**

```bash
npm run build
npm run preview
```

Open each page at desktop and mobile widths; confirm photos still look sharp (webp quality 78 at the widths actually rendered should be visually indistinguishable from the original JPEGs at typical viewing sizes — spot-check the hero and one service photo side-by-side against `git show HEAD~1:public/images/hero.jpg` opened separately if any doubt).

- [ ] **Step 6: Commit** — folds into Commit Group 3 ("Performance and accessibility fixes") together with Task 10's contrast/focus fixes; do not commit yet, continue to Task 10.

---

### Task 10: Accessibility fixes — contrast, skip link, focus management

**Files:**
- Modify: `src/index.css` (contrast token fixes)
- Modify: `src/pages/Home.tsx`, `src/pages/Services.tsx` (2 white-on-primary-light buttons + 1 hover state)
- Modify: `src/components/Footer.tsx` (2 low-contrast legal links)
- Modify: `src/components/Header.tsx` (mobile menu focus trap)
- The skip link markup (`<a href="#main-content" className="skip-link">`) and `<main id="main-content">` landmark were already added in Task 2 Step 1. Task 2's implementer correctly built exactly what the brief specified — but the brief never specified CSS for `.skip-link`, so as things stand it renders as a permanently-visible line of text above the header on every page instead of the standard hidden-until-keyboard-focused pattern. This task adds that CSS (Step 5 below) — it's a real gap in the plan, not something Task 2 should have invented unprompted.

Contrast math (WCAG 2.1 SC 1.4.3, computed via the standard relative-luminance formula) for the 3 combinations named in the spec:

| Combination | Current ratio | AA normal-text (4.5:1) |
|---|---|---|
| `#0284c7` text on white/`#f8fafc` | 4.09:1 | **FAILS** |
| white text on `#0ea5e9` background | 2.77:1 | **FAILS** |
| `#64748b` on `#0f172a` | 3.75:1 | **FAILS** (passes only the 3:1 large-text/UI-component threshold) |

- [ ] **Step 1: Darken `--color-primary` in `src/index.css`** — this single token change fixes the `#0284c7`-on-white failure everywhere it's used as text (~20 call sites: eyebrow labels, phone/email links on Privacy/Terms/RequestQuote, "Read more" links, header CTA text), because contrast ratio is symmetric — the same hex that fails as text-on-white also fails as white-text's background, so this also sets up Step 2.

```diff
  :root {
-   --color-primary:       #0284C7;
-   --color-primary-dark:  #0369A1;
+   --color-primary:       #0369A1;   /* was primary-dark; #0284C7 on white is 4.09:1, fails AA */
+   --color-primary-dark:  #075985;   /* new hover/active shade, one step darker */
    --color-primary-light: #0EA5E9;   /* kept for large decorative surfaces/borders only — never text or small-button backgrounds */
```

Verified: `#0369A1` on white = 5.93:1 (passes AA, and passes for both directions per the symmetry note above).

- [ ] **Step 2: Fix the 2 white-on-`primary-light` buttons + 1 bad hover state**

`src/pages/Home.tsx:349`:
```diff
- className="inline-flex items-center justify-center gap-2 bg-brand-primary-light hover:bg-sky-400 text-white font-semibold px-7 py-3.5 rounded-xl transition-colors duration-200 cursor-pointer text-base min-h-[44px]"
+ className="inline-flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary-dark text-white font-semibold px-7 py-3.5 rounded-xl transition-colors duration-200 cursor-pointer text-base min-h-[44px]"
```

`src/pages/Services.tsx:117`:
```diff
- className="inline-flex items-center gap-2 bg-brand-primary-light hover:bg-sky-400 text-white font-semibold px-6 py-3.5 rounded-xl transition-colors duration-200 cursor-pointer"
+ className="inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-primary-dark text-white font-semibold px-6 py-3.5 rounded-xl transition-colors duration-200 cursor-pointer"
```

`src/pages/Services.tsx:239` (hover currently flips TO primary-light, making it worse on hover):
```diff
- className="inline-flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary-light text-white font-semibold px-6 py-3.5 rounded-xl transition-colors duration-200 cursor-pointer"
+ className="inline-flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary-dark text-white font-semibold px-6 py-3.5 rounded-xl transition-colors duration-200 cursor-pointer"
```

- [ ] **Step 3: Fix `#64748b`-on-`#0f172a` — Footer legal links**

`src/components/Footer.tsx:128,131`:
```diff
- <Link to="/privacy" className="text-xs text-slate-500 hover:text-slate-300 ...">
+ <Link to="/privacy" className="text-xs text-slate-400 hover:text-slate-300 ...">
...
- <Link to="/terms" className="text-xs text-slate-500 hover:text-slate-300 ...">
+ <Link to="/terms" className="text-xs text-slate-400 hover:text-slate-300 ...">
```

(`text-slate-400` = `#94A3B8`, 6.96:1 on `#0F172A` — passes AA, and matches the `text-slate-400` already used two lines above for the rest of the footer's body copy, so this is also a visual consistency fix, not just contrast.)

- [ ] **Step 4: Mobile menu focus management (`src/components/Header.tsx`)**

Currently declares `role="dialog" aria-modal="true"` but never moves focus into the panel on open or traps Tab within it — a screen reader user gets told "this is a modal dialog" while focus and Tab order behave like it isn't one. Add a minimal focus trap + initial-focus-on-open:

```diff
  export default function Header() {
    const [open, setOpen] = useState(false);
    const toggleRef = useRef<HTMLButtonElement>(null);
+   const menuRef = useRef<HTMLDivElement>(null);
+   const firstLinkRef = useRef<HTMLAnchorElement>(null);

+   /* Move focus into the panel when it opens */
+   useEffect(() => {
+     if (open) firstLinkRef.current?.focus();
+   }, [open]);

+   /* Trap Tab within the panel while open */
+   useEffect(() => {
+     if (!open) return;
+     const onKeyDown = (e: KeyboardEvent) => {
+       if (e.key !== 'Tab' || !menuRef.current) return;
+       const focusable = menuRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
+       if (focusable.length === 0) return;
+       const first = focusable[0];
+       const last = focusable[focusable.length - 1];
+       if (e.shiftKey && document.activeElement === first) {
+         e.preventDefault();
+         last.focus();
+       } else if (!e.shiftKey && document.activeElement === last) {
+         e.preventDefault();
+         first.focus();
+       }
+     };
+     document.addEventListener('keydown', onKeyDown);
+     return () => document.removeEventListener('keydown', onKeyDown);
+   }, [open]);
```

And in the mobile-menu JSX, add `ref={menuRef}` to the `id="mobile-menu"` container div, and `ref={firstLinkRef}` to the first `NavLink` in the mobile `navLinks.map(...)` (index 0 only — pass the ref conditionally: `ref={i === 0 ? firstLinkRef : undefined}` inside the map, or simplest, since it's always `navLinks[0]` = Home, give the Home NavLink an explicit ref by pulling it out of the `.map()` — keep the loop but check `label === 'Home'`... simplest robust approach: add `ref={firstLinkRef}` directly on the map's first rendered element via `index === 0`:

```diff
- {navLinks.map(({ to, label }) => (
+ {navLinks.map(({ to, label }, index) => (
    <NavLink
      key={to}
+     ref={index === 0 ? firstLinkRef : undefined}
      to={to}
```

(`NavLink` forwards refs to its underlying `<a>` in react-router-dom v7, so `firstLinkRef` typed as `RefObject<HTMLAnchorElement>` is correct.)

- [ ] **Step 5: Style `.skip-link` in `src/index.css`** — standard visually-hidden-until-focused pattern:

```css
.skip-link {
  position: absolute;
  top: -3rem;
  left: 0.5rem;
  z-index: 100;
  background: var(--color-primary);
  color: #FFFFFF;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 600;
  font-size: 0.875rem;
  text-decoration: none;
  transition: top 0.15s ease-out;
}

.skip-link:focus {
  top: 0.5rem;
}
```

Add this in `src/index.css`'s `@layer base` block, near the existing `:focus-visible` rule. White text on `--color-primary` (`#0369A1` after Step 1) is 5.93:1 — already AA-safe, no separate contrast fix needed here.

- [ ] **Step 6: Verify no horizontal overflow / visual brand shift**

```bash
npm run build && npm run preview
```

Load each page at 375px and 1440px widths; confirm buttons/links read the same visually (darker blue is a subtle shade change, not a redesign), no layout shifts, and Tab from the top of any page reveals the skip link, which then activates and moves focus to `#main-content`.

- [ ] **Step 7: Commit** (Commit Group 3 — "Performance and accessibility fixes", combining Task 9 + Task 10):

```bash
git add src/index.css src/pages/Home.tsx src/pages/Services.tsx src/pages/About.tsx \
  src/pages/ServiceAreas.tsx src/components/Footer.tsx src/components/Header.tsx \
  src/components/ResponsiveImage.tsx scripts/optimize-images.mjs public/images package.json package-lock.json
git commit -m "$(cat <<'EOF'
Fix color contrast, mobile-menu focus trap, and add responsive images

Darkens --color-primary (#0284C7 -> #0369A1) since it measured 4.09:1
against white — below the 4.5:1 WCAG AA threshold for normal text —
which also fixes every white-on-primary-light button (was 2.77:1) since
contrast ratio is symmetric between foreground/background. Fixes the
Footer's #64748b-on-#0f172a legal links (3.75:1) to slate-400 (6.96:1),
matching the rest of the footer's body-copy color. Adds a Tab-trap and
initial-focus-on-open to the mobile nav panel, which already declared
aria-modal="true" without actually behaving like a modal. Generates
webp/avif + 4 responsive widths per source photo via sharp and swaps
the largest content photos to a new ResponsiveImage component with
lazy-loading everywhere except the single actual LCP hero image.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 11: Extract and document the GHL form adapter

**Files:**
- Create: `src/lib/ghlAdapter.ts`
- Modify: `src/pages/RequestQuote.tsx` (use the adapter instead of inline `fetch`)
- Modify: `api/submit-quote.ts` (doc comment only — behavior already fixed in Task 1's cherry-pick)
- Modify: `.env.example`

**Interfaces:**
- Produces: `submitQuote(payload: QuotePayload): Promise<QuoteSubmitResult>` where `QuoteSubmitResult = { ok: true } | { ok: false; error: string }`.
- Consumes: `fetch` (global, mocked in tests).

- [ ] **Step 1: Write `src/lib/ghlAdapter.ts`**

```ts
// src/lib/ghlAdapter.ts
import { CONSENT_VERSION, TRANSACTIONAL_CONSENT_TEXT, MARKETING_CONSENT_TEXT } from './consent';

export interface QuotePayload {
  serviceType: string;
  bedrooms: string;
  bathrooms: string;
  sqft: string;
  frequency: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  preferredDate: string;
  notes: string;
  smsTransactionalConsent: boolean;
  smsMarketingConsent: boolean;
}

export type QuoteSubmitResult = { ok: true } | { ok: false; error: string };

/**
 * Posts a quote request to our own /api/submit-quote edge function, which
 * holds the GHL API key/location ID server-side and upserts the contact via
 * GHL's Contacts API. This is a same-origin relative path on purpose — it
 * works identically whether the frontend is on Vercel or Cloudflare, as long
 * as /api/submit-quote is deployed alongside it (see docs/ARCHITECTURE.md
 * "Form integration contract" for the current status of that deployment).
 */
export async function submitQuote(form: QuotePayload): Promise<QuoteSubmitResult> {
  try {
    const res = await fetch('/api/submit-quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        consentTimestamp: new Date().toISOString(),
        consentVersion: CONSENT_VERSION,
        consentUrl: typeof window !== 'undefined' ? window.location.href : '',
        consentTextTransactional: form.smsTransactionalConsent ? TRANSACTIONAL_CONSENT_TEXT : '',
        consentTextMarketing: form.smsMarketingConsent ? MARKETING_CONSENT_TEXT : '',
      }),
    });
    if (!res.ok) {
      return { ok: false, error: `Request failed (${res.status}). Please try again or call us at (480) 309-7607.` };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: 'Network error. Please check your connection and try again, or call us at (480) 309-7607.' };
  }
}
```

- [ ] **Step 2: Rewire `RequestQuote.tsx`'s `handleSubmit` to use it**

```diff
+ import { submitQuote } from '../lib/ghlAdapter';
  ...
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
+   if (submitting) return; // duplicate-submit guard in addition to the disabled button
    setSubmitting(true);
    setSubmitError('');
-   try {
-     const res = await fetch('https://cleaning-by-kandi.vercel.app/api/submit-quote', { ... });
-     if (!res.ok) { ... }
-     setSubmitted(true);
-   } catch { ... } finally { setSubmitting(false); }
+   const result = await submitQuote(form);
+   if (result.ok) {
+     setSubmitted(true);
+   } else {
+     setSubmitError(result.error);
+   }
+   setSubmitting(false);
  };
```

The pre-existing `disabled={!canSubmit || submitting}` on the submit button already prevents duplicate submissions at the UI layer; the `if (submitting) return;` guard at the top of `handleSubmit` is defense-in-depth against a second `submit` event firing before React re-renders the disabled state (e.g. rapid Enter-key presses).

- [ ] **Step 3: Update `.env.example`**

```diff
- # Formspree endpoint for the Request Quote form.
- # Get this from https://formspree.io → New Form → copy the endpoint URL.
- # Example: https://formspree.io/f/xpzgkwld
- VITE_FORMSPREE_ENDPOINT=
+ # GoHighLevel integration for /api/submit-quote (Vercel/Cloudflare edge
+ # function — see api/submit-quote.ts). Server-side only, never exposed to
+ # the client bundle. BLOCKED: real production values for these are not
+ # available in this repo/session — see docs/ARCHITECTURE.md "Form
+ # integration contract" for what's needed before this goes live.
+ GHL_API_KEY=
+ GHL_LOCATION_ID=
```

- [ ] **Step 4: Typecheck**

```bash
npx tsc -b --noEmit
```

- [ ] **Step 5: Commit** — defer to Task 12 (tests must exist and pass before this commits, per "Do not commit until the relevant tests pass").

---

### Task 12: Test setup + automated tests

**Files:**
- Create: `vitest.config.ts`
- Create: `tests/setup.ts`
- Create: `tests/routes.test.tsx`
- Create: `tests/jsonld.test.ts`
- Create: `tests/form.test.tsx`
- Create: `tests/a11y-contrast.test.ts`
- Modify: `package.json` (devDependencies: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `jsdom`)

**Interfaces:**
- Consumes: `ROUTES`/`getRouteMeta` from `src/lib/routes.ts`, `submitQuote` from `src/lib/ghlAdapter.ts`, `App` from `src/App.tsx`.

- [ ] **Step 1: Install test dependencies**

```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

- [ ] **Step 2: `vitest.config.ts`**

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    globals: true,
  },
});
```

- [ ] **Step 3: `tests/setup.ts`**

```ts
// tests/setup.ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 4: `tests/routes.test.tsx`** — covers spec Step 10's "all seven public routes; route-specific H1s; route-specific titles and canonicals; internal links; 404 behavior"

```tsx
// tests/routes.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../src/App';
import { ROUTES } from '../src/lib/routes';

describe.each(ROUTES)('route $path', (route) => {
  it('renders exactly one H1 matching the route registry', () => {
    render(
      <MemoryRouter initialEntries={[route.path]}>
        <App />
      </MemoryRouter>
    );
    const h1s = screen.getAllByRole('heading', { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent(route.h1);
  });
});

describe('unknown route', () => {
  it('renders the 404 page, not the homepage', () => {
    render(
      <MemoryRouter initialEntries={['/this-does-not-exist']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
  });
});

describe('internal links', () => {
  it('footer links to Privacy and Terms exist and point at real routes', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: /privacy policy/i })).toHaveAttribute('href', '/privacy');
    expect(screen.getByRole('link', { name: /terms of service/i })).toHaveAttribute('href', '/terms');
  });

  it('phone and email links have correct hrefs and accessible names', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    const phoneLinks = screen.getAllByRole('link', { name: /480.*309.*7607/ });
    expect(phoneLinks.length).toBeGreaterThan(0);
    for (const link of phoneLinks) expect(link).toHaveAttribute('href', 'tel:4803097607');
  });
});
```

Note: `Seo.tsx` is a no-op under jsdom too only if `import.meta.env.SSR` — Vitest's default environment is NOT SSR (`import.meta.env.SSR` is `false` under `environment: 'jsdom'`), so `Seo` renders its tags client-side as normal in these tests; title/canonical assertions belong in `tests/jsonld.test.ts` and the post-build `verify:static` script instead (jsdom's `document.title` handling of React 19's hoisting is not guaranteed to match browser behavior exactly — the authoritative check is the built-HTML verification script from Task 7, not a jsdom unit test). Keep this test file scoped to H1/links/404, which don't depend on that hoisting behavior.

- [ ] **Step 5: `tests/jsonld.test.ts`** — covers "LocalBusiness JSON-LD validity"

```ts
// tests/jsonld.test.ts
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import BusinessSchema from '../src/components/BusinessSchema';
import { BUSINESS, SERVICES } from '../src/lib/business';

describe('BusinessSchema JSON-LD', () => {
  function getSchema() {
    const { container } = render(<BusinessSchema />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
    return JSON.parse(script!.innerHTML);
  }

  it('has required LocalBusiness fields with verified values', () => {
    const schema = getSchema();
    expect(schema['@type']).toBe('LocalBusiness');
    expect(schema.name).toBe(BUSINESS.legalName);
    expect(schema.telephone).toBe(BUSINESS.telephone);
    expect(schema.email).toBe(BUSINESS.email);
    expect(schema.url).toBe('https://cleaningbykandi.com/');
  });

  it('lists exactly the 5 verified visible services, no more', () => {
    const schema = getSchema();
    const listed = schema.hasOfferCatalog.itemListElement.map((o: { itemOffered: { name: string } }) => o.itemOffered.name);
    expect(listed).toEqual([...SERVICES]);
    expect(listed).not.toContain('Organization Services');
    expect(listed).not.toContain('Eco-Friendly Cleaning');
  });

  it('does not include aggregateRating, review, or unverified geo/hours', () => {
    const schema = getSchema();
    expect(schema).not.toHaveProperty('aggregateRating');
    expect(schema).not.toHaveProperty('review');
    expect(schema).not.toHaveProperty('geo');
    expect(schema).not.toHaveProperty('openingHoursSpecification');
    expect(schema.address).not.toHaveProperty('streetAddress');
  });
});
```

- [ ] **Step 6: `tests/form.test.tsx`** — covers "form validation; mocked successful submission; mocked non-2xx submission; mocked network failure; duplicate-submission prevention"

```tsx
// tests/form.test.tsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import RequestQuote from '../src/pages/RequestQuote';

async function fillThroughStep3(user: ReturnType<typeof userEvent.setup>) {
  // Step 1: pick a service
  await user.click(screen.getByRole('button', { name: /residential cleaning/i }));
  await user.click(screen.getByRole('button', { name: /^next$/i }));
  // Step 2: home details
  await user.selectOptions(screen.getByLabelText(/bedrooms/i), '3');
  await user.selectOptions(screen.getByLabelText(/bathrooms/i), '2');
  await user.type(screen.getByLabelText(/square footage/i), '1800');
  await user.selectOptions(screen.getByLabelText(/frequency/i), 'weekly');
  await user.click(screen.getByRole('button', { name: /^next$/i }));
  // Step 3: contact
  await user.type(screen.getByLabelText(/first name/i), 'Jane');
  await user.type(screen.getByLabelText(/last name/i), 'Doe');
  await user.type(screen.getByLabelText(/^email/i), 'jane@example.com');
  await user.type(screen.getByLabelText(/phone/i), '4805551234');
  await user.type(screen.getByLabelText(/^city/i), 'Surprise');
}

describe('RequestQuote form', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('keeps Next disabled until a service is selected on step 1', () => {
    render(<MemoryRouter><RequestQuote /></MemoryRouter>);
    expect(screen.getByRole('button', { name: /^next$/i })).toBeDisabled();
  });

  it('shows a success state only after a real 2xx response', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(new Response(JSON.stringify({ success: true }), { status: 200 }));
    const user = userEvent.setup();
    render(<MemoryRouter><RequestQuote /></MemoryRouter>);
    await fillThroughStep3(user);
    await user.click(screen.getByRole('button', { name: /submit quote request/i }));
    await waitFor(() => expect(screen.getByText(/thank you|request received|we.?ll be in touch/i)).toBeInTheDocument());
  });

  it('shows a retryable error on a non-2xx response, no success state', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(new Response(JSON.stringify({ error: 'boom' }), { status: 500 }));
    const user = userEvent.setup();
    render(<MemoryRouter><RequestQuote /></MemoryRouter>);
    await fillThroughStep3(user);
    await user.click(screen.getByRole('button', { name: /submit quote request/i }));
    await waitFor(() => expect(screen.getByText(/try again|call us/i)).toBeInTheDocument());
    expect(screen.queryByText(/thank you|request received/i)).not.toBeInTheDocument();
  });

  it('shows a retryable error on a network failure', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new TypeError('Failed to fetch'));
    const user = userEvent.setup();
    render(<MemoryRouter><RequestQuote /></MemoryRouter>);
    await fillThroughStep3(user);
    await user.click(screen.getByRole('button', { name: /submit quote request/i }));
    await waitFor(() => expect(screen.getByText(/network|try again|call us/i)).toBeInTheDocument());
  });

  it('disables the submit button while a submission is in flight (duplicate-submit guard)', async () => {
    let resolveFetch: (v: Response) => void = () => {};
    (fetch as ReturnType<typeof vi.fn>).mockReturnValueOnce(new Promise((resolve) => { resolveFetch = resolve; }));
    const user = userEvent.setup();
    render(<MemoryRouter><RequestQuote /></MemoryRouter>);
    await fillThroughStep3(user);
    const submitBtn = screen.getByRole('button', { name: /submit quote request|sending/i });
    await user.click(submitBtn);
    expect(submitBtn).toBeDisabled();
    resolveFetch(new Response(JSON.stringify({ success: true }), { status: 200 }));
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
  });
});
```

Adjust the exact `getByRole`/`getByLabelText`/text-matcher strings in this task's execution step against the *real* rendered markup — the field labels/success copy above are best-effort from the diff reviewed during planning; if `RequestQuote.tsx`'s actual success-state text or field `id`s differ, use the real strings (run `screen.debug()` once locally while writing the test if a matcher doesn't find its element).

- [ ] **Step 7: `tests/a11y-contrast.test.ts`** — covers Step 8's 3 named color combinations as a regression guard (pure-function contrast check, no rendering)

```ts
// tests/a11y-contrast.test.ts
import { describe, it, expect } from 'vitest';

function relativeLuminance(hex: string): number {
  const c = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(c.slice(i, i + 2), 16) / 255);
  const lin = (v: number) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function contrastRatio(hexA: string, hexB: string): number {
  const [l1, l2] = [relativeLuminance(hexA), relativeLuminance(hexB)].sort((a, b) => b - a);
  return (l1 + 0.05) / (l2 + 0.05);
}

describe('WCAG AA contrast — fixed token pairs (Step 8)', () => {
  it('brand-primary text passes 4.5:1 on white', () => {
    expect(contrastRatio('#0369A1', '#FFFFFF')).toBeGreaterThanOrEqual(4.5);
  });
  it('white text on the fixed CTA background passes 4.5:1', () => {
    expect(contrastRatio('#FFFFFF', '#0369A1')).toBeGreaterThanOrEqual(4.5);
  });
  it('footer legal-link text passes 4.5:1 on the footer background', () => {
    expect(contrastRatio('#94A3B8', '#0F172A')).toBeGreaterThanOrEqual(4.5);
  });
  it('documents the 3 combinations that originally failed, for regression context', () => {
    expect(contrastRatio('#0284C7', '#FFFFFF')).toBeLessThan(4.5);
    expect(contrastRatio('#FFFFFF', '#0EA5E9')).toBeLessThan(4.5);
    expect(contrastRatio('#64748B', '#0F172A')).toBeLessThan(4.5);
  });
});
```

- [ ] **Step 8: Run the full suite**

```bash
npm run test
```

Expected: all tests pass. If `routes.test.tsx` or `form.test.tsx` matchers don't find elements, fix the matcher against real markup — do not change component markup just to satisfy a guessed test string.

- [ ] **Step 9: Commit** (Commit Group 4 — "Form adapter and automated tests", combining Task 11 + Task 12):

```bash
git add src/lib/ghlAdapter.ts src/pages/RequestQuote.tsx .env.example \
  vitest.config.ts tests/ package.json package-lock.json
git commit -m "$(cat <<'EOF'
Extract GHL form adapter and add an automated test suite

Moves the quote form's fetch call into src/lib/ghlAdapter.ts (submitQuote)
so it's independently testable with a mocked fetch, points it at the
same-origin /api/submit-quote instead of the hardcoded Vercel preview
URL, and adds a duplicate-submit guard on top of the existing disabled-
button behavior. Replaces the Formspree env var with GHL_API_KEY/
GHL_LOCATION_ID in .env.example (server-side only, no real values
committed). Adds Vitest + Testing Library covering all 7 routes' H1s,
404 behavior, internal/contact links, LocalBusiness JSON-LD shape, the
5-service allowlist, and mocked success/4xx/network-error/duplicate-
submit form scenarios. Real GHL credentials are not available in this
environment — form testing here is mocked-only; see docs/ARCHITECTURE.md
for what's still needed before this integration is production-verified.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 13: Cloudflare staging configuration

**Files:**
- Create: `wrangler.jsonc` (adapted from `origin/cloudflare/workers-autoconfig`, `not_found_handling` fixed)
- Modify: `vite.config.ts` (add `@cloudflare/vite-plugin`)
- Modify: `package.json` (add `wrangler`, `@cloudflare/vite-plugin`; add `preview:cf`/`deploy` scripts — deploy script exists but is never invoked by this task)
- Modify: `.gitignore` (wrangler-specific ignores from the reference branch)

- [ ] **Step 1: `wrangler.jsonc`** — start from `origin/cloudflare/workers-autoconfig`'s version, fix `not_found_handling`:

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "cleaning-by-kandi",
  "compatibility_date": "2026-07-25",
  "observability": {
    "enabled": true
  },
  "assets": {
    // "single-page-application" would serve index.html (200 OK) for every
    // unmatched path — exactly the soft-404 behavior this migration is
    // removing. "404-page" serves dist/404.html with a real 404 status for
    // paths that don't match a prerendered route or a real asset.
    "not_found_handling": "404-page"
  },
  "compatibility_flags": [
    "nodejs_compat"
  ]
}
```

- [ ] **Step 2: Add the Cloudflare Vite plugin**

```bash
npm install --save-dev wrangler @cloudflare/vite-plugin
```

```diff
  import { defineConfig } from 'vite'
  import react from '@vitejs/plugin-react'
+ import { cloudflare } from '@cloudflare/vite-plugin'

  export default defineConfig(({ command }) => ({
    base: '/',
    appType: command === 'serve' ? 'spa' : 'mpa',
-   plugins: [react()],
+   plugins: [react(), cloudflare()],
  }))
```

- [ ] **Step 3: `.gitignore` additions** (from the reference branch, still correct):

```diff
  .vercel
  .claude/
+
+ # wrangler files
+ .wrangler
+ .dev.vars*
+ !.dev.vars.example
```

(`.env*`/`!.env.example` are already covered by the existing `*.local` + explicit `.env.local` handling in this repo's `.gitignore` — don't duplicate/broaden that pattern beyond what's already there.)

- [ ] **Step 4: `package.json` scripts**

```diff
    "preview": "vite preview",
+   "preview:cf": "npm run build && wrangler dev",
```

(No `deploy` script wired to run automatically anywhere — per the safety rules, deployment is a manual, explicit, human-triggered action outside this task's scope. Documented, not automated.)

- [ ] **Step 5: Verify `wrangler dev` serves the prerendered build correctly**

```bash
npm run build
npx wrangler dev --port 8788 &
sleep 2
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8788/about
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8788/this-does-not-exist
kill %1
```

Expected: `/about` → `200`, `/this-does-not-exist` → `404`. This is a **local** wrangler dev server binding to localhost only — no external network exposure, no account/DNS interaction, satisfies "do not deploy."

- [ ] **Step 6: Commit** — defer to Task 15 (combine with docs into Commit Group 5).

---

### Task 14: CLAUDE.md and README reconciliation

**Files:**
- Modify: `CLAUDE.md`
- Modify: `README.md`
- Create: `docs/ARCHITECTURE.md`
- Create: `docs/DEPLOYMENT.md`

- [ ] **Step 1: Reconcile `CLAUDE.md`** — do not delete the GHL-rebuild history; mark it superseded and point at the new decision record. Insert at the very top, above the existing `# Claude Instructions — Cleaning By Kandi` heading:

```markdown
> **Superseded 2026-08-16.** The instructions below described rebuilding
> this site natively inside GoHighLevel's page builder. That direction has
> been replaced: the approved architecture is a directly-hosted, prerendered
> frontend (this React/Vite app) on Cloudflare, with GoHighLevel retained
> only as the CRM/workflow backend behind the quote form's API — GHL is no
> longer the public page shell. See `docs/ARCHITECTURE.md` for the current
> decision record and rationale. The business facts and service list below
> are still accurate and still the source of truth; the "Rebuild natively
> in GHL" instructions and GHL-build-sheet output format are historical —
> kept for reference, not to be followed for new work.

---

```

Leave the rest of the file (business facts, services list, GHL build-sheet format) exactly as-is below that notice — it's accurate historical context per Step 11's "do not erase useful historical context."

- [ ] **Step 2: Write `docs/ARCHITECTURE.md`**

Cover, concretely (not placeholders — write the actual content, informed by every decision made in Tasks 1–13):
- The architecture diagram from the spec (direct frontend → GHL webhook/API → GHL CRM).
- Why prerendering via a Node SSR entry instead of Next/Astro/Remix (smallest footprint, reuses installed deps — same reasoning as this plan's Architecture section).
- Why `--color-primary` changed value instead of overriding it at each of 20 call sites (single-token fix, contrast ratio symmetry).
- Why the GHL-shell-era absolute Vercel URLs, pinned `cbk.js`/`cbk.css` filenames, and `vercel.json` cache headers were removed.
- **Open questions for the owner** (do not guess these):
  1. Are "Organization Services" and "Eco-Friendly Cleaning" (listed in `CLAUDE.md`'s business facts) actually active offerings? They don't appear on `/services` or anywhere else visible. If yes, they need a visible page section before they can appear in metadata/JSON-LD; if no, `CLAUDE.md`'s business list should be corrected.
  2. `priceRange: "$$"` was in the baseline JSON-LD draft with no verifiable basis in the repo — confirm or drop.
  3. `/cleaning-tips` — currently 404s in production and in this build. Per the spec, no new article is being invented this phase; confirm whether the intended resolution is a permanent 404, a 410 Gone, or a future replacement page.
  4. The real GHL API key, GHL location ID, and confirmation that `/api/submit-quote`'s field-mapping (`customFields` keys like `service_type`, `cleaning_frequency`, etc.) matches GHL's actual custom-field keys in the live sub-account — none of this is verifiable from the repo or from a logged-out view of the production site. **This blocks calling the form integration "production-ready."**
  5. Real business hours, if any are ever to be published (currently correctly omitted from JSON-LD as unverified).

- [ ] **Step 3: Write `docs/DEPLOYMENT.md`**

Cover, concretely:
- Local dev: `npm ci`, `npm run dev`.
- Full build: `npm run build` (chains `tsc -b`, client build, SSR build, prerender, sitemap generation — list the exact chain from Task 5 Step 4).
- Verification: `npm run test`, `npm run verify:static`, `npm run lint`.
- Local Cloudflare preview: `npm run preview:cf` (wrangler dev, localhost only).
- **Staging deployment prerequisites** (explicitly NOT done by this task): a Cloudflare account/API token available to whoever runs `wrangler deploy` or connects the repo to Cloudflare Pages; `GHL_API_KEY` and `GHL_LOCATION_ID` set as Cloudflare secrets (never in the repo); DNS/staging-subdomain decision (this task does not touch `cleaningbykandi.com` DNS at all); confirmation of the `/api/submit-quote` runtime target on Cloudflare (the existing `api/submit-quote.ts` uses Vercel's `export const config = { runtime: 'edge' }` convention — Cloudflare Pages Functions use a different file-based convention (`functions/api/submit-quote.ts` with an `onRequestPost` export, not a Vercel-style default-export handler); **this file needs a Cloudflare-Functions-shaped rewrite before it will run on Cloudflare** — flag this explicitly, do not silently assume Vercel's edge-function shape works unchanged on Cloudflare Pages Functions.
- Rollback: this is a local branch only; "rollback" = do not merge/deploy it. Once staged, rollback would mean reverting the Cloudflare Pages deployment to the prior one via the Cloudflare dashboard/API (external action, out of scope here).
- What's intentionally unresolved: the 5 "Open questions for the owner" from `docs/ARCHITECTURE.md`, plus the Cloudflare Pages Functions rewrite of `api/submit-quote.ts` just noted.

**This is a real, concrete finding discovered while writing this task, not present in the original spec's problem list — flag it prominently in the final report: `api/submit-quote.ts` as currently written (Vercel Edge Function shape) will not run unmodified on Cloudflare Pages Functions.** Do not attempt the Cloudflare Functions rewrite in this task without user confirmation — it's a meaningful behavior change to production-critical form code and the spec's stop conditions cover exactly this ("direct hosting would break the current quote workflow"). Document it as a blocking follow-up instead.

- [ ] **Step 4: `README.md`** — update/add sections for dev/build/test commands, linking to the two new docs:

```markdown
## Development

    npm ci
    npm run dev

## Build

    npm run build

Runs typecheck, client build, SSR build, prerenders all 7 public routes to
static HTML, and generates dist/sitemap.xml. See docs/ARCHITECTURE.md.

## Test & verify

    npm run test            # Vitest — routes, JSON-LD, form, contrast
    npm run lint
    npm run verify:static   # asserts against the built dist/ output

## Deployment

See docs/DEPLOYMENT.md — Cloudflare staging steps and prerequisites.
```

- [ ] **Step 5: Commit** (Commit Group 5 — "Cloudflare staging configuration and documentation", combining Task 13 + Task 14):

```bash
git add wrangler.jsonc vite.config.ts .gitignore package.json package-lock.json \
  CLAUDE.md README.md docs/ARCHITECTURE.md docs/DEPLOYMENT.md
git commit -m "$(cat <<'EOF'
Add Cloudflare staging config and reconcile architecture docs

Adds wrangler.jsonc (adapted from origin/cloudflare/workers-autoconfig,
with not_found_handling fixed from "single-page-application" to
"404-page" so unmatched paths actually 404 instead of soft-404ing to
index.html) and the @cloudflare/vite-plugin. CLAUDE.md's "rebuild
natively in GHL" instructions are marked superseded rather than deleted,
pointing at new docs/ARCHITECTURE.md and docs/DEPLOYMENT.md, which
record the direct-hosting + GHL-backend decision, the open questions
that need owner confirmation (Organization Services / Eco-Friendly
Cleaning, priceRange, /cleaning-tips resolution, real GHL credentials),
and a concrete blocker found while documenting deployment:
api/submit-quote.ts is written as a Vercel Edge Function and will not
run unmodified on Cloudflare Pages Functions without a rewrite, which
is out of scope for this branch pending confirmation.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 15: Full verification pass (Step 12 of the spec)

**Files:** none — this task runs commands and records real output, no code changes unless a verification step surfaces a bug, in which case fix it, re-verify, and fold the fix into the most relevant existing commit group (amend only if not yet reported to the user as final; otherwise a small follow-up commit in the same group).

- [ ] **Step 1: Run the full command sequence from the spec's Step 12**

```bash
npm ci
npm audit
npm run lint
npm run test
npm run build
git diff --check
git status --short --branch
```

Record actual output for the final report — do not summarize as "passed" without showing what ran.

- [ ] **Step 2: Serve the production build and hit every route with real HTTP requests**

```bash
npm run preview &
sleep 1
for path in / /about /services /service-areas /request-quote /privacy /terms /cleaning-tips /about/nested /request-quote?utm_source=test; do
  echo "=== $path ==="
  curl -s -o /dev/null -w "status=%{http_code} url_effective=%{url_effective}\n" "http://localhost:4173$path"
done
kill %1
```

For each of the 7 real routes, additionally pull title/canonical/OG/H1/JSON-LD out of the response body (`curl -s ... | grep -oE '<title>.*</title>|canonical.*href="[^"]*"|og:image.*content="[^"]*"'` or reuse `scripts/verify-static-output.mjs`'s cheerio logic — that script already IS this check, run against `dist/`, so this step can mostly point at "see `npm run verify:static` output above" rather than re-deriving it via curl+grep). Confirm:
- `/cleaning-tips` → `404` (not silently redirected to `/`).
- Nested unknown path (`/about/nested`) → `404`.
- Query string on a real route (`/request-quote?utm_source=test`) → `200`, same content as `/request-quote`.

- [ ] **Step 3: Robots and sitemap**

```bash
curl -s http://localhost:4173/robots.txt
curl -s http://localhost:4173/sitemap.xml
```

- [ ] **Step 4: Manual browser check (desktop + mobile viewport) via the `run` skill or direct browser tool** — check each route for: no console errors, no broken images (Network tab, 200 on every `<img>`/`<source>`), no horizontal overflow at 375px, keyboard navigation reaches all header/footer links and the mobile menu traps focus correctly (Task 10), mobile menu opens/closes with Escape returning focus to the toggle button (pre-existing behavior, confirm not regressed).

- [ ] **Step 5: Lighthouse, run 3× against the local production build, report the median — not a single run**

```bash
npm run preview &
sleep 1
for i in 1 2 3; do
  npx lighthouse http://localhost:4173/ --preset=desktop --only-categories=performance,accessibility,best-practices,seo --output=json --output-path=/tmp/lh-$i.json --chrome-flags="--headless"
done
kill %1
```

(Use mobile emulation, not `--preset=desktop`, per the spec — drop that flag; Lighthouse defaults to mobile throttling/viewport unless desktop preset is passed.) Report the median Performance/Accessibility/Best-Practices/SEO scores and median CLS across the 3 runs, explicitly labeled as **lab data**, not real-user Core Web Vitals — do not claim otherwise regardless of the numbers.

- [ ] **Step 6: No commit for this task** — it's pure verification. If Step 1–5 surface a real defect, fix it as a small amendment to the most relevant existing commit (Tasks 6–14), re-run the specific failing check, and note the fix in the final report's file-change summary.

---

## Self-Review Notes (completed during planning, not a step to re-run)

- **Spec coverage:** Steps 1–2 of the spec are already done (git state established, cherry-pick captured prior work, `origin/cloudflare/workers-autoconfig` inspected). Steps 3–11 map to Tasks 2–14 above. Step 12 maps to Task 15. Step 13 (final response) is produced by the executor after Task 15, not a plan task itself — see "Final Report" note below.
- **Placeholder scan:** no TBD/"add error handling"/"similar to Task N" phrasing left in any task; every code step has real code or an exact diff.
- **Type consistency:** `RouteMeta` (Task 3) is the single shape consumed by `Seo.tsx`, `scripts/prerender.mjs`, `scripts/generate-sitemap.mjs`, `scripts/verify-static-output.mjs`, and `tests/routes.test.tsx` — verified all 5 use the same field names (`path`, `title`, `description`, `h1`, `image`, `outDir`). `QuotePayload`/`QuoteSubmitResult` (Task 11) match between `ghlAdapter.ts` and `form.test.tsx`'s usage.
- **New gap found and folded in during planning, not in the original spec:** `api/submit-quote.ts`'s Vercel-Edge-Function shape is incompatible with Cloudflare Pages Functions' file-based convention. This is flagged as a blocking, unresolved item in Task 14 rather than silently fixed or silently ignored — a real Cloudflare Functions rewrite of production-critical form-submission code is exactly the kind of change the spec's stop conditions ask to surface rather than guess at.

## Final Report

After Task 15, produce the Step 13 response format from the spec directly in the conversation (branch name, base SHA, final HEAD SHA, file-change summary, architecture rationale, route matrix, test/lint/build/audit/Lighthouse results, form/GHL status, unresolved business questions, security advisories, staging steps, and confirmation nothing was pushed/deployed). This is a reporting step, not a code task — no plan task file needed for it.

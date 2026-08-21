// scripts/verify-static-output.mjs
import { readFile, access } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as cheerio from 'cheerio';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const distDir = resolve(root, 'dist');
const { ROUTES, SITE_URL } = await import(resolve(root, 'dist-ssr/entry-server.js'));

const failures = [];
const fail = (msg) => failures.push(msg);

// vercel.json must never reintroduce a catch-all SPA rewrite to the
// homepage — that makes every unmatched path return 200 with index.html
// instead of a real 404, silently undoing this project's per-route
// prerendering (see docs/ARCHITECTURE.md, "vercel.json's catch-all rewrite
// is a live soft-404 concern"). No vercel.json at all is fine — Vercel's
// default static serving already returns dist/404.html with a real 404 for
// unmatched paths without any rewrite config.
try {
  const rawVercelConfig = await readFile(resolve(root, 'vercel.json'), 'utf-8');
  let vercelConfig;
  try {
    vercelConfig = JSON.parse(rawVercelConfig);
  } catch (parseErr) {
    fail(`vercel.json exists but is not valid JSON: ${parseErr.message}`);
    vercelConfig = null;
  }
  if (vercelConfig) {
    const rewriteEntries = Array.isArray(vercelConfig.rewrites)
      ? vercelConfig.rewrites
      : [
          ...(vercelConfig.rewrites?.beforeFiles ?? []),
          ...(vercelConfig.rewrites?.afterFiles ?? []),
          ...(vercelConfig.rewrites?.fallback ?? []),
        ];
    const CATCH_ALL_SOURCES = new Set(['/(.*)', '(.*)', '/:path*', '/:match*', '/*', '*']);
    const HOMEPAGE_DESTINATIONS = new Set(['/index.html', 'index.html', '/']);
    for (const rule of rewriteEntries) {
      if (CATCH_ALL_SOURCES.has(rule.source) && HOMEPAGE_DESTINATIONS.has(rule.destination)) {
        fail(
          `vercel.json has a catch-all rewrite ("${rule.source}" -> "${rule.destination}") that ` +
            `would serve the homepage with HTTP 200 for every unmatched path instead of a real ` +
            `404 — see docs/ARCHITECTURE.md`
        );
      }
    }
  }
} catch (err) {
  if (err.code !== 'ENOENT') {
    fail(`vercel.json could not be read: ${err.message}`);
  }
  // ENOENT (no vercel.json) is fine — no rewrites config means no catch-all.
}

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
  else {
    const h1Text = h1s.first().text();
    if (h1Text !== route.h1) {
      fail(`${route.path}: h1 text mismatch — got "${h1Text}", expected "${route.h1}"`);
    }
  }

  for (const [label, url] of [['og:image', ogImage], ['twitter:image', twitterImage]]) {
    if (!url) fail(`${route.path}: missing ${label}`);
    else if (!url.startsWith(SITE_URL)) fail(`${route.path}: ${label} "${url}" is not on the canonical origin`);
  }

  // Stable entry filenames: production's GHL page embeds these via
  // hardcoded <script>/<link> tags at fixed paths (see docs/ARCHITECTURE.md
  // "Unresolved deployment requirement"). A content-hashed entry filename
  // would silently 404 that embed on every deploy, so every route's built
  // HTML must reference these exact stable URLs, not just "some" script/link.
  const scriptSrc = $('script[type="module"]').attr('src');
  const styleHrefs = $('link[rel="stylesheet"]').map((_, el) => $(el).attr('href')).get();
  if (scriptSrc !== '/assets/cbk.js') fail(`${route.path}: entry script src is "${scriptSrc}", expected "/assets/cbk.js"`);
  if (!styleHrefs.includes('/assets/cbk.css')) fail(`${route.path}: no stylesheet link with href "/assets/cbk.css" found (got: ${styleHrefs.join(', ')})`);

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

// Stable entry files exist on disk at the exact paths every route's HTML
// references above (see the per-route script/link assertions).
await access(resolve(distDir, 'assets/cbk.js')).catch(() => fail('dist/assets/cbk.js is missing'));
await access(resolve(distDir, 'assets/cbk.css')).catch(() => fail('dist/assets/cbk.css is missing'));

if (failures.length > 0) {
  console.error(`\nstatic-output verification FAILED (${failures.length} issue(s)):\n`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(`static-output verification passed for ${ROUTES.length} routes.`);

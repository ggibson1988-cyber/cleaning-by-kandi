// scripts/generate-sitemap.mjs
import { writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const { ROUTES, SITE_URL } = await import(resolve(root, 'dist-ssr/entry-server.js'));

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

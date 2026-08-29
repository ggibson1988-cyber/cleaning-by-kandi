// scripts/prerender.mjs
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const distDir = resolve(root, 'dist');

const template = await readFile(resolve(distDir, 'index.html'), 'utf-8');
const { render, ROUTES, SITE_URL } = await import(resolve(root, 'dist-ssr/entry-server.js'));

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

console.log('Prerendering routes...');
for (const route of ROUTES) {
  const bodyHtml = render(route.path);
  const headHtml = buildHead(route, SITE_URL);
  await writeRoute(route.outDir, headHtml, bodyHtml);
}

// 404 page: real content, robots noindex baked into the head, no canonical
// (a 404 has no canonical URL), status handled by hosting config (Task 13).
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

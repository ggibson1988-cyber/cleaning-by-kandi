# Cleaning By Kandi

Prerendered, directly-hosted marketing site for Cleaning By Kandi, LLC (Surprise / West Valley,
Arizona) — Vite + React 19 + react-router-dom, with a GoHighLevel-backed quote form. See
`docs/ARCHITECTURE.md` for the full decision record and `CLAUDE.md` for business facts and
historical context.

## Development

    npm ci
    npm run dev

## Build

    npm run build

Runs typecheck, client build, SSR build, prerenders all 7 public routes to static HTML, and
generates `dist/sitemap.xml`. See `docs/ARCHITECTURE.md`.

## Test & verify

    npm run test            # Vitest — routes, JSON-LD, form, contrast
    npm run lint
    npm run verify:static   # asserts against the built dist/ output

## Deployment

See `docs/DEPLOYMENT.md` — Cloudflare staging steps and prerequisites. Nothing in this repo is
deployed yet; the quote form's API handler needs a Cloudflare-Functions-shaped rewrite before a
Cloudflare deployment's form will work — see that doc's staging prerequisites.

## Local Cloudflare preview

    npm run preview:cf

Builds and serves `dist/` through `wrangler dev`'s local Workers runtime emulation. Localhost
only — no Cloudflare account or network deployment involved.

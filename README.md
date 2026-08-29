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

See `docs/DEPLOYMENT.md` and `docs/ARCHITECTURE.md`. Nothing in this repo is deployed yet.
Production architecture: GoHighLevel hosts `cleaningbykandi.com`; the custom frontend/build assets
are created and deployed through Vercel. Cloudflare Workers/Pages are **not** part of the approved
hosting architecture. How GHL will serve this frontend's clean routes is not yet designed — see
`docs/ARCHITECTURE.md`'s "Unresolved deployment requirement" section before assuming any staging
or production path.

## Local preview

    npm run preview

Vite's own generic build-preview server. Localhost only. See `docs/DEPLOYMENT.md` for its known
trailing-slash limitation — it does not prove canonical no-trailing-slash URLs will work in
production.

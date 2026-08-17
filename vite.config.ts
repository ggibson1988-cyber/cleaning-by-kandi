import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { cloudflare } from '@cloudflare/vite-plugin'

// https://vite.dev/config/
export default defineConfig(({ command, isPreview }) => ({
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
  // Vite reports `command === 'serve'` for BOTH `vite dev` and
  // `vite preview` — it does not distinguish them. `isPreview` is `true`
  // only for `vite preview`, so it's needed to scope this to dev only;
  // preview must behave like production (real 404s) to verify the build.
  appType: command === 'serve' && !isPreview ? 'spa' : 'mpa',
  // The Cloudflare plugin only applies to `vite dev` (command === 'serve'
  // and not preview), where it emulates the Workers runtime for local
  // development. It must NOT run during `vite build`: its
  // builder.buildApp hook hijacks every `vite build` invocation
  // (including the `--ssr` build used by build:ssr), forcing hashed SSR
  // chunk filenames and breaking scripts/prerender.mjs's fixed
  // `dist-ssr/entry-server.js` import. It must also NOT run during
  // `vite preview`: `command === 'serve'` alone matches preview too, but
  // the plugin's config resolution expects a
  // `.wrangler/deploy/config.json` that only exists after a Workers
  // deploy, so loading it during plain `vite preview` throws ENOENT;
  // `isPreview` is what distinguishes preview from dev here.
  // `wrangler dev` (used by `preview:cf`) is a separate CLI that reads
  // wrangler.jsonc directly and never loads this config, so restricting
  // the plugin to dev mode doesn't affect Cloudflare verification.
  plugins: command === 'serve' && !isPreview ? [react(), cloudflare()] : [react()],
}))

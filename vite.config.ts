import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command, isPreview, isSsrBuild }) => ({
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
  plugins: [react()],
  // Pin the client entry JS/CSS to stable filenames (assets/cbk.js,
  // assets/cbk.css) — production's GHL page embeds these via hardcoded
  // <script>/<link> tags pointing at fixed paths (see
  // docs/ARCHITECTURE.md "Unresolved deployment requirement"); a
  // content-hashed entry filename would 404 that embed on every deploy.
  // Scoped to the client build only (isSsrBuild is true/false depending on
  // which of the two `vite build` invocations in `npm run build` is
  // running) — dist-ssr/entry-server.js's filename is relied on verbatim
  // by scripts/prerender.mjs and scripts/verify-static-output.mjs and must
  // stay untouched. Code-split chunks and all other assets (images, etc.)
  // keep normal content-hashed names — only the two entry files are
  // pinned.
  ...(command === 'build' && !isSsrBuild
    ? {
        build: {
          rollupOptions: {
            output: {
              entryFileNames: (chunkInfo: { name?: string }) =>
                chunkInfo.name === 'index' ? 'assets/cbk.js' : 'assets/[name]-[hash].js',
              chunkFileNames: 'assets/[name]-[hash].js',
              assetFileNames: (assetInfo: { name?: string; names?: string[] }) => {
                const name = assetInfo.names?.[0] ?? assetInfo.name ?? '';
                return name === 'index.css' ? 'assets/cbk.css' : 'assets/[name]-[hash][extname]';
              },
            },
          },
        },
      }
    : {}),
}))

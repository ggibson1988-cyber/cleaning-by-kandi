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

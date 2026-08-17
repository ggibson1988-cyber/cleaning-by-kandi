import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Stable, non-hashed entry filenames so the GoHighLevel embed URLs
        // (assets/cbk.js, assets/cbk.css) never break on redeploy. Cache
        // freshness is handled by revalidation headers in vercel.json.
        entryFileNames: 'assets/cbk.js',
        chunkFileNames: 'assets/cbk-[name].js',
        assetFileNames: 'assets/cbk.[ext]',
      },
    },
  },
})

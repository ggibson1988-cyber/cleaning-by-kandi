import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from './App';

// This file is a Node-only SSR entry point (built via `vite build --ssr` and
// imported from scripts/*.mjs as dist-ssr/entry-server.js) — it's never
// processed by Vite Fast Refresh, so oxlint's "only export components"
// warning about the ROUTES/SITE_URL re-exports below is a false positive.
export function render(url: string): string { // oxlint-disable-line react/only-export-components
  return renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>
  );
}

export { ROUTES } from './lib/routes';
export { SITE_URL } from './lib/business';

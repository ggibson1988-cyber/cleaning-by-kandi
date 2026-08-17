import { StrictMode } from 'react';
import { hydrateRoot, createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';

const mount = document.getElementById('cbk-root') ?? document.getElementById('root');

if (!mount) {
  throw new Error('Cleaning By Kandi mount element not found. Add <div id="cbk-root"></div> to the page.');
}

const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// Prerendered pages have server-rendered markup already in #cbk-root — hydrate it.
// `npm run dev` has no prerendered markup, so fall back to a plain client render.
if (mount.hasChildNodes()) {
  hydrateRoot(mount, app);
} else {
  createRoot(mount).render(app);
}

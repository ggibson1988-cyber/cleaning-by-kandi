import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const mount = document.getElementById('cbk-root') ?? document.getElementById('root')

if (!mount) {
  throw new Error('Cleaning By Kandi mount element not found. Add <div id="cbk-root"></div> to the page.')
}

createRoot(mount).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

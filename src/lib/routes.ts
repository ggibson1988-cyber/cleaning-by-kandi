// src/lib/routes.ts
import { canonicalImage } from './seoImage';

export interface RouteMeta {
  path: string;
  title: string;
  description: string;
  h1: string;
  image: string;
  /** Directory this route prerenders to under dist/. "" = dist/index.html */
  outDir: string;
}

const DEFAULT_IMAGE = canonicalImage('/images/hero.jpg');

export const ROUTES: RouteMeta[] = [
  {
    path: '/',
    outDir: '',
    title: 'House Cleaning in Surprise & the West Valley, AZ | Cleaning By Kandi',
    description: "Reliable, detail-obsessed residential and commercial cleaning across Surprise, Peoria, Glendale & the West Valley. Fully insured, locally owned. Get a free quote.",
    // Actual <h1> (Home.tsx): "West Valley Homes,<br />Cleaned Right. By Kandi."
    // <br /> contributes no textContent/whitespace, so there is no space after
    // the comma in the real rendered text — this must match character-for-
    // character since later tasks compare against it directly.
    h1: 'West Valley Homes,Cleaned Right. By Kandi.',
    image: DEFAULT_IMAGE,
  },
  {
    path: '/about',
    outDir: 'about',
    title: 'About Cleaning By Kandi | Locally Owned Cleaning Team, West Valley AZ',
    description: "Meet Kandi and the team behind Cleaning By Kandi — a locally owned, fully insured cleaning service trusted by families and businesses across Arizona's West Valley.",
    h1: 'More Than a Cleaning Service',
    image: DEFAULT_IMAGE,
  },
  {
    path: '/services',
    outDir: 'services',
    title: 'Cleaning Services in the West Valley, AZ | Residential, Deep & Commercial',
    description: "Explore Cleaning By Kandi's services: residential, deep, move-in/move-out, short-term rental, and commercial cleaning across Surprise and the West Valley of Arizona.",
    h1: 'Professional Cleaning for Every Need',
    image: canonicalImage('/images/residential.jpg'),
  },
  {
    path: '/service-areas',
    outDir: 'service-areas',
    title: 'Service Areas | House Cleaning in Surprise, Peoria & Glendale, AZ',
    description: 'Cleaning By Kandi serves Surprise, Peoria, Glendale, Sun City, Goodyear, and Buckeye. See if your West Valley, Arizona neighborhood is in our cleaning service area.',
    h1: 'Serving the Phoenix Metro Area',
    image: canonicalImage('/images/arizona.jpg'),
  },
  {
    path: '/request-quote',
    outDir: 'request-quote',
    title: 'Request a Free Cleaning Quote | Cleaning By Kandi, Surprise AZ',
    description: "Get a free, no-obligation cleaning quote from Cleaning By Kandi. Tell us about your home or business and we'll respond within 24 hours. Serving the West Valley, AZ.",
    // Actual <h1> (RequestQuote.tsx) on initial render: "Get Your Free Quote".
    // A second, conditional <h1>("Quote Request Received!") renders only after
    // successful submission — not reachable on first paint/prerender.
    h1: 'Get Your Free Quote',
    image: DEFAULT_IMAGE,
  },
  {
    path: '/privacy',
    outDir: 'privacy',
    title: 'Privacy Policy | Cleaning By Kandi',
    description: 'How Cleaning By Kandi collects, uses, and protects your information when you use our website and cleaning services in the West Valley, Arizona.',
    h1: 'Privacy Policy',
    image: DEFAULT_IMAGE,
  },
  {
    path: '/terms',
    outDir: 'terms',
    title: 'Terms of Service | Cleaning By Kandi',
    description: 'The terms and conditions governing use of the Cleaning By Kandi website and cleaning services in the West Valley, Arizona.',
    h1: 'Terms of Service',
    image: DEFAULT_IMAGE,
  },
];

export function getRouteMeta(path: string): RouteMeta {
  const found = ROUTES.find((r) => r.path === path);
  if (!found) throw new Error(`No route metadata registered for path "${path}"`);
  return found;
}

// src/lib/business.ts
export const SITE_URL = 'https://cleaningbykandi.com';

export const BUSINESS = {
  legalName: 'Cleaning By Kandi, LLC',
  telephone: '+1-480-309-7607',
  telephoneDisplay: '(480) 309-7607',
  telephoneHref: 'tel:4803097607',
  email: 'cleaningbykandi@yahoo.com',
  emailHref: 'mailto:cleaningbykandi@yahoo.com',
  addressLocality: 'Surprise',
  addressRegion: 'AZ',
  addressCountry: 'US',
} as const;

// Exactly the 5 services visible on /services. Do NOT add "Organization
// Services" or "Eco-Friendly Cleaning" here — they appear in CLAUDE.md's
// business list but are not shown on any public page. See docs/ARCHITECTURE.md
// "Open questions for the owner" for the resolution needed before adding them.
export const SERVICES = [
  'Residential Cleaning',
  'Deep Cleaning',
  'Move-In / Move-Out Cleaning',
  'Short-Term Rental / Airbnb Cleaning',
  'Commercial Cleaning',
] as const;

export const SERVICE_AREAS = ['Surprise', 'Peoria', 'Glendale', 'Sun City', 'Goodyear', 'Buckeye'] as const;

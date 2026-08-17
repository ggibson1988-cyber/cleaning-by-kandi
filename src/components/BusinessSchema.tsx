import { SITE_URL } from './Seo';

/**
 * LocalBusiness structured data (JSON-LD) for Cleaning By Kandi.
 *
 * Rendered globally so it is present in <head> on every route (only the root
 * route is indexed under the current hash-routing setup, so a global mount
 * guarantees Google sees it when it renders cleaningbykandi.com).
 *
 * Deliberately omitted:
 *  - aggregateRating / review: Google disallows self-serving review markup on
 *    LocalBusiness/Organization; real reviews belong on the Google Business
 *    Profile. Add here only if pulling verified third-party reviews.
 *  - openingHoursSpecification: hours are unknown — fabricating them is worse
 *    than omitting. Add once Kandi confirms real hours.
 */

const SERVICES = [
  'Residential Cleaning',
  'Deep Cleaning',
  'Move-In / Move-Out Cleaning',
  'Short-Term Rental / Airbnb Cleaning',
  'Commercial Cleaning',
  'Organization Services',
  'Eco-Friendly Cleaning',
];

const AREAS = ['Surprise', 'Peoria', 'Glendale', 'Sun City', 'Goodyear', 'Buckeye'];

const schema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${SITE_URL}/#business`,
  name: 'Cleaning By Kandi, LLC',
  description:
    'Locally owned residential and commercial cleaning serving Surprise and the greater West Valley of Arizona — residential, deep, move-in/move-out, short-term rental, and commercial cleaning.',
  url: `${SITE_URL}/`,
  image: `${SITE_URL}/images/hero.jpg`,
  telephone: '+1-480-309-7607',
  email: 'cleaningbykandi@yahoo.com',
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Surprise',
    addressRegion: 'AZ',
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 33.6292,
    longitude: -112.368,
  },
  areaServed: AREAS.map((city) => ({
    '@type': 'City',
    name: `${city}, AZ`,
  })),
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Cleaning Services',
    itemListElement: SERVICES.map((service) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: service },
    })),
  },
};

export default function BusinessSchema() {
  // JSON-LD is valid anywhere in the document; Google reads it from the body too.
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

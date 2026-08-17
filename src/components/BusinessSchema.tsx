import { BUSINESS, SERVICES, SERVICE_AREAS, SITE_URL } from '../lib/business';
import { canonicalImage } from '../lib/seoImage';

/**
 * LocalBusiness JSON-LD, mounted once at the app root so it's present on
 * every prerendered route.
 *
 * Deliberately omitted (see plan docs/ARCHITECTURE.md for rationale):
 *  - aggregateRating/review: no real third-party review data available.
 *  - geo coordinates: not verified against the actual business location.
 *  - openingHoursSpecification: hours are unconfirmed.
 *  - street address: service-area business, no public storefront.
 *  - "Organization Services" / "Eco-Friendly Cleaning": listed in CLAUDE.md
 *    but not shown on any visible page — owner confirmation required before
 *    they can appear in public metadata (see docs/ARCHITECTURE.md).
 */
const schema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${SITE_URL}/#business`,
  name: BUSINESS.legalName,
  url: `${SITE_URL}/`,
  image: canonicalImage('/images/hero.jpg'),
  telephone: BUSINESS.telephone,
  email: BUSINESS.email,
  address: {
    '@type': 'PostalAddress',
    addressLocality: BUSINESS.addressLocality,
    addressRegion: BUSINESS.addressRegion,
    addressCountry: BUSINESS.addressCountry,
  },
  areaServed: SERVICE_AREAS.map((city) => ({ '@type': 'City', name: `${city}, AZ` })),
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
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

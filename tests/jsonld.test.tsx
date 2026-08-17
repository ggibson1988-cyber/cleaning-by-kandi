// tests/jsonld.test.ts
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import BusinessSchema from '../src/components/BusinessSchema';
import { BUSINESS } from '../src/lib/business';

describe('BusinessSchema JSON-LD', () => {
  function getSchema() {
    const { container } = render(<BusinessSchema />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
    return JSON.parse(script!.innerHTML);
  }

  it('has required LocalBusiness fields with verified values', () => {
    const schema = getSchema();
    expect(schema['@type']).toBe('LocalBusiness');
    expect(schema.name).toBe(BUSINESS.legalName);
    expect(schema.telephone).toBe(BUSINESS.telephone);
    expect(schema.email).toBe(BUSINESS.email);
    expect(schema.url).toBe('https://cleaningbykandi.com/');
  });

  it('lists exactly the 5 verified visible services, no more', () => {
    const schema = getSchema();
    const listed = schema.hasOfferCatalog.itemListElement.map((o: { itemOffered: { name: string } }) => o.itemOffered.name);
    // Compared against a hardcoded literal, not [...SERVICES] (imported from
    // the same src/lib/business.ts that BusinessSchema.tsx maps over) — a
    // comparison against SERVICES itself would be tautological, passing
    // silently even if someone added a 6th, unverified service to that
    // constant. This literal is the actual verified allowlist.
    expect(listed).toEqual([
      'Residential Cleaning',
      'Deep Cleaning',
      'Move-In / Move-Out Cleaning',
      'Short-Term Rental / Airbnb Cleaning',
      'Commercial Cleaning',
    ]);
    expect(listed).not.toContain('Organization Services');
    expect(listed).not.toContain('Eco-Friendly Cleaning');
  });

  it('does not include aggregateRating, review, or unverified geo/hours', () => {
    const schema = getSchema();
    expect(schema).not.toHaveProperty('aggregateRating');
    expect(schema).not.toHaveProperty('review');
    expect(schema).not.toHaveProperty('geo');
    expect(schema).not.toHaveProperty('openingHoursSpecification');
    expect(schema.address).not.toHaveProperty('streetAddress');
  });
});

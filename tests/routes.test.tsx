// tests/routes.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../src/App';
import { ROUTES } from '../src/lib/routes';

describe.each(ROUTES)('route $path', (route) => {
  it('renders exactly one H1 matching the route registry', () => {
    render(
      <MemoryRouter initialEntries={[route.path]}>
        <App />
      </MemoryRouter>
    );
    const h1s = screen.getAllByRole('heading', { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent(route.h1);
  });
});

describe('unknown route', () => {
  it('renders the 404 page, not the homepage', () => {
    render(
      <MemoryRouter initialEntries={['/this-does-not-exist']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
  });
});

describe('internal links', () => {
  it('footer links to Privacy and Terms exist and point at real routes', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: /privacy policy/i })).toHaveAttribute('href', '/privacy');
    expect(screen.getByRole('link', { name: /terms of service/i })).toHaveAttribute('href', '/terms');
  });

  it('phone and email links have correct hrefs and accessible names', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    const phoneLinks = screen.getAllByRole('link', { name: /480.*309.*7607/ });
    expect(phoneLinks.length).toBeGreaterThan(0);
    for (const link of phoneLinks) expect(link).toHaveAttribute('href', 'tel:4803097607');
  });
});

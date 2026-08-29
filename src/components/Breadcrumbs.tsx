// src/components/Breadcrumbs.tsx
import { Link } from 'react-router-dom';
import { SITE_URL } from '../lib/business';

interface Crumb {
  label: string;
  path: string;
}

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  const trail = [{ label: 'Home', path: '/' }, ...items];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.label,
      item: crumb.path === '/' ? `${SITE_URL}/` : `${SITE_URL}${crumb.path}`,
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 text-sm text-slate-500">
      <ol className="flex flex-wrap items-center gap-1">
        {trail.map((crumb, i) => (
          <li key={crumb.path} className="flex items-center gap-1">
            {i > 0 && <span aria-hidden="true">/</span>}
            {i === trail.length - 1 ? (
              <span aria-current="page" className="text-slate-700 font-medium">{crumb.label}</span>
            ) : (
              <Link to={crumb.path} className="hover:text-slate-700 hover:underline">{crumb.label}</Link>
            )}
          </li>
        ))}
      </ol>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </nav>
  );
}

// src/components/Seo.tsx
import { getRouteMeta } from '../lib/routes';
import { SITE_URL } from '../lib/business';

interface SeoProps {
  path: string;
}

export default function Seo({ path }: SeoProps) {
  // The static <head> for every route is written by scripts/prerender.mjs
  // from the same src/lib/routes.ts registry this component reads. Rendering
  // these tags again during SSR (no <head> ancestor exists in the tree being
  // rendered — index.html's <head> is a static template, not part of the
  // React tree) would just emit stray <title>/<meta> inside <body>, so this
  // component is a no-op server-side. On the client, React 19 hoists these
  // elements to the real document <head> on route change — that's what
  // keeps <title>/canonical/OG tags correct during SPA navigation.
  if (import.meta.env.SSR) return null;

  const { title, description, image } = getRouteMeta(path);
  const url = path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`;

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </>
  );
}

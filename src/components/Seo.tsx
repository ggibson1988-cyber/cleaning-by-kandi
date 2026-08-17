/**
 * Per-route SEO tags via React 19 native document metadata.
 *
 * React 19 automatically hoists <title>, <meta>, and <link> to <head> no matter
 * where they're rendered in the tree, and removes them on unmount — so metadata
 * swaps cleanly per route with no external library. (We deliberately do NOT use
 * react-helmet-async: its React 19 support is unverified and a broken metadata
 * layer previously blanked the page.)
 *
 * CANONICALS: the app uses HashRouter because the live host (cleaningbykandi.com,
 * served by GoHighLevel) only resolves the root path — deep paths like /about
 * return 404. Canonicals therefore point at the intended clean-path URLs (which
 * the sitemap lists). Under hash routing Google renders only the root route per
 * crawl, so these are inert today and become live if the app moves to BrowserRouter.
 */

export const SITE_URL = 'https://cleaningbykandi.com';
const DEFAULT_OG_IMAGE = `${SITE_URL}/images/hero.jpg`;

interface SeoProps {
  title: string;
  description: string;
  /** Clean path, e.g. "/about". Use "/" for home. */
  path: string;
  image?: string;
}

export default function Seo({ title, description, path, image = DEFAULT_OG_IMAGE }: SeoProps) {
  const url = path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`;

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </>
  );
}

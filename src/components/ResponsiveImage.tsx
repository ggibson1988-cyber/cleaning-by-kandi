// src/components/ResponsiveImage.tsx
interface ResponsiveImageProps {
  /** Base name without extension/size suffix, e.g. "/images/hero" */
  base: string;
  alt: string;
  widths: number[];
  width: number;
  height: number;
  sizes: string;
  className?: string;
  /** Set true only for the actual LCP image; everything else lazy-loads. */
  priority?: boolean;
}

export default function ResponsiveImage({
  base, alt, widths, width, height, sizes, className, priority = false,
}: ResponsiveImageProps) {
  const webpSrcSet = widths.map((w) => `${base}-${w}.webp ${w}w`).join(', ');
  const jpgSrcSet = widths.map((w) => `${base}-${w}.jpg ${w}w`).join(', ');
  const fallbackSrc = `${base}-${widths[widths.length - 1]}.jpg`;

  return (
    <picture>
      <source type="image/webp" srcSet={webpSrcSet} sizes={sizes} />
      <img
        src={fallbackSrc}
        srcSet={jpgSrcSet}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        decoding={priority ? undefined : 'async'}
      />
    </picture>
  );
}

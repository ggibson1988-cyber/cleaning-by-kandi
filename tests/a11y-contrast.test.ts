// tests/a11y-contrast.test.ts
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));

function relativeLuminance(hex: string): number {
  const c = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(c.slice(i, i + 2), 16) / 255);
  const lin = (v: number) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function contrastRatio(hexA: string, hexB: string): number {
  const [l1, l2] = [relativeLuminance(hexA), relativeLuminance(hexB)].sort((a, b) => b - a);
  return (l1 + 0.05) / (l2 + 0.05);
}

// Read the actual shipped token values out of src/index.css rather than
// hardcoding hex literals here — a hardcoded literal would keep passing even
// if --color-primary regressed back to a failing value in the source file,
// since this test would then be verifying arithmetic instead of the product.
function readCssCustomProperty(name: string): string {
  const css = readFileSync(resolve(root, 'src/index.css'), 'utf-8');
  const match = css.match(new RegExp(`--${name}:\\s*(#[0-9A-Fa-f]{6})`));
  if (!match) throw new Error(`Could not find --${name} in src/index.css`);
  return match[1];
}

const colorPrimary = readCssCustomProperty('color-primary');
const colorPrimaryDark = readCssCustomProperty('color-primary-dark');

describe('WCAG AA contrast — fixed token pairs (Step 8)', () => {
  it('brand-primary text passes 4.5:1 on white', () => {
    expect(contrastRatio(colorPrimary, '#FFFFFF')).toBeGreaterThanOrEqual(4.5);
  });
  it('white text on the fixed CTA background passes 4.5:1', () => {
    expect(contrastRatio('#FFFFFF', colorPrimary)).toBeGreaterThanOrEqual(4.5);
  });
  it('white text on the primary-dark hover/active background passes 4.5:1', () => {
    expect(contrastRatio('#FFFFFF', colorPrimaryDark)).toBeGreaterThanOrEqual(4.5);
  });
  it('footer legal-link text passes 4.5:1 on the footer background', () => {
    // Tailwind's built-in slate-400/slate-900 — not CSS custom properties
    // defined in src/index.css, so these well-known, stable palette values
    // are reasonable to hardcode.
    expect(contrastRatio('#94A3B8', '#0F172A')).toBeGreaterThanOrEqual(4.5);
  });
  it('documents the 3 combinations that originally failed, for regression context', () => {
    // Historical/regression-documentation values — these are intentionally
    // hardcoded to the pre-fix values, not sourced from the current file.
    expect(contrastRatio('#0284C7', '#FFFFFF')).toBeLessThan(4.5);
    expect(contrastRatio('#FFFFFF', '#0EA5E9')).toBeLessThan(4.5);
    expect(contrastRatio('#64748B', '#0F172A')).toBeLessThan(4.5);
  });
});

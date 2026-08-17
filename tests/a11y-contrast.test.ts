// tests/a11y-contrast.test.ts
import { describe, it, expect } from 'vitest';

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

describe('WCAG AA contrast — fixed token pairs (Step 8)', () => {
  it('brand-primary text passes 4.5:1 on white', () => {
    expect(contrastRatio('#0369A1', '#FFFFFF')).toBeGreaterThanOrEqual(4.5);
  });
  it('white text on the fixed CTA background passes 4.5:1', () => {
    expect(contrastRatio('#FFFFFF', '#0369A1')).toBeGreaterThanOrEqual(4.5);
  });
  it('footer legal-link text passes 4.5:1 on the footer background', () => {
    expect(contrastRatio('#94A3B8', '#0F172A')).toBeGreaterThanOrEqual(4.5);
  });
  it('documents the 3 combinations that originally failed, for regression context', () => {
    expect(contrastRatio('#0284C7', '#FFFFFF')).toBeLessThan(4.5);
    expect(contrastRatio('#FFFFFF', '#0EA5E9')).toBeLessThan(4.5);
    expect(contrastRatio('#64748B', '#0F172A')).toBeLessThan(4.5);
  });
});

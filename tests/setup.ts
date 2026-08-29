// tests/setup.ts
import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// jsdom has no IntersectionObserver implementation. framer-motion's
// whileInView / useInView (used by src/components/FadeIn.tsx and
// StaggerGrid across nearly every page) constructs one on mount, so without
// a stub every route test throws "ReferenceError: IntersectionObserver is
// not defined" as soon as those components render.
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] { return []; }
}

vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);

// jsdom logs "Not implemented: Window's scrollTo()" (a console.error) every
// time src/App.tsx's ScrollToTop effect runs on route change. Stub it so
// route-change tests don't produce noisy, expected-but-alarming output.
window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;

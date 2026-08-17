# $10K Checklist — Self-Audit
**Site:** Task Terminator Home Services, LLC
**Date:** 2026-06-29

---

## Overall Score: 74 / 100
A solid $6–7K build. One critical gap (imagery), one structural gap (mobile), and a handful of invisible-stuff polish items. Everything else is genuinely at or near the mark.

---

## 01 — Point of View, Not a Template
**Grade: A — 9/10**

The site commits to a specific direction: dark-industrial / dark-luxury. Not a template pick.

**What's working:**
- The "technical blueprint" hero visual (SVG hexagon, crosshairs, L-bracket corner marks, grid overlay) is original and consistent with the brand name
- Red #B10F0F as a single aggressive accent reads as intentional, not decorative
- Industrial card treatment throughout (red left border, monospace number watermarks, L-bracket marks) is a repeatable motif — not a default shadcn card
- The particle canvas background is on-brand for a "task terminator" identity
- Section grid texture, corner annotations, measurement lines — all reinforce the direction without overexplaining it

**Gap:**
- The About page hero ("Built on Trust. Driven by Results.") and some copy still reads generic service-business. The POV is stronger in the design than in the writing.

---

## 02 — Typography That Does Work
**Grade: B+ — 8/10**

**What's working:**
- Pairing: **Poppins** (display, 800 weight) + **DM Sans** (body, 400–600) — neither Inter nor Roboto ✓
- Weight hierarchy is explicit: 800 headlines → 700 subheadings → 600 labels → 400–500 body
- `clamp()` on all headline sizes so the scale stays proportional across viewports
- Monospace used deliberately for watermark numbers and SVG annotations — third voice without adding a third font

**Gaps:**
- The scale gap between h2 (~46px) and h3 (~18px) is steep. A 28–32px h3 for card titles would add a cleaner tertiary step.
- Letter-spacing on body text (`DM Sans`) is at default. A very slight positive tracking (0.01–0.02em) on small labels (11–12px) would sharpen legibility.
- No `font-feature-settings` for tabular figures — prices and numbers reflow slightly when adjacent to proportional text.

---

## 03 — A Restrained Color System
**Grade: A — 9/10**

**The palette in use (5 values):**
| Token | Hex | Role |
|---|---|---|
| Dark | #1A1A1A | Section backgrounds, hero |
| Charcoal | #2B2B2B | Primary surface |
| Gunmetal | #474A4F | Cards, panels |
| Card Alt | #3A3D42 | Industrial service cards |
| Red | #B10F0F | All CTAs, accents, borders |

Text is a single gray family (#fff → #C8C8C8 → #A0A0A0 → #888 → #666 → #555) — not additional hues.

**What's working:**
- No color drift across pages — same tokens everywhere
- Red used for exactly one semantic purpose: action / accent. Never decorative.
- The grid texture uses `rgba(177,15,15,0.055)` — the red bleeds subtly into background patterns, tying the palette together invisibly

**Gap:**
- #3A3D42 was introduced for the industrial service cards and doesn't appear in any token reference. Minor drift from the established three darks. Should either be formalized as a token or collapsed into #474A4F.

---

## 04 — Hierarchy That Breathes
**Grade: B+ — 8/10**

**What's working:**
- Within each section: eyebrow pill → h2 → body → CTA is a consistent, readable flow
- 96px section padding gives each section room
- Hero uses scale aggressively: 80px h1, 18px body, clear CTA band — viewer knows exactly where to look
- Stats band (red section) breaks the dark rhythm intentionally, creating a visual rest point

**Gaps:**
- The homepage stacks 7 sections (Hero → Stats → Services → HowItWorks → Trust → CTABanner). The alternating #1A1A1A / #2B2B2B creates rhythm but not breathing — there's no section that's deliberately sparse or open to let heavier sections land harder.
- The Trust/Expectations section (4 cards) and the Services section (3 cards) read at the same visual weight. One of them should be lighter or more open so they don't compete.
- Services page: the alternating 2-col service sections (text left, checklist right) has no visual cue that connects them as a series. A subtle numbered indicator or running left-border line would help the eye track down the page.

---

## 05 — Imagery with Intent
**Grade: D+ — 4/10** ← The critical gap.

**What's here:**
- Logo (client-provided PNG) — wired in correctly at 44px/40px
- HeroVisual: custom CSS + SVG blueprint placeholder with cursor-tracking parallax — this is intentional and on-brand
- Everything else: icon-only (Lucide icons at 20–28px)

**The problem:**
Every section below the hero — Services, How It Works, About, Trust/Expectations — is text + icon cards on dark backgrounds. There is zero photography, zero generated imagery, zero visual texture beyond CSS patterns. At the $10K mark, the imagery standard is: "feels commissioned." Icon-only sections feel like a SaaS app, not a premium service brand.

**What's needed to close this gap:**
- 3–5 real or AI-generated photos: a hand adjusting a door hinge, a level on a shelf, a clean workspace — tool-detail level, not a smiling contractor stock photo
- The hero visual already has a `photoSrc` prop wired in — swapping it is one line once photos exist
- The About section "story" panel (currently text + numbered grid) should have one image
- Service cards could use a subtle photographic texture or real task photography in the background

This is not fixable with code alone. It requires real assets.

---

## 06 — Motion That Whispers
**Grade: A — 9/10**

**What's working:**
- Scroll-triggered Framer Motion reveals use a custom easing `[0.16, 1, 0.3, 1]` (fast-in, slow-out spring feel) — not the generic `ease-in-out` you see on $200 sites
- Stagger delays on grid items (0.08–0.13s per item) — the cards cascade, not dump
- Hero visual cursor parallax: three independent spring layers (hex ±8px / crosshair ±13px / cardinal dots ±20px) — a designer would notice this and nod
- Spring physics: `stiffness: 90, damping: 16, mass: 0.7` — feels physical, not tweened
- `prefers-reduced-motion` is globally respected (CSS override in globals.css)
- Booking form step transitions: AnimatePresence slide-in/out on step change

**Gaps:**
- Hover interactions on service cards mutate inline `style` via `onMouseEnter/Leave` in JS — works fine but is not GPU-composited the way pure CSS `transform` transitions are. On a mid-range phone this can drop frames.
- The particle canvas animation has no frame budget cap — it runs at whatever rate `requestAnimationFrame` gives, which on mobile can mean unnecessary battery drain. A `visibility` or `IntersectionObserver` pause when the hero scrolls out of view would help.
- No shared-element transitions between pages (clicking "Services" → services page is a hard cut).

---

## 07 — Mobile That's Designed, Not Shrunk
**Grade: C+ — 6/10**

**What's working:**
- `overflowX: hidden` on body + main prevents horizontal scroll
- Hero visual hides on <960px — the content column doesn't compete with a panel that doesn't render well small
- `clamp()` font sizes scale smoothly
- `auto-fit minmax()` grids wrap correctly — nothing breaks
- CTA buttons have `whiteSpace: nowrap` and `boxSizing: border-box`

**Gaps (honest):**
- The auto-fit grid approach is *responsive*, not *mobile-designed*. The service cards going from 3-col to 1-col is CSS doing the work, not a design decision for the phone. A $10K mobile layout would reconsider what content appears in what order, what gets hidden, and what gets a different component entirely.
- The booking form's 2-column name field grid (`gridTemplateColumns: "1fr 1fr"`) has no breakpoint — at 320px it will be very tight.
- The Navbar mobile menu: relies on the hamburger pattern from the original build. Worth verifying it's fully accessible (focus trap, close on outside click, keyboard Escape).
- Hero on mobile is a full-viewport centered text block with particle canvas — fine, but the canvas is still running 50 particles on a phone. Worth disabling on mobile or reducing to 15.
- No mobile-specific typographic decisions: the eyebrow pill text (12px, 0.08em tracking, uppercase) is borderline small on a 375px viewport.

---

## 08 — The Invisible Expensive Stuff
**Grade: B- — 7/10**

**What's working:**
- All 6 pages build as **static** (`○ Static`) — no SSR latency, CDN-cacheable, sub-second TTFB
- Next.js 16 with Turbopack — fast build pipeline
- `next/image` for the logo (WebP conversion, responsive sizing, `priority` on hero logo)
- Semantic HTML: `section`, `h1–h3`, `ul/li`, `form` with `label` elements, `aria-hidden` on all decorative SVGs and canvas
- Meta `title` + `description` on every page
- Each page has unique, accurate metadata

**Gaps:**

**Contrast (WCAG AA — biggest issue):**
- `#888` on `#2B2B2B` = ~3.9:1. Body text at 14px **fails** AA (requires 4.5:1). Large text (18px+ or 14px bold) passes at 3:1, but the majority of `#888` usage is 13–14px regular weight.
- `#B10F0F` on `#1A1A1A` = ~3.6:1. Red labels and badge text at 11px **fail** AA. These would need to move to at least `#CC1111` or the background needs to lighten.
- `#555` on `#2B2B2B` = ~2.4:1. Used in footer legal text and some secondary labels — **fails** significantly.

**Missing:**
- No Open Graph / Twitter Card meta tags (`og:title`, `og:description`, `og:image`). When shared on social or iMessage, no preview card renders.
- No custom favicon — using Next.js default. A $10K site has a favicon.
- No `robots.txt` or `sitemap.xml` — not critical for launch but missing for SEO completeness.
- No `focus-visible` ring styles defined in globals.css beyond the browser default. Keyboard users get inconsistent focus rings (some browsers show nothing with click-then-tab).
- `lang="en"` on the `<html>` element — not verified as set in layout.tsx.

---

## Summary Table

| # | Item | Grade | Score |
|---|------|-------|-------|
| 01 | Point of View | A | 9/10 |
| 02 | Typography | B+ | 8/10 |
| 03 | Color System | A | 9/10 |
| 04 | Hierarchy | B+ | 8/10 |
| 05 | Imagery | D+ | 4/10 |
| 06 | Motion | A | 9/10 |
| 07 | Mobile | C+ | 6/10 |
| 08 | Invisible Stuff | B- | 7/10 |
| **Total** | | | **74/100** |

---

## Priority Fix List

**Must fix before launch:**
1. **Imagery (05)** — Get 3–5 real or AI-generated photos. This is the single biggest quality signal missing. The site looks like a SaaS app, not a premium home service brand.
2. **Contrast (08)** — `#888` body text fails WCAG AA at 14px. Bump to `#999` or `#9A9A9A` minimum. `#555` footer text needs to move to `#777`. Red badge text on dark needs a lighter red.
3. **OG tags (08)** — Add `og:title`, `og:description`, `og:image` to `layout.tsx` defaults. Every page share will look broken without it.

**High-value polish (close the gap from $7K to $10K):**
4. **Favicon (08)** — Export logo as 32×32 and 180×180 `.ico`/`.png`, add to `/public`, wire into layout.
5. **Mobile booking form (07)** — Add `@media (max-width: 480px)` to collapse the 2-col name fields to 1-col.
6. **Hero canvas on mobile (07)** — Reduce particles to 15 or pause canvas when not in viewport.
7. **Typography scale (02)** — Add a 28px h3 step for card titles. Currently jumps from 46px h2 to 18px h3.
8. **Focus-visible rings (08)** — Add a global `focus-visible` outline in `globals.css` using the brand red.

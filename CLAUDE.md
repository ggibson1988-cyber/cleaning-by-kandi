> **Superseded 2026-08-16, corrected 2026-08-17.** The instructions below
> described rebuilding this site natively inside GoHighLevel's page builder.
> That direction was replaced by a `feature/seo-foundation-cloudflare` branch
> that added clean routes, prerendered HTML, and metadata/schema/sitemap
> work for this React/Vite app. **An earlier revision of that branch and its
> docs assumed Cloudflare Workers/Pages as the hosting target — that was a
> mistake and has been removed; Cloudflare hosting was never approved.**
> The actual current production architecture is: `cleaningbykandi.com` is
> served through GoHighLevel; the custom React frontend/build assets are
> created and deployed through Vercel; GoHighLevel remains the CRM/workflow
> backend and the current live public host. **How GHL will serve this
> frontend's clean routes (`/about`, `/services`, etc.) while preserving the
> Vercel-built assets is not yet designed** — see `docs/ARCHITECTURE.md`'s
> "Unresolved deployment requirement" section; do not assume it's solved.
> The business facts and service list below are still accurate and still
> the source of truth; the "Rebuild natively in GHL" instructions and
> GHL-build-sheet output format are historical — kept for reference, not to
> be followed for new work.

---

# Claude Instructions — Cleaning By Kandi

This repo contains a React/Vite website for Cleaning By Kandi, LLC.

The React site is the design and content reference only.

The current goal is NOT to continue developing the React site unless explicitly requested.

The current goal is:

Rebuild this website natively inside GoHighLevel using GHL’s website/page builder, forms/surveys, CRM, and workflows.

## Business

Business name: Cleaning By Kandi, LLC
Location: Surprise / West Valley Arizona
Phone: (480) 309-7607
Email: cleaningbykandi@yahoo.com

Services:
- Residential Cleaning
- Deep Cleaning
- Move-In / Move-Out Cleaning
- Short-Term Rental / Airbnb Cleaning
- Commercial Cleaning

## Instructions

When helping with this repo:

1. Use the React/Vite files as a design/content reference.
2. Do not focus on React, Vite, Cloudflare, deployment, or hosting unless explicitly asked.
3. Translate the site into native GoHighLevel build instructions.
4. Prefer GHL-native sections, rows, columns, headings, text blocks, buttons, images, forms, surveys, and workflows.
5. Avoid custom React/JS.
6. Use custom CSS only if necessary.
7. Produce implementation-ready instructions, not generic advice.
8. Build one page at a time.
9. Start with the Home page unless told otherwise.
10. Prioritize conversion, clarity, maintainability, mobile layout, and local trust.

## Output Format

When producing a GHL build sheet, include:

- Page name
- Section name
- Purpose of section
- GHL element types to use
- Row/column layout
- Heading copy
- Body copy
- Button text
- Button link target
- Image suggestion
- Colors/style notes
- Spacing notes
- Mobile layout notes
- QA checklist

## Do Not

Do not:
- keep coding the React site by default
- recommend DNS/hosting changes unless specifically asked
- assume Cloudflare Pages is the target
- give vague strategy instead of actionable GHL build steps

## CRM Goal

The website should capture quote requests and trigger:

1. Create/update contact
2. Add lead source/tag
3. Create opportunity
4. Notify owner
5. Send customer confirmation
6. Create follow-up task
7. Optional reminder if no follow-up happens within 24 hours

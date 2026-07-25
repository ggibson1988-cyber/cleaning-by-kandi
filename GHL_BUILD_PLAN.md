# Cleaning By Kandi — GoHighLevel Build Plan

## Build Objective

Rebuild the Cleaning By Kandi website natively inside GoHighLevel.

The React/Vite repo is the visual and content reference.

Use GHL-native builder elements wherever possible.

## GHL Location

Build inside the Cleaning By Kandi sub-account/location.

Not agency-level view.

Use:

- Sites → Websites
- Sites → Forms or Surveys
- Automation → Workflows
- Opportunities / Pipelines
- Settings → Custom Fields, if needed

## Pages To Build

1. Home
2. Services
3. About
4. Service Areas
5. Request Quote
6. Privacy Policy
7. Terms & Conditions

## Primary Navigation

Recommended top nav:

- Home
- About
- Services
- Service Areas
- Request Quote

Primary CTA button:

Get a Free Quote

Phone CTA:

(480) 309-7607

## Home Page Sections

### 1. Hero

Purpose:
Immediately communicate what the business does, where it serves, and drive 
quote requests.

Headline:

West Valley Homes, Cleaned Right. By Kandi.

Subheadline:

Reliable, detail-focused residential and commercial cleaning across 
Surprise, Peoria, Glendale, and the West Valley.

Primary button:

Get Your Free Quote

Link:

/request-quote

Secondary button:

Call (480) 309-7607

Link:

tel:4803097607

Visual:
Use a clean home/living room image.

GHL structure:
- Section
- 2-column row desktop
- Left: badge, headline, paragraph, buttons
- Right: image card
- Mobile: stack image above or below text

### 2. Trust Badges

Badges:
- Fully Insured
- Background-Checked
- On-Time & Reliable
- Locally Owned

GHL structure:
- 4-column row desktop
- 2-column tablet
- stacked or 2x2 mobile

### 3. Services Preview

Heading:

Cleaning Built Around Your Life

Body:

Whether it’s weekly upkeep or a one-time deep clean, we have a service to 
match every need and budget.

Cards:
- Residential Cleaning
- Deep Cleaning
- Move-In / Move-Out
- Short-Term Rental
- Commercial Cleaning
- Organization Services

CTA:

View Services

Link:

/services

### 4. Why Choose Kandi

Heading:

Why Families & Businesses Choose Kandi

Bullets:
- Locally owned and operated in the West Valley
- Fully insured and background-checked team
- Flexible scheduling — weekly, bi-weekly, monthly, or one-time
- Detail-focused cleaning with reliable communication

CTA:

Learn Our Story

Link:

/about

### 5. Reviews

Heading:

What Our Clients Are Saying

Use existing testimonials from the React site if available.

Layout:
- 3 review cards
- name/initial
- quote text
- simple star icons if GHL supports it

### 6. Service Area CTA

Heading:

Serving Surprise, Peoria, Glendale, Sun City, Goodyear & Buckeye

CTA:

Request a Free Quote

Link:

/request-quote

### 7. Footer

Include:
- Business name
- Short description
- Services links
- Service area links
- Phone
- Email
- Privacy
- Terms

## Request Quote Page

Use GHL Survey if possible.

### Survey Steps

Step 1 — Service Type

Options:
- Residential Cleaning
- Deep Cleaning
- Move-In / Move-Out
- Short-Term Rental
- Commercial Cleaning
- Organization Services
- Eco-Friendly Cleaning

Step 2 — Home/Space Details

Fields:
- Bedrooms
- Bathrooms
- Square Footage
- Cleaning Frequency

Frequency options:
- One-Time
- Weekly
- Bi-Weekly
- Monthly

Step 3 — Contact Details

Fields:
- First Name
- Last Name
- Phone
- Email
- City
- Address
- Preferred Date
- Notes

Thank-you message:

Thanks! We received your quote request. Kandi’s team will follow up within 
24 hours. For immediate help, call (480) 309-7607.

## GHL Custom Fields

Create if needed:

- Service Type
- Bedrooms
- Bathrooms
- Square Footage
- Cleaning Frequency
- Preferred Date
- Cleaning Notes
- Lead Source

## Tags

Recommended tags:

- Website Quote Request
- Cleaning Lead
- Service Residential
- Service Deep Clean
- Service Move Out
- Service Short Term Rental
- Service Commercial

## Pipeline

Pipeline:

Cleaning Leads

Stages:
1. New Quote Request
2. Contacted
3. Estimate Sent
4. Scheduled
5. Won
6. Lost / Not a Fit

## Workflow

Workflow name:

Cleaning By Kandi — Website Quote Request

Trigger:
- Survey submitted
or
- Form submitted

Actions:
1. Create/update contact
2. Add tag: Website Quote Request
3. Set lead source: Website
4. Create opportunity in Cleaning Leads pipeline
5. Notify owner by SMS/email
6. Send customer confirmation
7. Create follow-up task
8. Wait 24 hours
9. If still not contacted, notify owner again

## QA Checklist

Before publishing:

- Home page loads
- Mobile layout looks good
- Navigation works
- Phone links work
- Quote form/survey submits
- Contact is created/updated in GHL
- Opportunity is created
- Owner notification sends
- Customer confirmation sends
- Privacy/Terms links work
- Domain still resolves correctly

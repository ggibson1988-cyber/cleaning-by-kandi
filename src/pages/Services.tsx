import { Link } from 'react-router-dom';
import {
  Home, Layers, Key, Building2, MoveRight,
  CheckCircle, ArrowRight, Phone,
} from 'lucide-react';
import FadeIn from '../components/FadeIn';
import WaveDivider from '../components/WaveDivider';
import BubblePattern from '../components/BubblePattern';

const services = [
  {
    id: 'residential', num: '01', icon: Home, color: 'sky',
    title: 'Residential Cleaning',
    tagline: 'Consistent, reliable home cleaning on your schedule.',
    description: 'Our residential cleaning service is designed to keep your home fresh and tidy week after week. Whether you need weekly, bi-weekly, or monthly visits, we\'ll customize a plan that fits your home and lifestyle.',
    photo: 'images/residential.jpg',
    photoAlt: 'Professional cleaning supplies and tools ready for a residential home cleaning in Arizona',
    includes: [
      'Kitchen cleaning (counters, stovetop, sink, exterior of appliances)',
      'Bathroom scrubbing and sanitizing',
      'Vacuuming and mopping all floor types',
      'Dusting surfaces, ceiling fans, and blinds',
      'Trash removal and linen changes (if requested)',
      'Living room tidying and surface wiping',
    ],
  },
  {
    id: 'deep', num: '02', icon: Layers, color: 'emerald',
    title: 'Deep Cleaning',
    tagline: 'A thorough, top-to-bottom clean for every corner of your home.',
    description: 'Perfect for first-time clients, spring cleaning, or when your home needs extra attention. Our deep cleaning service reaches places that regular cleaning misses — leaving your home truly spotless.',
    photo: 'images/deep-clean.jpg',
    photoAlt: 'Sparkling clean kitchen after a deep cleaning service — every surface and appliance addressed',
    includes: [
      'Interior oven and refrigerator cleaning',
      'Cleaning behind and underneath appliances',
      'Baseboards, window sills, and door frames',
      'Light switches and outlet plates',
      'Inside cabinets and drawers (upon request)',
    ],
  },
  {
    id: 'moveinout', num: '03', icon: Key, color: 'violet',
    title: 'Move-In / Move-Out Cleaning',
    tagline: 'Start fresh — or leave a great impression behind.',
    description: 'Moving is stressful enough. Let us handle the cleaning so you can focus on everything else. Our move-in/move-out service ensures properties are immaculate for new occupants — and helps renters recover security deposits.',
    photo: 'images/move-out.jpg',
    photoAlt: 'Immaculately cleaned empty room ready for new tenants after a move-out cleaning',
    includes: [
      'Full deep clean of entire property',
      'Cleaning all appliances inside and out',
      'Wiping down all cabinets, shelves, and drawers',
      'Cleaning inside closets and storage areas',
      'Removing adhesive residue and marks from walls',
      'Cleaning windows, tracks, and sills',
    ],
  },
  {
    id: 'rental', num: '04', icon: Building2, color: 'orange',
    title: 'Short-Term Rental Cleaning',
    tagline: 'Guest-ready turnovers for Airbnb, VRBO, and more.',
    description: 'First impressions make all the difference in short-term rentals. We specialize in fast, reliable turnovers that get your property guest-ready between bookings — helping you earn better reviews and more bookings.',
    photo: 'images/rental.jpg',
    photoAlt: 'Guest-ready bedroom prepared for short-term rental guests — fresh linens and spotless surfaces',
    includes: [
      'Full clean of all rooms and bathrooms',
      'Linen and towel laundry (or swap)',
      'Restocking supplies (provided by owner)',
      'Amenities checklist completion',
      'Reporting of any damage or maintenance needs',
      'Flexible scheduling for back-to-back bookings',
    ],
  },
  {
    id: 'commercial', num: '05', icon: MoveRight, color: 'slate',
    title: 'Commercial Cleaning',
    tagline: 'Professional cleaning for offices and commercial spaces.',
    description: 'A clean workspace boosts morale, impresses clients, and promotes employee health. Cleaning By Kandi offers professional commercial cleaning services tailored to your business hours and specific needs.',
    photo: 'images/commercial.jpg',
    photoAlt: 'Clean, professional office space after commercial cleaning service — desks and floors spotless',
    includes: [
      'General office cleaning and sanitizing',
      'Restroom disinfection and restocking',
      'Break room and kitchen cleaning',
      'Vacuuming and mopping all floor types',
      'Trash removal and recycling',
      'Window cleaning (interior)',
    ],
  },
];

const colorMap: Record<string, { badge: string; check: string; bg: string; border: string; number: string }> = {
  sky:     { badge: 'bg-sky-100 text-sky-700',       check: 'text-brand-primary',     bg: 'bg-sky-50',     border: 'border-sky-200',     number: 'text-sky-200' },
  emerald: { badge: 'bg-emerald-100 text-emerald-700', check: 'text-brand-success', bg: 'bg-emerald-50', border: 'border-emerald-200', number: 'text-emerald-200' },
  violet:  { badge: 'bg-violet-100 text-violet-700',  check: 'text-violet-600',  bg: 'bg-violet-50',  border: 'border-violet-200',  number: 'text-violet-200' },
  orange:  { badge: 'bg-orange-100 text-orange-700',  check: 'text-orange-600',  bg: 'bg-orange-50',  border: 'border-orange-200',  number: 'text-orange-200' },
  slate:   { badge: 'bg-slate-200 text-slate-700',    check: 'text-slate-600',   bg: 'bg-slate-100',  border: 'border-slate-300',   number: 'text-slate-300' },
};

export default function Services() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-sky-900 py-16 md:py-24">
        <BubblePattern opacity={0.06} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <p className="text-sky-400 font-semibold text-sm uppercase tracking-wider mb-3">What We Offer</p>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Professional Cleaning for Every Need
            </h1>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-8">
              From regular home maintenance to specialty cleans, Cleaning By Kandi has you covered across the West Valley.
            </p>
            <Link
              to="/request-quote"
              className="inline-flex items-center gap-2 bg-brand-primary-light hover:bg-sky-400 text-white font-semibold px-6 py-3.5 rounded-xl transition-colors duration-200 cursor-pointer"
            >
              Get a Free Quote <ArrowRight className="w-4 h-4" />
            </Link>
          </FadeIn>
        </div>
        <WaveDivider fill="#F8FAFC" />
      </section>

      {/* ── Quick nav ── */}
      <section className="bg-slate-50 border-b border-slate-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto py-3 snap-x snap-mandatory">
            {services.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="shrink-0 text-sm font-medium px-4 py-2 rounded-lg text-slate-600 hover:bg-white hover:text-slate-900 transition-colors duration-200 cursor-pointer whitespace-nowrap snap-start min-h-[44px] flex items-center"
              >
                <span className={`${colorMap[s.color].check} font-bold mr-1`}>{s.num}</span>
                {s.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Service sections (numbered, connected by left border) ── */}
      <div className="bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Connecting vertical thread */}
          <div className="relative">
            <div
              className="absolute left-[11px] top-8 bottom-8 w-0.5 bg-slate-200 hidden lg:block"
              aria-hidden="true"
            />

            <div className="space-y-16">
              {services.map((service, idx) => {
                const c = colorMap[service.color];
                const isEven = idx % 2 === 0;

                return (
                  <FadeIn key={service.id} delay={0.05}>
                    <section
                      id={service.id}
                      className="scroll-mt-36"
                    >
                      <div className="flex gap-6 items-start">
                        {/* Numbered node on the vertical line */}
                        <div
                          className={`hidden lg:flex w-6 h-6 rounded-full border-2 border-slate-200 bg-white items-center justify-center shrink-0 mt-2 z-10`}
                          aria-hidden="true"
                        >
                          <div className="w-2 h-2 rounded-full bg-brand-primary" />
                        </div>

                        <div className="flex-1 grid lg:grid-cols-2 gap-10 items-start">
                          {/* Text col */}
                          <div className={isEven ? 'order-1' : 'order-1 lg:order-2'}>
                            <div className={`inline-flex items-center gap-2 ${c.badge} text-xs font-bold px-3 py-1 rounded-full mb-4 font-heading tabular`}>
                              {service.num} — {service.title}
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-2">{service.title}</h2>
                            <p className="text-slate-500 font-medium mb-4">{service.tagline}</p>
                            <p className="text-slate-600 leading-relaxed mb-6">{service.description}</p>
                            <Link
                              to="/request-quote"
                              className="inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-primary-dark text-white font-semibold px-5 py-2.5 rounded-xl transition-colors duration-200 cursor-pointer text-sm"
                            >
                              Book This Service <ArrowRight className="w-4 h-4" />
                            </Link>
                          </div>

                          {/* Photo + includes col */}
                          <div className={`space-y-4 ${isEven ? 'order-2' : 'order-2 lg:order-1'}`}>
                            {/* Photo */}
                            <div className="rounded-2xl overflow-hidden shadow-sm aspect-video">
                              <img
                                src={service.photo}
                                alt={service.photoAlt}
                                className="w-full h-full object-cover"
                                width={800}
                                height={450}
                                loading="lazy"
                                decoding="async"
                              />
                            </div>
                            {/* Includes */}
                            <div className={`${c.bg} border ${c.border} rounded-2xl p-5`}>
                              <h3 className="font-heading font-semibold text-slate-900 mb-3 text-base">What's Included</h3>
                              <ul className="space-y-2">
                                {service.includes.map((item) => (
                                  <li key={item} className="flex items-start gap-2.5">
                                    <CheckCircle className={`w-4 h-4 ${c.check} shrink-0 mt-0.5`} />
                                    <span className="text-slate-700 text-sm">{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <section className="bg-slate-900 py-14">
        <FadeIn className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Not Sure Which Service You Need?</h2>
          <p className="text-slate-400 mb-8">
            Give us a call or fill out our quote form and we'll help you find the right fit for your home or business.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/request-quote"
              className="inline-flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary-light text-white font-semibold px-6 py-3.5 rounded-xl transition-colors duration-200 cursor-pointer"
            >
              Request a Quote <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="tel:4803097607"
              className="inline-flex items-center justify-center gap-2 border border-slate-600 hover:bg-slate-800 text-white font-semibold px-6 py-3.5 rounded-xl transition-colors duration-200 cursor-pointer"
            >
              <Phone className="w-4 h-4" /> (480) 309-7607
            </a>
          </div>
        </FadeIn>
      </section>
    </>
  );
}

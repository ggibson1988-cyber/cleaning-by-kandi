import { Link } from 'react-router-dom';
import {
  Home,
  Layers,
  Key,
  Building2,
  MoveRight,
  CheckCircle,
  ArrowRight,
  Phone,
} from 'lucide-react';

const services = [
  {
    id: 'residential',
    icon: Home,
    title: 'Residential Cleaning',
    tagline: 'Consistent, reliable home cleaning on your schedule.',
    description:
      'Our residential cleaning service is designed to keep your home fresh and tidy week after week. Whether you need weekly, bi-weekly, or monthly visits, we\'ll customize a plan that fits your home and lifestyle.',
    includes: [
      'Kitchen cleaning (counters, stovetop, sink, exterior of appliances)',
      'Bathroom scrubbing and sanitizing',
      'Vacuuming and mopping all floor types',
      'Dusting surfaces, ceiling fans, and blinds',
      'Trash removal and linen changes (if requested)',
      'Living room tidying and surface wiping',
    ],
    color: 'sky',
  },
  {
    id: 'deep',
    icon: Layers,
    title: 'Deep Cleaning',
    tagline: 'A thorough, top-to-bottom clean for every corner of your home.',
    description:
      'Perfect for first-time clients, spring cleaning, or when your home needs extra attention, our deep cleaning service reaches places that regular cleaning misses — leaving your home truly spotless.',
    includes: [
      'Interior oven and refrigerator cleaning',
      'Cleaning behind and underneath appliances',
      'Detailed scrubbing of grout and tile',
      'Baseboards, window sills, and door frames',
      'Light switches and outlet plates',
      'Inside cabinets and drawers (upon request)',
    ],
    color: 'emerald',
  },
  {
    id: 'moveinout',
    icon: Key,
    title: 'Move-In / Move-Out Cleaning',
    tagline: 'Start fresh — or leave a great impression behind.',
    description:
      'Moving is stressful enough. Let us handle the cleaning so you can focus on everything else. Our move-in/move-out service ensures properties are immaculate for new occupants — and can help renters recover security deposits.',
    includes: [
      'Full deep clean of entire property',
      'Cleaning all appliances inside and out',
      'Wiping down all cabinets, shelves, and drawers',
      'Cleaning inside closets and storage areas',
      'Removing adhesive residue and marks from walls',
      'Cleaning windows, tracks, and sills',
    ],
    color: 'violet',
  },
  {
    id: 'rental',
    icon: Building2,
    title: 'Short-Term Rental Cleaning',
    tagline: 'Guest-ready turnovers for Airbnb, VRBO, and more.',
    description:
      'First impressions make all the difference in short-term rentals. We specialize in fast, reliable turnovers that get your property guest-ready between bookings — helping you earn better reviews and more bookings.',
    includes: [
      'Full clean of all rooms and bathrooms',
      'Linen and towel laundry (or swap)',
      'Restocking supplies (provided by owner)',
      'Restocking amenities checklist',
      'Reporting of any damage or maintenance needs',
      'Flexible scheduling for back-to-back bookings',
    ],
    color: 'orange',
  },
  {
    id: 'commercial',
    icon: MoveRight,
    title: 'Commercial Cleaning',
    tagline: 'Professional cleaning for offices and commercial spaces.',
    description:
      'A clean workspace boosts morale, impresses clients, and promotes employee health. Cleaning By Kandi offers professional commercial cleaning services tailored to your business hours and specific needs.',
    includes: [
      'General office cleaning and sanitizing',
      'Restroom disinfection and restocking',
      'Break room and kitchen cleaning',
      'Vacuuming and mopping all floor types',
      'Trash removal and recycling',
      'Window cleaning (interior)',
    ],
    color: 'slate',
  },
];

const colorMap: Record<string, { bg: string; icon: string; badge: string; border: string }> = {
  sky: { bg: 'bg-sky-50', icon: 'text-sky-600', badge: 'bg-sky-100 text-sky-700', border: 'border-sky-200' },
  emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600', badge: 'bg-emerald-100 text-emerald-700', border: 'border-emerald-200' },
  violet: { bg: 'bg-violet-50', icon: 'text-violet-600', badge: 'bg-violet-100 text-violet-700', border: 'border-violet-200' },
  orange: { bg: 'bg-orange-50', icon: 'text-orange-600', badge: 'bg-orange-100 text-orange-700', border: 'border-orange-200' },
  slate: { bg: 'bg-slate-100', icon: 'text-slate-600', badge: 'bg-slate-200 text-slate-700', border: 'border-slate-300' },
};

export default function Services() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-sky-900 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sky-400 font-medium text-sm uppercase tracking-wider mb-3">What We Offer</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Professional Cleaning Services for Every Need
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-8">
            From regular home maintenance to specialty cleans, Cleaning By Kandi has you covered across the West Valley.
          </p>
          <Link
            to="/request-quote"
            className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white font-semibold px-6 py-3.5 rounded-xl transition-colors duration-200 cursor-pointer"
          >
            Get a Free Quote <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Quick Nav */}
      <section className="bg-white border-b border-slate-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto py-3 no-scrollbar">
            {services.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="shrink-0 text-sm font-medium px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors duration-200 cursor-pointer whitespace-nowrap"
              >
                {s.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Service Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {services.map((service, idx) => {
          const c = colorMap[service.color];
          const Icon = service.icon;
          const isEven = idx % 2 === 0;
          return (
            <section
              key={service.id}
              id={service.id}
              className="scroll-mt-32 grid lg:grid-cols-2 gap-10 items-start"
            >
              {/* Text */}
              <div className={isEven ? 'order-1' : 'order-1 lg:order-2'}>
                <div className={`inline-flex items-center gap-2 ${c.badge} text-xs font-semibold px-3 py-1 rounded-full mb-4`}>
                  <Icon className="w-3.5 h-3.5" />
                  {service.title}
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">{service.title}</h2>
                <p className="text-slate-500 font-medium mb-4">{service.tagline}</p>
                <p className="text-slate-600 leading-relaxed mb-6">{service.description}</p>
                <Link
                  to="/request-quote"
                  className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors duration-200 cursor-pointer text-sm"
                >
                  Book This Service <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Includes card */}
              <div className={isEven ? 'order-2' : 'order-2 lg:order-1'}>
                <div className={`${c.bg} border ${c.border} rounded-2xl p-6`}>
                  <h3 className="font-heading font-semibold text-slate-900 mb-4 text-base">What's Included</h3>
                  <ul className="space-y-3">
                    {service.includes.map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <CheckCircle className={`w-4 h-4 ${c.icon} shrink-0 mt-0.5`} />
                        <span className="text-slate-700 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* CTA */}
      <section className="bg-slate-900 py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Not Sure Which Service You Need?</h2>
          <p className="text-slate-400 mb-8">
            Give us a call or fill out our quote form and we'll help you find the right fit for your home or business.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/request-quote"
              className="inline-flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold px-6 py-3.5 rounded-xl transition-colors duration-200 cursor-pointer"
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
        </div>
      </section>
    </>
  );
}

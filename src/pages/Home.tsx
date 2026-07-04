import { Link } from 'react-router-dom';
import {
  Shield,
  Star,
  CheckCircle,
  Phone,
  ArrowRight,
  Home as HomeIcon,
  Layers,
  MoveRight,
  Building2,
  Key,
  Clock,
  ThumbsUp,
  Leaf,
  Award,
  ChevronRight,
} from 'lucide-react';

const services = [
  {
    icon: HomeIcon,
    title: 'Residential Cleaning',
    description: 'Regular scheduled cleaning to keep your home spotless — kitchens, baths, living areas, and more.',
  },
  {
    icon: Layers,
    title: 'Deep Cleaning',
    description: 'A thorough top-to-bottom clean, reaching every corner your regular routine misses.',
  },
  {
    icon: Key,
    title: 'Move-In / Move-Out',
    description: 'Start fresh or leave a sparkling impression for the next occupants.',
  },
  {
    icon: Building2,
    title: 'Short-Term Rental',
    description: 'Fast, reliable turnovers for Airbnb and VRBO hosts — guest-ready every time.',
  },
  {
    icon: MoveRight,
    title: 'Commercial Cleaning',
    description: 'Professional cleaning for offices and commercial spaces, done on your schedule.',
  },
];

const trustBadges = [
  { icon: Shield, label: 'Fully Insured' },
  { icon: Award, label: 'Bonded & Vetted' },
  { icon: Leaf, label: 'Eco-Friendly Products' },
  { icon: Clock, label: 'On-Time Guarantee' },
];

const testimonials = [
  {
    name: 'Sarah M.',
    location: 'Surprise, AZ',
    rating: 5,
    text: "Kandi and her team are absolutely incredible! My house has never looked so clean. They paid attention to every little detail and even cleaned areas I forgot to mention. Highly recommend!",
  },
  {
    name: 'James T.',
    location: 'Peoria, AZ',
    rating: 5,
    text: "I use Cleaning By Kandi for my Airbnb property. The turnovers are flawless — guests always comment on how clean and fresh everything is. Bookings have improved since I started using them.",
  },
  {
    name: 'Linda R.',
    location: 'Glendale, AZ',
    rating: 5,
    text: "After moving out, I was stressed about the deposit. Kandi did a move-out clean and it looked better than when I moved in. Got my full deposit back — worth every penny!",
  },
];

const stats = [
  { value: '500+', label: 'Happy Clients' },
  { value: '5★', label: 'Average Rating' },
  { value: '3+', label: 'Years Serving AZ' },
  { value: '6', label: 'Cities Served' },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-sky-900">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-sky-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-emerald-400 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-sky-600/20 border border-sky-500/30 text-sky-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <Shield className="w-3.5 h-3.5" />
              Serving the West Valley, Arizona
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              A Spotlessly Clean Home,{' '}
              <span className="text-sky-400">Guaranteed.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed mb-8 max-w-2xl">
              Cleaning By Kandi delivers reliable, detail-obsessed residential and commercial cleaning across Surprise, Peoria, Glendale, and the greater West Valley.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/request-quote"
                className="inline-flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-400 text-white font-semibold px-6 py-3.5 rounded-xl transition-colors duration-200 cursor-pointer text-base"
              >
                Get Your Free Quote
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="tel:4803097607"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-6 py-3.5 rounded-xl transition-colors duration-200 cursor-pointer text-base"
              >
                <Phone className="w-4 h-4" />
                (480) 309-7607
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trustBadges.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 py-2">
                <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-emerald-600" />
                </div>
                <span className="text-sm font-semibold text-slate-700">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-sky-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map(({ value, label }) => (
              <div key={label}>
                <div className="text-3xl md:text-4xl font-bold font-heading text-white mb-1">{value}</div>
                <div className="text-sky-100 text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 md:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Cleaning Services Built Around You
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Whether it's weekly upkeep or a one-time deep clean, we have a service to match every need and budget.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-sky-300 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-sky-50 group-hover:bg-sky-600 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300">
                  <Icon className="w-6 h-6 text-sky-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-heading font-semibold text-slate-900 text-lg mb-2">{title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">{description}</p>
                <Link
                  to="/services"
                  className="inline-flex items-center gap-1 text-sky-600 text-sm font-medium hover:gap-2 transition-all duration-200 cursor-pointer"
                >
                  Learn more <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
            {/* CTA Card */}
            <div className="bg-sky-600 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="font-heading font-bold text-white text-xl mb-2">Ready to get started?</h3>
                <p className="text-sky-100 text-sm leading-relaxed">
                  Fill out our quick quote form and we'll get back to you within 24 hours.
                </p>
              </div>
              <Link
                to="/request-quote"
                className="inline-flex items-center gap-2 mt-6 bg-white text-sky-600 font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-sky-50 transition-colors duration-200 cursor-pointer w-fit"
              >
                Request a Quote <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image placeholder */}
            <div className="relative">
              <div className="bg-gradient-to-br from-sky-100 to-emerald-100 rounded-3xl aspect-[4/3] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-sky-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <HomeIcon className="w-10 h-10 text-sky-600" />
                  </div>
                  <p className="text-slate-500 text-sm font-medium">Photo Coming Soon</p>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-lg p-4 border border-slate-100">
                <div className="flex items-center gap-2">
                  <ThumbsUp className="w-5 h-5 text-emerald-500" />
                  <div>
                    <div className="text-xs text-slate-500">Customer Satisfaction</div>
                    <div className="font-bold text-slate-900 text-lg leading-none">100%</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Why Families & Businesses Choose Kandi
              </h2>
              <p className="text-slate-600 leading-relaxed mb-8">
                We're not just a cleaning service — we're your trusted partner in keeping your space healthy, welcoming, and spotless. Every visit is backed by our satisfaction guarantee.
              </p>
              <ul className="space-y-4">
                {[
                  'Locally owned and operated in the West Valley',
                  'Fully insured, bonded, and background-checked team',
                  'Eco-friendly, safe cleaning products',
                  'Flexible scheduling — weekly, bi-weekly, or one-time',
                  '100% satisfaction guarantee on every clean',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 mt-8 text-sky-600 font-semibold hover:gap-3 transition-all duration-200 cursor-pointer"
              >
                Learn our story <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              What Our Clients Are Saying
            </h2>
            <p className="text-slate-600">Real reviews from real Arizona families and business owners.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <StarRating count={t.rating} />
                <p className="text-slate-700 leading-relaxed mt-4 mb-6 text-sm">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center font-bold text-sky-700 text-sm font-heading">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">{t.name}</div>
                    <div className="text-slate-500 text-xs">{t.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-gradient-to-r from-slate-900 to-sky-900 py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready for a Cleaner, Happier Home?
          </h2>
          <p className="text-slate-300 text-lg mb-8">
            Get your free, no-obligation quote today. We serve Surprise, Peoria, Glendale, Sun City, Goodyear, and Buckeye.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/request-quote"
              className="inline-flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-400 text-white font-semibold px-7 py-3.5 rounded-xl transition-colors duration-200 cursor-pointer text-base"
            >
              Request a Free Quote <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="tel:4803097607"
              className="inline-flex items-center justify-center gap-2 border border-white/30 hover:bg-white/10 text-white font-semibold px-7 py-3.5 rounded-xl transition-colors duration-200 cursor-pointer text-base"
            >
              <Phone className="w-4 h-4" /> Call Us Now
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

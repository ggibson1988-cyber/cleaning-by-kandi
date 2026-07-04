import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield, Star, CheckCircle, Phone, ArrowRight,
  Home as HomeIcon, Layers, MoveRight, Building2, Key,
  Clock, ThumbsUp, Leaf, Award,
} from 'lucide-react';
import FadeIn from '../components/FadeIn';
import { StaggerGrid, StaggerItem } from '../components/StaggerGrid';
import WaveDivider from '../components/WaveDivider';
import BubblePattern from '../components/BubblePattern';
import SparkleAccent from '../components/SparkleAccent';

/* ─── Data ───────────────────────────────────────────────── */
const services = [
  { icon: HomeIcon,   title: 'Residential Cleaning',  description: 'Regular scheduled cleaning to keep your home spotless — kitchens, baths, living areas, and more.' },
  { icon: Layers,     title: 'Deep Cleaning',          description: 'A thorough top-to-bottom clean, reaching every corner your regular routine misses.' },
  { icon: Key,        title: 'Move-In / Move-Out',     description: 'Start fresh or leave a sparkling impression for the next occupants.' },
  { icon: Building2,  title: 'Short-Term Rental',      description: 'Fast, reliable turnovers for Airbnb and VRBO hosts — guest-ready every time.' },
  { icon: MoveRight,  title: 'Commercial Cleaning',    description: 'Professional cleaning for offices and commercial spaces, done on your schedule.' },
];

const trustBadges = [
  { icon: Shield, label: 'Fully Insured' },
  { icon: Award,  label: 'Bonded & Vetted' },
  { icon: Leaf,   label: 'Eco-Friendly' },
  { icon: Clock,  label: 'On-Time Guarantee' },
];

const testimonials = [
  {
    name: 'Sarah M.', location: 'Surprise, AZ', rating: 5,
    text: 'Kandi and her team are absolutely incredible! My house has never looked so clean. They paid attention to every little detail and even cleaned areas I forgot to mention.',
  },
  {
    name: 'James T.', location: 'Peoria, AZ', rating: 5,
    text: 'I use Cleaning By Kandi for my Airbnb property. The turnovers are flawless — guests always comment on how clean and fresh everything is. Bookings have improved since I started.',
  },
  {
    name: 'Linda R.', location: 'Glendale, AZ', rating: 5,
    text: 'After moving out, Kandi did a move-out clean that looked better than when I moved in. Got my full deposit back — worth every penny!',
  },
];

const stats = [
  { value: '500+', label: 'Happy Clients' },
  { value: '5★',   label: 'Average Rating' },
  { value: '3+',   label: 'Years in AZ' },
  { value: '6',    label: 'Cities Served' },
];

/* ─── Star rating ────────────────────────────────────────── */
function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

/* ─── Hero photo frame ───────────────────────────────────── */
function HeroPhoto() {
  return (
    <div className="relative hidden lg:block">
      <div className="absolute -top-4 -right-4 w-full h-full rounded-3xl border-2 border-sky-400/40" aria-hidden="true" />
      <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/5]">
        <img
          src="/images/hero.jpg"
          alt="Cleaning By Kandi professional cleaning a bright Arizona home"
          className="w-full h-full object-cover"
          width={800}
          height={1000}
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent" aria-hidden="true" />
        <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg flex items-center gap-3">
          <ThumbsUp className="w-5 h-5 text-emerald-500" />
          <div>
            <div className="text-xs text-slate-500 font-medium">Satisfaction Rate</div>
            <div className="font-heading font-bold text-slate-900 text-xl tabular leading-none">100%</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────── */
export default function Home() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-sky-900">
        <BubblePattern opacity={0.07} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              {/* Mobile-only: circular hero photo medallion */}
              <div className="block lg:hidden mb-6">
                <img
                  src="/images/hero.jpg"
                  alt="Cleaning By Kandi professional at work"
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-sky-400/30 shadow-lg"
                  width={80}
                  height={80}
                />
              </div>

              <motion.div
                className="inline-flex items-center gap-2 bg-sky-600/20 border border-sky-500/30 text-sky-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6"
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                <Shield className="w-3.5 h-3.5" />
                Serving the West Valley, Arizona
              </motion.div>

              <motion.h1
                className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                A Spotlessly<br />
                Clean Home,{' '}
                <span className="text-sky-400">Guaranteed.</span>
              </motion.h1>

              <motion.p
                className="text-lg text-slate-300 leading-relaxed mb-8 max-w-xl"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                Cleaning By Kandi delivers reliable, detail-obsessed residential and commercial cleaning across Surprise, Peoria, Glendale, and the greater West Valley.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-3"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  to="/request-quote"
                  className="inline-flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-400 text-white font-semibold px-6 py-3.5 rounded-xl transition-colors duration-200 cursor-pointer text-base min-h-[44px]"
                >
                  Get Your Free Quote
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="tel:4803097607"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-6 py-3.5 rounded-xl transition-colors duration-200 cursor-pointer text-base min-h-[44px]"
                >
                  <Phone className="w-4 h-4" />
                  (480) 309-7607
                </a>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.75, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              <HeroPhoto />
            </motion.div>
          </div>
        </div>
        <WaveDivider fill="#FFFFFF" />
      </section>

      {/* ── Trust badges ── */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <FadeIn>
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
          </FadeIn>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-sky-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <StaggerGrid className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map(({ value, label }) => (
              <StaggerItem key={label}>
                <div className="text-4xl font-bold font-heading text-white mb-1 tabular">{value}</div>
                <div className="text-sky-100 text-sm">{label}</div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="py-16 md:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <p className="text-sky-600 font-semibold text-sm uppercase tracking-wider mb-2">What We Offer</p>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Cleaning Built Around Your Life<SparkleAccent className="ml-2" />
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Whether it's weekly upkeep or a one-time deep clean, we have a service to match every need and budget.
            </p>
          </FadeIn>

          <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(({ icon: Icon, title, description }, idx) => (
              <StaggerItem key={title} className={idx >= 3 ? 'hidden sm:block' : undefined}>
                <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-sky-300 hover:shadow-lg transition-all duration-300 group h-full flex flex-col">
                  <div className="w-12 h-12 bg-sky-50 group-hover:bg-sky-600 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300">
                    <Icon className="w-6 h-6 text-sky-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="font-heading font-semibold text-slate-900 mb-2">{title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4 flex-1">{description}</p>
                  <Link
                    to="/services"
                    className="inline-flex items-center gap-1 text-sky-600 text-sm font-medium hover:gap-2 transition-all duration-200 cursor-pointer"
                  >
                    Learn more <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </StaggerItem>
            ))}

            {/* CTA card */}
            <StaggerItem>
              <div className="bg-sky-600 rounded-2xl p-6 flex flex-col justify-between h-full">
                <div>
                  <h3 className="font-heading font-bold text-white text-xl mb-2">Ready to get started?</h3>
                  <p className="text-sky-100 text-sm leading-relaxed">
                    Fill out our quick quote form and we'll respond within 24 hours.
                  </p>
                </div>
                <Link
                  to="/request-quote"
                  className="inline-flex items-center gap-2 mt-6 bg-white text-sky-600 font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-sky-50 transition-colors duration-200 cursor-pointer w-fit"
                >
                  Request a Quote <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </StaggerItem>
          </StaggerGrid>

          {/* Mobile-only: link to all 5 services (cards 4–5 are hidden on mobile) */}
          <div className="mt-6 text-center sm:hidden">
            <Link
              to="/services"
              className="inline-flex items-center gap-1.5 text-sky-600 font-semibold text-sm hover:underline min-h-[44px]"
            >
              See all 5 services <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Pull-quote — deliberately sparse section ── */}
      <section className="bg-white py-16 md:py-24">
        <FadeIn className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div
            className="text-sky-500 mb-6 flex justify-center"
            aria-hidden="true"
          >
            <Star className="w-8 h-8 fill-sky-500" />
          </div>
          <blockquote className="text-2xl md:text-3xl lg:text-4xl font-heading font-medium text-slate-900 leading-tight italic mb-8">
            &ldquo;My house has never looked so clean. They paid attention to every little detail.&rdquo;
          </blockquote>
          <p className="text-slate-500 font-medium">— Sarah M., Surprise, AZ</p>
        </FadeIn>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="py-16 md:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Photo */}
            <FadeIn direction="left">
              <div className="relative">
                <div className="absolute -top-3 -left-3 w-full h-full rounded-3xl border-2 border-emerald-400/40" aria-hidden="true" />
                <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-[4/3]">
                  <img
                    src="/images/clean-home.jpg"
                    alt="Bright, freshly cleaned Arizona living room interior"
                    className="w-full h-full object-cover"
                    width={800}
                    height={600}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="right">
              <p className="text-sky-600 font-semibold text-sm uppercase tracking-wider mb-2">Why Choose Us</p>
              <h2 className="text-4xl font-bold text-slate-900 mb-4">
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
                className="inline-flex items-center gap-2 mt-8 text-sky-600 font-semibold hover:gap-3 transition-all duration-200 cursor-pointer min-h-[44px]"
              >
                Learn our story <ArrowRight className="w-4 h-4" />
              </Link>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <p className="text-sky-600 font-semibold text-sm uppercase tracking-wider mb-2">Reviews</p>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">What Our Clients Are Saying<SparkleAccent className="ml-2" /></h2>
            <p className="text-slate-600">Real reviews from real Arizona families and business owners.</p>
          </FadeIn>
          <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <StaggerItem key={t.name}>
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 h-full flex flex-col">
                  <StarRating count={t.rating} />
                  <p className="text-slate-700 leading-relaxed mt-4 mb-6 text-sm flex-1">&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center font-bold text-sky-700 text-sm font-heading shrink-0">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 text-sm">{t.name}</div>
                      <div className="text-slate-500 text-xs">{t.location}</div>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* ── CTA banner ── */}
      <section className="relative overflow-hidden bg-gradient-to-r from-slate-900 to-sky-900 py-14">
        <BubblePattern opacity={0.05} />
        <FadeIn className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready for a Cleaner, Happier Home?
          </h2>
          <p className="text-slate-300 text-lg mb-8">
            Get your free, no-obligation quote today. We serve Surprise, Peoria, Glendale, Sun City, Goodyear, and Buckeye.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/request-quote"
              className="inline-flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-400 text-white font-semibold px-7 py-3.5 rounded-xl transition-colors duration-200 cursor-pointer text-base min-h-[44px]"
            >
              Request a Free Quote <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="tel:4803097607"
              className="inline-flex items-center justify-center gap-2 border border-white/30 hover:bg-white/10 text-white font-semibold px-7 py-3.5 rounded-xl transition-colors duration-200 cursor-pointer text-base min-h-[44px]"
            >
              <Phone className="w-4 h-4" /> Call Us Now
            </a>
          </div>
        </FadeIn>
      </section>
    </>
  );
}

import { Link } from 'react-router-dom';
import {
  Heart,
  Shield,
  Star,
  Clock,
  CheckCircle,
  ArrowRight,
  Leaf,
  Award,
  Users,
} from 'lucide-react';

const values = [
  {
    icon: Shield,
    title: 'Reliability',
    description:
      'When you book with Cleaning By Kandi, you can count on us to show up on time, every time. We understand that your schedule is precious, and we treat it that way.',
  },
  {
    icon: Star,
    title: 'Attention to Detail',
    description:
      'We clean the baseboards, wipe down the light switches, and get behind the appliances. The little things matter — and they\'re exactly what sets us apart.',
  },
  {
    icon: Heart,
    title: 'Care & Respect',
    description:
      'Your home is your sanctuary. We treat every space with the same respect we would our own — handling your belongings with care and leaving everything just as you\'d want it.',
  },
  {
    icon: Leaf,
    title: 'Eco-Friendly Approach',
    description:
      'We use environmentally safe cleaning products that are effective without harsh chemicals — better for your family, pets, and our planet.',
  },
  {
    icon: Clock,
    title: 'Flexible Scheduling',
    description:
      'Life is busy. That\'s why we offer weekly, bi-weekly, monthly, and one-time cleanings — scheduled around what works best for you.',
  },
  {
    icon: Award,
    title: 'Satisfaction Guarantee',
    description:
      'Not completely satisfied? Let us know within 24 hours and we\'ll come back to make it right — no questions asked.',
  },
];

const milestones = [
  { year: 'Founded', label: 'Cleaning By Kandi was born from a passion for helping families reclaim their time.' },
  { year: '100 Clients', label: 'Word spread quickly — neighbors told neighbors, and our reputation grew organically.' },
  { year: '6 Cities', label: 'Expanded to serve all of the West Valley: Surprise, Peoria, Glendale, Sun City, Goodyear, and Buckeye.' },
  { year: '500+ Clients', label: 'Trusted by hundreds of Arizona homeowners, Airbnb hosts, and local businesses.' },
];

export default function About() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-sky-900 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sky-400 font-medium text-sm uppercase tracking-wider mb-3">Our Story</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              More Than a Cleaning Service — We're Your Partner in a Cleaner Life
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              Cleaning By Kandi was founded on a simple belief: everyone deserves to come home to a clean, comfortable space — without spending their weekends scrubbing floors.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                The Story Behind Cleaning By Kandi
              </h2>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  Hi, I'm Kandi! I started Cleaning By Kandi after years of working as a professional cleaner and realizing that most clients weren't just looking for someone to push a mop around — they were looking for someone they could <strong className="text-slate-800">trust</strong>.
                </p>
                <p>
                  Living and working in the West Valley, I saw how many busy families, working professionals, and short-term rental hosts were struggling to keep up with the demands of a clean home. So I set out to build a cleaning service that felt more like having a trusted friend help out — someone who genuinely cares about the result.
                </p>
                <p>
                  Today, Cleaning By Kandi serves hundreds of clients across six Arizona cities. Every member of our team shares my commitment to reliability, thoroughness, and treating every home with the respect it deserves.
                </p>
              </div>
              <Link
                to="/request-quote"
                className="inline-flex items-center gap-2 mt-8 bg-sky-600 hover:bg-sky-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-200 cursor-pointer"
              >
                Book Your First Clean <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Image placeholder */}
            <div className="bg-gradient-to-br from-sky-100 to-emerald-100 rounded-3xl aspect-square flex items-center justify-center">
              <div className="text-center px-8">
                <div className="w-24 h-24 bg-sky-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-12 h-12 text-sky-600" />
                </div>
                <p className="text-slate-500 font-medium">Meet Our Team</p>
                <p className="text-slate-400 text-sm mt-1">Photo coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Journey / Milestones */}
      <section className="py-16 md:py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Our Journey</h2>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-slate-200 hidden sm:block" aria-hidden="true" />
            <div className="space-y-8">
              {milestones.map(({ year, label }) => (
                <div key={year} className="flex gap-6 items-start">
                  <div className="relative w-12 h-12 bg-sky-600 rounded-full flex items-center justify-center shrink-0 z-10">
                    <span className="text-white font-bold font-heading text-xs text-center leading-tight px-1">{year}</span>
                  </div>
                  <div className="bg-white rounded-2xl p-5 border border-slate-200 flex-1 shadow-sm">
                    <p className="text-slate-700 leading-relaxed">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Our Core Values</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              These aren't just words on a wall — they're the principles we show up with at every single clean.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map(({ icon: Icon, title, description }) => (
              <div key={title} className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <div className="w-11 h-11 bg-sky-100 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-sky-600" />
                </div>
                <h3 className="font-heading font-semibold text-slate-900 text-lg mb-2">{title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="py-16 bg-sky-600">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Why Hundreds of Arizona Families Trust Us</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {[
              'Locally owned & operated',
              'Fully insured & bonded',
              'Background-checked team',
              'Eco-friendly products',
              'No long-term contracts',
              '100% satisfaction guarantee',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-3">
                <CheckCircle className="w-4 h-4 text-emerald-300 shrink-0" />
                <span className="text-white text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>
          <Link
            to="/request-quote"
            className="inline-flex items-center gap-2 bg-white text-sky-700 font-bold px-7 py-3.5 rounded-xl hover:bg-sky-50 transition-colors duration-200 cursor-pointer"
          >
            Get Your Free Quote <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}

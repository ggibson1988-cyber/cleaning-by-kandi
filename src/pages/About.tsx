import { Link } from 'react-router-dom';
import {
  Heart, Shield, Star, Clock, CheckCircle,
  ArrowRight,
} from 'lucide-react';
import FadeIn from '../components/FadeIn';
import { StaggerGrid, StaggerItem } from '../components/StaggerGrid';
import WaveDivider from '../components/WaveDivider';
import BubblePattern from '../components/BubblePattern';
import SparkleAccent from '../components/SparkleAccent';
import Seo from '../components/Seo';
import Breadcrumbs from '../components/Breadcrumbs';

const values = [
  { icon: Shield, title: 'Reliability',         description: 'When you book with Cleaning By Kandi, you can count on us to show up on time, every time. Your schedule is precious — we treat it that way.' },
  { icon: Star,   title: 'Attention to Detail', description: 'We clean the baseboards, wipe the light switches, and get behind the appliances. The little things are exactly what sets us apart.' },
  { icon: Heart,  title: 'Care & Respect',      description: 'Your home is your sanctuary. We treat every space with the same respect we\'d give our own — handling belongings with care.' },
  { icon: Clock,  title: 'Flexible Scheduling', description: 'Life is busy. That\'s why we offer weekly, bi-weekly, monthly, and one-time cleanings — scheduled around what works best for you.' },
];

const milestones = [
  { year: 'Founded',   label: 'Cleaning By Kandi was born from a passion for helping families reclaim their time and come home to a space they love.' },
  { year: 'Growing',   label: 'Word spread quickly — neighbors told neighbors, and our reputation grew through genuine care and results that speak for themselves.' },
  { year: 'West Valley', label: 'Expanded to serve all of the West Valley: Surprise, Peoria, Glendale, Sun City, Goodyear, and Buckeye.' },
];

export default function About() {
  return (
    <>
      <Seo path="/about" />
      <Breadcrumbs items={[{ label: 'About', path: '/about' }]} />
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-sky-900 py-16 md:py-24">
        <BubblePattern opacity={0.06} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="max-w-3xl">
            <p className="text-sky-400 font-semibold text-sm uppercase tracking-wider mb-3">Our Story</p>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              More Than a Cleaning Service
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              Cleaning By Kandi was founded on a simple belief: everyone deserves to come home to a clean, comfortable space — without spending their weekends scrubbing floors.
            </p>
          </FadeIn>
        </div>
        <WaveDivider fill="#FFFFFF" />
      </section>

      {/* ── Story ── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <FadeIn direction="left">
              <p className="text-brand-primary font-semibold text-sm uppercase tracking-wider mb-2">Our Founder</p>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
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
                  Today, Cleaning By Kandi serves clients across six West Valley cities. Every member of our team shares my commitment to reliability, thoroughness, and treating every home with the respect it deserves.
                </p>
              </div>
              <Link
                to="/request-quote"
                className="inline-flex items-center gap-2 mt-8 bg-brand-primary hover:bg-brand-primary-dark text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-200 cursor-pointer"
              >
                Book Your First Clean <ArrowRight className="w-4 h-4" />
              </Link>
            </FadeIn>

            {/* Photo with offset-ring motif */}
            <FadeIn direction="right">
              <div className="relative">
                <div className="absolute -top-4 -right-4 w-full h-full rounded-3xl border-2 border-sky-400/40" aria-hidden="true" />
                <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-[4/3]">
                  <img
                    src="/images/about-team.jpg"
                    alt="Kandi and her professional cleaning team ready for a West Valley home cleaning"
                    className="w-full h-full object-cover"
                    width={800}
                    height={600}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent" aria-hidden="true" />
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── Journey ── */}
      <section className="py-16 md:py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Our Journey</h2>
          </FadeIn>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200 hidden sm:block" aria-hidden="true" />
            <div className="space-y-8">
              {milestones.map(({ year, label }, idx) => (
                <FadeIn key={year} delay={idx * 0.1}>
                  <div className="flex gap-6 items-start">
                    <div className="relative w-12 h-12 bg-brand-primary rounded-full flex items-center justify-center shrink-0 z-10">
                      <span className="text-white font-bold font-heading text-[10px] text-center leading-tight px-1">{year}</span>
                    </div>
                    <div className="bg-white rounded-2xl p-5 border border-slate-200 flex-1 shadow-sm">
                      <p className="text-slate-700 leading-relaxed">{label}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <p className="text-brand-primary font-semibold text-sm uppercase tracking-wider mb-2">How We Work</p>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Our Core Values<SparkleAccent className="ml-2" /></h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              These aren't just words on a wall — they're the principles we show up with at every single clean.
            </p>
          </FadeIn>
          <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map(({ icon: Icon, title, description }) => (
              <StaggerItem key={title}>
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 h-full">
                  <div className="w-11 h-11 bg-sky-100 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-brand-primary" />
                  </div>
                  <h3 className="font-heading font-semibold text-slate-900 mb-2">{title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 sm:line-clamp-none">{description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* ── Trust CTA ── */}
      <section className="relative overflow-hidden bg-brand-primary py-16">
        <BubblePattern opacity={0.08} />
        <FadeIn className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Why Arizona Families Trust Us</h2>
          <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {[
              'Locally owned & operated',
              'Fully insured',
              'Background-checked team',
              'No long-term contracts',
            ].map((item) => (
              <StaggerItem key={item}>
                <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-3">
                  <CheckCircle className="w-4 h-4 text-emerald-300 shrink-0" />
                  <span className="text-white text-sm font-medium">{item}</span>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
          <Link
            to="/request-quote"
            className="inline-flex items-center gap-2 bg-white text-sky-700 font-bold px-7 py-3.5 rounded-xl hover:bg-sky-50 transition-colors duration-200 cursor-pointer"
          >
            Get Your Free Quote <ArrowRight className="w-4 h-4" />
          </Link>
        </FadeIn>
      </section>
    </>
  );
}

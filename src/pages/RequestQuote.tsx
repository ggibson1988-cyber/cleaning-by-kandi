import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Home, Layers, Key, Building2, MoveRight,
  CheckCircle, ArrowRight, ArrowLeft, Phone, Mail,
  User, MapPin, Calendar, MessageSquare, Sparkles,
} from 'lucide-react';

type ServiceType = 'residential' | 'deep' | 'moveinout' | 'rental' | 'commercial' | '';

interface FormData {
  serviceType: ServiceType;
  bedrooms: string; bathrooms: string; sqft: string; frequency: string;
  firstName: string; lastName: string; email: string; phone: string;
  city: string; address: string; preferredDate: string; notes: string;
}

const INIT: FormData = {
  serviceType: '', bedrooms: '', bathrooms: '', sqft: '', frequency: '',
  firstName: '', lastName: '', email: '', phone: '',
  city: '', address: '', preferredDate: '', notes: '',
};

const SERVICES = [
  { id: 'residential' as ServiceType, icon: Home,      label: 'Residential Cleaning',     desc: 'Regular scheduled home cleaning' },
  { id: 'deep'        as ServiceType, icon: Layers,    label: 'Deep Cleaning',             desc: 'Thorough top-to-bottom clean' },
  { id: 'moveinout'   as ServiceType, icon: Key,       label: 'Move-In / Move-Out',        desc: 'For moves and vacating tenants' },
  { id: 'rental'      as ServiceType, icon: Building2, label: 'Short-Term Rental',         desc: 'Airbnb / VRBO turnovers' },
  { id: 'commercial'  as ServiceType, icon: MoveRight, label: 'Commercial Cleaning',       desc: 'Offices and commercial spaces' },
];

const FREQUENCIES = ['One-Time', 'Weekly', 'Bi-Weekly', 'Monthly'];
const CITIES      = ['Surprise', 'Peoria', 'Glendale', 'Sun City', 'Goodyear', 'Buckeye', 'Other'];
const BEDROOMS    = ['Studio', '1', '2', '3', '4', '5+'];
const BATHROOMS   = ['1', '1.5', '2', '2.5', '3', '3+'];
const TOTAL_STEPS = 3;

const SLIDE = {
  enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const } },
  exit:  (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0, transition: { duration: 0.18 } }),
};

/* ── Sub-components ── */
function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8" aria-label={`Step ${current} of ${total}`}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold font-heading transition-all duration-300 ${
              i + 1 < current ? 'bg-brand-accent text-white'
              : i + 1 === current ? 'bg-brand-primary text-white ring-4 ring-sky-100'
              : 'bg-slate-200 text-slate-500'
            }`}
          >
            {i + 1 < current ? <CheckCircle className="w-4 h-4" /> : i + 1}
          </div>
          {i < total - 1 && (
            <div className={`w-12 h-0.5 transition-colors duration-300 ${i + 1 < current ? 'bg-brand-accent' : 'bg-slate-200'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function FieldLabel({ htmlFor, children, required }: { htmlFor: string; children: React.ReactNode; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-semibold text-slate-700 mb-1.5">
      {children}
      {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
    </label>
  );
}

const inputCls = "w-full border border-slate-300 rounded-xl px-4 py-3 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all duration-200";
const iconInputCls = `${inputCls} pl-10`;

/* ── Main component ── */
export default function RequestQuote() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormData>(INIT);

  const set = (key: keyof FormData) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const canNext1 = form.serviceType !== '';
  const canNext2 = Boolean(form.bedrooms && form.bathrooms && form.frequency);
  const canSubmit = Boolean(form.firstName && form.lastName && form.email && form.phone && form.city);

  const goTo = (next: number) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  };

  /* ── Success state ── */
  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-20">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-10 h-10 text-brand-success" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Quote Request Received!</h1>
          <p className="text-slate-600 leading-relaxed mb-6">
            Thank you, <strong>{form.firstName}</strong>! We'll follow up within 24 hours at{' '}
            <strong>{form.email}</strong>.
          </p>
          <p className="text-slate-500 text-sm mb-8">
            For immediate assistance, call{' '}
            <a href="tel:4803097607" className="text-brand-primary font-semibold hover:underline cursor-pointer">(480) 309-7607</a>
          </p>
          <button
            onClick={() => { setSubmitted(false); setStep(1); setForm(INIT); }}
            className="bg-brand-primary hover:bg-brand-primary-dark text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-200 cursor-pointer"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-sky-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Get Your Free Quote</h1>
          <p className="text-slate-300 max-w-xl mx-auto">
            Fill out the form below and we'll send you a custom quote within 24 hours — no obligation, no pressure.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="py-12 md:py-16 bg-slate-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-10 overflow-hidden">
            <StepIndicator current={step} total={TOTAL_STEPS} />

            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} noValidate>
              <AnimatePresence mode="wait" custom={direction} initial={false}>
                {/* ── Step 1: Service ── */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    custom={direction}
                    variants={SLIDE}
                    initial="enter"
                    animate="center"
                    exit="exit"
                  >
                    <h2 className="text-xl font-bold text-slate-900 mb-1">Select Your Service</h2>
                    <p className="text-slate-500 text-sm mb-6">Choose the type of cleaning you need.</p>
                    <div className="grid grid-cols-1 gap-3">
                      {SERVICES.map(({ id, icon: Icon, label, desc }) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => set('serviceType')(id)}
                          aria-pressed={form.serviceType === id}
                          className={`flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer ${
                            form.serviceType === id
                              ? 'border-sky-500 bg-sky-50 ring-2 ring-sky-100'
                              : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${form.serviceType === id ? 'bg-brand-primary' : 'bg-slate-100'}`}>
                            <Icon className={`w-5 h-5 ${form.serviceType === id ? 'text-white' : 'text-slate-500'}`} />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-slate-900 text-sm">{label}</div>
                            <div className="text-slate-500 text-xs">{desc}</div>
                          </div>
                          {form.serviceType === id && <CheckCircle className="w-5 h-5 text-brand-primary shrink-0" />}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* ── Step 2: Home details ── */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    custom={direction}
                    variants={SLIDE}
                    initial="enter"
                    animate="center"
                    exit="exit"
                  >
                    <h2 className="text-xl font-bold text-slate-900 mb-1">Tell Us About Your Space</h2>
                    <p className="text-slate-500 text-sm mb-6">This helps us give you an accurate estimate.</p>
                    <div className="space-y-5">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <FieldLabel htmlFor="bedrooms" required>Bedrooms</FieldLabel>
                          <select id="bedrooms" value={form.bedrooms} onChange={(e) => set('bedrooms')(e.target.value)} required className={`${inputCls} appearance-none bg-white cursor-pointer`}>
                            <option value="">Select</option>
                            {BEDROOMS.map((o) => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <FieldLabel htmlFor="bathrooms" required>Bathrooms</FieldLabel>
                          <select id="bathrooms" value={form.bathrooms} onChange={(e) => set('bathrooms')(e.target.value)} required className={`${inputCls} appearance-none bg-white cursor-pointer`}>
                            <option value="">Select</option>
                            {BATHROOMS.map((o) => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                      </div>
                      <div>
                        <FieldLabel htmlFor="sqft">Approx. Square Footage</FieldLabel>
                        <input id="sqft" type="number" value={form.sqft} onChange={(e) => set('sqft')(e.target.value)} placeholder="e.g. 1800" className={inputCls} />
                      </div>
                      <div>
                        <FieldLabel htmlFor="frequency" required>How Often?</FieldLabel>
                        <div className="grid grid-cols-2 gap-2">
                          {FREQUENCIES.map((f) => (
                            <button
                              key={f}
                              type="button"
                              onClick={() => set('frequency')(f)}
                              aria-pressed={form.frequency === f}
                              className={`py-2.5 px-4 rounded-xl border-2 text-sm font-medium transition-all duration-200 cursor-pointer ${
                                form.frequency === f
                                  ? 'border-sky-500 bg-sky-50 text-sky-700'
                                  : 'border-slate-200 text-slate-600 hover:border-slate-300'
                              }`}
                            >
                              {f}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ── Step 3: Contact ── */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    custom={direction}
                    variants={SLIDE}
                    initial="enter"
                    animate="center"
                    exit="exit"
                  >
                    <h2 className="text-xl font-bold text-slate-900 mb-1">Your Contact Information</h2>
                    <p className="text-slate-500 text-sm mb-6">We'll use this to send your quote and follow up.</p>
                    <div className="space-y-4">
                      {/* Name row — collapses to 1-col on narrow screens */}
                      <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-4">
                        <div>
                          <FieldLabel htmlFor="firstName" required>First Name</FieldLabel>
                          <div className="relative">
                            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input id="firstName" type="text" value={form.firstName} onChange={(e) => set('firstName')(e.target.value)} required autoComplete="given-name" placeholder="Jane" className={iconInputCls} />
                          </div>
                        </div>
                        <div>
                          <FieldLabel htmlFor="lastName" required>Last Name</FieldLabel>
                          <input id="lastName" type="text" value={form.lastName} onChange={(e) => set('lastName')(e.target.value)} required autoComplete="family-name" placeholder="Smith" className={inputCls} />
                        </div>
                      </div>
                      <div>
                        <FieldLabel htmlFor="email" required>Email Address</FieldLabel>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input id="email" type="email" value={form.email} onChange={(e) => set('email')(e.target.value)} required autoComplete="email" placeholder="jane@example.com" className={iconInputCls} />
                        </div>
                      </div>
                      <div>
                        <FieldLabel htmlFor="phone" required>Phone Number</FieldLabel>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input id="phone" type="tel" value={form.phone} onChange={(e) => set('phone')(e.target.value)} required autoComplete="tel" placeholder="(480) 555-0123" className={iconInputCls} />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-4">
                        <div>
                          <FieldLabel htmlFor="city" required>City</FieldLabel>
                          <div className="relative">
                            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
                            <select id="city" value={form.city} onChange={(e) => set('city')(e.target.value)} required className={`${iconInputCls} appearance-none bg-white cursor-pointer`}>
                              <option value="">Select city</option>
                              {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                          </div>
                        </div>
                        <div>
                          <FieldLabel htmlFor="preferredDate">Preferred Date</FieldLabel>
                          <div className="relative">
                            <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input id="preferredDate" type="date" value={form.preferredDate} onChange={(e) => set('preferredDate')(e.target.value)} min={new Date().toISOString().split('T')[0]} className={`${iconInputCls} cursor-pointer`} />
                          </div>
                        </div>
                      </div>
                      <div>
                        <FieldLabel htmlFor="address">Street Address</FieldLabel>
                        <input id="address" type="text" value={form.address} onChange={(e) => set('address')(e.target.value)} placeholder="123 Main St" autoComplete="street-address" className={inputCls} />
                      </div>
                      <div>
                        <FieldLabel htmlFor="notes">Additional Notes</FieldLabel>
                        <div className="relative">
                          <MessageSquare className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                          <textarea id="notes" value={form.notes} onChange={(e) => set('notes')(e.target.value)} placeholder="Any pets, special instructions, or areas of focus?" rows={3} className={`${iconInputCls} resize-none`} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
                {step > 1 ? (
                  <button type="button" onClick={() => goTo(step - 1)} className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors duration-200 cursor-pointer">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                ) : <div />}

                {step < TOTAL_STEPS ? (
                  <button
                    type="button"
                    onClick={() => goTo(step + 1)}
                    disabled={step === 1 ? !canNext1 : !canNext2}
                    className="inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-primary-dark disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-xl transition-colors duration-200 cursor-pointer text-sm"
                  >
                    Next Step <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className="inline-flex items-center gap-2 bg-brand-success hover:bg-brand-success-dark disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold px-6 py-2.5 rounded-xl transition-colors duration-200 cursor-pointer text-sm"
                  >
                    <Sparkles className="w-4 h-4" /> Submit Quote Request
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Trust note */}
          <div className="mt-6 bg-white rounded-2xl border border-slate-200 p-5 flex gap-4 items-start">
            <CheckCircle className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-900 text-sm">No commitment required</p>
              <p className="text-slate-500 text-xs mt-0.5">
                Requesting a quote is 100% free. We'll respond within 24 hours with a custom estimate for your specific needs.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

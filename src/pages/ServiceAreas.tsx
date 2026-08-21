import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, Phone, CheckCircle } from 'lucide-react';
import FadeIn from '../components/FadeIn';
import { StaggerGrid, StaggerItem } from '../components/StaggerGrid';
import WaveDivider from '../components/WaveDivider';
import BubblePattern from '../components/BubblePattern';
import Seo from '../components/Seo';
import Breadcrumbs from '../components/Breadcrumbs';
import ResponsiveImage from '../components/ResponsiveImage';

// Kept in sync with SERVICE_AREAS in src/lib/business.ts (footer + JSON-LD
// areaServed) — see docs/ARCHITECTURE.md "Open questions for the owner" #5
// for the history of this list previously drifting out of sync. Sun City
// and Buckeye have no verified zip list yet, so their zip arrays are left
// empty rather than guessed.
const cities = [
  { name: 'Peoria',   description: 'Our home base! Proudly serving Lake Pleasant, Vistancia, and all Peoria neighborhoods.',           zip: ['85345', '85380', '85381', '85382', '85383'], highlight: true  },
  { name: 'Surprise', description: 'We serve all Surprise neighborhoods — from Marley Park to Asante.',                                zip: ['85374', '85378', '85379', '85388'], highlight: false },
  { name: 'Glendale', description: 'Serving homes and businesses throughout Glendale, including Westgate and Arrowhead.',              zip: ['85301', '85302', '85303', '85304', '85305', '85306'], highlight: false },
  { name: 'Sun City', description: 'Serving Sun City and the surrounding West Valley retirement communities.',                         zip: [], highlight: false },
  { name: 'Goodyear', description: 'Covering Palm Valley, Estrella Mountain Ranch, and Goodyear neighborhoods.',                      zip: ['85338', '85395'], highlight: false },
  { name: 'Buckeye',  description: 'Reaching homes and businesses out to Buckeye on the western edge of the Valley.',                  zip: [], highlight: false },
  { name: 'And More', description: 'Don\'t see your city? We may still be able to help — give us a call!',                           zip: [], highlight: false },
];

const ArizonaMap = () => {
  const pins = [
    { x: 227, y: 173, name: 'Surprise', primary: false, lx: 240, ly: 158, anchor: 'start' as const },
    { x: 319, y: 201, name: 'Peoria',   primary: true,  lx: 332, ly: 184, anchor: 'start' as const },
    { x: 354, y: 225, name: 'Glendale', primary: false, lx: 367, ly: 210, anchor: 'start' as const },
    // Placed along the Loop 101 corridor labeled below ("N/S through Sun
    // City & Peoria"), north of the Peoria pin — decorative/approximate,
    // like the rest of this map, not a verified coordinate.
    { x: 275, y: 125, name: 'Sun City', primary: false, lx: 262, ly: 110, anchor: 'end'   as const },
    { x: 234, y: 284, name: 'Goodyear', primary: false, lx: 247, ly: 269, anchor: 'start' as const },
    // Placed along the I-10 corridor labeled below ("E/W through Goodyear
    // & Buckeye"), west of the Goodyear pin — decorative/approximate.
    { x: 105, y: 275, name: 'Buckeye',  primary: false, lx: 92,  ly: 260, anchor: 'start' as const },
  ];

  return (
    <div className="relative w-full max-w-lg mx-auto">
      <svg
        viewBox="0 0 480 380"
        className="w-full rounded-2xl"
        aria-label="Map showing Cleaning By Kandi service area in the West Valley, Arizona"
        role="img"
      >
        <defs>
          <linearGradient id="cbkDesertBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EDE5C8" />
            <stop offset="100%" stopColor="#DED0A5" />
          </linearGradient>
          <filter id="cbkPin" x="-60%" y="-60%" width="220%" height="220%">
            <feDropShadow dx="0" dy="2" stdDeviation="2.2" floodOpacity="0.22" floodColor="#5C3A10" />
          </filter>
        </defs>

        {/* Desert base */}
        <rect width="480" height="380" fill="url(#cbkDesertBg)" rx="14" />

        {/* White Tank Mountains (west) */}
        <path d="M38 288 L56 252 L70 266 L84 240 L100 258 L118 236 L128 250 L138 234 L146 249 L152 240 L158 257 L148 288 Z"
              fill="#C8A870" opacity="0.40" />
        {/* Estrella Mountains (SW) */}
        <path d="M64 374 L82 340 L96 354 L110 324 L124 342 L136 323 L145 338 L150 374 Z"
              fill="#BF9E6A" opacity="0.34" />

        {/* Lake Pleasant */}
        <path d="M283 27 Q298 17 318 21 Q340 17 351 35 Q354 50 343 61 Q329 71 311 67 Q293 71 279 58 Q271 46 283 27 Z"
              fill="#A8C8DC" stroke="#88B2CC" strokeWidth="1.2" opacity="0.88" />
        <text x="314" y="45" textAnchor="middle" fontSize="7" fontFamily="system-ui,-apple-system,sans-serif"
              fill="#4A88A4" fontWeight="600" letterSpacing="0.3">Lake Pleasant</text>

        {/* Urban developed areas (lighter cream patches) */}
        <rect x="186" y="143" width="83" height="73" fill="#F2EAD2" opacity="0.50" rx="5" />
        <rect x="257" y="153" width="106" height="96" fill="#F2EAD2" opacity="0.50" rx="5" />
        <rect x="317" y="189" width="82" height="82" fill="#F2EAD2" opacity="0.48" rx="5" />
        <rect x="197" y="258" width="68" height="58" fill="#F2EAD2" opacity="0.42" rx="5" />

        {/* Street grid */}
        {[158, 178, 198, 218, 238, 258, 278].map((y) => (
          <line key={`h${y}`} x1="156" y1={y} x2="434" y2={y} stroke="#F5EDD8" strokeWidth="0.7" opacity="0.65" />
        ))}
        {[196, 229, 263, 296, 329, 362, 396].map((x) => (
          <line key={`v${x}`} x1={x} y1="120" x2={x} y2="344" stroke="#F5EDD8" strokeWidth="0.7" opacity="0.65" />
        ))}

        {/* Major arterials */}
        <line x1="163" y1="168" x2="434" y2="168" stroke="#E8DEC0" strokeWidth="2.0" opacity="0.78" />
        <line x1="163" y1="192" x2="434" y2="192" stroke="#E8DEC0" strokeWidth="2.0" opacity="0.78" />
        <line x1="186" y1="213" x2="434" y2="213" stroke="#E8DEC0" strokeWidth="1.6" opacity="0.68" />
        <line x1="186" y1="241" x2="434" y2="241" stroke="#E8DEC0" strokeWidth="1.6" opacity="0.68" />

        {/* Loop 303 – N/S through Surprise & Goodyear */}
        <path d="M226 93 L226 176 Q228 206 234 226 L234 289"
              fill="none" stroke="#C8A445" strokeWidth="3.2" strokeLinecap="round" opacity="0.87" />
        <path d="M226 93 L226 176 Q228 206 234 226 L234 289"
              fill="none" stroke="#F0D580" strokeWidth="1.6" strokeLinecap="round" opacity="0.72" />

        {/* Loop 101 – N/S through Sun City & Peoria */}
        <path d="M303 93 L303 199 Q306 229 315 249 L323 316"
              fill="none" stroke="#C8A445" strokeWidth="3.2" strokeLinecap="round" opacity="0.87" />
        <path d="M303 93 L303 199 Q306 229 315 249 L323 316"
              fill="none" stroke="#F0D580" strokeWidth="1.6" strokeLinecap="round" opacity="0.72" />

        {/* I-10 – E/W through Goodyear & Buckeye */}
        <path d="M68 287 L435 287"
              fill="none" stroke="#C8A445" strokeWidth="3.8" strokeLinecap="round" opacity="0.87" />
        <path d="M68 287 L435 287"
              fill="none" stroke="#F0D580" strokeWidth="2.0" strokeLinecap="round" opacity="0.72" />

        {/* I-17 – N/S eastern corridor */}
        <path d="M399 93 L399 346"
              fill="none" stroke="#C8A445" strokeWidth="3.8" strokeLinecap="round" opacity="0.87" />
        <path d="M399 93 L399 346"
              fill="none" stroke="#F0D580" strokeWidth="2.0" strokeLinecap="round" opacity="0.72" />

        {/* Grand Ave diagonal */}
        <path d="M422 265 L196 130"
              fill="none" stroke="#C8A445" strokeWidth="2.2" strokeLinecap="round" opacity="0.58" />

        {/* Freeway shields */}
        <rect x="205" y="96" width="22" height="13" rx="3" fill="#B89038" opacity="0.92" />
        <text x="216" y="106" textAnchor="middle" fontSize="7.5" fontFamily="system-ui,sans-serif" fill="white" fontWeight="800">303</text>
        <rect x="281" y="96" width="22" height="13" rx="3" fill="#B89038" opacity="0.92" />
        <text x="292" y="106" textAnchor="middle" fontSize="7.5" fontFamily="system-ui,sans-serif" fill="white" fontWeight="800">101</text>
        <rect x="80" y="271" width="24" height="13" rx="3" fill="#B89038" opacity="0.92" />
        <text x="92" y="281" textAnchor="middle" fontSize="7.5" fontFamily="system-ui,sans-serif" fill="white" fontWeight="800">I-10</text>
        <rect x="378" y="96" width="24" height="13" rx="3" fill="#B89038" opacity="0.92" />
        <text x="390" y="106" textAnchor="middle" fontSize="7.5" fontFamily="system-ui,sans-serif" fill="white" fontWeight="800">I-17</text>

        {/* Service area boundary */}
        <polygon
          points="196,138 251,128 311,138 379,165 462,195 472,252 468,308 415,338 310,340 220,310 160,290 115,255 115,205 162,188"
          fill="#C87030" fillOpacity="0.10" stroke="#B06028" strokeWidth="1.8" strokeOpacity="0.38" strokeDasharray="5,4"
        />

        {/* Service area label */}
        <text x="280" y="362" textAnchor="middle" fontSize="7.5" fontFamily="system-ui,-apple-system,sans-serif"
              fill="#9A5020" fontWeight="700" letterSpacing="1.0" opacity="0.75">
          PHOENIX METRO SERVICE AREA
        </text>

        {/* City pins */}
        {pins.map((city) => (
          <g
            key={`pin-${city.name}`}
            transform={`translate(${city.x}, ${city.y}) scale(${city.primary ? 1.28 : 1})`}
            filter="url(#cbkPin)"
          >
            <path
              d="M0,0 C-8,-4 -10,-9 -10,-14 C-10,-20 -5,-24 0,-24 C5,-24 10,-20 10,-14 C10,-9 8,-4 0,0 Z"
              fill={city.primary ? '#CF4520' : '#3876C4'}
            />
            <circle cy="-14" r="4" fill="white" opacity="0.92" />
          </g>
        ))}

        {/* City labels */}
        {pins.map((city) => (
          <g key={`lbl-${city.name}`}>
            <text
              x={city.lx} y={city.ly}
              textAnchor={city.anchor}
              fontSize={city.primary ? 10 : 9}
              fontFamily="system-ui,-apple-system,sans-serif"
              fontWeight={city.primary ? '700' : '600'}
              fill={city.primary ? '#180800' : '#2A1E10'}
            >
              {city.name}
            </text>
            {city.primary && (
              <text
                x={city.lx} y={city.ly + 11}
                textAnchor={city.anchor}
                fontSize="7.5"
                fontFamily="system-ui,-apple-system,sans-serif"
                fontWeight="700"
                fill="#CF4520"
                letterSpacing="0.5"
              >
                HOME BASE
              </text>
            )}
          </g>
        ))}

        {/* North indicator */}
        <g transform="translate(456, 30)">
          <circle r="13" fill="white" fillOpacity="0.85" />
          <polygon points="0,-8 -3,-1 3,-1" fill="#CF4520" opacity="0.88" />
          <text y="8" textAnchor="middle" fontSize="10" fontFamily="system-ui,sans-serif" fill="#666" fontWeight="700">N</text>
        </g>
      </svg>
      <div className="absolute bottom-3 right-3 bg-white/85 border border-amber-200/50 rounded-lg px-2.5 py-1.5 text-xs text-amber-800/60 backdrop-blur-sm">
        Approximate area
      </div>
    </div>
  );
};

export default function ServiceAreas() {
  return (
    <>
      <Seo path="/service-areas" />
      <Breadcrumbs items={[{ label: 'Service Areas', path: '/service-areas' }]} />
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-sky-900 py-16 md:py-24">
        <BubblePattern opacity={0.06} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 bg-sky-600/20 border border-sky-500/30 text-sky-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <MapPin className="w-3.5 h-3.5" />
              West Valley, Arizona
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Serving the Phoenix Metro Area
            </h1>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Based in the West Valley, Cleaning By Kandi delivers top-tier cleaning services to homes and businesses across the region.
            </p>
          </FadeIn>
        </div>
        <WaveDivider fill="#F8FAFC" />
      </section>

      {/* ── Map + Cities ── */}
      <section className="py-16 md:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">

            {/* Map */}
            <FadeIn direction="left">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sticky top-24">
                <h2 className="font-heading font-bold text-slate-900 text-xl mb-6 text-center">Our Service Area</h2>
                <ArizonaMap />
                <div className="mt-6 flex flex-wrap gap-2 justify-center">
                  {cities.map((c) => (
                    <span
                      key={c.name}
                      className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
                        c.highlight ? 'bg-brand-primary text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <MapPin className="w-3 h-3" />
                      {c.name}
                    </span>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* City cards */}
            <StaggerGrid className="space-y-4">
              {cities.map((city) => (
                <StaggerItem key={city.name}>
                  <div
                    className={`bg-white rounded-2xl p-5 border shadow-sm transition-all duration-200 hover:shadow-md ${
                      city.highlight ? 'border-sky-300 ring-1 ring-sky-200' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${city.highlight ? 'bg-brand-primary' : 'bg-slate-100'}`}>
                        <MapPin className={`w-4 h-4 ${city.highlight ? 'text-white' : 'text-slate-500'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-heading font-semibold text-slate-900">{city.name === 'And More' ? city.name : `${city.name}, AZ`}</h3>
                          {city.highlight && (
                            <span className="text-xs bg-sky-100 text-sky-700 font-medium px-2 py-0.5 rounded-full">Our Base</span>
                          )}
                        </div>
                        <p className="text-slate-600 text-sm mt-1">{city.description}</p>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {city.zip.map((z) => (
                            <span key={z} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                              {z}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGrid>
          </div>
        </div>
      </section>

      {/* ── Arizona photo band ── */}
      <section className="relative overflow-hidden h-48 md:h-64">
        <ResponsiveImage
          base="/images/arizona"
          alt="Sonoran Desert landscape in the West Valley Arizona region — the communities Cleaning By Kandi serves"
          className="absolute inset-0 w-full h-full object-cover"
          widths={[400, 800, 1200]}
          width={1200}
          height={600}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/75 to-sky-900/50 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <p className="text-sky-300 font-semibold text-sm uppercase tracking-wider mb-2">Proudly Rooted in Arizona</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              The West Valley,<br className="sm:hidden" /> Our Home.
            </h2>
          </div>
        </div>
      </section>

      {/* ── Same service everywhere ── */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Same Great Service, Every City</h2>
            <p className="text-slate-600 mb-10">
              No matter where you are in the West Valley, you get the same reliable, detail-focused cleaning experience.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-2xl mx-auto mb-8">
              {[
                'Fully insured team',
                'Flexible scheduling options',
                'Consistent, trained cleaners',
                'Free, no-obligation quotes',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5 bg-slate-50 rounded-xl px-4 py-3 border border-slate-200">
                  <CheckCircle className="w-4 h-4 text-brand-accent shrink-0" />
                  <span className="text-slate-700 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Don't see your city ── */}
      <section className="bg-slate-50 border-t border-slate-200 py-12">
        <FadeIn className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Don't See Your City?</h2>
          <p className="text-slate-600 mb-6">
            We may still be able to serve you! Give us a call or send a message and we'll let you know if we can help.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/request-quote"
              className="inline-flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary-dark text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-200 cursor-pointer"
            >
              Request a Quote <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="tel:4803097607"
              className="inline-flex items-center justify-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold px-6 py-3 rounded-xl transition-colors duration-200 cursor-pointer"
            >
              <Phone className="w-4 h-4" /> (480) 309-7607
            </a>
          </div>
        </FadeIn>
      </section>
    </>
  );
}

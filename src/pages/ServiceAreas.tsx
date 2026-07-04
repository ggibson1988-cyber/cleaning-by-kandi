import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, Phone, CheckCircle } from 'lucide-react';

const cities = [
  {
    name: 'Surprise',
    description: 'Our home base! We serve all neighborhoods in Surprise — from Marley Park to Asante.',
    zip: ['85374', '85378', '85379', '85388'],
    highlight: true,
  },
  {
    name: 'Peoria',
    description: 'Covering all of Peoria including Lake Pleasant, Vistancia, and the historic district.',
    zip: ['85345', '85380', '85381', '85382', '85383'],
    highlight: false,
  },
  {
    name: 'Glendale',
    description: 'Serving homes and businesses throughout Glendale, including Westgate and Arrowhead.',
    zip: ['85301', '85302', '85303', '85304', '85305', '85306'],
    highlight: false,
  },
  {
    name: 'Sun City',
    description: 'Proud to serve the Sun City community with trusted, attentive cleaning services.',
    zip: ['85351', '85372', '85373'],
    highlight: false,
  },
  {
    name: 'Goodyear',
    description: 'Covering all of Goodyear including Palm Valley, Estrella Mountain Ranch, and more.',
    zip: ['85338', '85395'],
    highlight: false,
  },
  {
    name: 'Buckeye',
    description: 'Serving Buckeye\'s growing communities from Tartesso to Festival Ranch.',
    zip: ['85326', '85396'],
    highlight: false,
  },
];

const ArizonaMap = () => (
  <div className="relative w-full max-w-lg mx-auto">
    <svg viewBox="0 0 400 300" className="w-full" aria-label="Map of Cleaning By Kandi service area in the West Valley, Arizona">
      {/* Arizona state outline - simplified */}
      <path
        d="M 100 20 L 340 20 L 360 80 L 360 220 L 300 220 L 300 260 L 160 260 L 160 200 L 80 200 L 80 80 Z"
        fill="#e2e8f0"
        stroke="#cbd5e1"
        strokeWidth="2"
      />
      {/* West Valley highlight */}
      <ellipse cx="185" cy="135" rx="80" ry="55" fill="#bae6fd" stroke="#0ea5e9" strokeWidth="2" opacity="0.7" />
      {/* City dots */}
      {[
        { x: 175, y: 110, name: 'Surprise' },
        { x: 200, y: 120, name: 'Peoria' },
        { x: 220, y: 140, name: 'Glendale' },
        { x: 165, y: 125, name: 'Sun City' },
        { x: 155, y: 150, name: 'Goodyear' },
        { x: 130, y: 165, name: 'Buckeye' },
      ].map((city) => (
        <g key={city.name}>
          <circle cx={city.x} cy={city.y} r="5" fill="#0369a1" stroke="white" strokeWidth="1.5" />
          <text
            x={city.x + 8}
            y={city.y + 4}
            fontSize="9"
            fontFamily="Lexend, sans-serif"
            fontWeight="600"
            fill="#0f172a"
          >
            {city.name}
          </text>
        </g>
      ))}
      {/* Label */}
      <text x="185" y="195" textAnchor="middle" fontSize="8" fontFamily="Lexend, sans-serif" fill="#0369a1" fontWeight="600">
        WEST VALLEY SERVICE AREA
      </text>
      {/* Phoenix label */}
      <text x="260" y="155" fontSize="9" fontFamily="sans-serif" fill="#64748b">Phoenix</text>
      <circle cx="255" cy="152" r="3" fill="#94a3b8" />
      {/* North indicator */}
      <text x="355" y="40" fontSize="10" fontFamily="sans-serif" fill="#64748b" fontWeight="700">N</text>
      <line x1="358" y1="42" x2="358" y2="55" stroke="#64748b" strokeWidth="1.5" />
      <polygon points="358,42 355,50 361,50" fill="#64748b" />
    </svg>
    <div className="absolute bottom-2 right-2 bg-white/90 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-500 backdrop-blur-sm">
      Approximate service area
    </div>
  </div>
);

export default function ServiceAreas() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-sky-900 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-sky-600/20 border border-sky-500/30 text-sky-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <MapPin className="w-3.5 h-3.5" />
            West Valley, Arizona
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Proudly Serving 6 Arizona Communities
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Based in the West Valley, Cleaning By Kandi delivers top-tier cleaning services to homes and businesses across the region.
          </p>
        </div>
      </section>

      {/* Map + Cities */}
      <section className="py-16 md:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Map */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
              <h2 className="font-heading font-bold text-slate-900 text-xl mb-6 text-center">Our Service Area</h2>
              <ArizonaMap />
              <div className="mt-6 flex flex-wrap gap-2 justify-center">
                {cities.map((c) => (
                  <span
                    key={c.name}
                    className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
                      c.highlight
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <MapPin className="w-3 h-3" />
                    {c.name}
                  </span>
                ))}
              </div>
            </div>

            {/* City list */}
            <div className="space-y-4">
              {cities.map((city) => (
                <div
                  key={city.name}
                  className={`bg-white rounded-2xl p-5 border shadow-sm transition-all duration-200 hover:shadow-md ${
                    city.highlight ? 'border-sky-300 ring-1 ring-sky-200' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${city.highlight ? 'bg-sky-600' : 'bg-slate-100'}`}>
                        <MapPin className={`w-4 h-4 ${city.highlight ? 'text-white' : 'text-slate-500'}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-heading font-semibold text-slate-900">{city.name}, AZ</h3>
                          {city.highlight && (
                            <span className="text-xs bg-sky-100 text-sky-700 font-medium px-2 py-0.5 rounded-full">Our Base</span>
                          )}
                        </div>
                        <p className="text-slate-600 text-sm mt-1">{city.description}</p>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {city.zip.map((z) => (
                            <span key={z} className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-mono">
                              {z}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What's Included in Every Area */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Same Great Service, Every City</h2>
          <p className="text-slate-600 mb-10">
            No matter where you are in the West Valley, you get the same reliable, detail-focused cleaning experience.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-2xl mx-auto mb-8">
            {[
              'Fully insured & bonded team',
              'Eco-friendly cleaning products',
              'Flexible scheduling options',
              'Consistent, trained cleaners',
              'Satisfaction guarantee on every visit',
              'Free, no-obligation quotes',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2.5 bg-slate-50 rounded-xl px-4 py-3 border border-slate-200">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-slate-700 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Don't see your city? */}
      <section className="bg-slate-50 border-t border-slate-200 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Don't See Your City?</h2>
          <p className="text-slate-600 mb-6">
            We may still be able to serve you! Give us a call or send us a message and we'll let you know if we can accommodate your location.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/request-quote"
              className="inline-flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-200 cursor-pointer"
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
        </div>
      </section>
    </>
  );
}

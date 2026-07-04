import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Sparkles, Globe, Share2 } from 'lucide-react';

const services = [
  'Residential Cleaning',
  'Deep Cleaning',
  'Move-In / Move-Out Cleaning',
  'Short-Term Rental Cleaning',
  'Commercial Cleaning',
];

const areas = ['Surprise', 'Peoria', 'Glendale', 'Sun City', 'Goodyear', 'Buckeye'];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-sky-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-heading font-bold text-white text-lg leading-tight">
                Cleaning<br />
                <span className="text-sky-400">By Kandi</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Professional cleaning services you can trust — delivered with care and attention to detail across the West Valley.
            </p>
            <div className="flex gap-3">
              <a
                href="https://cleaningbykandi.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Website"
                className="w-9 h-9 bg-slate-800 hover:bg-sky-600 rounded-lg flex items-center justify-center transition-colors duration-200 cursor-pointer"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href="mailto:cleaningbykandi@yahoo.com"
                aria-label="Share"
                className="w-9 h-9 bg-slate-800 hover:bg-sky-600 rounded-lg flex items-center justify-center transition-colors duration-200 cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-heading font-semibold text-white mb-4">Services</h3>
            <ul className="space-y-2">
              {services.map((s) => (
                <li key={s}>
                  <Link
                    to="/services"
                    className="text-sm text-slate-400 hover:text-white transition-colors duration-200 cursor-pointer"
                  >
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Areas */}
          <div>
            <h3 className="font-heading font-semibold text-white mb-4">Service Areas</h3>
            <ul className="space-y-2">
              {areas.map((a) => (
                <li key={a}>
                  <Link
                    to="/service-areas"
                    className="text-sm text-slate-400 hover:text-white transition-colors duration-200 cursor-pointer"
                  >
                    {a}, AZ
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:4803097607"
                  className="flex items-start gap-2 text-sm text-slate-400 hover:text-white transition-colors duration-200 cursor-pointer"
                >
                  <Phone className="w-4 h-4 mt-0.5 text-sky-400 shrink-0" />
                  (480) 309-7607
                </a>
              </li>
              <li>
                <a
                  href="mailto:cleaningbykandi@yahoo.com"
                  className="flex items-start gap-2 text-sm text-slate-400 hover:text-white transition-colors duration-200 cursor-pointer"
                >
                  <Mail className="w-4 h-4 mt-0.5 text-sky-400 shrink-0" />
                  cleaningbykandi@yahoo.com
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-400">
                <MapPin className="w-4 h-4 mt-0.5 text-sky-400 shrink-0" />
                Serving the West Valley, AZ
              </li>
            </ul>
            <Link
              to="/request-quote"
              className="inline-block mt-4 bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors duration-200 cursor-pointer"
            >
              Get a Free Quote
            </Link>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} Cleaning By Kandi. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link to="/privacy" className="text-xs text-slate-500 hover:text-slate-300 transition-colors duration-200 cursor-pointer">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-xs text-slate-500 hover:text-slate-300 transition-colors duration-200 cursor-pointer">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

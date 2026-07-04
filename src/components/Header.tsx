import { useState, useEffect, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Phone, Menu, X, Sparkles } from 'lucide-react';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/service-areas', label: 'Service Areas' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  /* Close on Escape; return focus to toggle */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  /* Prevent body scroll while mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const close = () => {
    setOpen(false);
    toggleRef.current?.focus();
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" onClick={close}>
            <div className="w-9 h-9 bg-sky-600 rounded-lg flex items-center justify-center group-hover:bg-sky-700 transition-colors duration-200">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading font-bold text-slate-900 text-lg leading-tight">
              Cleaning<br />
              <span className="text-sky-600">By Kandi</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-sky-50 text-sky-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* CTA + Phone */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="tel:4803097607"
              className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-sky-600 transition-colors duration-200 cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              (480) 309-7607
            </a>
            <Link
              to="/request-quote"
              className="bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors duration-200 cursor-pointer"
            >
              Get a Free Quote
            </Link>
          </div>

          {/* Hamburger */}
          <button
            ref={toggleRef}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors duration-200 cursor-pointer"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className="md:hidden border-t border-slate-200 bg-white px-4 pb-4 pt-2"
        >
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={close}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 cursor-pointer ${
                    isActive ? 'bg-sky-50 text-sky-700' : 'text-slate-700 hover:bg-slate-50'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-2">
            <a
              href="tel:4803097607"
              className="flex items-center gap-2 px-4 py-3 text-slate-700 text-sm"
            >
              <Phone className="w-4 h-4 text-sky-600" />
              (480) 309-7607
            </a>
            <Link
              to="/request-quote"
              onClick={close}
              className="bg-sky-600 text-white text-sm font-semibold px-4 py-3 rounded-lg text-center transition-colors duration-200 cursor-pointer"
            >
              Get a Free Quote
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

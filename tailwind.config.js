/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          800: '#1E293B',
          900: '#0F172A',
        },
        brand: {
          primary:        'var(--color-primary)',
          'primary-dark': 'var(--color-primary-dark)',
          'primary-light':'var(--color-primary-light)',
          accent:         'var(--color-accent)',
          'accent-light': 'var(--color-accent-light)',
          navy:           'var(--color-navy)',
          'navy-mid':     'var(--color-navy-mid)',
          muted:          'var(--color-muted)',
          subtle:         'var(--color-subtle)',
          border:         'var(--color-border)',
          surface:        'var(--color-surface)',
          bg:             'var(--color-background)',
          fg:             'var(--color-foreground)',
          success:        'var(--color-success)',
          'success-dark': 'var(--color-success-dark)',
          'success-bg':   'var(--color-success-bg)',
          error:          'var(--color-error)',
          'error-bg':     'var(--color-error-bg)',
        },
      },
      fontFamily: {
        heading: ['Lexend', 'sans-serif'],
        body: ['"Source Sans 3"', 'sans-serif'],
      },
      // Fluid type scale via clamp — overrides Tailwind defaults for key sizes
      fontSize: {
        '6xl': ['clamp(2.5rem, 4vw + 1.25rem, 3.75rem)', { lineHeight: '1.08' }],
        '5xl': ['clamp(2rem, 3.5vw + 0.75rem, 3rem)', { lineHeight: '1.1' }],
        '4xl': ['clamp(1.75rem, 2.5vw + 0.75rem, 2.25rem)', { lineHeight: '1.15' }],
        '3xl': ['clamp(1.375rem, 2vw + 0.5rem, 1.875rem)', { lineHeight: '1.2' }],
        '2xl': ['clamp(1.2rem, 1.5vw + 0.5rem, 1.5rem)', { lineHeight: '1.25' }],
        'xl':  ['clamp(1.1rem, 1vw + 0.6rem, 1.25rem)', { lineHeight: '1.35' }],
      },
    },
  },
  plugins: [],
};

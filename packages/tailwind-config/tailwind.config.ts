import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../apps/client/src/components/**/*.{js,ts,jsx,tsx,mdx}',
    '../../apps/client/src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../apps/client/src/pages/**/*.{ts,tsx}',
    '../../apps/client/src/**/*.{ts,tsx}',
    '../../apps/admin/src/components/**/*.{js,ts,jsx,tsx,mdx}',
    '../../apps/admin/src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../apps/admin/src/pages/**/*.{ts,tsx}',
    '../../apps/admin/src/**/*.{ts,tsx}',
    '../../packages/shared/src/components/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/shared/src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/shared/src/pages/**/*.{ts,tsx}',
    '../../packages/shared/src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {},
    },
    extend: {
      backgroundImage: {
        slash: `url('/images/slash.svg')`,
        backslash: `url('/images/back-slash.svg')`,
      },
      fontSize: {
        h1: ['3rem', '4.4375rem'],
        h2: ['2.125rem', '3.125rem'],
        h3: ['1.5rem', '2.25rem'],
        h4: ['1.25rem', '1.8125rem'],
        h5: ['1.125rem', '1.6875rem'],
        title: ['1.75rem', '2.5625rem'],
        body1: ['1rem', '1.5rem'],
        body2: ['0.875rem', '1.25rem'],
        caption: ['0.75rem', '1.125rem'],
        overline: ['0.625rem', '0.9375rem'],
      },
      colors: {
        primary: {
          sky: '#7ACDF4',
          lime: '#B2E449',
          navy: '#003365',
        },
        sub: {
          navy: '#051B30',
          blue: '#3C8AAF',
          lime: '#C8CE2B',
          orange: '#FF9877',
          yellow: '#F8FADB',
          gray: '#CDD5E2',
          green: '#73962B',
        },
        gray: {
          10: '#FCFCFC',
          20: '#FAFAFA',
          30: '#F5F5F5',
          40: '#EEEEEE',
          50: '#E0E0E0',
          60: '#9E9E9E',
          70: '#616161',
          80: '#424242',
          90: '#212121',
        },
        white: '#FFFFFF',
        black: '#000000',
        background: '#F5F9FB',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        foreground: 'hsl(var(--foreground))',

        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      spacing: {
        15: '3.75rem',
        35: '8.8125rem',
        36: '9rem',
        310: '77.5rem',
      },
      screens: {
        '600': '(max-width: 600px)',
        '1024': '(max-width: 1024px)',
        '1440': '(max-width: 1440px)',
        '1728': '(max-width: 1728px)',
        '1920': '(max-width: 1920px)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;

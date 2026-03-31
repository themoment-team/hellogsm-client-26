import type { Config } from 'tailwindcss';

const sharedConfig: Omit<Config, 'content'> = {
  theme: {
    screens: {
      xs: '450px',
      sm: '600px',
      smxm: '750px',
      smx: '850px',
      md: '1024px',
      mdx: '1200px',
      lg: '1440px',
      xl: '1728px',
      fhd: '1920px',
      uhd: '2160px',
    },
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
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
      },
      borderRadius: {
        sm: 'calc(var(--radius) - 4px)',
        md: 'calc(var(--radius) - 2px)',
        lg: 'var(--radius)',
        xl: 'calc(var(--radius) + 4px)',
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
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default sharedConfig;

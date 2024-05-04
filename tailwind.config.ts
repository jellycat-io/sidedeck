import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
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
        frameNormal: {
          DEFAULT: 'hsl(var(--frame-normal))',
          foreground: 'hsl(var(--frame-normal-foreground))',
        },
        frameEffect: {
          DEFAULT: 'hsl(var(--frame-effect))',
          foreground: 'hsl(var(--frame-effect-foreground))',
        },
        frameFusion: {
          DEFAULT: 'hsl(var(--frame-fusion))',
          foreground: 'hsl(var(--frame-fusion-foreground))',
        },
        frameRitual: {
          DEFAULT: 'hsl(var(--frame-ritual))',
          foreground: 'hsl(var(--frame-ritual-foreground))',
        },
        frameSynchro: {
          DEFAULT: 'hsl(var(--frame-synchro))',
          foreground: 'hsl(var(--frame-synchro-foreground))',
        },
        frameXyz: {
          DEFAULT: 'hsl(var(--frame-xyz))',
          foreground: 'hsl(var(--frame-xyz-foreground))',
        },
        frameLink: {
          DEFAULT: 'hsl(var(--frame-link))',
          foreground: 'hsl(var(--frame-link-foreground))',
        },
        framePendulum: {
          DEFAULT: 'hsl(var(--frame-pendulum))',
          foreground: 'hsl(var(--frame-pendulum-foreground))',
        },
        frameToken: {
          DEFAULT: 'hsl(var(--frame-token))',
          foreground: 'hsl(var(--frame-token-foreground))',
        },
        frameSpell: {
          DEFAULT: 'hsl(var(--frame-spell))',
          foreground: 'hsl(var(--frame-spell-foreground))',
        },
        frameTrap: {
          DEFAULT: 'hsl(var(--frame-trap))',
          foreground: 'hsl(var(--frame-trap-foreground))',
        },
        frameSlifer: {
          DEFAULT: 'hsl(var(--frame-slifer))',
          foreground: 'hsl(var(--frame-slifer-foreground))',
        },
        frameObelisk: {
          DEFAULT: 'hsl(var(--frame-obelisk))',
          foreground: 'hsl(var(--frame-obelisk-foreground))',
        },
        frameRa: {
          DEFAULT: 'hsl(var(--frame-ra))',
          foreground: 'hsl(var(--frame-ra-foreground))',
        },
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
} satisfies Config;

export default config;

import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        forest: 'var(--forest)',
        primary: {
          DEFAULT: 'var(--primary)',
          dark: 'var(--primary-dark)',
        },
        clay: {
          DEFAULT: 'var(--clay)',
          soft: 'var(--clay-soft)',
        },
        sand: 'var(--sand)',
        cream: 'var(--cream)',
        bg: 'var(--bg)',
        ink: 'var(--text)',
        muted: 'var(--muted)',
        line: 'var(--border)',
      },
      fontFamily: {
        serif: ['var(--font-fraunces)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
        control: '8px',
      },
      boxShadow: {
        soft: '0 4px 20px -8px rgba(20, 69, 47, 0.12)',
        card: '0 2px 12px -4px rgba(20, 69, 47, 0.10)',
        lift: '0 10px 32px -10px rgba(20, 69, 47, 0.18)',
      },
      maxWidth: {
        content: '1200px',
      },
    },
  },
  plugins: [],
};

export default config;

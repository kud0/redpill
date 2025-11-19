import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        redpill: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },
        dark: {
          50: '#3a3a3a',
          100: '#2a2a2a',
          200: '#1a1a1a',
          300: '#141414',
          400: '#0f0f0f',
          500: '#0a0a0a',
          600: '#050505',
        },
        accent: {
          cyan: '#06b6d4',
          purple: '#a855f7',
          gold: '#fbbf24',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'redpill-glow': 'radial-gradient(circle at center, rgba(220, 38, 38, 0.15) 0%, transparent 70%)',
        'gradient-shimmer': 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 20s ease-in-out infinite',
        'gradient': 'gradient-shift 3s ease infinite',
        'blob': 'blob 7s infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(220, 38, 38, 0.5), 0 0 10px rgba(220, 38, 38, 0.3)' },
          '100%': { boxShadow: '0 0 10px rgba(220, 38, 38, 0.8), 0 0 20px rgba(220, 38, 38, 0.5)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(220, 38, 38, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(220, 38, 38, 0.6)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-100% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1) rotate(0deg)' },
          '25%': { transform: 'translate(50px, -30px) scale(1.1) rotate(90deg)' },
          '50%': { transform: 'translate(-30px, 50px) scale(0.9) rotate(180deg)' },
          '75%': { transform: 'translate(30px, 30px) scale(1.05) rotate(270deg)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundSize: {
        '300%': '300%',
      },
    },
  },
  plugins: [],
};

export default config;

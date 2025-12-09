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
        'matrix': {
          black: '#050505',
          dark: '#0a0a0a',
          dim: '#111111',
        },
        'neon': {
          red: '#FF0033',
          green: '#00FF41',
          blue: '#00F0FF',
        }
      },
      fontFamily: {
        mono: ['var(--font-space-mono)', 'monospace'],
        display: ['var(--font-orbitron)', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 20s ease-in-out infinite',
        'gradient': 'gradient-shift 3s ease infinite',
        'blob': 'blob 7s infinite',
        'scanline': 'scanline 8s linear infinite',
        'glitch': 'glitch 1s linear infinite',
        'typewriter': 'typewriter 4s steps(40) 1s 1 normal both',
        'blink': 'blink 500ms steps(50) infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(220, 38, 38, 0.5), 0 0 10px rgba(220, 38, 38, 0.3)' },
          '100%': { boxShadow: '0 0 10px rgba(220, 38, 38, 0.8), 0 0 20px rgba(220, 38, 38, 0.5)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 0, 51, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 0, 51, 0.6)' },
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
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' }
        },
        glitch: {
          '2%, 64%': { transform: 'translate(2px,0) skew(0deg)' },
          '4%, 60%': { transform: 'translate(-2px,0) skew(0deg)' },
          '62%': { transform: 'translate(0,0) skew(5deg)' },
        },
        typewriter: {
          'from': { width: '0' },
          'to': { width: '100%' }
        },
        blink: {
          'from': { borderColor: 'transparent' },
          'to': { borderColor: '#FF0033' }
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'redpill-glow': 'radial-gradient(circle at center, rgba(255, 0, 51, 0.15) 0%, transparent 70%)',
        'scanlines': 'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.2))',
      },
    },
  },
  plugins: [],
};

export default config;

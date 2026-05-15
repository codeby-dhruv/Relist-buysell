import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'SF Pro Display', 'Helvetica Neue', 'Arial', 'sans-serif']
      },
      boxShadow: {
        glow: '0 24px 80px rgba(20, 184, 166, 0.16)',
        soft: '0 18px 60px rgba(15, 23, 42, 0.10)'
      },
      colors: {
        ink: '#0f172a',
        mist: '#f8fafc'
      }
    }
  },
  plugins: []
} satisfies Config;

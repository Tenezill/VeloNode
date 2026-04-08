import type { Config } from 'tailwindcss'
import primeui from 'tailwindcss-primeui'

export default {
  content: [
    './app/**/*.{vue,js,ts}',
    './app/components/**/*.{vue,js,ts}',
  ],
  theme: {
    extend: {
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.35s ease-out both',
      },
      colors: {
        /** Trust-focused palette: deep navy + slate (Phase 2+ pages will lean on these) */
        vn: {
          navy: { DEFAULT: '#0f172a', muted: '#1e293b' },
          slate: { DEFAULT: '#334155', light: '#64748b' },
          ice: '#f8fafc',
        },
      },
    },
  },
  plugins: [primeui],
} satisfies Config

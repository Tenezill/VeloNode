import type { Config } from 'tailwindcss'
import primeui from 'tailwindcss-primeui'

export default {
  content: [
    './app/**/*.{vue,js,ts}',
    './app/components/**/*.{vue,js,ts}',
  ],
  theme: {
    extend: {
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

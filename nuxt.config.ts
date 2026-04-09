// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from '@primeuix/themes/aura'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  // Minimal template keeps source under `app/`
  srcDir: 'app/',

  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@primevue/nuxt-module',
    '@nuxt/icon',
  ],

  /**
   * Styled mode + Aura preset: injects design tokens (--p-*) used by PrimeVue components and
   * tailwindcss-primeui (bg-primary, surface-*, etc.). Unstyled mode skips theme injection and
   * leaves components raw unless you use Volt or manual pass-through styling.
   */
  primevue: {
    options: {
      ripple: true,
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.p-dark',
          cssLayer: {
            name: 'primevue',
            order: 'tailwind-base, primevue, tailwind-utilities',
          },
        },
      },
    },
  },

  /** Custom Node.js REST API (JWT + base URL) — Phase 1 will consume this via useApi() */
  runtimeConfig: {
    public: {
      apiBase:
        process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3001/api',
    },
  },
})

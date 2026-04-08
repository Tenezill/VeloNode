// https://nuxt.com/docs/api/configuration/nuxt-config
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

  /** PrimeVue in unstyled mode — Tailwind provides layout and tokens via tailwindcss-primeui */
  primevue: {
    options: {
      unstyled: true,
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

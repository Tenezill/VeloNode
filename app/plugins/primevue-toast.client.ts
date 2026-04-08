import ToastService from 'primevue/toastservice'

/**
 * PrimeVue Toast — enables `useToast()` across the app.
 * Paired with `<Toast />` in the default layout.
 */
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(ToastService)
})

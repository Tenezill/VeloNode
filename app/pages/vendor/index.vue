<template>
  <div class="mx-auto max-w-3xl px-6 py-16">
    <p class="text-xs font-semibold uppercase tracking-[0.2em] text-vn-slate-light">
      Vendor dashboard
    </p>
    <h1 class="mt-2 text-3xl font-semibold text-vn-navy">
      Factory console
    </h1>
    <p class="mt-3 text-vn-slate">
      RFQ inbox and product ingestion ship in Phase 3. This route is protected by the vendor middleware.
    </p>
    <p v-if="auth.user?.email" class="mt-4 text-sm text-vn-slate-light">
      Signed in as {{ auth.user.email }}
    </p>
    <Button class="mt-8" label="Sign out" severity="secondary" @click="signOut" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['vendor'],
})

const auth = useAuthStore()

function signOut() {
  auth.clearSession()
  return navigateTo('/auth/login')
}
</script>

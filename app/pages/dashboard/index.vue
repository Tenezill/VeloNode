<template>
  <div class="mx-auto max-w-3xl px-6 py-16">
    <p class="text-xs font-semibold uppercase tracking-[0.2em] text-vn-slate-light">
      Buyer workspace
    </p>
    <h1 class="mt-2 text-3xl font-semibold text-vn-navy">
      Welcome back{{ auth.user?.companyName ? `, ${auth.user.companyName}` : '' }}
    </h1>
    <p class="mt-3 text-vn-slate">
      RFQ tools and catalog discovery arrive in Phase 2. This route is protected by the buyer middleware.
    </p>
    <Button class="mt-8" label="Sign out" severity="secondary" @click="signOut" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['buyer'],
})

const auth = useAuthStore()

function signOut() {
  auth.clearSession()
  return navigateTo('/auth/login')
}
</script>

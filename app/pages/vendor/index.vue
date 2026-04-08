<template>
  <div class="mx-auto max-w-4xl">
    <p class="text-xs font-semibold uppercase tracking-[0.2em] text-vn-slate-light">
      Vendor dashboard
    </p>
    <h1 class="mt-2 text-3xl font-semibold text-vn-navy">
      Factory console
    </h1>
    <p class="mt-3 text-vn-slate">Manage incoming RFQs, onboard products, and integrate your ERP via API keys.</p>
    <p v-if="auth.user?.email" class="mt-4 text-sm text-vn-slate-light">
      Signed in as {{ auth.user.email }}
    </p>
    <div class="mt-8 flex flex-wrap gap-3">
      <NuxtLink to="/vendor/rfqs">
        <Button label="Open RFQ Inbox" />
      </NuxtLink>
      <NuxtLink to="/vendor/products/new">
        <Button label="Upload Product" severity="secondary" />
      </NuxtLink>
      <NuxtLink to="/vendor/developer">
        <Button label="Developer API" severity="contrast" />
      </NuxtLink>
      <Button label="Sign out" severity="secondary" @click="signOut" />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'vendor',
  middleware: ['vendor'],
})

const auth = useAuthStore()

function signOut() {
  auth.clearSession()
  return navigateTo('/auth/login')
}
</script>

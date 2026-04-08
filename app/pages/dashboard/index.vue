<template>
  <div class="mx-auto max-w-3xl px-6 py-16">
    <p class="text-xs font-semibold uppercase tracking-[0.2em] text-vn-slate-light">
      Buyer workspace
    </p>
    <h1 class="mt-2 text-3xl font-semibold text-vn-navy">
      Welcome back{{ auth.user?.companyName ? `, ${auth.user.companyName}` : '' }}
    </h1>
    <p class="mt-3 text-vn-slate">
      RFQ tooling is active. Create a structured request and attach technical files for vendor matching.
    </p>
    <div class="mt-8 flex items-center gap-3">
      <NuxtLink to="/dashboard/rfq/new">
        <Button label="Create RFQ" />
      </NuxtLink>
      <Button label="Sign out" severity="secondary" @click="signOut" />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'buyer',
  middleware: ['buyer'],
})

const auth = useAuthStore()

function signOut() {
  auth.clearSession()
  return navigateTo('/auth/login')
}
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-slate-200/70 bg-white/90 backdrop-blur">
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
      <div class="flex items-center gap-10">
        <NuxtLink to="/" class="flex items-center gap-2">
          <span class="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-vn-navy text-white">
            <Icon name="heroicons:shield-check" class="h-5 w-5" />
          </span>
          <span class="text-sm font-semibold tracking-wide text-vn-navy">VelaNode</span>
        </NuxtLink>

        <nav class="hidden items-center gap-6 md:flex">
          <NuxtLink class="text-sm font-medium text-vn-slate hover:text-vn-navy" to="/products">
            Products
          </NuxtLink>
          <NuxtLink class="text-sm font-medium text-vn-slate hover:text-vn-navy" to="/dashboard/rfq/new">
            Submit RFQ
          </NuxtLink>
          <NuxtLink class="text-sm font-medium text-vn-slate hover:text-vn-navy" to="/dashboard">
            Dashboard
          </NuxtLink>
        </nav>
      </div>

      <div class="flex items-center gap-3">
        <TrustPill icon="heroicons:lock-closed" label="Secure escrow" />
        <TrustPill icon="heroicons:check-badge" label="VIES verified" class="hidden sm:flex" />

        <div class="ml-2 flex items-center gap-2">
          <template v-if="!auth.isAuthenticated">
            <NuxtLink
              to="/auth/login"
              class="rounded-lg px-3 py-2 text-sm font-medium text-vn-slate hover:text-vn-navy"
            >
              Sign in
            </NuxtLink>
            <NuxtLink
              to="/auth/register"
              class="rounded-lg bg-vn-navy px-3 py-2 text-sm font-medium text-white hover:bg-vn-navy-muted"
            >
              Register
            </NuxtLink>
          </template>
          <template v-else>
            <NuxtLink
              :to="auth.user?.role === 'vendor' ? '/vendor' : '/dashboard'"
              class="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-vn-navy hover:border-vn-navy-muted"
            >
              {{ auth.user?.role === 'vendor' ? 'Vendor' : 'Buyer' }} account
            </NuxtLink>
            <button
              type="button"
              class="rounded-lg px-3 py-2 text-sm font-medium text-vn-slate hover:text-vn-navy"
              @click="signOut"
            >
              Sign out
            </button>
          </template>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const auth = useAuthStore()

function signOut() {
  auth.clearSession()
  return navigateTo('/auth/login')
}
</script>

<template>
  <div class="mx-auto max-w-4xl space-y-8">
    <div>
      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-vn-slate-light">
        Buyer dashboard
      </p>
      <h1 class="mt-2 text-3xl font-semibold text-vn-navy">
        Welcome back{{ auth.user?.companyName ? `, ${auth.user.companyName}` : '' }}
      </h1>
      <p class="mt-2 text-vn-slate">
        Your procurement workspace. Phase 2 adds catalog and RFQ submission; Phase 3 will add vendor responses.
      </p>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <NuxtLink
        to="/dashboard/rfq/new"
        class="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:border-slate-300"
      >
        <p class="text-sm font-semibold text-vn-navy">Submit a new RFQ</p>
        <p class="mt-2 text-sm text-vn-slate">
          Upload drawings and specify price/volume to receive structured vendor responses.
        </p>
      </NuxtLink>

      <NuxtLink
        to="/products"
        class="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:border-slate-300"
      >
        <p class="text-sm font-semibold text-vn-navy">Browse products</p>
        <p class="mt-2 text-sm text-vn-slate">
          Explore categories and dynamic specs powered by flexible JSONB attributes.
        </p>
      </NuxtLink>
    </div>

    <div class="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
      <div>
        <p class="text-sm font-semibold text-vn-navy">Session</p>
        <p class="mt-1 text-sm text-vn-slate-light">
          Signed in as {{ auth.user?.email }}
        </p>
      </div>
      <Button label="Sign out" severity="secondary" @click="signOut" />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['buyer'],
  layout: 'buyer',
})

const auth = useAuthStore()

function signOut() {
  auth.clearSession()
  return navigateTo('/auth/login')
}
</script>

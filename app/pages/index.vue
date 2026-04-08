<template>
  <div class="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
    <section class="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <p class="text-xs font-semibold uppercase tracking-[0.18em] text-vn-slate-light">
        Trusted European sourcing
      </p>
      <h1 class="mt-3 text-3xl font-semibold tracking-tight text-vn-navy md:text-4xl">
        Secure custom OEM from verified factories
      </h1>
      <p class="mt-4 max-w-3xl text-vn-slate">
        Discover factory profiles, validate supplier trust, and issue high-quality RFQs with escrow-ready
        procurement workflows.
      </p>
      <div class="mt-7 flex flex-wrap gap-3">
        <NuxtLink to="/products" class="rounded-md bg-vn-navy px-4 py-2.5 text-sm font-medium text-white">
          Browse products
        </NuxtLink>
        <NuxtLink
          to="/dashboard/rfq/new"
          class="rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-vn-navy"
        >
          Submit RFQ
        </NuxtLink>
      </div>
    </section>

    <section class="mt-8 grid gap-4 md:grid-cols-3">
      <Card v-for="signal in trustSignals" :key="signal.title">
        <template #title>{{ signal.title }}</template>
        <template #content>
          <p class="text-sm text-vn-slate">{{ signal.detail }}</p>
        </template>
      </Card>
    </section>

    <section class="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-xl font-semibold text-vn-navy">Popular categories</h2>
        <NuxtLink to="/products" class="text-sm text-vn-slate hover:text-vn-navy">View all</NuxtLink>
      </div>
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <NuxtLink
          v-for="category in categories"
          :key="category.key"
          :to="`/products?category=${encodeURIComponent(category.key)}`"
          class="rounded-xl border border-slate-200 p-4 transition hover:border-vn-navy/40 hover:bg-slate-50"
        >
          <p class="font-medium text-vn-navy">{{ category.label }}</p>
          <p class="mt-1 text-xs text-vn-slate-light">{{ category.count }} listed suppliers</p>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'buyer',
})

const trustSignals = [
  { title: 'VIES verified buyers', detail: 'EU VAT checks reduce fraudulent RFQ traffic.' },
  { title: 'Secure escrow pipeline', detail: 'Payment milestones and release controls for safer onboarding.' },
  { title: 'Factory onboarding checks', detail: 'Structured profile and capability verification before visibility.' },
]

const categories = [
  { key: 'electronics', label: 'Electronics', count: 182 },
  { key: 'automotive', label: 'Automotive Parts', count: 96 },
  { key: 'industrial', label: 'Industrial Hardware', count: 124 },
  { key: 'consumer', label: 'Consumer Goods', count: 77 },
]
</script>

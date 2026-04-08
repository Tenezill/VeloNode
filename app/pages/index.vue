<template>
  <div class="space-y-14">
    <section class="rounded-3xl border border-slate-200/80 bg-white px-8 py-12 shadow-sm">
      <div class="grid gap-10 lg:grid-cols-5 lg:items-center">
        <div class="lg:col-span-3">
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-vn-slate-light">
            European buyer portal
          </p>
          <h1 class="mt-3 text-4xl font-semibold tracking-tight text-vn-navy md:text-5xl">
            OEM sourcing with trust built in
          </h1>
          <p class="mt-4 max-w-2xl text-lg text-vn-slate">
            Discover categories, validate buyers via VAT (VIES), and submit structured RFQs to verified factories.
          </p>

          <div class="mt-7 flex flex-wrap gap-3">
            <NuxtLink
              to="/products"
              class="rounded-lg bg-vn-navy px-4 py-2.5 text-sm font-medium text-white hover:bg-vn-navy-muted"
            >
              Browse products
            </NuxtLink>
            <NuxtLink
              to="/dashboard/rfq/new"
              class="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-vn-navy hover:border-vn-navy-muted"
            >
              Submit RFQ
            </NuxtLink>
          </div>

          <div class="mt-8 flex flex-wrap gap-2">
            <TrustPill icon="heroicons:lock-closed" label="Secure escrow" />
            <TrustPill icon="heroicons:check-badge" label="VIES verified buyers" />
            <TrustPill icon="heroicons:shield-check" label="Factory onboarding (Alibaba-style API)" />
          </div>
        </div>

        <div class="lg:col-span-2">
          <div class="rounded-2xl border border-slate-200/80 bg-vn-ice p-6">
            <p class="text-sm font-semibold text-vn-navy">Why this matters</p>
            <ul class="mt-4 space-y-3 text-sm text-vn-slate">
              <li class="flex gap-2">
                <i class="pi pi-check-circle mt-0.5 text-vn-navy" />
                Prevent low-quality leads with buyer verification.
              </li>
              <li class="flex gap-2">
                <i class="pi pi-check-circle mt-0.5 text-vn-navy" />
                Reduce misunderstandings via structured specs + drawings.
              </li>
              <li class="flex gap-2">
                <i class="pi pi-check-circle mt-0.5 text-vn-navy" />
                Accelerate onboarding with an OpenAPI-like model.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section>
      <div class="flex items-end justify-between gap-4">
        <div>
          <h2 class="text-2xl font-semibold text-vn-navy">Categories</h2>
          <p class="mt-2 text-vn-slate">Start with a category to narrow the supplier shortlist.</p>
        </div>
        <NuxtLink to="/products" class="text-sm font-medium text-vn-navy hover:underline">
          View all →
        </NuxtLink>
      </div>

      <div class="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <NuxtLink
          v-for="c in categories"
          :key="c.id"
          :to="`/products?category=${c.id}`"
          class="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:border-slate-300"
        >
          <p class="text-sm font-semibold text-vn-navy">{{ c.label }}</p>
          <p class="mt-2 text-sm text-vn-slate">{{ c.description }}</p>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'buyer',
})

const { categories } = useCatalog()
</script>

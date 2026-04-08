<template>
  <div v-if="product">
    <div class="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
      <div class="max-w-3xl">
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-vn-slate-light">
          {{ getCategoryLabel(product.categoryId) }}
        </p>
        <h1 class="mt-2 text-3xl font-semibold text-vn-navy">
          {{ product.name }}
        </h1>
        <p class="mt-3 text-vn-slate">
          {{ product.summary }}
        </p>

        <div class="mt-6 flex flex-wrap gap-2">
          <span class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-vn-slate">
            <i class="pi pi-box text-vn-navy" />
            MOQ {{ product.moq }}
          </span>
          <span class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-vn-slate">
            <i class="pi pi-map-marker text-vn-navy" />
            Origin {{ product.country }}
          </span>
        </div>
      </div>

      <div class="w-full max-w-sm rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <p class="text-sm font-semibold text-vn-navy">Next step</p>
        <p class="mt-2 text-sm text-vn-slate">
          Submit an RFQ with your target price, volume, and CAD/PDF drawings. Factories respond in a structured format.
        </p>
        <NuxtLink
          to="/dashboard/rfq/new"
          class="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-vn-navy px-4 py-2.5 text-sm font-medium text-white hover:bg-vn-navy-muted"
        >
          Create RFQ
        </NuxtLink>
      </div>
    </div>

    <div class="mt-10 grid gap-6 lg:grid-cols-5">
      <div class="lg:col-span-3">
        <div class="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <h2 class="text-sm font-semibold text-vn-navy">Specifications</h2>
          <p class="mt-2 text-sm text-vn-slate">
            These fields are rendered dynamically from the product’s JSONB attributes.
          </p>

          <div class="mt-5 overflow-hidden rounded-xl border border-slate-200/80">
            <DataTable :value="attributeRows" class="text-sm" striped-rows>
              <Column field="key" header="Attribute" />
              <Column field="value" header="Value" />
            </DataTable>
          </div>
        </div>
      </div>

      <div class="lg:col-span-2">
        <div class="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <h2 class="text-sm font-semibold text-vn-navy">Trust &amp; workflow</h2>
          <ul class="mt-4 space-y-3 text-sm text-vn-slate">
            <li class="flex gap-2">
              <i class="pi pi-check-circle mt-0.5 text-vn-navy" />
              Buyer identity validated via VAT checks (VIES).
            </li>
            <li class="flex gap-2">
              <i class="pi pi-check-circle mt-0.5 text-vn-navy" />
              RFQs are structured to reduce misquoting and back-and-forth.
            </li>
            <li class="flex gap-2">
              <i class="pi pi-check-circle mt-0.5 text-vn-navy" />
              Attach drawings securely (CAD/PDF).
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="rounded-2xl border border-slate-200/80 bg-white p-10 text-center">
    <p class="text-sm font-medium text-vn-navy">Product not found</p>
    <p class="mt-2 text-sm text-vn-slate">Return to search and pick another listing.</p>
    <NuxtLink to="/products" class="mt-6 inline-block text-sm font-medium text-vn-navy hover:underline">
      Back to products
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'buyer',
})

const route = useRoute()
const { getProductById, getCategoryLabel } = useCatalog()

const id = computed(() => String(route.params.id))
const product = computed(() => getProductById(id.value))

const attributeRows = computed(() => {
  if (!product.value) return []
  return Object.entries(product.value.attributes).map(([key, value]) => ({
    key,
    value: String(value),
  }))
})
</script>

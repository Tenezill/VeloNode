<template>
  <div class="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <div class="mb-4">
      <NuxtLink to="/products" class="text-sm text-vn-slate hover:text-vn-navy">← Back to search</NuxtLink>
    </div>

    <div class="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <section class="rounded-xl border border-slate-200 bg-white p-6">
        <h1 class="text-2xl font-semibold text-vn-navy">{{ product.name }}</h1>
        <p class="mt-2 text-vn-slate">{{ product.description }}</p>
        <div class="mt-4 flex flex-wrap gap-2">
          <Tag :value="product.category" severity="secondary" />
          <Tag :value="`MOQ ${product.moq}`" />
          <Tag v-if="product.viesFriendly" value="VIES-friendly docs" severity="success" />
        </div>
      </section>

      <section class="rounded-xl border border-slate-200 bg-white p-6">
        <h2 class="text-lg font-semibold text-vn-navy">Factory snapshot</h2>
        <p class="mt-2 text-sm text-vn-slate">{{ product.factory }}</p>
        <p class="mt-1 text-sm text-vn-slate-light">{{ product.location }}</p>
        <NuxtLink
          to="/dashboard/rfq/new"
          class="mt-6 inline-flex rounded-md bg-vn-navy px-4 py-2 text-sm font-medium text-white"
        >
          Request quotation
        </NuxtLink>
      </section>
    </div>

    <section class="mt-6 rounded-xl border border-slate-200 bg-white p-6">
      <h2 class="mb-4 text-lg font-semibold text-vn-navy">Technical attributes</h2>
      <DataTable :value="attributeRows" responsive-layout="scroll">
        <Column field="key" header="Field" />
        <Column field="value" header="Value" />
      </DataTable>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'buyer',
})

interface ProductDetail {
  id: string
  name: string
  category: string
  moq: number
  factory: string
  location: string
  description: string
  viesFriendly: boolean
  attributes: Record<string, string | number | boolean>
}

const route = useRoute()
const id = computed(() => String(route.params.id))

// Mock API data matching flexible JSONB backend shape.
const mockProducts: Record<string, ProductDetail> = {
  'p-1001': {
    id: 'p-1001',
    name: 'Smart Motor Controller',
    category: 'electronics',
    moq: 500,
    factory: 'Ningbo HexaTech',
    location: 'Ningbo, China',
    description: 'Programmable controller for brushless DC motor applications.',
    viesFriendly: true,
    attributes: {
      Material: 'ABS + Aluminum',
      Voltage: '12V',
      Certification: 'CE / RoHS',
      Waterproof: true,
      'PCB Layers': 4,
    },
  },
  'p-1002': {
    id: 'p-1002',
    name: 'Aluminum Valve Housing',
    category: 'automotive',
    moq: 1200,
    factory: 'Qingdao ForgeWorks',
    location: 'Qingdao, China',
    description: 'CNC-machined housing suitable for high-pressure fluid systems.',
    viesFriendly: false,
    attributes: {
      Material: 'Aluminum 6061-T6',
      Tolerance: '±0.02 mm',
      Surface: 'Anodized',
      Weight: '180g',
    },
  },
}

const product = computed(
  () =>
    mockProducts[id.value] || {
      id: id.value,
      name: 'Unknown product',
      category: 'n/a',
      moq: 0,
      factory: 'Unknown factory',
      location: 'Unknown',
      description: 'No mock data available yet.',
      viesFriendly: false,
      attributes: {},
    },
)

const attributeRows = computed(() =>
  Object.entries(product.value.attributes).map(([key, value]) => ({
    key,
    value: String(value),
  })),
)
</script>

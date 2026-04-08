<template>
  <div class="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <h1 class="text-2xl font-semibold text-vn-navy">Factory product discovery</h1>
    <p class="mt-1 text-sm text-vn-slate">Filter by category, MOQ, and EU-ready compliance signals.</p>

    <div class="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
      <aside class="rounded-xl border border-slate-200 bg-white p-4">
        <h2 class="mb-3 text-sm font-semibold uppercase tracking-wide text-vn-slate">Filters</h2>
        <div class="space-y-4">
          <div>
            <label class="mb-1 block text-xs text-vn-slate-light">Category</label>
            <Select
              v-model="filters.category"
              :options="categoryOptions"
              option-label="label"
              option-value="value"
              class="w-full"
              placeholder="Any category"
            />
          </div>

          <div>
            <label class="mb-1 block text-xs text-vn-slate-light">Max MOQ</label>
            <InputNumber v-model="filters.maxMoq" :min="1" :use-grouping="false" class="w-full" />
          </div>

          <div class="flex items-center gap-2">
            <Checkbox v-model="filters.viesFriendly" binary input-id="viesFriendly" />
            <label for="viesFriendly" class="text-sm text-vn-slate">VIES-friendly docs available</label>
          </div>
        </div>
      </aside>

      <section class="rounded-xl border border-slate-200 bg-white p-4">
        <DataTable :value="filteredProducts" paginator :rows="6" responsive-layout="scroll">
          <Column field="name" header="Product" />
          <Column field="category" header="Category">
            <template #body="{ data }">
              <Tag :value="data.category" severity="secondary" />
            </template>
          </Column>
          <Column field="moq" header="MOQ" />
          <Column field="factory" header="Factory" />
          <Column header="Action">
            <template #body="{ data }">
              <NuxtLink :to="`/products/${data.id}`" class="text-sm font-medium text-vn-navy hover:underline">
                View details
              </NuxtLink>
            </template>
          </Column>
        </DataTable>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'buyer',
})

interface ProductRow {
  id: string
  name: string
  category: string
  moq: number
  factory: string
  viesFriendly: boolean
}

const route = useRoute()

const categoryOptions = [
  { label: 'Electronics', value: 'electronics' },
  { label: 'Automotive', value: 'automotive' },
  { label: 'Industrial', value: 'industrial' },
  { label: 'Consumer', value: 'consumer' },
]

const filters = reactive({
  category: String(route.query.category || ''),
  maxMoq: null as number | null,
  viesFriendly: false,
})

const products = ref<ProductRow[]>([
  { id: 'p-1001', name: 'Smart Motor Controller', category: 'electronics', moq: 500, factory: 'Ningbo HexaTech', viesFriendly: true },
  { id: 'p-1002', name: 'Aluminum Valve Housing', category: 'automotive', moq: 1200, factory: 'Qingdao ForgeWorks', viesFriendly: false },
  { id: 'p-1003', name: 'Precision Gear Set', category: 'industrial', moq: 300, factory: 'Suzhou Drive Systems', viesFriendly: true },
  { id: 'p-1004', name: 'Injection Molded Enclosure', category: 'consumer', moq: 2000, factory: 'Shenzhen PolyForm', viesFriendly: true },
])

const filteredProducts = computed(() =>
  products.value.filter((item) => {
    if (filters.category && item.category !== filters.category) return false
    if (filters.maxMoq && item.moq > filters.maxMoq) return false
    if (filters.viesFriendly && !item.viesFriendly) return false
    return true
  }),
)
</script>

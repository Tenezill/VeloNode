<template>
  <div>
    <div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-vn-slate-light">
          Products
        </p>
        <h1 class="mt-2 text-3xl font-semibold text-vn-navy">
          Discover OEM-ready supply
        </h1>
        <p class="mt-2 max-w-2xl text-vn-slate">
          Search across verified categories. In the MVP, data is mocked but shaped like the JSONB-backed API.
        </p>
      </div>

      <div class="flex gap-2">
        <Button
          label="Filters"
          icon="pi pi-sliders-h"
          severity="secondary"
          @click="filtersOpen = true"
        />
      </div>
    </div>

    <div class="mt-8 flex flex-col gap-6 lg:flex-row">
      <!-- Desktop filter rail -->
      <aside class="hidden w-full max-w-sm lg:block">
        <div class="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <h2 class="text-sm font-semibold text-vn-navy">Filters</h2>
          <div class="mt-5 space-y-5">
            <div class="space-y-2">
              <label class="text-xs font-semibold uppercase tracking-wide text-vn-slate-light">
                Keyword
              </label>
              <InputText v-model="query.q" class="w-full" placeholder="e.g. bracket, enclosure…" />
            </div>

            <div class="space-y-2">
              <label class="text-xs font-semibold uppercase tracking-wide text-vn-slate-light">
                Category
              </label>
              <Select
                v-model="query.categoryId"
                :options="categoryOptions"
                option-label="label"
                option-value="value"
                placeholder="All categories"
                class="w-full"
                show-clear
              />
            </div>

            <div class="space-y-2">
              <label class="text-xs font-semibold uppercase tracking-wide text-vn-slate-light">
                Max MOQ
              </label>
              <InputNumber
                v-model="query.moqMax"
                class="w-full"
                placeholder="Any"
                :min="1"
                :use-grouping="false"
              />
              <p class="text-xs text-vn-slate-light">
                Helps European buyers estimate feasibility without exposing vendor pricing.
              </p>
            </div>
          </div>
        </div>
      </aside>

      <section class="flex-1">
        <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <NuxtLink
            v-for="p in filtered"
            :key="p.id"
            :to="`/products/${p.id}`"
            class="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:border-slate-300"
          >
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.2em] text-vn-slate-light">
                  {{ getCategoryLabel(p.categoryId) }}
                </p>
                <h3 class="mt-2 text-lg font-semibold text-vn-navy group-hover:underline">
                  {{ p.name }}
                </h3>
              </div>
              <span class="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-vn-slate">
                <i class="pi pi-map-marker text-[0.75rem]" />
                {{ p.country }}
              </span>
            </div>

            <p class="mt-3 text-sm text-vn-slate">
              {{ p.summary }}
            </p>

            <div class="mt-5 flex items-center justify-between">
              <span class="text-sm font-medium text-vn-navy">MOQ {{ p.moq }}</span>
              <span class="text-sm font-medium text-vn-slate group-hover:text-vn-navy">
                View details →
              </span>
            </div>
          </NuxtLink>
        </div>

        <div v-if="filtered.length === 0" class="mt-12 rounded-2xl border border-slate-200/80 bg-white p-10 text-center">
          <p class="text-sm font-medium text-vn-navy">No matches</p>
          <p class="mt-2 text-sm text-vn-slate">Try clearing filters or searching a broader keyword.</p>
        </div>
      </section>
    </div>

    <!-- Mobile filters -->
    <Sidebar v-model:visible="filtersOpen" position="right" class="w-[22rem]">
      <template #header>
        <div class="flex items-center gap-2">
          <i class="pi pi-filter text-vn-navy" />
          <span class="text-sm font-semibold text-vn-navy">Filters</span>
        </div>
      </template>

      <div class="space-y-5 p-1">
        <div class="space-y-2">
          <label class="text-xs font-semibold uppercase tracking-wide text-vn-slate-light">
            Keyword
          </label>
          <InputText v-model="query.q" class="w-full" placeholder="e.g. bracket, enclosure…" />
        </div>

        <div class="space-y-2">
          <label class="text-xs font-semibold uppercase tracking-wide text-vn-slate-light">
            Category
          </label>
          <Select
            v-model="query.categoryId"
            :options="categoryOptions"
            option-label="label"
            option-value="value"
            placeholder="All categories"
            class="w-full"
            show-clear
          />
        </div>

        <div class="space-y-2">
          <label class="text-xs font-semibold uppercase tracking-wide text-vn-slate-light">
            Max MOQ
          </label>
          <InputNumber
            v-model="query.moqMax"
            class="w-full"
            placeholder="Any"
            :min="1"
            :use-grouping="false"
          />
        </div>

        <Button
          class="w-full"
          label="Done"
          icon="pi pi-check"
          @click="filtersOpen = false"
        />
      </div>
    </Sidebar>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'buyer',
})

const route = useRoute()
const filtersOpen = ref(false)

const { categories, query, filtered, getCategoryLabel } = useCatalog()

const categoryOptions = computed(() => [
  ...categories.value.map((c) => ({ label: c.label, value: c.id })),
])

// Support deep-linking into a filtered view (e.g. from homepage category tiles).
watchEffect(() => {
  const category = route.query.category
  if (typeof category === 'string' && category) {
    query.categoryId = category
  }
})
</script>

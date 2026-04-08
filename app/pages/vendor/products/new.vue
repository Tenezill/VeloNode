<template>
  <div class="max-w-4xl">
    <div class="mb-5">
      <h1 class="text-2xl font-semibold text-vn-navy">Manual Product Upload</h1>
      <p class="mt-1 text-sm text-vn-slate">Publish standard fields and flexible JSONB attributes for buyer discovery.</p>
    </div>

    <form class="rounded-xl border border-slate-200 bg-white p-6" @submit.prevent="submitProduct">
      <div class="grid gap-4 md:grid-cols-2">
        <div>
          <label class="mb-1 block text-sm font-medium text-vn-slate">Name</label>
          <InputText v-model="form.name" class="w-full" :invalid="submitted && !form.name.trim()" />
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-vn-slate">Category</label>
          <Select
            v-model="form.category"
            :options="categoryOptions"
            option-label="label"
            option-value="value"
            class="w-full"
            :invalid="submitted && !form.category"
          />
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-vn-slate">MOQ</label>
          <InputNumber v-model="form.moq" :min="1" :use-grouping="false" class="w-full" :invalid="submitted && !form.moq" />
        </div>
      </div>

      <Divider align="left" class="my-6">
        <span class="text-sm font-medium text-vn-slate">Dynamic Attributes (JSONB)</span>
      </Divider>

      <div class="space-y-3">
        <div v-for="row in attributes" :key="row.id" class="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
          <InputText v-model="row.key" placeholder="Attribute key (e.g. Material)" />
          <InputText v-model="row.value" placeholder="Attribute value (e.g. Aluminum)" />
          <Button icon="pi pi-trash" severity="danger" text @click="removeAttribute(row.id)" />
        </div>
      </div>

      <div class="mt-4">
        <Button label="Add attribute" icon="pi pi-plus" severity="secondary" @click="addAttribute" />
      </div>

      <div class="mt-6 flex items-center gap-3">
        <Button type="submit" label="Publish product" :loading="busy" />
        <NuxtLink to="/vendor" class="text-sm text-vn-slate hover:text-vn-navy">Back to dashboard</NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'

definePageMeta({
  layout: 'vendor',
  middleware: ['vendor'],
})

interface AttributeInput {
  id: string
  key: string
  value: string
}

const { api } = useApi()
const toast = useToast()

const submitted = ref(false)
const busy = ref(false)

const form = reactive({
  name: '',
  category: '',
  moq: null as number | null,
})

const categoryOptions = [
  { label: 'Electronics', value: 'electronics' },
  { label: 'Automotive', value: 'automotive' },
  { label: 'Industrial', value: 'industrial' },
  { label: 'Consumer', value: 'consumer' },
]

let attributeCounter = 0
function nextAttributeId() {
  attributeCounter += 1
  return `attr-${attributeCounter}`
}

const attributes = ref<AttributeInput[]>([{ id: nextAttributeId(), key: '', value: '' }])

function addAttribute() {
  attributes.value.push({ id: nextAttributeId(), key: '', value: '' })
}

function removeAttribute(id: string) {
  attributes.value = attributes.value.filter((entry) => entry.id !== id)
  if (!attributes.value.length) addAttribute()
}

const isValid = computed(() => Boolean(form.name.trim() && form.category && form.moq))

async function submitProduct() {
  submitted.value = true
  if (!isValid.value) return

  const normalizedAttributes = attributes.value
    .filter((entry) => entry.key.trim() && entry.value.trim())
    .reduce<Record<string, string>>((acc, entry) => {
      acc[entry.key.trim()] = entry.value.trim()
      return acc
    }, {})

  busy.value = true
  try {
    await api('/vendor/products', {
      method: 'POST',
      body: {
        name: form.name,
        category: form.category,
        moq: form.moq,
        attributes: normalizedAttributes,
      },
      quiet: true,
    })
    toast.add({ severity: 'success', summary: 'Product uploaded', detail: 'Product sent to catalog pipeline.', life: 3500 })
  } catch {
    toast.add({
      severity: 'warn',
      summary: 'Mock upload',
      detail: 'Saved in demo mode. Connect this request to your backend endpoint when ready.',
      life: 4200,
    })
  } finally {
    busy.value = false
  }
}
</script>

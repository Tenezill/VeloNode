<template>
  <div class="space-y-4">
    <div class="grid gap-3 md:grid-cols-2">
      <div class="rounded-md bg-slate-50 p-3">
        <p class="text-xs uppercase tracking-wide text-slate-500">RFQ Title</p>
        <p class="mt-1 text-sm text-slate-900">{{ payload.title || '-' }}</p>
      </div>
      <div class="rounded-md bg-slate-50 p-3">
        <p class="text-xs uppercase tracking-wide text-slate-500">Category</p>
        <p class="mt-1 text-sm text-slate-900">{{ payload.category || '-' }}</p>
      </div>
      <div class="rounded-md bg-slate-50 p-3">
        <p class="text-xs uppercase tracking-wide text-slate-500">Materials</p>
        <p class="mt-1 text-sm text-slate-900">{{ payload.materials.length ? payload.materials.join(', ') : '-' }}</p>
      </div>
      <div class="rounded-md bg-slate-50 p-3">
        <p class="text-xs uppercase tracking-wide text-slate-500">Target Price / Unit</p>
        <p class="mt-1 text-sm text-slate-900">{{ formattedPrice }}</p>
      </div>
      <div class="rounded-md bg-slate-50 p-3">
        <p class="text-xs uppercase tracking-wide text-slate-500">Destination</p>
        <p class="mt-1 text-sm text-slate-900">{{ payload.destinationCountry || '-' }}</p>
      </div>
      <div class="rounded-md bg-slate-50 p-3">
        <p class="text-xs uppercase tracking-wide text-slate-500">Incoterm</p>
        <p class="mt-1 text-sm text-slate-900">{{ payload.incoterm || '-' }}</p>
      </div>
    </div>

    <div class="rounded-md bg-slate-50 p-3">
      <p class="text-xs uppercase tracking-wide text-slate-500">Executive Summary</p>
      <p class="mt-1 text-sm text-slate-900">{{ payload.summary || '-' }}</p>
    </div>

    <div class="rounded-md bg-slate-50 p-3">
      <p class="text-xs uppercase tracking-wide text-slate-500">Technical Specs</p>
      <p class="mt-1 text-sm text-slate-900">{{ payload.technicalSpecs || '-' }}</p>
    </div>

    <div class="rounded-md bg-slate-50 p-3">
      <p class="text-xs uppercase tracking-wide text-slate-500">Custom Attributes</p>
      <ul v-if="payload.customAttributes.length" class="mt-1 space-y-1 text-sm text-slate-900">
        <li v-for="(item, index) in payload.customAttributes" :key="index">
          {{ item.key || 'N/A' }}: {{ item.value || 'N/A' }}
        </li>
      </ul>
      <p v-else class="mt-1 text-sm text-slate-900">-</p>
    </div>

    <div class="flex justify-end">
      <Button
        label="Publish RFQ"
        :loading="publishing"
        class="border-cyan-500 bg-cyan-500 text-white hover:border-cyan-600 hover:bg-cyan-600"
        @click="emit('publish')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
interface CustomAttribute {
  key: string
  value: string
}

interface RfqPayload {
  title: string
  category: string
  summary: string
  materials: string[]
  files: string[]
  technicalSpecs: string
  ndaRequired: boolean
  customAttributes: CustomAttribute[]
  quantityTiers: number[]
  targetPricePerUnit: number | null
  massProductionDeadline: Date | null
  sampleRequired: boolean
  destinationCountry: string
  incoterm: 'EXW' | 'FOB' | 'DDP' | ''
}

const props = defineProps<{
  payload: RfqPayload
  publishing: boolean
}>()

const emit = defineEmits<{
  publish: []
}>()

const formattedPrice = computed(() => {
  if (!props.payload.targetPricePerUnit) return '-'
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(props.payload.targetPricePerUnit)
})
</script>

<template>
  <div class="space-y-4">
    <div class="grid gap-3 md:grid-cols-2">
      <div class="rounded-md bg-slate-50 p-3">
        <p class="text-xs uppercase tracking-wide text-slate-500">RFQ Title</p>
        <p class="mt-1 text-sm text-slate-900">{{ identity.title || '-' }}</p>
      </div>
      <div class="rounded-md bg-slate-50 p-3">
        <p class="text-xs uppercase tracking-wide text-slate-500">Category</p>
        <p class="mt-1 text-sm text-slate-900">{{ identity.category || '-' }}</p>
      </div>
      <div class="rounded-md bg-slate-50 p-3">
        <p class="text-xs uppercase tracking-wide text-slate-500">Materials</p>
        <p class="mt-1 text-sm text-slate-900">
          {{ identity.materials.length ? identity.materials.join(', ') : '-' }}
        </p>
      </div>
      <div class="rounded-md bg-slate-50 p-3">
        <p class="text-xs uppercase tracking-wide text-slate-500">Target Price / Unit</p>
        <p class="mt-1 text-sm text-slate-900">{{ formattedPrice }}</p>
      </div>
      <div class="rounded-md bg-slate-50 p-3">
        <p class="text-xs uppercase tracking-wide text-slate-500">Destination</p>
        <p class="mt-1 text-sm text-slate-900">{{ logistics.destination || '-' }}</p>
      </div>
      <div class="rounded-md bg-slate-50 p-3">
        <p class="text-xs uppercase tracking-wide text-slate-500">Incoterm</p>
        <p class="mt-1 text-sm text-slate-900">{{ logistics.incoterm || '-' }}</p>
      </div>
    </div>

    <div class="rounded-md bg-slate-50 p-3">
      <p class="text-xs uppercase tracking-wide text-slate-500">Executive Summary</p>
      <p class="mt-1 text-sm text-slate-900">{{ identity.summary || '-' }}</p>
    </div>

    <div class="rounded-md bg-slate-50 p-3">
      <p class="text-xs uppercase tracking-wide text-slate-500">Technical Specs</p>
      <p class="mt-1 text-sm text-slate-900">{{ tech.specs || '-' }}</p>
    </div>

    <div class="rounded-md bg-slate-50 p-3">
      <p class="text-xs uppercase tracking-wide text-slate-500">Custom Attributes</p>
      <ul v-if="tech.customAttributes.length" class="mt-1 space-y-1 text-sm text-slate-900">
        <li v-for="(item, index) in tech.customAttributes" :key="index">
          {{ item.key || 'N/A' }}: {{ item.value || 'N/A' }}
        </li>
      </ul>
      <p v-else class="mt-1 text-sm text-slate-900">-</p>
    </div>

    <div class="flex justify-end">
      <Button
        label="Publish RFQ to Verified Network"
        :loading="publishing"
        class="border-cyan-500 bg-cyan-500 text-white hover:border-cyan-600 hover:bg-cyan-600"
        @click="emit('publish')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  publishing: boolean
}>()

const emit = defineEmits<{
  publish: []
}>()

const { identity, tech, commercial, logistics } = useRfqWizard()

const formattedPrice = computed(() => {
  if (!commercial.targetPrice) return '-'
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(commercial.targetPrice)
})
</script>

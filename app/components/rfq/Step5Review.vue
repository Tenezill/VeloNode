<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-semibold text-slate-800">Review</h2>

    <div class="grid gap-4 md:grid-cols-2">
      <div class="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <p class="text-xs font-medium uppercase text-slate-500">Title</p>
        <p class="mt-1 text-sm text-slate-800">{{ state.identity.title || '—' }}</p>
      </div>
      <div class="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <p class="text-xs font-medium uppercase text-slate-500">Category</p>
        <p class="mt-1 text-sm text-slate-800">{{ state.identity.category || '—' }}</p>
      </div>
      <div class="md:col-span-2">
        <div class="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p class="text-xs font-medium uppercase text-slate-500">Summary</p>
          <p class="mt-1 whitespace-pre-wrap text-sm text-slate-800">{{ state.identity.summary || '—' }}</p>
        </div>
      </div>
    </div>

    <div class="rounded-lg border border-slate-200 p-4">
      <h3 class="text-sm font-semibold text-slate-800">Technical</h3>
      <dl class="mt-3 space-y-2 text-sm text-slate-600">
        <div><span class="text-slate-500">Files:</span> {{ state.tech.files.length ? state.tech.files.join(', ') : '—' }}</div>
        <div><span class="text-slate-500">NDA:</span> {{ state.tech.requiresNda ? 'Yes' : 'No' }}</div>
        <div><span class="text-slate-500">Specs:</span> {{ state.tech.specs || '—' }}</div>
      </dl>
    </div>

    <div class="rounded-lg border border-slate-200 p-4">
      <h3 class="text-sm font-semibold text-slate-800">Commercial &amp; logistics</h3>
      <dl class="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
        <div><span class="text-slate-500">Quantity:</span> {{ state.commercial.quantity ?? '—' }}</div>
        <div><span class="text-slate-500">Target EUR:</span> {{ formattedPrice }}</div>
        <div><span class="text-slate-500">Deadline:</span> {{ formattedDeadline }}</div>
        <div><span class="text-slate-500">Sample:</span> {{ state.commercial.requiresSample ? 'Yes' : 'No' }}</div>
        <div><span class="text-slate-500">Destination:</span> {{ state.logistics.destination || '—' }}</div>
        <div><span class="text-slate-500">Incoterm:</span> {{ state.logistics.incoterm || '—' }}</div>
      </dl>
    </div>

    <p class="text-sm text-slate-500">
      Use <strong>Publish RFQ</strong> below to submit.
    </p>
  </div>
</template>

<script setup lang="ts">
import { useRfqWizard } from '~/composables/useRfqWizard'

const { state } = useRfqWizard()

const formattedPrice = computed(() => {
  const p = state.value.commercial.targetPrice
  if (p == null || p <= 0) return '—'
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(p)
})

const formattedDeadline = computed(() => {
  const d = state.value.commercial.deadline
  if (!d) return '—'
  const date = d instanceof Date ? d : new Date(d as string)
  return date.toLocaleDateString('de-DE', { year: 'numeric', month: 'short', day: 'numeric' })
})
</script>

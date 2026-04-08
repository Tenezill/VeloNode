<template>
  <div class="space-y-6">
    <Message
      v-if="showReviewErrors && reviewIssues.length"
      severity="error"
      :closable="false"
      class="text-sm"
    >
      <p class="font-medium text-vn-navy">Complete the following before publishing:</p>
      <ul class="mt-2 list-inside list-disc space-y-1 text-vn-slate">
        <li v-for="issue in reviewIssues" :key="issue">{{ issue }}</li>
      </ul>
    </Message>

    <div class="grid gap-3 md:grid-cols-2">
      <div class="rounded-xl bg-vn-ice/50 p-4">
        <p class="text-xs font-semibold uppercase tracking-wide text-vn-slate-light">RFQ title</p>
        <p class="mt-1 text-sm text-vn-navy">{{ state.identity.title || '—' }}</p>
      </div>
      <div class="rounded-xl bg-vn-ice/50 p-4">
        <p class="text-xs font-semibold uppercase tracking-wide text-vn-slate-light">Category</p>
        <p class="mt-1 text-sm text-vn-navy">{{ state.identity.category || '—' }}</p>
      </div>
      <div class="rounded-xl bg-vn-ice/50 p-4 md:col-span-2">
        <p class="text-xs font-semibold uppercase tracking-wide text-vn-slate-light">Materials</p>
        <p class="mt-1 text-sm text-vn-navy">
          {{ state.identity.materials.length ? state.identity.materials.join(', ') : '—' }}
        </p>
      </div>
      <div class="rounded-xl bg-vn-ice/50 p-4 md:col-span-2">
        <p class="text-xs font-semibold uppercase tracking-wide text-vn-slate-light">Executive summary</p>
        <p class="mt-1 whitespace-pre-wrap text-sm text-vn-slate">{{ state.identity.summary || '—' }}</p>
      </div>
    </div>

    <div class="rounded-xl border border-slate-200/80 p-4">
      <h3 class="text-sm font-semibold text-vn-navy">Technical</h3>
      <dl class="mt-3 space-y-2 text-sm">
        <div class="flex flex-wrap gap-2">
          <dt class="text-vn-slate-light">Files</dt>
          <dd class="text-vn-slate">
            {{ state.tech.files.length ? state.tech.files.join(', ') : '—' }}
          </dd>
        </div>
        <div>
          <dt class="text-vn-slate-light">NDA</dt>
          <dd class="text-vn-slate">{{ state.tech.requiresNda ? 'Yes' : 'No' }}</dd>
        </div>
        <div>
          <dt class="text-vn-slate-light">Specifications</dt>
          <dd class="mt-1 whitespace-pre-wrap text-vn-slate">{{ state.tech.specs || '—' }}</dd>
        </div>
      </dl>
    </div>

    <div class="rounded-xl border border-slate-200/80 p-4">
      <h3 class="text-sm font-semibold text-vn-navy">Commercial &amp; logistics</h3>
      <dl class="mt-3 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt class="text-vn-slate-light">Quantity</dt>
          <dd class="text-vn-slate">
            {{ state.commercial.quantity != null && state.commercial.quantity > 0 ? state.commercial.quantity : '—' }}
          </dd>
        </div>
        <div>
          <dt class="text-vn-slate-light">Target price / unit</dt>
          <dd class="text-vn-slate">{{ formattedPrice }}</dd>
        </div>
        <div>
          <dt class="text-vn-slate-light">Deadline</dt>
          <dd class="text-vn-slate">{{ formattedDeadline }}</dd>
        </div>
        <div>
          <dt class="text-vn-slate-light">Sample</dt>
          <dd class="text-vn-slate">{{ state.commercial.requiresSample ? 'Yes' : 'No' }}</dd>
        </div>
        <div>
          <dt class="text-vn-slate-light">Destination</dt>
          <dd class="text-vn-slate">{{ state.logistics.destination || '—' }}</dd>
        </div>
        <div>
          <dt class="text-vn-slate-light">Incoterm</dt>
          <dd class="text-vn-slate">{{ state.logistics.incoterm || '—' }}</dd>
        </div>
      </dl>
    </div>

    <div class="flex flex-col gap-3 sm:flex-row sm:justify-end">
      <Button
        label="Publish RFQ to Verified Network"
        icon="pi pi-send"
        size="large"
        :loading="isSubmitting"
        class="border-cyan-600 bg-cyan-600 text-white hover:border-cyan-700 hover:bg-cyan-700"
        @click="submitRfq"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const { state, showReviewErrors, isSubmitting, validateStep, submitRfq } = useRfqWizard()

const formattedPrice = computed(() => {
  if (!state.value.commercial.targetPrice) return '—'
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(
    state.value.commercial.targetPrice,
  )
})

const formattedDeadline = computed(() => {
  const d = state.value.commercial.deadline
  if (!d) return '—'
  const date = d instanceof Date ? d : new Date(d as string)
  return date.toLocaleDateString('de-DE', { year: 'numeric', month: 'short', day: 'numeric' })
})

const reviewIssues = computed(() => {
  void state.value.identity.title
  void state.value.tech.specs
  void state.value.commercial.quantity
  void state.value.logistics.destination

  const issues: string[] = []
  if (!validateStep(1)) {
    issues.push('Step 1: title, category, and executive summary are required.')
  }
  if (!validateStep(2)) {
    issues.push('Step 2: add files or technical specifications.')
  }
  if (!validateStep(3)) {
    issues.push('Step 3: quantity, target price (EUR), and valid commercial inputs are required.')
  }
  if (!validateStep(4)) {
    issues.push('Step 4: destination country and incoterm are required.')
  }
  return issues
})
</script>

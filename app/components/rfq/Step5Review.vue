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
        <p class="mt-1 text-sm text-vn-navy">{{ identity.title || '—' }}</p>
      </div>
      <div class="rounded-xl bg-vn-ice/50 p-4">
        <p class="text-xs font-semibold uppercase tracking-wide text-vn-slate-light">Category</p>
        <p class="mt-1 text-sm text-vn-navy">{{ identity.category || '—' }}</p>
      </div>
      <div class="rounded-xl bg-vn-ice/50 p-4 md:col-span-2">
        <p class="text-xs font-semibold uppercase tracking-wide text-vn-slate-light">Materials</p>
        <p class="mt-1 text-sm text-vn-navy">
          {{ identity.materials.length ? identity.materials.join(', ') : '—' }}
        </p>
      </div>
      <div class="rounded-xl bg-vn-ice/50 p-4 md:col-span-2">
        <p class="text-xs font-semibold uppercase tracking-wide text-vn-slate-light">Executive summary</p>
        <p class="mt-1 whitespace-pre-wrap text-sm text-vn-slate">{{ identity.summary || '—' }}</p>
      </div>
    </div>

    <div class="rounded-xl border border-slate-200/80 p-4">
      <h3 class="text-sm font-semibold text-vn-navy">Technical</h3>
      <dl class="mt-3 space-y-2 text-sm">
        <div class="flex flex-wrap gap-2">
          <dt class="text-vn-slate-light">Files</dt>
          <dd class="text-vn-slate">
            {{ tech.files.length ? tech.files.join(', ') : '—' }}
          </dd>
        </div>
        <div>
          <dt class="text-vn-slate-light">NDA</dt>
          <dd class="text-vn-slate">{{ tech.requiresNda ? 'Yes' : 'No' }}</dd>
        </div>
        <div>
          <dt class="text-vn-slate-light">Specifications</dt>
          <dd class="mt-1 whitespace-pre-wrap text-vn-slate">{{ tech.specs || '—' }}</dd>
        </div>
        <div v-if="tech.customAttributes.length">
          <dt class="text-vn-slate-light">Custom attributes</dt>
          <dd class="mt-1">
            <ul class="list-inside list-disc space-y-1 text-vn-slate">
              <li v-for="(item, i) in tech.customAttributes" :key="i">
                {{ item.key || '—' }}: {{ item.value || '—' }}
              </li>
            </ul>
          </dd>
        </div>
      </dl>
    </div>

    <div class="rounded-xl border border-slate-200/80 p-4">
      <h3 class="text-sm font-semibold text-vn-navy">Commercial &amp; logistics</h3>
      <dl class="mt-3 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt class="text-vn-slate-light">Quantity tiers</dt>
          <dd class="text-vn-slate">
            {{
              commercial.quantityTiers.filter((t) => t > 0).length
                ? commercial.quantityTiers.filter((t) => t > 0).join(', ')
                : '—'
            }}
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
          <dd class="text-vn-slate">{{ commercial.requiresSample ? 'Yes' : 'No' }}</dd>
        </div>
        <div>
          <dt class="text-vn-slate-light">Destination</dt>
          <dd class="text-vn-slate">{{ logistics.destination || '—' }}</dd>
        </div>
        <div>
          <dt class="text-vn-slate-light">Incoterm</dt>
          <dd class="text-vn-slate">{{ logistics.incoterm || '—' }}</dd>
        </div>
      </dl>
    </div>

    <div class="flex flex-col gap-3 sm:flex-row sm:justify-end">
      <Button
        label="Publish RFQ to Verified Network"
        icon="pi pi-send"
        size="large"
        :loading="publishing"
        class="border-cyan-600 bg-cyan-600 text-white hover:border-cyan-700 hover:bg-cyan-700"
        @click="emit('publish')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  publishing: boolean
  showReviewErrors?: boolean
}>()

const emit = defineEmits<{
  publish: []
}>()

const { identity, tech, commercial, logistics, canAdvance } = useRfqWizard()

const formattedPrice = computed(() => {
  if (!commercial.targetPrice) return '—'
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(
    commercial.targetPrice,
  )
})

const formattedDeadline = computed(() => {
  if (!commercial.deadline) return '—'
  const d = commercial.deadline instanceof Date ? commercial.deadline : new Date(commercial.deadline)
  return d.toLocaleDateString('de-DE', { year: 'numeric', month: 'short', day: 'numeric' })
})

const reviewIssues = computed(() => {
  const issues: string[] = []
  if (!canAdvance(1)) {
    issues.push('Step 1: title, category, and executive summary are required.')
  }
  if (!canAdvance(2)) {
    issues.push('Step 2: add files or technical specifications.')
  }
  if (!canAdvance(3)) {
    issues.push('Step 3: at least one quantity greater than zero and target price (EUR) are required.')
  }
  if (!canAdvance(4)) {
    issues.push('Step 4: destination country and incoterm are required.')
  }
  return issues
})
</script>

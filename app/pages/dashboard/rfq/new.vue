<template>
  <div
    ref="wizardRoot"
    class="min-h-screen bg-slate-50"
  >
    <div class="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div class="mb-6">
        <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Buyer Dashboard</p>
        <h1 class="mt-2 text-3xl font-semibold text-slate-900">Create RFQ Wizard</h1>
        <p class="mt-1 text-sm text-slate-500">Structured enterprise procurement workflow for qualified vendor matching.</p>
      </div>

      <div class="grid gap-6 lg:grid-cols-[1fr_320px]">
        <section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <Steps :model="stepItems" :active-step="activeStep" readonly />
          <div class="mt-3 flex flex-wrap gap-2">
            <span
              v-for="(item, index) in stepItems"
              :key="item.label"
              class="inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs"
              :class="stepPillClass(index)"
            >
              <i v-if="isStepCompleted(index)" class="pi pi-check text-[10px]" />
              <span>{{ index + 1 }}. {{ item.label }}</span>
            </span>
          </div>

          <div class="mt-6 rounded-md border border-slate-200 bg-white p-5">
            <h2 class="text-lg font-medium text-slate-900">{{ activeStepMeta.title }}</h2>
            <p class="mt-1 text-sm text-slate-500">{{ activeStepMeta.description }}</p>

            <div class="mt-5">
              <Step1Identity v-if="activeStep === 0" :payload="rfqPayload" :show-errors="showErrors" />
              <Step2Tech v-else-if="activeStep === 1" :payload="rfqPayload" :show-errors="showErrors" />
              <Step3Commercial v-else-if="activeStep === 2" :payload="rfqPayload" :show-errors="showErrors" />
              <Step4Logistics v-else-if="activeStep === 3" :payload="rfqPayload" :show-errors="showErrors" />
              <Step5Review
                v-else
                :payload="rfqPayload"
                :publishing="publishing"
                @publish="publishRfq"
              />
            </div>
          </div>

          <div class="sticky bottom-0 z-10 mt-5 border-t border-slate-200 bg-white/95 px-1 pt-4 backdrop-blur">
            <div class="flex items-center justify-between">
              <Button
                label="Back"
                severity="secondary"
                :disabled="activeStep === 0"
                @click="prevStep"
              />
              <Button
                v-if="activeStep < stepItems.length - 1"
                label="Continue"
                class="border-cyan-500 bg-cyan-500 text-white hover:border-cyan-600 hover:bg-cyan-600"
                @click="nextStep"
              />
              <div v-else class="text-sm text-slate-500">Review and publish when ready.</div>
            </div>
          </div>
        </section>

        <aside class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h3 class="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">Contextual Tips</h3>
          <ul class="mt-3 space-y-2">
            <li
              v-for="tip in activeStepMeta.tips"
              :key="tip"
              class="rounded-md bg-slate-50 p-3 text-sm text-slate-600"
            >
              {{ tip }}
            </li>
          </ul>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'

definePageMeta({
  layout: 'buyer',
  middleware: ['buyer'],
})

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

const activeStep = ref(0)
const publishing = ref(false)
const showErrors = ref(false)
const wizardRoot = ref<HTMLElement | null>(null)
const toast = useToast()
const router = useRouter()

const stepItems = [
  { label: 'Project Identity' },
  { label: 'Technical Data' },
  { label: 'Commercial Terms' },
  { label: 'Logistics' },
  { label: 'Final Review' },
]

const rfqPayload = reactive<RfqPayload>({
  title: '',
  category: '',
  summary: '',
  materials: [],
  files: [],
  technicalSpecs: '',
  ndaRequired: false,
  customAttributes: [],
  quantityTiers: [],
  targetPricePerUnit: null,
  massProductionDeadline: null,
  sampleRequired: false,
  destinationCountry: '',
  incoterm: '',
})

const stepMeta = [
  {
    title: 'Step 1: Project Identity',
    description: 'Define RFQ intent and baseline sourcing context.',
    tips: [
      'Use a clear RFQ title so vendors can triage quickly.',
      'Executive summary should state product purpose and core constraints.',
    ],
  },
  {
    title: 'Step 2: Technical Data & Blueprints',
    description: 'Attach technical files and map custom JSONB attributes.',
    tips: [
      'Upload latest CAD/PDF package to reduce clarification cycles.',
      'Custom attributes should use stable key naming conventions.',
    ],
  },
  {
    title: 'Step 3: Commercial Terms',
    description: 'Set quantity tiers, target pricing, and production timeline.',
    tips: [
      'Volume tiers improve quote quality and supplier confidence.',
      'Target pricing should include expected material quality band.',
    ],
  },
  {
    title: 'Step 4: Shipping & Logistics',
    description: 'Define destination and trade terms for accurate landed pricing.',
    tips: [
      'Confirm destination early to avoid freight quote rework.',
      'Incoterms alignment prevents disputes during fulfillment.',
    ],
  },
  {
    title: 'Step 5: Final Review',
    description: 'Review all details before publishing to the vendor network.',
    tips: [
      'Validate specification consistency across all steps.',
      'Publishing with complete data improves match quality.',
    ],
  },
]

const activeStepMeta = computed(() => stepMeta[activeStep.value] || stepMeta[0])

function canAdvance(step: number) {
  if (step === 0) {
    return Boolean(rfqPayload.title.trim() && rfqPayload.category && rfqPayload.summary.trim())
  }
  if (step === 1) {
    return Boolean(rfqPayload.technicalSpecs.trim() || rfqPayload.files.length)
  }
  if (step === 2) {
    return Boolean(rfqPayload.quantityTiers.some((tier) => tier > 0) && rfqPayload.targetPricePerUnit)
  }
  if (step === 3) {
    return Boolean(rfqPayload.destinationCountry && rfqPayload.incoterm)
  }
  return true
}

function nextStep() {
  if (activeStep.value >= stepItems.length - 1) return
  if (!canAdvance(activeStep.value)) {
    showErrors.value = true
    toast.add({
      severity: 'warn',
      summary: 'Step incomplete',
      detail: 'Please complete the required information before continuing.',
      life: 3200,
    })
    focusFirstInvalidField()
    return
  }
  showErrors.value = false
  activeStep.value += 1
}

function prevStep() {
  if (activeStep.value <= 0) return
  showErrors.value = false
  activeStep.value -= 1
}

watch(activeStep, () => {
  showErrors.value = false
})

function stepPillClass(index: number) {
  if (index === activeStep.value) {
    return 'border-cyan-500 bg-cyan-50 text-cyan-700'
  }
  if (index < activeStep.value) {
    return 'border-emerald-200 bg-emerald-50 text-emerald-700'
  }
  return 'border-slate-200 bg-white text-slate-500'
}

function isStepCompleted(index: number) {
  if (index >= activeStep.value) return false
  return canAdvance(index)
}

function isTextEntryElement(el: EventTarget | null) {
  const node = el as HTMLElement | null
  if (!node) return false
  if (node.closest('textarea')) return true
  if (node.closest('[contenteditable="true"]')) return true
  return false
}

function focusFirstInvalidField() {
  nextTick(() => {
    const root = wizardRoot.value
    if (!root) return
    const selector = '.p-invalid, [aria-invalid="true"], input:invalid, textarea:invalid, .text-red-500'
    const invalidEl = root.querySelector(selector) as HTMLElement | null
    if (!invalidEl) return
    invalidEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
    if (typeof invalidEl.focus === 'function') invalidEl.focus()
  })
}

function onGlobalKeydown(event: KeyboardEvent) {
  if (publishing.value) return
  if (isTextEntryElement(event.target)) return
  if (event.key !== 'Enter') return

  if (event.shiftKey) {
    event.preventDefault()
    prevStep()
    return
  }

  if (activeStep.value < stepItems.length - 1) {
    event.preventDefault()
    nextStep()
  }
}

async function publishRfq() {
  if (publishing.value) return
  publishing.value = true
  await new Promise((resolve) => setTimeout(resolve, 1200))
  publishing.value = false
  toast.add({
    severity: 'success',
    summary: 'RFQ published',
    detail: 'Your RFQ is now visible to matched factories.',
    life: 3800,
  })
  await router.push('/dashboard/rfqs')
}

onMounted(() => {
  window.addEventListener('keydown', onGlobalKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onGlobalKeydown)
})
</script>

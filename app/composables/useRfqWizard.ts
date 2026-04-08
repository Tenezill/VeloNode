/**
 * Buyer RFQ wizard — state is provided by the page so parent + steps share one instance.
 * (Module singletons can duplicate across Nuxt/Vite chunks, which breaks v-model + Continue.)
 */
import type { InjectionKey } from 'vue'

interface IdentityState {
  title: string
  category: string
  summary: string
  materials: string[]
}

interface TechAttribute {
  key: string
  value: string
}

interface TechState {
  files: string[]
  specs: string
  requiresNda: boolean
  customAttributes: TechAttribute[]
}

interface CommercialState {
  quantityTiers: number[]
  targetPrice: number | null
  requiresSample: boolean
  deadline: Date | null
}

interface LogisticsState {
  destination: string
  incoterm: 'EXW' | 'FOB' | 'DDP' | ''
}

const stepItems = [
  { label: 'Project Identity' },
  { label: 'Technical Data' },
  { label: 'Commercial Terms' },
  { label: 'Logistics' },
  { label: 'Final Review' },
]

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
    description: 'Set volume expectations, target pricing, and timelines.',
    tips: [
      'Volume tiers improve quote quality and supplier confidence.',
      'Target pricing should include expected material quality band.',
    ],
  },
  {
    title: 'Step 4: Shipping & Logistics',
    description: 'Define destination and trade terms for landed pricing.',
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
] as const

function createRfqWizard() {
  const identity = reactive<IdentityState>({
    title: '',
    category: '',
    summary: '',
    materials: [],
  })

  const tech = reactive<TechState>({
    files: [],
    specs: '',
    requiresNda: false,
    customAttributes: [],
  })

  const commercial = reactive<CommercialState>({
    quantityTiers: [0],
    targetPrice: null,
    requiresSample: false,
    deadline: null,
  })

  const logistics = reactive<LogisticsState>({
    destination: '',
    incoterm: '',
  })

  const currentStep = ref(1)
  const maxStep = 5

  const activeIndex = computed(() => currentStep.value - 1)
  const activeStepMeta = computed(() => {
    const meta = stepMeta[activeIndex.value] || stepMeta[0]
    return {
      title: meta.title,
      description: meta.description,
      tips: [...meta.tips],
    }
  })

  function canAdvance(step: number) {
    if (step === 1) {
      return Boolean(identity.title.trim() && identity.category && identity.summary.trim())
    }
    if (step === 2) {
      return Boolean(tech.specs.trim() || tech.files.length)
    }
    if (step === 3) {
      return Boolean(
        commercial.quantityTiers.some((tier) => tier > 0) && commercial.targetPrice,
      )
    }
    if (step === 4) {
      return Boolean(logistics.destination && logistics.incoterm)
    }
    return true
  }

  function isWizardComplete() {
    return canAdvance(1) && canAdvance(2) && canAdvance(3) && canAdvance(4)
  }

  function nextStep() {
    if (currentStep.value >= maxStep) return
    if (!canAdvance(currentStep.value)) return
    currentStep.value += 1
  }

  function prevStep() {
    if (currentStep.value <= 1) return
    currentStep.value -= 1
  }

  function isStepCompleted(index: number) {
    const stepNumber = index + 1
    if (stepNumber >= currentStep.value) return false
    return canAdvance(stepNumber)
  }

  function toPayload() {
    return {
      title: identity.title,
      category: identity.category,
      summary: identity.summary,
      materials: identity.materials,
      files: tech.files,
      technicalSpecs: tech.specs,
      ndaRequired: tech.requiresNda,
      customAttributes: tech.customAttributes,
      quantityTiers: commercial.quantityTiers,
      targetPricePerUnit: commercial.targetPrice,
      massProductionDeadline: commercial.deadline,
      sampleRequired: commercial.requiresSample,
      destinationCountry: logistics.destination,
      incoterm: logistics.incoterm,
    }
  }

  function resetWizard() {
    identity.title = ''
    identity.category = ''
    identity.summary = ''
    identity.materials = []
    tech.files = []
    tech.specs = ''
    tech.requiresNda = false
    tech.customAttributes = []
    commercial.quantityTiers = [0]
    commercial.targetPrice = null
    commercial.requiresSample = false
    commercial.deadline = null
    logistics.destination = ''
    logistics.incoterm = ''
    currentStep.value = 1
  }

  return {
    identity,
    tech,
    commercial,
    logistics,
    currentStep,
    maxStep,
    stepItems,
    activeIndex,
    activeStepMeta,
    canAdvance,
    isWizardComplete,
    nextStep,
    prevStep,
    isStepCompleted,
    toPayload,
    resetWizard,
  }
}

export type RfqWizardApi = ReturnType<typeof createRfqWizard>

export const RFQ_WIZARD_KEY: InjectionKey<RfqWizardApi> = Symbol('rfqWizard')

/** Call once from `app/pages/dashboard/rfq/new.vue` setup (before child steps mount). */
export function provideRfqWizard() {
  const api = createRfqWizard()
  provide(RFQ_WIZARD_KEY, api)
  return api
}

export function useRfqWizard() {
  const api = inject(RFQ_WIZARD_KEY)
  if (!api) {
    throw new Error(
      '[useRfqWizard] Missing provider. Call provideRfqWizard() from pages/dashboard/rfq/new.vue.',
    )
  }
  return api
}

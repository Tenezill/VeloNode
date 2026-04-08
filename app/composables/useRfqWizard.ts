/**
 * Buyer RFQ wizard — single draft via Nuxt `useState` so every component shares one reactive source.
 */
import { useToast } from 'primevue/usetoast'

export interface RfqWizardState {
  currentStep: number
  identity: {
    title: string
    category: string
    summary: string
    materials: string[]
  }
  tech: {
    files: string[]
    specs: string
    requiresNda: boolean
  }
  commercial: {
    quantity: number | null
    targetPrice: number | null
    requiresSample: boolean
    deadline: Date | null
  }
  logistics: {
    destination: string
    incoterm: '' | 'EXW' | 'FOB' | 'DDP'
  }
}

const STATE_KEY = 'rfq-buyer-wizard-v2'
const UI_KEY = 'rfq-buyer-wizard-ui-v2'

function initialState(): RfqWizardState {
  return {
    currentStep: 1,
    identity: {
      title: '',
      category: '',
      summary: '',
      materials: [],
    },
    tech: {
      files: [],
      specs: '',
      requiresNda: false,
    },
    commercial: {
      quantity: null,
      targetPrice: null,
      requiresSample: false,
      deadline: null,
    },
    logistics: {
      destination: '',
      incoterm: '',
    },
  }
}

export const stepItems = [
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
    description: 'Attach technical files and capture specifications.',
    tips: [
      'Upload latest CAD/PDF package to reduce clarification cycles.',
      'You can rely on written specs if files are not ready yet.',
    ],
  },
  {
    title: 'Step 3: Commercial Terms',
    description: 'Set volume, target pricing, and timelines.',
    tips: [
      'A realistic annual quantity helps factories quote tooling and MOQ.',
      'Target pricing should reflect expected material and finish band.',
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

export function useRfqWizard() {
  const state = useState<RfqWizardState>(STATE_KEY, () => initialState())

  const showFieldErrors = useState<boolean>(`${UI_KEY}-fields`, () => false)
  const showReviewErrors = useState<boolean>(`${UI_KEY}-review`, () => false)
  const isSubmitting = ref(false)

  const maxStep = 5

  const activeIndex = computed(() => state.value.currentStep - 1)
  const activeStepMeta = computed(() => {
    const meta = stepMeta[activeIndex.value] || stepMeta[0]
    return {
      title: meta.title,
      description: meta.description,
      tips: [...meta.tips],
    }
  })

  function validateStep(step: number): boolean {
    const s = state.value
    switch (step) {
      case 1:
        return Boolean(
          s.identity.title.trim() && s.identity.category && s.identity.summary.trim(),
        )
      case 2:
        return Boolean(s.tech.specs.trim() || s.tech.files.length)
      case 3:
        return Boolean(
          s.commercial.quantity != null &&
            s.commercial.quantity > 0 &&
            s.commercial.targetPrice != null &&
            s.commercial.targetPrice > 0,
        )
      case 4:
        return Boolean(s.logistics.destination && s.logistics.incoterm)
      default:
        return true
    }
  }

  /** Validates the step the user is currently on (1–4). Step 5 uses `isWizardComplete`. */
  function validateCurrentStep(): boolean {
    const step = state.value.currentStep
    if (step >= maxStep) return true
    return validateStep(step)
  }

  function isWizardComplete(): boolean {
    return validateStep(1) && validateStep(2) && validateStep(3) && validateStep(4)
  }

  function nextStep() {
    if (state.value.currentStep >= maxStep) return
    state.value.currentStep += 1
  }

  function prevStep() {
    if (state.value.currentStep <= 1) return
    state.value.currentStep -= 1
  }

  function resetWizard() {
    state.value = initialState()
    showFieldErrors.value = false
    showReviewErrors.value = false
  }

  function isStepCompleted(index: number) {
    const stepNumber = index + 1
    if (stepNumber >= state.value.currentStep) return false
    return validateStep(stepNumber)
  }

  function toPayload() {
    const s = state.value
    return {
      title: s.identity.title,
      category: s.identity.category,
      summary: s.identity.summary,
      materials: s.identity.materials,
      files: s.tech.files,
      technicalSpecs: s.tech.specs,
      ndaRequired: s.tech.requiresNda,
      quantity: s.commercial.quantity,
      targetPricePerUnit: s.commercial.targetPrice,
      massProductionDeadline: s.commercial.deadline,
      sampleRequired: s.commercial.requiresSample,
      destinationCountry: s.logistics.destination,
      incoterm: s.logistics.incoterm,
    }
  }

  /** Mock publish: delay + success toast + redirect (optional real API try). */
  async function submitRfq() {
    const toast = useToast()
    if (isSubmitting.value) return

    if (!isWizardComplete()) {
      showReviewErrors.value = true
      showFieldErrors.value = true
      toast.add({
        severity: 'error',
        summary: 'RFQ incomplete',
        detail: 'Complete all required steps before publishing.',
        life: 5500,
      })
      return
    }

    showReviewErrors.value = false
    isSubmitting.value = true
    try {
      await new Promise((r) => setTimeout(r, 900))

      try {
        const { api } = useApi()
        await api('/rfqs', {
          method: 'POST',
          body: toPayload(),
          quiet: true,
        })
      } catch {
        /* mock path: ignore API failure */
      }

      toast.add({
        severity: 'success',
        summary: 'RFQ published',
        detail: 'Your RFQ has been submitted to the verified network (mock + API when available).',
        life: 5000,
      })
      resetWizard()
      await navigateTo('/dashboard/rfqs')
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    state,
    showFieldErrors,
    showReviewErrors,
    isSubmitting,
    maxStep,
    stepItems,
    activeIndex,
    activeStepMeta,
    validateStep,
    validateCurrentStep,
    isWizardComplete,
    nextStep,
    prevStep,
    resetWizard,
    isStepCompleted,
    toPayload,
    submitRfq,
  }
}

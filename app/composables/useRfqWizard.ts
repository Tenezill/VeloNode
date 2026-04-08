import { ref } from 'vue'
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

/** Module-level ref: one shared draft for the RFQ wizard across all components. */
const state = ref<RfqWizardState>({
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
})

export function useRfqWizard() {
  const nextStep = () => {
    if (state.value.currentStep < 5) {
      state.value.currentStep += 1
    }
  }

  const prevStep = () => {
    if (state.value.currentStep > 1) {
      state.value.currentStep -= 1
    }
  }

  const publishRfq = async () => {
    const toast = useToast()
    await new Promise((r) => setTimeout(r, 700))
    toast.add({
      severity: 'success',
      summary: 'RFQ published',
      detail: 'Your RFQ has been submitted (mock). Redirecting…',
      life: 4000,
    })
    await navigateTo('/dashboard/rfqs')
  }

  return {
    state,
    nextStep,
    prevStep,
    publishRfq,
  }
}

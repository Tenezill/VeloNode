<template>
  <div ref="wizardRoot" class="mx-auto max-w-6xl">
    <div class="mb-6">
      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-vn-slate-light">
        Buyer dashboard
      </p>
      <h1 class="mt-2 text-3xl font-semibold text-vn-navy">New RFQ</h1>
      <p class="mt-2 text-vn-slate">
        Use the wizard to capture identity, specs, pricing, and logistics in a structured format.
      </p>
    </div>

    <div class="grid gap-6 lg:grid-cols-[1fr_320px]">
      <section class="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <Steps :model="stepItems" :active-step="activeIndex" readonly />

        <div class="mt-4 flex flex-wrap gap-2">
          <span
            v-for="(item, index) in stepItems"
            :key="item.label"
            class="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs"
            :class="stepPillClass(index)"
          >
            <i v-if="isStepCompleted(index)" class="pi pi-check text-[10px]" />
            <span>{{ index + 1 }}. {{ item.label }}</span>
          </span>
        </div>

        <div class="mt-6 rounded-2xl border border-slate-200/80 bg-white p-6">
          <h2 class="text-lg font-semibold text-vn-navy">{{ activeStepMeta.title }}</h2>
          <p class="mt-1 text-sm text-vn-slate">{{ activeStepMeta.description }}</p>

          <div class="mt-5">
            <Step1Identity v-if="currentStep === 1" :show-errors="showErrors" />
            <Step2Tech v-else-if="currentStep === 2" :show-errors="showErrors" />
            <Step3Commercial v-else-if="currentStep === 3" :show-errors="showErrors" />
            <Step4Logistics v-else-if="currentStep === 4" :show-errors="showErrors" />
            <Step5Review v-else :publishing="publishing" @publish="publishRfq" />
          </div>
        </div>

        <div class="sticky bottom-0 z-10 mt-6 border-t border-slate-200/70 bg-white/95 px-1 pt-4 backdrop-blur">
          <div class="flex items-center justify-between">
            <Button
              label="Back"
              severity="secondary"
              :disabled="currentStep === 1 || publishing"
              @click="handlePrev"
            />
            <Button
              v-if="currentStep < maxStep"
              label="Continue"
              icon="pi pi-arrow-right"
              :disabled="publishing"
              @click="handleNext"
            />
            <div v-else class="text-sm text-vn-slate-light">Review and publish when ready.</div>
          </div>
        </div>
      </section>

      <aside class="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <h3 class="text-xs font-semibold uppercase tracking-[0.2em] text-vn-slate-light">Contextual tips</h3>
        <ul class="mt-4 space-y-2">
          <li v-for="tip in activeStepMeta.tips" :key="tip" class="rounded-xl bg-vn-ice p-3 text-sm text-vn-slate">
            {{ tip }}
          </li>
        </ul>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'

definePageMeta({
  layout: 'buyer',
  middleware: ['buyer'],
})

const publishing = ref(false)
const showErrors = ref(false)
const wizardRoot = ref<HTMLElement | null>(null)
const toast = useToast()
const {
  currentStep,
  maxStep,
  stepItems,
  activeIndex,
  activeStepMeta,
  nextStep,
  prevStep,
  canAdvance,
  isStepCompleted,
} = useRfqWizard()

function handleNext() {
  if (!canAdvance(currentStep.value)) {
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
  nextStep()
}

function handlePrev() {
  showErrors.value = false
  prevStep()
}

watch(currentStep, () => {
  showErrors.value = false
})

function stepPillClass(index: number) {
  if (index === activeIndex.value) {
    return 'border-cyan-500 bg-cyan-50 text-cyan-700'
  }
  if (index < activeIndex.value) {
    return 'border-emerald-200 bg-emerald-50 text-emerald-700'
  }
  return 'border-slate-200 bg-white text-slate-500'
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

  if (currentStep.value < maxStep) {
    event.preventDefault()
    handleNext()
  }
}

async function publishRfq() {
  if (publishing.value) return
  // For now we mock publish with a toast-only flow.
  publishing.value = true
  toast.add({
    severity: 'success',
    summary: 'RFQ ready to publish',
    detail: 'In a real backend, this would now be sent to the verified vendor network.',
    life: 4500,
  })
  publishing.value = false
}

onMounted(() => {
  window.addEventListener('keydown', onGlobalKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onGlobalKeydown)
})
</script>

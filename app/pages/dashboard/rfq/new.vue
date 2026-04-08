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
        <div class="pointer-events-none select-none">
          <Steps :model="stepItems" :active-step="activeIndex" readonly />
        </div>

        <div class="pointer-events-none mt-4 flex flex-wrap gap-2 select-none">
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

        <div class="relative z-10 mt-6 rounded-2xl border border-slate-200/80 bg-white p-6 isolate">
          <h2 class="text-lg font-semibold text-vn-navy">{{ activeStepMeta.title }}</h2>
          <p class="mt-1 text-sm text-vn-slate">{{ activeStepMeta.description }}</p>

          <div class="mt-5 min-h-[12rem]">
            <Step1Identity v-if="state.currentStep === 1" />
            <Step2Tech v-else-if="state.currentStep === 2" />
            <Step3Commercial v-else-if="state.currentStep === 3" />
            <Step4Logistics v-else-if="state.currentStep === 4" />
            <Step5Review v-else />
          </div>
        </div>

        <div class="relative z-20 mt-6 border-t border-slate-200/70 bg-white pt-4">
          <div class="flex items-center justify-between gap-3">
            <Button
              label="Back"
              severity="secondary"
              :disabled="state.currentStep === 1 || isSubmitting"
              @click="handlePrev"
            />
            <Button
              v-if="state.currentStep < maxStep"
              :label="state.currentStep === 4 ? 'Review' : 'Next'"
              icon="pi pi-arrow-right"
              icon-pos="right"
              :disabled="isSubmitting"
              @click="handleNext"
            />
            <div v-else class="text-sm text-vn-slate-light">Use “Publish RFQ” above to submit.</div>
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

const wizardRoot = ref<HTMLElement | null>(null)
const toast = useToast()

const {
  state,
  showFieldErrors,
  showReviewErrors,
  isSubmitting,
  maxStep,
  stepItems,
  activeIndex,
  activeStepMeta,
  validateCurrentStep,
  nextStep,
  prevStep,
  isStepCompleted,
} = useRfqWizard()

function handleNext() {
  if (!validateCurrentStep()) {
    showFieldErrors.value = true
    toast.add({
      severity: 'error',
      summary: 'Step incomplete',
      detail: 'Please fill in all required fields before continuing.',
      life: 4000,
    })
    focusFirstInvalidField()
    return
  }
  showFieldErrors.value = false
  showReviewErrors.value = false
  nextStep()
}

function handlePrev() {
  showFieldErrors.value = false
  showReviewErrors.value = false
  prevStep()
}

watch(
  () => state.value.currentStep,
  () => {
    showFieldErrors.value = false
  },
)

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
  const input = node.closest('input')
  if (input) {
    const t = (input as HTMLInputElement).type
    if (
      t === 'text' ||
      t === 'search' ||
      t === 'email' ||
      t === 'number' ||
      t === 'tel' ||
      t === 'url' ||
      t === ''
    ) {
      return true
    }
  }
  if (node.closest('.p-select-overlay') || node.closest('[data-pc-section="panel"]')) return true
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
  if (isSubmitting.value) return
  if (isTextEntryElement(event.target)) return
  if (event.key !== 'Enter') return

  if (event.shiftKey) {
    event.preventDefault()
    prevStep()
    return
  }

  if (state.value.currentStep < maxStep) {
    event.preventDefault()
    handleNext()
  }
}

onMounted(() => {
  window.addEventListener('keydown', onGlobalKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onGlobalKeydown)
})
</script>

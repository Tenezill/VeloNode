<template>
  <div class="mx-auto max-w-4xl p-6">
    <div class="mb-8 flex flex-wrap gap-4 border-b border-slate-200 pb-4 text-sm text-slate-500">
      <div :class="{ 'font-bold text-cyan-600': state.currentStep === 1 }">1. Identity</div>
      <div :class="{ 'font-bold text-cyan-600': state.currentStep === 2 }">2. Technical</div>
      <div :class="{ 'font-bold text-cyan-600': state.currentStep === 3 }">3. Commercial</div>
      <div :class="{ 'font-bold text-cyan-600': state.currentStep === 4 }">4. Logistics</div>
      <div :class="{ 'font-bold text-cyan-600': state.currentStep === 5 }">5. Review</div>
    </div>

    <div class="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
      <Step1Identity v-if="state.currentStep === 1" />
      <Step2Tech v-if="state.currentStep === 2" />
      <Step3Commercial v-if="state.currentStep === 3" />
      <Step4Logistics v-if="state.currentStep === 4" />
      <Step5Review v-if="state.currentStep === 5" />
    </div>

    <div class="mt-6 flex items-center justify-between gap-4">
      <div>
        <Button
          v-if="state.currentStep > 1"
          label="Back"
          severity="secondary"
          @click="prevStep"
        />
      </div>
      <div class="flex gap-2">
        <Button
          v-if="state.currentStep < 5"
          label="Next Step"
          class="border-0 bg-cyan-500 text-white hover:bg-cyan-600"
          @click="nextStep"
        />
        <Button
          v-if="state.currentStep === 5"
          label="Publish RFQ"
          class="border-0 bg-cyan-500 text-white hover:bg-cyan-600"
          @click="publishRfq"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Step1Identity from '~/components/rfq/Step1Identity.vue'
import Step2Tech from '~/components/rfq/Step2Tech.vue'
import Step3Commercial from '~/components/rfq/Step3Commercial.vue'
import Step4Logistics from '~/components/rfq/Step4Logistics.vue'
import Step5Review from '~/components/rfq/Step5Review.vue'
import { useRfqWizard } from '~/composables/useRfqWizard'

definePageMeta({
  layout: 'buyer',
  middleware: ['buyer'],
})

const { state, nextStep, prevStep, publishRfq } = useRfqWizard()
</script>

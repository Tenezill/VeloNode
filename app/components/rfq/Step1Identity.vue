<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-semibold text-slate-800">Project Identity</h2>

    <div class="flex flex-col space-y-2">
      <label class="text-sm font-medium text-slate-600">RFQ Title</label>
      <InputText
        v-model="state.identity.title"
        class="w-full"
        placeholder="e.g., Custom Aluminum Brackets Rev B"
      />
    </div>

    <div class="flex flex-col space-y-2">
      <label class="text-sm font-medium text-slate-600">Category</label>
      <InputText
        v-model="state.identity.category"
        class="w-full"
        placeholder="e.g., CNC Machining"
      />
    </div>

    <div class="flex flex-col space-y-2">
      <label class="text-sm font-medium text-slate-600">Executive Summary</label>
      <Textarea
        v-model="state.identity.summary"
        class="w-full"
        rows="4"
        placeholder="Describe the end-use of this product..."
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRfqWizard } from '~/composables/useRfqWizard'

const { state } = useRfqWizard()
</script>

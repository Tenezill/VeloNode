<template>
  <div class="space-y-8 animate-fade-in">
    <div>
      <h2 class="text-2xl font-bold text-slate-800">Project Identity</h2>
      <p class="mt-1 text-sm text-slate-500">
        Define the core concept and category for your manufacturing request.
      </p>
    </div>

    <div class="flex flex-col space-y-2">
      <label class="text-sm font-semibold text-slate-700">RFQ Title</label>
      <InputText
        v-model="state.identity.title"
        class="w-full"
        placeholder="e.g., Custom Aluminum Brackets Rev B"
      />
    </div>

    <div class="flex flex-col space-y-2">
      <label class="text-sm font-semibold text-slate-700">Category</label>
      <InputText
        v-model="state.identity.category"
        class="w-full"
        placeholder="e.g., CNC Machining, Injection Molding"
      />
    </div>

    <div class="flex flex-col space-y-2">
      <label class="text-sm font-semibold text-slate-700">Executive Summary</label>
      <Textarea
        v-model="state.identity.summary"
        class="w-full resize-y"
        rows="5"
        placeholder="Describe the end-use of this product and any primary goals..."
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRfqWizard } from '~/composables/useRfqWizard'

const { state } = useRfqWizard()
</script>

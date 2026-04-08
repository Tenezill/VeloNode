<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-semibold text-slate-800">Logistics</h2>

    <div class="flex flex-col space-y-2">
      <label class="text-sm font-medium text-slate-600" for="dest">Destination country</label>
      <Select
        id="dest"
        v-model="state.logistics.destination"
        class="w-full"
        :options="countries"
        option-label="label"
        option-value="value"
        placeholder="Select country"
      />
    </div>

    <div class="flex flex-col space-y-2">
      <label class="text-sm font-medium text-slate-600">Incoterm</label>
      <SelectButton
        v-model="state.logistics.incoterm"
        :options="incoterms"
        option-label="label"
        option-value="value"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRfqWizard } from '~/composables/useRfqWizard'

const { state } = useRfqWizard()

const countries = [
  { label: 'Germany', value: 'DE' },
  { label: 'France', value: 'FR' },
  { label: 'Italy', value: 'IT' },
  { label: 'Netherlands', value: 'NL' },
  { label: 'Spain', value: 'ES' },
  { label: 'Poland', value: 'PL' },
]

const incoterms = [
  { label: 'EXW', value: 'EXW' },
  { label: 'FOB', value: 'FOB' },
  { label: 'DDP', value: 'DDP' },
]
</script>

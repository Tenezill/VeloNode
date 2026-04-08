<template>
  <div class="space-y-4">
    <div>
      <label class="mb-1 block text-sm font-medium text-vn-slate" for="destination">Destination country</label>
      <Select
        id="destination"
        v-model="state.logistics.destination"
        :options="countries"
        option-label="label"
        option-value="value"
        class="w-full"
        :invalid="showFieldErrors && !state.logistics.destination"
        placeholder="Select destination"
      />
      <small v-if="showFieldErrors && !state.logistics.destination" class="mt-1 block text-red-500">
        Destination is required.
      </small>
    </div>

    <div>
      <label class="mb-2 block text-sm font-medium text-vn-slate">Incoterm</label>
      <SelectButton
        v-model="state.logistics.incoterm"
        :options="incoterms"
        option-label="label"
        option-value="value"
      />
      <small v-if="showFieldErrors && !state.logistics.incoterm" class="mt-1 block text-red-500">
        Select EXW, FOB, or DDP.
      </small>
    </div>
  </div>
</template>

<script setup lang="ts">
const { state, showFieldErrors } = useRfqWizard()

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

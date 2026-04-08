<template>
  <div class="space-y-4">
    <div>
      <label class="mb-1 block text-sm font-medium text-slate-700">Destination Country</label>
      <Select
        v-model="logistics.destination"
        :options="countries"
        option-label="label"
        option-value="value"
        class="w-full"
        :invalid="showErrors && !logistics.destination"
        placeholder="Select destination"
      />
      <small v-if="showErrors && !logistics.destination" class="mt-1 block text-red-500">
        Destination country is required.
      </small>
    </div>

    <div>
      <label class="mb-2 block text-sm font-medium text-slate-700">Incoterm</label>
      <SelectButton v-model="logistics.incoterm" :options="incoterms" option-label="label" option-value="value" />
      <small v-if="showErrors && !logistics.incoterm" class="mt-1 block text-red-500">
        Incoterm is required.
      </small>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  showErrors?: boolean
}>()

const { logistics } = useRfqWizard()

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

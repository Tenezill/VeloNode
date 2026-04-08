<template>
  <div class="space-y-4">
    <div>
      <label class="mb-1 block text-sm font-medium text-slate-700">RFQ Title</label>
      <InputText
        v-model="identity.title"
        class="w-full"
        :invalid="showErrors && !payload.title.trim()"
        placeholder="e.g. OEM Motor Housing for EV Platform"
      />
      <small v-if="showErrors && !payload.title.trim()" class="mt-1 block text-red-500">RFQ title is required.</small>
    </div>

    <div>
      <label class="mb-1 block text-sm font-medium text-slate-700">Category</label>
      <Select
        v-model="identity.category"
        :options="categories"
        option-label="label"
        option-value="value"
        class="w-full"
        :invalid="showErrors && !payload.category"
        placeholder="Select a product category"
      />
      <small v-if="showErrors && !payload.category" class="mt-1 block text-red-500">Category is required.</small>
    </div>

    <div>
      <label class="mb-1 block text-sm font-medium text-slate-700">Executive Summary</label>
      <Textarea
        v-model="identity.summary"
        rows="5"
        auto-resize
        class="w-full"
        :invalid="showErrors && !payload.summary.trim()"
        placeholder="Describe intended use, target market, and quality expectations."
      />
      <small v-if="showErrors && !payload.summary.trim()" class="mt-1 block text-red-500">
        Executive summary is required.
      </small>
    </div>

    <div>
      <label class="mb-1 block text-sm font-medium text-slate-700">Primary Material(s)</label>
      <MultiSelect
        v-model="identity.materials"
        :options="materials"
        class="w-full"
        display="chip"
        placeholder="Select one or more materials"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  showErrors?: boolean
}>()

const { identity } = useRfqWizard()

const categories = [
  { label: 'Electronics', value: 'electronics' },
  { label: 'Automotive', value: 'automotive' },
  { label: 'Industrial Hardware', value: 'industrial' },
      { label: 'Consumer Goods', value: 'consumer' },
]

const materials = ['Aluminum', 'Steel', 'ABS', 'PC', 'Copper', 'Silicone', 'Brass']
</script>

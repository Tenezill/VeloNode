<template>
  <div class="space-y-4">
    <div>
      <label class="mb-1 block text-sm font-medium text-vn-slate" for="rfq-title">RFQ Title</label>
      <InputText
        id="rfq-title"
        v-model="state.identity.title"
        class="w-full"
        :invalid="showFieldErrors && !state.identity.title.trim()"
        placeholder="e.g. OEM Motor Housing for EV Platform"
      />
      <small v-if="showFieldErrors && !state.identity.title.trim()" class="mt-1 block text-red-500">
        RFQ title is required.
      </small>
    </div>

    <div>
      <label class="mb-1 block text-sm font-medium text-vn-slate" for="rfq-category">Category</label>
      <Select
        id="rfq-category"
        v-model="state.identity.category"
        :options="categories"
        option-label="label"
        option-value="value"
        class="w-full"
        :invalid="showFieldErrors && !state.identity.category"
        placeholder="Select a product category"
      />
      <small v-if="showFieldErrors && !state.identity.category" class="mt-1 block text-red-500">
        Category is required.
      </small>
    </div>

    <div>
      <label class="mb-1 block text-sm font-medium text-vn-slate" for="rfq-summary">Executive Summary</label>
      <Textarea
        id="rfq-summary"
        v-model="state.identity.summary"
        rows="5"
        auto-resize
        class="w-full"
        :invalid="showFieldErrors && !state.identity.summary.trim()"
        placeholder="Describe intended use, target market, and quality expectations."
      />
      <small v-if="showFieldErrors && !state.identity.summary.trim()" class="mt-1 block text-red-500">
        Executive summary is required.
      </small>
    </div>

    <div>
      <label class="mb-1 block text-sm font-medium text-vn-slate" for="rfq-materials">Primary Material(s)</label>
      <MultiSelect
        id="rfq-materials"
        v-model="state.identity.materials"
        :options="materials"
        class="w-full"
        display="chip"
        placeholder="Optional — select materials"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const { state, showFieldErrors } = useRfqWizard()

const categories = [
  { label: 'Solar', value: 'solar' },
  { label: 'Plastics', value: 'plastics' },
  { label: 'Machining', value: 'machining' },
  { label: 'Electronics', value: 'electronics' },
  { label: 'Automotive', value: 'automotive' },
  { label: 'Industrial Hardware', value: 'industrial' },
  { label: 'Consumer Goods', value: 'consumer' },
]

const materials = ['Aluminum', 'Steel', 'ABS', 'PC', 'Copper', 'Silicone', 'Brass']
</script>

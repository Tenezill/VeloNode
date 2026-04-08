<template>
  <div class="space-y-4">
    <div>
      <label class="mb-1 block text-sm font-medium text-vn-slate" for="quantity">Required quantity (units)</label>
      <InputNumber
        id="quantity"
        v-model="state.commercial.quantity"
        class="w-full"
        :min="1"
        :use-grouping="false"
        placeholder="e.g. 10000"
        :invalid="showFieldErrors && (!state.commercial.quantity || state.commercial.quantity <= 0)"
      />
      <small
        v-if="showFieldErrors && (!state.commercial.quantity || state.commercial.quantity <= 0)"
        class="mt-1 block text-red-500"
      >
        Enter a quantity greater than zero.
      </small>
    </div>

    <div>
      <label class="mb-1 block text-sm font-medium text-vn-slate" for="target-price">Target price (EUR / unit)</label>
      <InputNumber
        id="target-price"
        v-model="state.commercial.targetPrice"
        mode="currency"
        currency="EUR"
        locale="de-DE"
        class="w-full"
        :min="0"
        :invalid="showFieldErrors && (!state.commercial.targetPrice || state.commercial.targetPrice <= 0)"
      />
      <small
        v-if="showFieldErrors && (!state.commercial.targetPrice || state.commercial.targetPrice <= 0)"
        class="mt-1 block text-red-500"
      >
        Target unit price is required.
      </small>
    </div>

    <div>
      <label class="mb-1 block text-sm font-medium text-vn-slate" for="deadline">Mass production deadline</label>
      <DatePicker id="deadline" v-model="state.commercial.deadline" class="w-full" show-icon />
    </div>

    <div class="flex items-center gap-3">
      <ToggleSwitch v-model="state.commercial.requiresSample" input-id="sampleRequired" />
      <label for="sampleRequired" class="text-sm text-vn-slate">Sample required?</label>
    </div>
  </div>
</template>

<script setup lang="ts">
const { state, showFieldErrors } = useRfqWizard()
</script>

<template>
  <div class="space-y-8 animate-fade-in">
    <div>
      <h2 class="text-2xl font-bold text-slate-800">Commercial terms</h2>
      <p class="mt-1 text-sm text-slate-500">
        Set volume, target pricing, timeline, and whether you need a sample run.
      </p>
    </div>

    <div class="flex flex-col space-y-2">
      <label class="text-sm font-semibold text-slate-700" for="qty">Required quantity (units)</label>
      <InputNumber
        id="qty"
        v-model="state.commercial.quantity"
        class="w-full"
        :min="1"
        :use-grouping="false"
        placeholder="e.g. 10000"
      />
    </div>

    <div class="flex flex-col space-y-2">
      <label class="text-sm font-semibold text-slate-700" for="price">Target price (EUR / unit)</label>
      <InputNumber
        id="price"
        v-model="state.commercial.targetPrice"
        class="w-full"
        mode="currency"
        currency="EUR"
        locale="de-DE"
        :min="0"
      />
    </div>

    <div class="flex flex-col space-y-2">
      <label class="text-sm font-semibold text-slate-700" for="deadline">Mass production deadline</label>
      <DatePicker
        id="deadline"
        v-model="state.commercial.deadline"
        class="w-full"
        show-icon
      />
    </div>

    <div class="flex flex-col space-y-2">
      <span class="text-sm font-semibold text-slate-700">Sampling</span>
      <div class="flex items-center gap-3">
        <ToggleSwitch v-model="state.commercial.requiresSample" input-id="sample" />
        <label class="text-sm text-slate-600" for="sample">Sample required</label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRfqWizard } from '~/composables/useRfqWizard'

const { state } = useRfqWizard()
</script>

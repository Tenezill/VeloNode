<template>
  <div class="space-y-4">
    <div>
      <div class="mb-2 flex items-center justify-between">
        <label class="block text-sm font-medium text-slate-700">Required Quantity Tiers</label>
        <Button label="Add Volume Tier" icon="pi pi-plus" size="small" severity="secondary" @click="addTier" />
      </div>
      <div class="space-y-2">
        <div v-for="(tier, index) in commercial.quantityTiers" :key="index" class="grid gap-2 sm:grid-cols-[1fr_auto]">
          <InputNumber
            v-model="commercial.quantityTiers[index]"
            :min="1"
            :use-grouping="false"
            class="w-full"
            :invalid="showErrors && (!commercial.quantityTiers[index] || commercial.quantityTiers[index] <= 0)"
          />
          <Button icon="pi pi-trash" text severity="danger" @click="removeTier(index)" />
        </div>
      </div>
      <small
        v-if="showErrors && !commercial.quantityTiers.some((tier) => tier > 0)"
        class="mt-1 block text-red-500"
      >
        Add at least one valid volume tier.
      </small>
    </div>

    <div>
      <label class="mb-1 block text-sm font-medium text-slate-700">Target Price per Unit</label>
      <InputNumber
        v-model="commercial.targetPrice"
        mode="currency"
        currency="EUR"
        locale="de-DE"
        class="w-full"
        :invalid="showErrors && !commercial.targetPrice"
      />
      <small v-if="showErrors && !commercial.targetPrice" class="mt-1 block text-red-500">
        Target unit price is required.
      </small>
    </div>

    <div>
      <label class="mb-1 block text-sm font-medium text-slate-700">Mass Production Deadline</label>
      <DatePicker v-model="commercial.deadline" class="w-full" show-icon />
    </div>

    <div class="flex items-center gap-3">
      <ToggleSwitch v-model="commercial.requiresSample" input-id="sampleRequired" />
      <label for="sampleRequired" class="text-sm text-slate-700">Sample Required?</label>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  showErrors?: boolean
}>()

const { commercial } = useRfqWizard()

function addTier() {
  commercial.quantityTiers.push(0)
}

function removeTier(index: number) {
  commercial.quantityTiers.splice(index, 1)
}
</script>

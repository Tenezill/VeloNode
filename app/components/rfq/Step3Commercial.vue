<template>
  <div class="space-y-4">
    <div>
      <div class="mb-2 flex items-center justify-between">
        <label class="block text-sm font-medium text-vn-slate">Required quantity tiers</label>
        <Button label="Add tier" icon="pi pi-plus" size="small" severity="secondary" @click="addTier" />
      </div>
      <div class="space-y-2">
        <div
          v-for="(_tier, index) in commercial.quantityTiers"
          :key="index"
          class="grid gap-2 sm:grid-cols-[1fr_auto]"
        >
          <InputNumber
            v-model="commercial.quantityTiers[index]"
            :min="1"
            :use-grouping="false"
            class="w-full"
            placeholder="Units"
            :invalid="
              showErrors &&
              (!commercial.quantityTiers[index] || commercial.quantityTiers[index] <= 0)
            "
          />
          <Button
            v-if="commercial.quantityTiers.length > 1"
            icon="pi pi-trash"
            text
            severity="danger"
            @click="removeTier(index)"
          />
        </div>
      </div>
      <small
        v-if="showErrors && !commercial.quantityTiers.some((tier) => tier > 0)"
        class="mt-1 block text-red-500"
      >
        Enter at least one quantity greater than zero.
      </small>
    </div>

    <div>
      <label class="mb-1 block text-sm font-medium text-vn-slate" for="target-price">Target price (EUR / unit)</label>
      <InputNumber
        id="target-price"
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
      <label class="mb-1 block text-sm font-medium text-vn-slate" for="deadline">Mass production deadline</label>
      <DatePicker id="deadline" v-model="commercial.deadline" class="w-full" show-icon />
    </div>

    <div class="flex items-center gap-3">
      <ToggleSwitch v-model="commercial.requiresSample" input-id="sampleRequired" />
      <label for="sampleRequired" class="text-sm text-vn-slate">Sample required?</label>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  showErrors?: boolean
}>()

const { commercial } = useRfqWizard()

function addTier() {
  commercial.quantityTiers.push(0)
}

function removeTier(index: number) {
  if (commercial.quantityTiers.length <= 1) return
  commercial.quantityTiers.splice(index, 1)
}
</script>

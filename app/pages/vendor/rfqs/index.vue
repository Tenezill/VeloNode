<template>
  <div>
    <div class="mb-5">
      <h1 class="text-2xl font-semibold text-vn-navy">RFQ Inbox</h1>
      <p class="mt-1 text-sm text-vn-slate">Incoming qualified leads from European buyers.</p>
    </div>

    <div class="rounded-xl border border-slate-200 bg-white p-4">
      <DataTable :value="rfqs" paginator :rows="8" responsive-layout="scroll">
        <Column field="buyerCompany" header="Buyer" />
        <Column field="country" header="Country" />
        <Column field="targetPrice" header="Target Price (EUR)" />
        <Column field="volume" header="Volume" />
        <Column field="status" header="Status">
          <template #body="{ data }">
            <Tag :value="data.status" :severity="data.status === 'Locked' ? 'warn' : 'success'" />
          </template>
        </Column>
        <Column header="Action">
          <template #body="{ data }">
            <Button
              :label="data.status === 'Locked' ? 'Unlock Lead' : 'View Lead'"
              size="small"
              :severity="data.status === 'Locked' ? 'contrast' : 'secondary'"
              @click="unlockLead(data.id)"
            />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'

definePageMeta({
  layout: 'vendor',
  middleware: ['vendor'],
})

interface RfqRow {
  id: string
  buyerCompany: string
  country: string
  targetPrice: number
  volume: number
  status: 'Locked' | 'Unlocked'
}

const toast = useToast()
const rfqs = ref<RfqRow[]>([
  { id: 'rfq-1', buyerCompany: 'Mayer Industrie GmbH', country: 'Germany', targetPrice: 8.4, volume: 12000, status: 'Locked' },
  { id: 'rfq-2', buyerCompany: 'Nordic Motion AB', country: 'Sweden', targetPrice: 12.1, volume: 5000, status: 'Unlocked' },
  { id: 'rfq-3', buyerCompany: 'Atelier Mecanique SAS', country: 'France', targetPrice: 3.2, volume: 30000, status: 'Locked' },
])

function unlockLead(id: string) {
  const target = rfqs.value.find((lead) => lead.id === id)
  if (!target) return
  if (target.status === 'Unlocked') {
    toast.add({ severity: 'info', summary: 'Lead open', detail: 'Lead details are already available.', life: 3000 })
    return
  }
  target.status = 'Unlocked'
  toast.add({
    severity: 'success',
    summary: 'Lead unlocked',
    detail: 'Contact details are now visible for this buyer.',
    life: 3500,
  })
}
</script>

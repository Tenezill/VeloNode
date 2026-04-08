<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-slate-800">Open RFQ market</h1>
      <p class="mt-1 text-sm text-slate-500">
        Trading floor — public leads from European buyers. Unlock to reveal identity and drawings.
      </p>
    </div>

    <div class="flex flex-col gap-6 lg:grid lg:grid-cols-12 lg:gap-8">
      <!-- Filters: ~1/4 width on large screens -->
      <aside class="lg:col-span-3">
        <Panel
          header="Filter by category"
          class="w-full rounded-lg border border-slate-200 bg-white shadow-sm"
        >
          <div class="flex flex-col gap-3">
            <div class="flex items-center gap-3">
              <Checkbox v-model="filterCnc" input-id="flt-cnc" binary />
              <label class="cursor-pointer text-sm font-medium text-slate-700" for="flt-cnc">
                CNC machining
              </label>
            </div>
            <div class="flex items-center gap-3">
              <Checkbox v-model="filterPlastics" input-id="flt-plastics" binary />
              <label class="cursor-pointer text-sm font-medium text-slate-700" for="flt-plastics">
                Plastics
              </label>
            </div>
            <div class="flex items-center gap-3">
              <Checkbox v-model="filterPcb" input-id="flt-pcb" binary />
              <label class="cursor-pointer text-sm font-medium text-slate-700" for="flt-pcb">
                PCB
              </label>
            </div>
            <p class="text-xs text-slate-400">Showing {{ visibleRfqs.length }} of {{ rfqs.length }} open RFQs.</p>
          </div>
        </Panel>
      </aside>

      <!-- Feed: ~3/4 width -->
      <section class="lg:col-span-9">
        <div class="flex flex-col gap-4">
          <Card
            v-for="rfq in visibleRfqs"
            :key="rfq.id"
            class="w-full rounded-lg border border-slate-200 bg-white shadow-sm"
          >
            <template #header>
              <div class="flex items-center justify-between gap-3">
                <Tag :value="rfq.category" severity="info" class="shrink-0" />
                <span class="text-sm text-slate-400">{{ rfq.postedAgo }}</span>
              </div>
            </template>

            <template #content>
              <div class="space-y-4">
                <h2 class="text-xl font-bold text-slate-800">{{ rfq.title }}</h2>

                <div class="grid grid-cols-2 gap-3 rounded-md border border-slate-100 bg-slate-50/80 p-3 text-sm">
                  <div>
                    <p class="text-xs font-medium uppercase tracking-wide text-slate-500">Volume</p>
                    <p class="mt-0.5 font-semibold text-slate-800">{{ rfq.volume }}</p>
                  </div>
                  <div>
                    <p class="text-xs font-medium uppercase tracking-wide text-slate-500">Destination</p>
                    <p class="mt-0.5 font-semibold text-slate-800">{{ rfq.destination }}</p>
                  </div>
                  <div class="col-span-2">
                    <p class="text-xs font-medium uppercase tracking-wide text-slate-500">Attachments</p>
                    <p class="mt-0.5 font-semibold text-slate-800">{{ rfq.attachmentsCount }} files</p>
                  </div>
                </div>

                <div class="border-t border-slate-100 pt-4">
                  <p class="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Buyer</p>

                  <template v-if="!rfq.isUnlocked">
                    <div
                      class="inline-block select-none rounded-md bg-slate-200 px-2 py-1 text-slate-500 blur-sm"
                    >
                      Hidden Buyer GmbH
                    </div>
                    <div class="mt-4 flex flex-wrap items-center gap-3">
                      <Button
                        label="Unlock lead (1 token)"
                        icon="pi pi-lock"
                        class="border-0 bg-cyan-600 font-semibold text-white shadow-sm hover:bg-cyan-700"
                        @click="unlockLead(rfq)"
                      />
                    </div>
                  </template>

                  <template v-else>
                    <p class="text-lg font-semibold text-slate-800">SolarTech Munich</p>
                    <div class="mt-4 flex flex-wrap items-center gap-3">
                      <Button
                        :label="`Download ${rfq.attachmentsCount} attachments`"
                        icon="pi pi-download"
                        severity="secondary"
                        class="border border-slate-300 bg-white font-medium text-slate-800 shadow-sm hover:bg-slate-50"
                        @click="onDownloadMock(rfq)"
                      />
                      <Button
                        label="Submit bid"
                        icon="pi pi-send"
                        severity="secondary"
                        class="border border-slate-300 bg-white font-medium text-slate-800 shadow-sm hover:bg-slate-50"
                        @click="onSubmitBidMock(rfq)"
                      />
                    </div>
                  </template>
                </div>
              </div>
            </template>
          </Card>

          <p v-if="visibleRfqs.length === 0" class="rounded-lg border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
            No RFQs match the selected categories. Enable at least one filter with matching leads.
          </p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'

definePageMeta({
  layout: 'vendor',
  middleware: ['vendor'],
})

interface OpenRfq {
  id: string
  category: string
  title: string
  volume: string
  destination: string
  postedAgo: string
  attachmentsCount: number
  isUnlocked: boolean
}

const toast = useToast()

const rfqs = ref<OpenRfq[]>([
  {
    id: 'REQ-1042',
    category: 'CNC Machining',
    title: 'Aluminum Brackets Rev B',
    volume: '5,000 units',
    destination: 'Germany',
    postedAgo: '2 hours ago',
    attachmentsCount: 2,
    isUnlocked: false,
  },
  {
    id: 'REQ-1043',
    category: 'Injection Molding',
    title: 'ABS Plastic Casings',
    volume: '50,000 units',
    destination: 'Austria',
    postedAgo: '5 hours ago',
    attachmentsCount: 4,
    isUnlocked: true,
  },
])

const filterCnc = ref(true)
const filterPlastics = ref(true)
const filterPcb = ref(true)

const visibleRfqs = computed(() => {
  const cats: string[] = []
  if (filterCnc.value) cats.push('CNC Machining')
  if (filterPlastics.value) cats.push('Injection Molding')
  if (filterPcb.value) cats.push('PCB Assembly')

  if (cats.length === 0) return rfqs.value

  return rfqs.value.filter((r) => cats.includes(r.category))
})

function unlockLead(rfq: OpenRfq) {
  rfq.isUnlocked = true
  toast.add({
    severity: 'success',
    summary: 'Lead unlocked',
    detail: `${rfq.id}: buyer identity and attachments are now available.`,
    life: 3500,
  })
}

function onDownloadMock(rfq: OpenRfq) {
  toast.add({
    severity: 'info',
    summary: 'Download',
    detail: `Mock download for ${rfq.id} (${rfq.attachmentsCount} files).`,
    life: 3000,
  })
}

function onSubmitBidMock(rfq: OpenRfq) {
  toast.add({
    severity: 'info',
    summary: 'Submit bid',
    detail: `Mock bid flow for ${rfq.id}.`,
    life: 3000,
  })
}
</script>

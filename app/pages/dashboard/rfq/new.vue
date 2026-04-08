<template>
  <div class="mx-auto max-w-3xl">
    <p class="text-xs font-semibold uppercase tracking-[0.2em] text-vn-slate-light">
      Buyer dashboard
    </p>
    <h1 class="mt-2 text-3xl font-semibold text-vn-navy">
      New RFQ
    </h1>
    <p class="mt-2 text-vn-slate">
      Provide enough detail for factories to quote accurately: target price, volume, and engineering files.
    </p>

    <form class="mt-8 space-y-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm" @submit.prevent="submit">
      <div class="grid gap-5 md:grid-cols-2">
        <div class="space-y-2">
          <label class="text-sm font-medium text-vn-slate" for="targetPrice">Target price (EUR)</label>
          <InputNumber
            id="targetPrice"
            v-model="targetPriceEur"
            class="w-full"
            :min="0"
            :use-grouping="false"
            placeholder="e.g. 2.40"
            mode="decimal"
            :min-fraction-digits="2"
            :max-fraction-digits="4"
          />
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium text-vn-slate" for="volume">Annual volume (units)</label>
          <InputNumber
            id="volume"
            v-model="annualVolume"
            class="w-full"
            :min="1"
            :use-grouping="false"
            placeholder="e.g. 20000"
          />
        </div>
      </div>

      <div class="space-y-2">
        <label class="text-sm font-medium text-vn-slate" for="notes">Notes for factory</label>
        <Textarea
          id="notes"
          v-model="notes"
          class="w-full"
          rows="6"
          auto-resize
          placeholder="Materials, tolerance, finish, packaging, Incoterms, required certifications…"
        />
      </div>

      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <label class="text-sm font-medium text-vn-slate">Blueprints / CAD / PDFs</label>
          <span class="text-xs text-vn-slate-light">{{ files.length }} file(s) selected</span>
        </div>

        <FileUpload
          mode="advanced"
          :multiple="true"
          :auto="false"
          custom-upload
          choose-label="Choose files"
          upload-label="Attach"
          cancel-label="Clear"
          accept=".pdf,.step,.stp,.iges,.igs,.dxf,.dwg,.zip"
          :max-file-size="25_000_000"
          @select="onSelectFiles"
          @clear="onClearFiles"
        >
          <template #empty>
            <div class="flex flex-col items-center justify-center py-10 text-center">
              <i class="pi pi-cloud-upload text-3xl text-vn-navy" />
              <p class="mt-4 text-sm font-medium text-vn-navy">
                Drag & drop files here
              </p>
              <p class="mt-1 text-sm text-vn-slate">
                PDF, STEP, IGES, DXF, DWG, or ZIP. Max 25MB each.
              </p>
            </div>
          </template>
        </FileUpload>

        <Message v-if="files.length" severity="info" :closable="false" class="text-sm">
          Files are stored locally for now (mock). When the backend is connected, these will be uploaded securely.
        </Message>
      </div>

      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <NuxtLink to="/products" class="text-sm font-medium text-vn-slate hover:text-vn-navy">
          ← Back to products
        </NuxtLink>
        <Button
          type="submit"
          label="Submit RFQ"
          icon="pi pi-send"
          :loading="busy"
          :disabled="!canSubmit"
        />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { FileUploadSelectEvent } from 'primevue/fileupload'
import { useToast } from 'primevue/usetoast'

definePageMeta({
  layout: 'buyer',
  middleware: ['buyer'],
})

const toast = useToast()
const { api } = useApi()

const targetPriceEur = ref<number | null>(null)
const annualVolume = ref<number | null>(null)
const notes = ref('')
const files = ref<File[]>([])
const busy = ref(false)

const canSubmit = computed(() => {
  return Boolean(annualVolume.value && annualVolume.value > 0 && notes.value.trim())
})

function onSelectFiles(e: FileUploadSelectEvent) {
  files.value = (e.files || []).slice() as File[]
}

function onClearFiles() {
  files.value = []
}

async function submit() {
  if (!canSubmit.value) {
    toast.add({
      severity: 'warn',
      summary: 'Missing details',
      detail: 'Please add at least volume and notes before submitting.',
      life: 6000,
    })
    return
  }

  busy.value = true
  try {
    await api('/rfqs', {
      method: 'POST',
      body: {
        targetPriceEur: targetPriceEur.value,
        annualVolume: annualVolume.value,
        notes: notes.value,
        // Files will be uploaded as multipart/form-data later.
        attachments: files.value.map((f) => ({
          name: f.name,
          size: f.size,
          type: f.type,
        })),
      },
      quiet: true,
    })
    toast.add({
      severity: 'success',
      summary: 'RFQ submitted',
      detail: 'Your request has been queued for vendor matching (mock).',
      life: 6500,
    })
    await navigateTo('/dashboard')
  } catch {
    toast.add({
      severity: 'warn',
      summary: 'Offline submission',
      detail:
        'Backend unreachable — saved as a local mock submission for demo purposes.',
      life: 7000,
    })
    await navigateTo('/dashboard')
  } finally {
    busy.value = false
  }
}
</script>

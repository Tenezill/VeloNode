<template>
  <div class="max-w-4xl">
    <div class="mb-5">
      <h1 class="text-2xl font-semibold text-vn-navy">Developer API</h1>
      <p class="mt-1 text-sm text-vn-slate">Use your credentials to integrate ERP with our Alibaba-style OpenAPI.</p>
    </div>

    <div class="rounded-xl border border-slate-200 bg-white p-6">
      <Message severity="warn" :closable="false" class="mb-4">
        Keep these credentials private. Rotate keys immediately if you suspect leakage.
      </Message>

      <div class="space-y-4">
        <div>
          <label class="mb-1 block text-sm font-medium text-vn-slate">appKey</label>
          <div class="flex gap-2">
            <InputText :model-value="credentials.appKey" readonly class="w-full" />
            <Button label="Copy" severity="secondary" @click="copyValue(credentials.appKey, 'appKey')" />
          </div>
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-vn-slate">appSecret</label>
          <div class="flex gap-2">
            <Password :model-value="credentials.appSecret" :feedback="false" toggle-mask readonly input-class="w-full" class="w-full" />
            <Button label="Copy" severity="secondary" @click="copyValue(credentials.appSecret, 'appSecret')" />
          </div>
        </div>
      </div>

      <div class="mt-5">
        <Button label="Regenerate credentials" severity="contrast" @click="regenerate" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'

definePageMeta({
  layout: 'vendor',
  middleware: ['vendor'],
})

const toast = useToast()

const credentials = reactive({
  appKey: 'vn_demo_app_key_5f6b2a',
  appSecret: 'vn_demo_secret_2b2f4a6cc1f',
})

async function copyValue(value: string, label: string) {
  try {
    await navigator.clipboard.writeText(value)
    toast.add({ severity: 'success', summary: 'Copied', detail: `${label} copied to clipboard.`, life: 2200 })
  } catch {
    toast.add({ severity: 'error', summary: 'Copy failed', detail: `Could not copy ${label}.`, life: 2600 })
  }
}

function regenerate() {
  credentials.appKey = `vn_demo_app_key_${Math.random().toString(36).slice(2, 8)}`
  credentials.appSecret = `vn_demo_secret_${Math.random().toString(36).slice(2, 15)}`
  toast.add({
    severity: 'warn',
    summary: 'Mock keys regenerated',
    detail: 'These are demo credentials until backend issuance is connected.',
    life: 3500,
  })
}
</script>

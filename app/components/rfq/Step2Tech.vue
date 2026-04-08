<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-semibold text-slate-800">Technical</h2>

    <div>
      <label class="mb-2 block text-sm font-medium text-slate-600">Blueprint upload (CAD / PDF)</label>
      <div class="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-8">
        <FileUpload
          mode="advanced"
          :multiple="true"
          accept=".pdf,.step,.stp,.zip"
          :max-file-size="25_000_000"
          custom-upload
          :auto="false"
          choose-label="Choose files"
          cancel-label="Clear"
          @select="onSelect"
          @clear="onClear"
        />
      </div>
      <p v-if="state.tech.files.length" class="mt-2 text-xs text-slate-500">
        {{ state.tech.files.length }} file(s) selected
      </p>
    </div>

    <div class="flex flex-col space-y-2">
      <label class="text-sm font-medium text-slate-600">Technical specifications</label>
      <Textarea v-model="state.tech.specs" class="w-full" rows="6" placeholder="Tolerance, materials, compliance…" />
    </div>

    <div class="flex items-center gap-3">
      <ToggleSwitch v-model="state.tech.requiresNda" input-id="nda" />
      <label for="nda" class="text-sm text-slate-600">NDA required</label>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FileUploadSelectEvent } from 'primevue/fileupload'
import { useRfqWizard } from '~/composables/useRfqWizard'

const { state } = useRfqWizard()

function onSelect(e: FileUploadSelectEvent) {
  const list = (e.files || []) as File[]
  state.value.tech.files = list.map((f) => f.name)
}

function onClear() {
  state.value.tech.files = []
}
</script>

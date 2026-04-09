<template>
  <div class="space-y-8 animate-fade-in">
    <div>
      <h2 class="text-2xl font-bold text-slate-800">Technical specifications</h2>
      <p class="mt-1 text-sm text-slate-500">
        Upload drawings and describe tolerances, materials, and compliance needs.
      </p>
    </div>

    <div class="flex flex-col space-y-2">
      <label class="text-sm font-semibold text-slate-700">Blueprint upload (CAD / PDF)</label>
      <FileUpload
        class="w-full"
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
      <p v-if="state.tech.files.length" class="text-xs text-slate-500">
        {{ state.tech.files.length }} file(s) selected
      </p>
    </div>

    <div class="flex flex-col space-y-2">
      <label class="text-sm font-semibold text-slate-700">Technical specifications</label>
      <Textarea
        v-model="state.tech.specs"
        class="w-full"
        rows="6"
        placeholder="Tolerance, materials, compliance…"
      />
    </div>

    <div class="flex flex-col space-y-2">
      <span class="text-sm font-semibold text-slate-700">Compliance</span>
      <div class="flex items-center gap-3">
        <ToggleSwitch v-model="state.tech.requiresNda" input-id="nda" />
        <label class="text-sm text-slate-600" for="nda">NDA required</label>
      </div>
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

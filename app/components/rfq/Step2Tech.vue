<template>
  <div class="space-y-5">
    <div>
      <label class="mb-2 block text-sm font-medium text-vn-slate">Blueprint vault (CAD / PDF)</label>
      <div
        class="rounded-2xl border-2 border-dashed border-slate-300 bg-vn-ice/40 px-4 py-10 sm:px-8 sm:py-14"
      >
        <FileUpload
          mode="advanced"
          :multiple="true"
          accept=".pdf,.step,.stp,.iges,.igs,.dxf,.dwg,.zip"
          :max-file-size="25_000_000"
          custom-upload
          :auto="false"
          choose-label="Choose files"
          upload-label="Ready"
          cancel-label="Clear"
          @select="onSelect"
          @clear="onClear"
        >
          <template #empty>
            <div class="flex flex-col items-center justify-center text-center">
              <i class="pi pi-cloud-upload text-4xl text-vn-navy" />
              <p class="mt-4 text-sm font-medium text-vn-navy">Drop blueprints here</p>
              <p class="mt-1 max-w-md text-sm text-vn-slate">
                PDF, STEP, IGES, DXF, DWG, or ZIP — up to 25&nbsp;MB per file.
              </p>
            </div>
          </template>
        </FileUpload>
      </div>
      <div class="mt-2 flex flex-wrap items-center gap-2 text-xs text-vn-slate-light">
        <span class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 font-medium text-emerald-800">
          <i class="pi pi-lock text-[0.7rem]" />
          Encrypted &amp; secure
        </span>
        <span>Files stay in your session until publish.</span>
      </div>
      <p v-if="state.tech.files.length" class="mt-2 text-xs text-vn-slate">
        {{ state.tech.files.length }} file(s) attached.
      </p>
      <small
        v-if="showFieldErrors && !state.tech.files.length && !state.tech.specs.trim()"
        class="mt-1 block text-red-500"
      >
        Add at least one file or provide technical specifications below.
      </small>
    </div>

    <div>
      <label class="mb-1 block text-sm font-medium text-vn-slate" for="tech-specs">Technical Specifications</label>
      <Textarea
        id="tech-specs"
        v-model="state.tech.specs"
        rows="6"
        auto-resize
        class="w-full"
        :invalid="showFieldErrors && !state.tech.specs.trim() && !state.tech.files.length"
        placeholder="Tolerance, compliance, dimensions, critical QA checkpoints…"
      />
    </div>

    <div class="flex items-center gap-3">
      <ToggleSwitch v-model="state.tech.requiresNda" input-id="ndaRequired" />
      <label for="ndaRequired" class="text-sm text-vn-slate">NDA required?</label>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FileUploadSelectEvent } from 'primevue/fileupload'

const { state, showFieldErrors } = useRfqWizard()

function onSelect(e: FileUploadSelectEvent) {
  const list = (e.files || []) as File[]
  state.value.tech.files = list.map((f) => f.name)
}

function onClear() {
  state.value.tech.files = []
}
</script>

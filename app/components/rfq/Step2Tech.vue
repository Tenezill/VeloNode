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
        <span>Files stay in your session until publish; backend upload hooks in next phase.</span>
      </div>
      <p v-if="tech.files.length" class="mt-2 text-xs text-vn-slate">
        {{ tech.files.length }} file(s) attached.
      </p>
      <small
        v-if="showErrors && !tech.files.length && !tech.specs.trim()"
        class="mt-1 block text-red-500"
      >
        Add at least one file or provide technical specifications below.
      </small>
    </div>

    <div>
      <label class="mb-1 block text-sm font-medium text-vn-slate" for="tech-specs">Technical Specifications</label>
      <Textarea
        id="tech-specs"
        v-model="tech.specs"
        rows="6"
        auto-resize
        class="w-full"
        :invalid="showErrors && !tech.specs.trim() && !tech.files.length"
        placeholder="Tolerance, compliance, dimensions, critical QA checkpoints…"
      />
    </div>

    <div class="flex items-center gap-3">
      <ToggleSwitch v-model="tech.requiresNda" input-id="ndaRequired" />
      <label for="ndaRequired" class="text-sm text-vn-slate">NDA required?</label>
    </div>

    <div class="rounded-xl border border-slate-200/80 p-4">
      <div class="mb-3 flex items-center justify-between">
        <h3 class="text-sm font-medium text-vn-navy">Custom attributes</h3>
        <Button label="Add row" icon="pi pi-plus" size="small" severity="secondary" @click="addAttribute" />
      </div>

      <div v-if="!tech.customAttributes.length" class="text-sm text-vn-slate-light">
        Optional: add key/value specs (JSONB-style) for vendor matching.
      </div>

      <div class="space-y-2">
        <div
          v-for="(attribute, index) in tech.customAttributes"
          :key="`${index}-${attribute.key}`"
          class="grid gap-2 sm:grid-cols-[1fr_1fr_auto]"
        >
          <InputText v-model="attribute.key" placeholder="Key (e.g. Max temp)" />
          <InputText v-model="attribute.value" placeholder="Value (e.g. 150°C)" />
          <Button icon="pi pi-trash" text severity="danger" @click="removeAttribute(index)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FileUploadSelectEvent } from 'primevue/fileupload'

defineProps<{
  showErrors?: boolean
}>()

const { tech } = useRfqWizard()

function onSelect(e: FileUploadSelectEvent) {
  const list = (e.files || []) as File[]
  tech.files = list.map((f) => f.name)
}

function onClear() {
  tech.files = []
}

function addAttribute() {
  tech.customAttributes.push({ key: '', value: '' })
}

function removeAttribute(index: number) {
  tech.customAttributes.splice(index, 1)
}
</script>

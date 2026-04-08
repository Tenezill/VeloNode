<template>
  <div class="space-y-5">
    <div>
      <label class="mb-2 block text-sm font-medium text-slate-700">Blueprint Upload (.step, .pdf, .zip)</label>
      <div class="rounded-md border-2 border-dashed border-slate-300 bg-slate-50 p-3">
        <FileUpload
          mode="advanced"
          :multiple="true"
          accept=".step,.stp,.pdf,.zip"
          :max-file-size="25000000"
          custom-upload
          choose-label="Select Files"
          upload-label="Ready"
          cancel-label="Clear"
          @select="onSelect"
          @clear="onClear"
        />
      </div>
      <p v-if="payload.files.length" class="mt-2 text-xs text-slate-500">
        {{ payload.files.length }} file(s) attached.
      </p>
      <small
        v-if="showErrors && !payload.files.length && !payload.technicalSpecs.trim()"
        class="mt-1 block text-red-500"
      >
        Add at least one file or provide technical specifications.
      </small>
    </div>

    <div>
      <label class="mb-1 block text-sm font-medium text-slate-700">Technical Specifications</label>
      <Textarea
        v-model="payload.technicalSpecs"
        rows="6"
        auto-resize
        class="w-full"
        :invalid="showErrors && !payload.technicalSpecs.trim() && !payload.files.length"
        placeholder="Tolerance, compliance, dimensions, critical QA checkpoints..."
      />
    </div>

    <div class="flex items-center gap-3">
      <ToggleSwitch v-model="payload.ndaRequired" input-id="ndaRequired" />
      <label for="ndaRequired" class="text-sm text-slate-700">NDA Required?</label>
    </div>

    <div class="rounded-md border border-slate-200 p-4">
      <div class="mb-3 flex items-center justify-between">
        <h3 class="text-sm font-medium text-slate-800">Custom Attributes</h3>
        <Button label="Add Custom Spec" icon="pi pi-plus" size="small" severity="secondary" @click="addAttribute" />
      </div>

      <div v-if="!payload.customAttributes.length" class="text-sm text-slate-500">
        No custom specs added yet.
      </div>

      <div class="space-y-2">
        <div
          v-for="(attribute, index) in payload.customAttributes"
          :key="`${index}-${attribute.key}`"
          class="grid gap-2 sm:grid-cols-[1fr_1fr_auto]"
        >
          <InputText v-model="attribute.key" placeholder="Key (e.g. Max Temp)" />
          <InputText v-model="attribute.value" placeholder="Value (e.g. 150C)" />
          <Button icon="pi pi-trash" text severity="danger" @click="removeAttribute(index)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface CustomAttribute {
  key: string
  value: string
}

interface RfqPayload {
  files: string[]
  technicalSpecs: string
  ndaRequired: boolean
  customAttributes: CustomAttribute[]
}

const props = defineProps<{
  payload: RfqPayload
  showErrors?: boolean
}>()

function onSelect(event: { files: File[] }) {
  props.payload.files = event.files.map((file) => file.name)
}

function onClear() {
  props.payload.files = []
}

function addAttribute() {
  props.payload.customAttributes.push({ key: '', value: '' })
}

function removeAttribute(index: number) {
  props.payload.customAttributes.splice(index, 1)
}
</script>

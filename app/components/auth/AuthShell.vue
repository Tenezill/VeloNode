<template>
  <div class="flex min-h-screen items-center justify-center bg-vn-ice px-4 py-12">
    <div class="w-full max-w-md rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm">
      <div class="mb-8 text-center">
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-vn-slate-light">
          VelaNode
        </p>
        <h1 class="mt-2 text-2xl font-semibold text-vn-navy">
          {{ title }}
        </h1>
        <p v-if="subtitle" class="mt-2 text-sm text-vn-slate">
          {{ subtitle }}
        </p>
      </div>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()
</script>

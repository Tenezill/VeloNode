<template>
  <div class="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
    <div class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h1 class="text-2xl font-semibold text-slate-900">My RFQs</h1>
      <p class="mt-2 text-sm text-slate-500">
        RFQ list view placeholder. Your newly published RFQ has been submitted successfully.
      </p>
      <div class="mt-5">
        <NuxtLink to="/dashboard/rfq/new" class="text-sm font-medium text-cyan-600 hover:text-cyan-700">
          Create another RFQ
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'buyer',
  middleware: ['buyer'],
})
</script>

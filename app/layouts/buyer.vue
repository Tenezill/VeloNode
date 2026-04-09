<template>
  <div class="min-h-screen">
    <Toast class="font-sans" position="top-right" />
    <BuyerNavBar />
    <main class="mx-auto w-full max-w-7xl px-6 py-10">
      <slot />
    </main>
    <footer class="border-t border-slate-200/70 bg-white">
      <div class="mx-auto max-w-7xl px-6 py-8 text-sm text-vn-slate">
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p class="font-medium text-vn-navy">VelaNode</p>
          <p class="text-vn-slate-light">
            Secure B2B OEM sourcing for verified European buyers.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts"></script>

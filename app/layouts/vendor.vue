<template>
  <div class="min-h-screen bg-vn-ice">
    <Toast position="top-right" />
    <div class="mx-auto grid min-h-screen max-w-7xl grid-cols-1 lg:grid-cols-[260px_1fr]">
      <aside class="border-r border-slate-200 bg-white p-5">
        <NuxtLink to="/vendor" class="mb-8 block">
          <p class="text-lg font-semibold text-vn-navy">VelaNode Vendor</p>
          <p class="text-xs text-vn-slate-light">Factory Console</p>
        </NuxtLink>
        <nav class="space-y-1">
          <NuxtLink to="/vendor" class="block rounded-md px-3 py-2 text-sm text-vn-slate hover:bg-slate-100">
            Overview
          </NuxtLink>
          <NuxtLink to="/vendor/rfqs" class="block rounded-md px-3 py-2 text-sm text-vn-slate hover:bg-slate-100">
            RFQ Inbox
          </NuxtLink>
          <NuxtLink to="/vendor/market" class="block rounded-md px-3 py-2 text-sm text-vn-slate hover:bg-slate-100">
            Open market
          </NuxtLink>
          <NuxtLink to="/vendor/products/new" class="block rounded-md px-3 py-2 text-sm text-vn-slate hover:bg-slate-100">
            Product Upload
          </NuxtLink>
          <NuxtLink to="/vendor/developer" class="block rounded-md px-3 py-2 text-sm text-vn-slate hover:bg-slate-100">
            Developer API
          </NuxtLink>
        </nav>
      </aside>
      <main class="p-4 sm:p-6 lg:p-8">
        <slot />
      </main>
    </div>
  </div>
</template>

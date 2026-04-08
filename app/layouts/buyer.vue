<template>
  <div class="min-h-screen bg-vn-ice">
    <Toast position="top-right" />
    <header class="border-b border-slate-200 bg-white/95 backdrop-blur">
      <div class="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <NuxtLink to="/" class="flex items-center gap-2">
          <span class="text-lg font-semibold text-vn-navy">VelaNode</span>
          <Tag severity="secondary" value="Buyer Portal" />
        </NuxtLink>

        <nav class="hidden items-center gap-6 md:flex">
          <NuxtLink to="/" class="text-sm text-vn-slate hover:text-vn-navy">Home</NuxtLink>
          <NuxtLink to="/products" class="text-sm text-vn-slate hover:text-vn-navy">Products</NuxtLink>
          <NuxtLink to="/dashboard/rfq/new" class="text-sm text-vn-slate hover:text-vn-navy">New RFQ</NuxtLink>
        </nav>

        <div class="flex items-center gap-2">
          <NuxtLink
            to="/auth/login"
            class="hidden rounded-md border border-slate-300 px-3 py-1.5 text-sm text-vn-slate hover:border-vn-navy sm:inline-block"
          >
            Sign in
          </NuxtLink>
          <NuxtLink
            to="/auth/register"
            class="rounded-md bg-vn-navy px-3 py-1.5 text-sm text-white hover:bg-vn-navy-muted"
          >
            Get verified
          </NuxtLink>
        </div>
      </div>
    </header>

    <main>
      <slot />
    </main>
  </div>
</template>

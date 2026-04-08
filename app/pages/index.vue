<template>
  <div class="mx-auto flex min-h-[70vh] max-w-3xl flex-col justify-center px-6 py-16">
    <p class="text-sm font-medium uppercase tracking-wide text-vn-slate-light">
      VelaNode
    </p>
    <h1 class="mt-2 text-3xl font-semibold tracking-tight text-vn-navy md:text-4xl">
      Secure B2B OEM — European buyers &amp; verified factories
    </h1>
    <p class="mt-4 text-lg text-vn-slate">
      Phase 1 is live: JWT-aware API helper, auth screens, VIES VAT validation (with Nitro fallback),
      and role-based route guards. Phase 2 will flesh out the buyer portal UX.
    </p>
    <div class="mt-10 flex flex-wrap gap-3">
      <NuxtLink
        to="/auth/register"
        class="rounded-lg bg-vn-navy px-4 py-2.5 text-sm font-medium text-white hover:bg-vn-navy-muted"
      >
        Register
      </NuxtLink>
      <NuxtLink
        to="/auth/login"
        class="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-vn-navy hover:border-vn-navy-muted"
      >
        Sign in
      </NuxtLink>
      <NuxtLink
        to="/dashboard"
        class="rounded-lg border border-transparent px-4 py-2.5 text-sm font-medium text-vn-slate underline-offset-4 hover:underline"
      >
        Buyer dashboard
      </NuxtLink>
      <NuxtLink
        to="/vendor"
        class="rounded-lg border border-transparent px-4 py-2.5 text-sm font-medium text-vn-slate underline-offset-4 hover:underline"
      >
        Vendor dashboard
      </NuxtLink>
    </div>
  </div>
</template>

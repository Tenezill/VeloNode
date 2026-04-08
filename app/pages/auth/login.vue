<template>
  <AuthShell
    title="Sign in"
    subtitle="Access your buyer workspace or vendor dashboard."
  >
    <form class="space-y-5" @submit.prevent="onSubmit">
      <div class="space-y-1.5">
        <label class="text-sm font-medium text-vn-slate" for="email">Work email</label>
        <InputText
          id="email"
          v-model="email"
          type="email"
          autocomplete="username"
          class="w-full"
          :invalid="submitted && !email"
          placeholder="you@company.eu"
        />
      </div>

      <div class="space-y-1.5">
        <label class="text-sm font-medium text-vn-slate" for="password">Password</label>
        <Password
          id="password"
          v-model="password"
          class="w-full"
          input-class="w-full"
          :feedback="false"
          toggle-mask
          autocomplete="current-password"
          :invalid="submitted && !password"
        />
      </div>

      <div class="space-y-1.5">
        <label class="text-sm font-medium text-vn-slate" for="role">Signing in as</label>
        <Select
          id="role"
          v-model="role"
          :options="roleOptions"
          option-label="label"
          option-value="value"
          class="w-full"
          placeholder="Select account type"
        />
      </div>

      <Button
        type="submit"
        class="w-full"
        label="Continue"
        :loading="busy"
      />

      <p class="text-center text-sm text-vn-slate">
        New to VelaNode?
        <NuxtLink class="font-medium text-vn-navy underline-offset-4 hover:underline" to="/auth/register">
          Create an account
        </NuxtLink>
      </p>
    </form>
  </AuthShell>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import type { AuthUser, UserRole } from '~/stores/auth'

definePageMeta({
  layout: 'default',
})

const { api } = useApi()
const auth = useAuthStore()
const toast = useToast()
const route = useRoute()

const email = ref('')
const password = ref('')
const role = ref<UserRole>('buyer')
const busy = ref(false)
const submitted = ref(false)

const roleOptions = [
  { label: 'European buyer', value: 'buyer' as const },
  { label: 'Factory / vendor', value: 'vendor' as const },
]

interface LoginResponse {
  token: string
  user: AuthUser
}

function defaultHomeForUser(r: UserRole) {
  return r === 'vendor' ? '/vendor' : '/dashboard'
}

/**
 * Primary path: real REST API. When the Node service is offline, we fall back to a mock session
 * so UX work can continue without blocking on infrastructure.
 */
async function onSubmit() {
  submitted.value = true
  if (!email.value || !password.value || !role.value) return

  busy.value = true
  const redirectTarget = (route.query.redirect as string) || undefined

  try {
    const res = await api<LoginResponse>('/auth/login', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value,
        role: role.value,
      },
      quiet: true,
    })
    auth.persistSession(res.token, res.user)
    await navigateTo(redirectTarget || defaultHomeForUser(res.user.role))
  } catch {
    /**
     * Mock fallback — backend not connected yet.
     * Mirrors the eventual contract so swapping to live data is a one-line change.
     */
    auth.persistSession('dev-mock-jwt', {
      id: 'dev-user',
      email: email.value,
      role: role.value,
    })
    toast.add({
      severity: 'warn',
      summary: 'Offline sign-in',
      detail:
        'API unreachable — using a local mock session until your Node server is running.',
      life: 7000,
    })
    await navigateTo(redirectTarget || defaultHomeForUser(role.value))
  } finally {
    busy.value = false
  }
}
</script>

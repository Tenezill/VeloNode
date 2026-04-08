<template>
  <AuthShell
    title="Create your company account"
    subtitle="Buyers must validate an EU VAT number via VIES before we activate procurement tools."
  >
    <form class="space-y-5" @submit.prevent="onSubmit">
      <div class="space-y-1.5">
        <label class="text-sm font-medium text-vn-slate" for="reg-role">Account type</label>
        <Select
          id="reg-role"
          v-model="role"
          :options="roleOptions"
          option-label="label"
          option-value="value"
          class="w-full"
        />
      </div>

      <div class="space-y-1.5">
        <label class="text-sm font-medium text-vn-slate" for="company">Company name</label>
        <InputText
          id="company"
          v-model="companyName"
          class="w-full"
          :invalid="submitted && !companyName"
          placeholder="Acme Industrial GmbH"
        />
      </div>

      <div class="space-y-1.5">
        <label class="text-sm font-medium text-vn-slate" for="email">Work email</label>
        <InputText
          id="email"
          v-model="email"
          type="email"
          autocomplete="email"
          class="w-full"
          :invalid="submitted && !email"
        />
      </div>

      <div class="space-y-1.5">
        <label class="text-sm font-medium text-vn-slate" for="password">Password</label>
        <Password
          id="password"
          v-model="password"
          class="w-full"
          input-class="w-full"
          :feedback="true"
          toggle-mask
          autocomplete="new-password"
          :invalid="submitted && !password"
        />
      </div>

      <!-- Buyer-only: EU VAT validated asynchronously (VIES + mock fallback via Nitro). -->
      <div v-if="role === 'buyer'" class="space-y-2">
        <label class="text-sm font-medium text-vn-slate" for="vat">EU VAT number</label>
        <InputText
          id="vat"
          v-model="vatNumber"
          class="w-full"
          placeholder="DE123456789"
          :invalid="submitted && vatStatus !== 'valid'"
        />
        <Message
          v-if="vatStatus === 'checking'"
          severity="info"
          :closable="false"
          class="text-sm"
        >
          Checking VIES registry…
        </Message>
        <Message
          v-else-if="vatStatus === 'valid'"
          severity="success"
          :closable="false"
          class="text-sm"
        >
          VAT looks good{{ vatMock ? ' (mock fallback — live VIES was unreachable).' : '.' }}
        </Message>
        <Message
          v-else-if="vatStatus === 'invalid' && vatNumber.trim()"
          severity="error"
          :closable="false"
          class="text-sm"
        >
          {{ vatMessage || 'VAT failed validation — please correct the number.' }}
        </Message>
        <p class="text-xs text-vn-slate-light">
          We verify VAT before submission so only legitimate EU operators can issue RFQs.
        </p>
      </div>

      <Button
        type="submit"
        class="w-full"
        label="Create account"
        :loading="busy"
        :disabled="!canSubmit"
      />

      <p class="text-center text-sm text-vn-slate">
        Already have access?
        <NuxtLink class="font-medium text-vn-navy underline-offset-4 hover:underline" to="/auth/login">
          Sign in
        </NuxtLink>
      </p>
    </form>
  </AuthShell>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import type { AuthUser } from '~/stores/auth'

definePageMeta({
  layout: 'default',
})

const { api } = useApi()
const auth = useAuthStore()
const toast = useToast()

const {
  status: vatStatus,
  lastMessage: vatMessage,
  isMock: vatMock,
  scheduleValidate,
  reset: resetVat,
} = useVatAsyncValidation()

const role = ref<'buyer' | 'vendor'>('buyer')
const companyName = ref('')
const email = ref('')
const password = ref('')
const vatNumber = ref('')
const busy = ref(false)
const submitted = ref(false)

const roleOptions = [
  { label: 'European buyer', value: 'buyer' as const },
  { label: 'Factory / vendor', value: 'vendor' as const },
]

/** Gate the submit button: buyers need a green VIES check first. */
const canSubmit = computed(() => {
  if (!companyName.value || !email.value || !password.value) return false
  if (role.value === 'buyer') return vatStatus.value === 'valid'
  return true
})

watch(vatNumber, (v) => scheduleValidate(v))

watch(role, (r) => {
  if (r === 'vendor') {
    vatNumber.value = ''
    resetVat()
  }
})

interface RegisterResponse {
  token: string
  user: AuthUser
}

async function onSubmit() {
  submitted.value = true
  if (!canSubmit.value) return

  busy.value = true
  try {
    const res = await api<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: {
        companyName: companyName.value,
        email: email.value,
        password: password.value,
        role: role.value,
        vatNumber: role.value === 'buyer' ? vatNumber.value.trim().toUpperCase() : undefined,
      },
      quiet: true,
    })
    auth.persistSession(res.token, res.user)
    await navigateTo(res.user.role === 'vendor' ? '/vendor' : '/dashboard')
  } catch {
    /** Same mock story as login — keeps QA/unblocked until the API ships. */
    auth.persistSession('dev-mock-jwt', {
      id: 'dev-register',
      email: email.value,
      role: role.value,
      companyName: companyName.value,
      vatNumber: role.value === 'buyer' ? vatNumber.value.trim().toUpperCase() : undefined,
    })
    toast.add({
      severity: 'warn',
      summary: 'Offline registration',
      detail:
        'API unreachable — created a mock session locally. Persisted data will appear once the backend is wired.',
      life: 7500,
    })
    await navigateTo(role.value === 'vendor' ? '/vendor' : '/dashboard')
  } finally {
    busy.value = false
  }
}
</script>

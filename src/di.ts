import { SignInUseCase } from '@/application/sign-in-use-case'
import { SignOutUseCase } from '@/application/sign-out-use-case'
import { ObserveAuthSessionUseCase } from '@/application/observe-auth-session-use-case'
import { GetCurrentIdentityUseCase } from '@/application/get-current-identity-use-case'
import { resolveAuthConfig } from '@/infrastructure/services/auth-config'
import type { PublicAuthConfig } from '@/infrastructure/services/auth-config'
import { HttpIdentityRepository } from '@/infrastructure/services/HttpIdentityRepository'
import type { AccountDependencies } from '@/ui/pages/account/AccountDependencies'

export interface PublicAppConfig extends PublicAuthConfig { apiBaseUrl?: string }

function resolveApiBaseUrl(input?: string): string | null {
  try {
    const url = new URL(input?.trim() ?? '')
    const localHttp = url.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)
    if ((url.protocol !== 'https:' && !localHttp) || url.username || url.password || url.search || url.hash || url.pathname !== '/api/v1') return null
    return url.href.replace(/\/$/, '')
  } catch { return null }
}

export async function createDependencies(config: PublicAppConfig): Promise<{ account: AccountDependencies | null; dispose: () => Promise<void> }> {
  const resolved = resolveAuthConfig(config)
  if (!resolved) return { account: null, dispose: async () => {} }
  const [{ createClient }, { SupabaseAuthService }] = await Promise.all([
    import('@supabase/supabase-js'), import('@/infrastructure/services/SupabaseAuthService'),
  ])
  const client = createClient(resolved.supabaseUrl, resolved.supabasePublishableKey, {
    auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: false },
  })
  const auth = new SupabaseAuthService(client.auth)
  const apiBaseUrl = resolveApiBaseUrl(config.apiBaseUrl)
  return {
    account: {
      signIn: new SignInUseCase(auth), signOut: new SignOutUseCase(auth), session: new ObserveAuthSessionUseCase(auth),
      identity: apiBaseUrl ? new GetCurrentIdentityUseCase(new HttpIdentityRepository({ apiBaseUrl, getAccessToken: () => auth.getAccessToken() })) : null,
    },
    dispose: () => client.auth.dispose(),
  }
}

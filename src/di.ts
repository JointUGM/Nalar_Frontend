import { SignInUseCase } from '@/application/sign-in-use-case'
import { SignOutUseCase } from '@/application/sign-out-use-case'
import { ObserveAuthSessionUseCase } from '@/application/observe-auth-session-use-case'
import { resolveAuthConfig } from '@/infrastructure/services/auth-config'
import type { PublicAuthConfig } from '@/infrastructure/services/auth-config'
import type { AccountDependencies } from '@/ui/pages/account/AccountDependencies'

export async function createDependencies(config: PublicAuthConfig): Promise<{ account: AccountDependencies | null; dispose: () => Promise<void> }> {
  const resolved = resolveAuthConfig(config)
  if (!resolved) return { account: null, dispose: async () => {} }
  const [{ createClient }, { SupabaseAuthService }] = await Promise.all([
    import('@supabase/supabase-js'), import('@/infrastructure/services/SupabaseAuthService'),
  ])
  const client = createClient(resolved.supabaseUrl, resolved.supabasePublishableKey, {
    auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: false },
  })
  const auth = new SupabaseAuthService(client.auth)
  return {
    account: { signIn: new SignInUseCase(auth), signOut: new SignOutUseCase(auth), session: new ObserveAuthSessionUseCase(auth) },
    dispose: () => client.auth.dispose(),
  }
}

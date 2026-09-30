import type { SignInUseCase } from '@/application/sign-in-use-case'
import type { SignOutUseCase } from '@/application/sign-out-use-case'
import type { ObserveAuthSessionUseCase } from '@/application/observe-auth-session-use-case'

export interface AccountDependencies {
  readonly signIn: Pick<SignInUseCase, 'execute'>
  readonly signOut: Pick<SignOutUseCase, 'execute'>
  readonly session: Pick<ObserveAuthSessionUseCase, 'execute' | 'read'>
}

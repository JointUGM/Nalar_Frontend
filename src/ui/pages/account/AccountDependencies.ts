import type { SignInUseCase } from '@/application/sign-in-use-case'
import type { SignOutUseCase } from '@/application/sign-out-use-case'
import type { ObserveAuthSessionUseCase } from '@/application/observe-auth-session-use-case'
import type { GetCurrentIdentityUseCase } from '@/application/get-current-identity-use-case'
import type { ActivateAccountUseCase } from '@/application/activate-account-use-case'

export interface AccountDependencies {
  readonly activate?: Pick<ActivateAccountUseCase, 'execute'>
  readonly signIn: Pick<SignInUseCase, 'execute'>
  readonly signOut: Pick<SignOutUseCase, 'execute'>
  readonly session: Pick<ObserveAuthSessionUseCase, 'execute' | 'read'>
  readonly identity?: Pick<GetCurrentIdentityUseCase, 'execute'> | null
}

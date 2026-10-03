import type { AuthSession, SignInCredentials } from '@/domain/model/AuthSession'
import type { AccountActivation } from '@/domain/model/AccountActivation'

export interface AuthService {
  activateAccount(activation: AccountActivation): Promise<void>
  signIn(credentials: SignInCredentials): Promise<AuthSession>
  signOut(): Promise<void>
  getSession(): Promise<AuthSession | null>
  subscribe(listener: (session: AuthSession | null) => void): () => void
}

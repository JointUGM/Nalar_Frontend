import type { AuthSession, SignInCredentials } from '@/domain/model/AuthSession'
import type { AccountActivation } from '@/domain/model/AccountActivation'

export interface AuthService {
  activateAccount(activation: AccountActivation): Promise<void>
  requestPasswordReset(email: string): Promise<void>
  // False only when the backend says it sends no reset mail; an unreadable answer counts as available.
  passwordResetEnabled(): Promise<boolean>
  resetPassword(reset: AccountActivation): Promise<void>
  changePassword(current: string, next: string): Promise<void>
  signIn(credentials: SignInCredentials): Promise<AuthSession>
  signOut(): Promise<void>
  getSession(): Promise<AuthSession | null>
  subscribe(listener: (session: AuthSession | null) => void): () => void
}

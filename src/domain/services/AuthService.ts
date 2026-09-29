import type { AuthSession, SignInCredentials } from '@/domain/model/AuthSession'

export interface AuthService {
  signIn(credentials: SignInCredentials): Promise<AuthSession>
  signOut(): Promise<void>
  getSession(): Promise<AuthSession | null>
  // Infrastructure token provider; tokens must not enter UI state or diagnostics.
  getAccessToken(): Promise<string | null>
  subscribe(listener: (session: AuthSession | null) => void): () => void
}

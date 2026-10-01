import type { AuthSession, SignInCredentials } from '@/domain/model/AuthSession'

export interface AuthService {
  signIn(credentials: SignInCredentials): Promise<AuthSession>
  signOut(): Promise<void>
  getSession(): Promise<AuthSession | null>
  subscribe(listener: (session: AuthSession | null) => void): () => void
}

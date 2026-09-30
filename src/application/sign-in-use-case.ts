import type { AuthSession, SignInCredentials } from '@/domain/model/AuthSession'
import { validateSignInCredentials } from '@/domain/model/AuthSession'
import type { AuthService } from '@/domain/services/AuthService'

export class SignInUseCase {
  constructor(private readonly auth: AuthService) {}
  async execute(credentials: SignInCredentials): Promise<AuthSession> {
    return this.auth.signIn(validateSignInCredentials(credentials))
  }
}

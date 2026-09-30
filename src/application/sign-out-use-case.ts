import type { AuthService } from '@/domain/services/AuthService'

export class SignOutUseCase {
  constructor(private readonly auth: AuthService) {}
  async execute(): Promise<void> { return this.auth.signOut() }
}

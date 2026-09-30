import type { AuthSession } from '@/domain/model/AuthSession'
import type { AuthService } from '@/domain/services/AuthService'

export class ObserveAuthSessionUseCase {
  constructor(private readonly auth: AuthService) {}
  async read(): Promise<AuthSession | null> { return this.auth.getSession() }
  execute(listener: (session: AuthSession | null) => void): () => void { return this.auth.subscribe(listener) }
}

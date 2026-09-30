import type { Identity } from '@/domain/model/Identity'
import type { IdentityRepository } from '@/domain/services/IdentityRepository'

export class GetCurrentIdentityUseCase {
  constructor(private readonly repository: IdentityRepository) {}

  execute(signal?: AbortSignal): Promise<Identity> {
    return this.repository.getMe(signal)
  }
}

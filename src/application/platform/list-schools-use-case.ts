import type { PlatformRepository } from '@/domain/services/PlatformRepository'
import type { PlatformOverview } from '@/domain/model/platform/School'

export class ListSchoolsUseCase {
  constructor(private readonly repository: PlatformRepository) {}
  execute(query: string, cursor: string | null): Promise<PlatformOverview> {
    return this.repository.getOverview(query.trim(), cursor)
  }
}

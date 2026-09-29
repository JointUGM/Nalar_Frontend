import type { PlatformRepository } from '@/domain/services/PlatformRepository'
import type { CurriculumCatalog } from '@/domain/model/platform/CurriculumVersion'

export class ListCurriculumVersionsUseCase {
  constructor(private readonly repository: PlatformRepository) {}
  execute(): Promise<CurriculumCatalog> { return this.repository.getCurriculum() }
}

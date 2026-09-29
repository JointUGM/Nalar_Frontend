import type { PlatformOverview } from '@/domain/model/platform/School'
import type { CurriculumCatalog } from '@/domain/model/platform/CurriculumVersion'

export interface PlatformRepository {
  getOverview(): Promise<PlatformOverview>
  getCurriculum(): Promise<CurriculumCatalog>
}

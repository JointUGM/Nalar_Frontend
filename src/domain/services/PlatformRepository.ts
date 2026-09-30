import type { PlatformOverview } from '@/domain/model/platform/School'
import type { CurriculumCatalog } from '@/domain/model/platform/CurriculumVersion'

export interface PlatformRepository {
  getOverview(query: string, cursor: string | null): Promise<PlatformOverview>
  getCurriculum(): Promise<CurriculumCatalog>
}

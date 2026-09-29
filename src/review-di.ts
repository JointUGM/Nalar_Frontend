import { ListSchoolsUseCase } from '@/application/platform/list-schools-use-case'
import { ListCurriculumVersionsUseCase } from '@/application/platform/list-curriculum-versions-use-case'
import { ReferencePlatformRepository } from '@/infrastructure/services/review/ReferencePlatformRepository'

export function createReviewDependencies() {
  const repository = new ReferencePlatformRepository()
  return { listSchools: new ListSchoolsUseCase(repository), listCurriculum: new ListCurriculumVersionsUseCase(repository) }
}

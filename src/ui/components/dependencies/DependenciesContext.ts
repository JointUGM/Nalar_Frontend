import { createContext } from 'react'
import type { ListSchoolsUseCase } from '@/application/platform/list-schools-use-case'
import type { ListCurriculumVersionsUseCase } from '@/application/platform/list-curriculum-versions-use-case'

export interface PlatformDependencies {
  listSchools: Pick<ListSchoolsUseCase, 'execute'>
  listCurriculum: Pick<ListCurriculumVersionsUseCase, 'execute'>
}

export const DependenciesContext = createContext<PlatformDependencies | null>(null)

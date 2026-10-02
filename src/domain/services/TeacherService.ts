import type { ClassMap, Released, ReleasePreview, TeacherPublication } from '@/domain/model/Teacher'

export interface TeacherService {
  publications(signal?: AbortSignal): Promise<TeacherPublication[]>
  classMap(publicationId: string, signal?: AbortSignal): Promise<ClassMap>
  releasePreview(publicationId: string, signal?: AbortSignal): Promise<ReleasePreview>
  release(publicationId: string, expectedEligibleCount: number, signal?: AbortSignal): Promise<Released>
}

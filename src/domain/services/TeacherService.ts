import type { ClassMap, MissionSummary, Published, PublishInput, Released, ReleasePreview, TeacherAssignment, TeacherPublication } from '@/domain/model/Teacher'

export interface TeacherService {
  publications(signal?: AbortSignal): Promise<TeacherPublication[]>
  assignments(signal?: AbortSignal): Promise<TeacherAssignment[]>
  missions(schoolId: string, signal?: AbortSignal): Promise<MissionSummary[]>
  publish(input: PublishInput, signal?: AbortSignal): Promise<Published>
  classMap(publicationId: string, signal?: AbortSignal): Promise<ClassMap>
  releasePreview(publicationId: string, signal?: AbortSignal): Promise<ReleasePreview>
  release(publicationId: string, expectedEligibleCount: number, signal?: AbortSignal): Promise<Released>
}

import { ApiError, resourceId } from '@/domain/model/ApiError'
import { kbMaxUploadBytes } from '@/domain/model/KnowledgeBase'
import type { KbCreateInput, KbItemKind, KbItemPatch, NewConcept, NewMisconception, ReviewStatus } from '@/domain/model/KnowledgeBase'
import type { KnowledgeBaseService } from '@/domain/services/KnowledgeBaseService'

const invalid = (code = 'INVALID_INPUT') => new ApiError(422, code)
// The backend checks the size and the PDF signature again; this only saves sending 50 MB to be refused.
function pdf(file: File): File {
  if (file.size > kbMaxUploadBytes) throw invalid('FILE_TOO_LARGE')
  if (file.size === 0 || !/\.pdf$/i.test(file.name)) throw invalid('FILE_NOT_PDF')
  return file
}
function required(value: string, max: number): string {
  const trimmed = value.trim()
  if (!trimmed || trimmed.length > max) throw invalid()
  return trimmed
}
// Blank lines are dropped, so an empty list is sent as an empty list.
const lines = (values: string[], max: number) => values.map((value) => value.trim()).filter(Boolean).map((value) => required(value, max))

export class KnowledgeBaseUseCases implements KnowledgeBaseService {
  constructor(private readonly service: KnowledgeBaseService) {}
  list(schoolId: string, signal?: AbortSignal) { return this.service.list(resourceId(schoolId), signal) }
  create(schoolId: string, input: KbCreateInput, signal?: AbortSignal) {
    return this.service.create(resourceId(schoolId), { school_subject_id: resourceId(input.school_subject_id), topic_title: required(input.topic_title, 120), file: pdf(input.file) }, signal)
  }
  detail(kbId: string, signal?: AbortSignal) { return this.service.detail(resourceId(kbId), signal) }
  addMaterial(kbId: string, file: File, signal?: AbortSignal) { return this.service.addMaterial(resourceId(kbId), pdf(file), signal) }
  archive(kbId: string, signal?: AbortSignal) { return this.service.archive(resourceId(kbId), signal) }
  archiveConcept(kbId: string, conceptId: string, signal?: AbortSignal) { return this.service.archiveConcept(resourceId(kbId), resourceId(conceptId), signal) }
  deleteMaterial(kbId: string, materialId: string, signal?: AbortSignal) { return this.service.deleteMaterial(resourceId(kbId), resourceId(materialId), signal) }
  materialFile(kbId: string, materialId: string, signal?: AbortSignal) { return this.service.materialFile(resourceId(kbId), resourceId(materialId), signal) }
  sections(kbId: string, signal?: AbortSignal) { return this.service.sections(resourceId(kbId), signal) }
  build(kbId: string, sectionId: string, signal?: AbortSignal) { return this.service.build(resourceId(kbId), resourceId(sectionId), signal) }
  reviewQueue(kbId: string, signal?: AbortSignal) { return this.service.reviewQueue(resourceId(kbId), signal) }
  edit(itemId: string, patch: KbItemPatch, signal?: AbortSignal) {
    if (patch.kind === 'concept') {
      const description = patch.description.trim()
      if (description.length > 2000) throw invalid()
      return this.service.edit(resourceId(itemId), { kind: 'concept', name: required(patch.name, 300), description }, signal)
    }
    return this.service.edit(resourceId(itemId), {
      kind: 'misconception', statement: required(patch.statement, 1000), correct_understanding: required(patch.correct_understanding, 2000),
      detection_cues: lines(patch.detection_cues, 300), counter_examples: lines(patch.counter_examples, 2000),
    }, signal)
  }
  addConcept(kbId: string, concept: NewConcept, idempotencyKey: string, signal?: AbortSignal) {
    const description = concept.description.trim()
    if (description.length > 1000) throw invalid()
    return this.service.addConcept(resourceId(kbId), { name: required(concept.name, 200), description }, resourceId(idempotencyKey), signal)
  }
  addMisconception(kbId: string, conceptId: string, value: NewMisconception, idempotencyKey: string, signal?: AbortSignal) {
    const cues = lines(value.detection_cues, 1000), counters = lines(value.counter_examples, 1000)
    if (cues.length > 30 || counters.length > 30) throw invalid()
    return this.service.addMisconception(resourceId(kbId), resourceId(conceptId), {
      statement: required(value.statement, 1000), correct_understanding: required(value.correct_understanding, 1000), detection_cues: cues, counter_examples: counters,
    }, resourceId(idempotencyKey), signal)
  }
  review(kind: KbItemKind, itemId: string, status: ReviewStatus, signal?: AbortSignal) { return this.service.review(kind, resourceId(itemId), status, signal) }
  job(jobId: string, signal?: AbortSignal) { return this.service.job(resourceId(jobId), signal) }
}

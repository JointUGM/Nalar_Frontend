import type { Job, KbCreateInput, KbDetail, KbItemKind, KbItemPatch, KbQueued, KbReviewQueue, KbSection, KbSummary, NewConcept, NewMisconception, ReviewStatus } from '@/domain/model/KnowledgeBase'
import type { KnowledgeBaseService } from '@/domain/services/KnowledgeBaseService'
import { ApiError } from '@/domain/model/ApiError'
import { allItems, count, flag, instant, list, nullable, record, text } from './HttpApi'
import type { HttpApi } from './HttpApi'
import type { components } from './contracts/backend'

type Schemas = components['schemas']
const kb = (id: string) => `/knowledge-bases/${encodeURIComponent(id)}`
const item = (kind: KbItemKind, id: string) => `/${kind}s/${encodeURIComponent(id)}`
const texts = (value: unknown) => list(value).map((entry) => text(entry))
const sources = (value: unknown) => list(value).map((entry) => { const source = record(entry); return { page_start: count(source.page_start), page_end: count(source.page_end) } })
function queued(data: unknown): KbQueued {
  const value = record(data)
  return { knowledge_base_id: text(value.knowledge_base_id), material_id: text(value.material_id), job_id: text(value.job_id) }
}
function upload(file: File, fields: Record<string, string> = {}): FormData {
  const form = new FormData()
  for (const [name, value] of Object.entries(fields)) form.set(name, value)
  form.set('file', file, file.name)
  return form
}

export class HttpKnowledgeBaseService implements KnowledgeBaseService {
  constructor(private readonly api: HttpApi) {}

  // Up to 500 topics per school (five pages).
  async list(schoolId: string, signal?: AbortSignal): Promise<KbSummary[]> {
    return (await allItems(this.api, `/schools/${encodeURIComponent(schoolId)}/knowledge-bases?limit=100`, signal)).map((entry) => {
      const value = record(entry)
      return {
        id: text(value.id), topic_title: text(value.topic_title), owner_name: nullable(value.owner_name, text), school_subject_id: text(value.school_subject_id), can_edit: flag(value.can_edit),
        material_count: count(value.material_count), built_section_count: count(value.built_section_count), pending_count: count(value.pending_count), approved_concept_count: count(value.approved_concept_count),
      }
    })
  }

  async create(schoolId: string, input: KbCreateInput, signal?: AbortSignal): Promise<KbQueued> {
    const form = upload(input.file, { school_subject_id: input.school_subject_id, topic_title: input.topic_title })
    return queued((await this.api.request(`/schools/${encodeURIComponent(schoolId)}/knowledge-bases`, { method: 'POST', form, idempotent: true, signal })).data)
  }

  async detail(kbId: string, signal?: AbortSignal): Promise<KbDetail> {
    const value = record((await this.api.request(kb(kbId), { signal })).data)
    return {
      id: text(value.id), topic_title: text(value.topic_title), can_edit: flag(value.can_edit),
      materials: list(value.materials).map((entry) => {
        const material = record(entry)
        return { id: text(material.id), title: text(material.title), page_count: nullable(material.page_count, count), pages_without_text: list(material.pages_without_text).map((page) => count(page)), archived_at: nullable(material.archived_at, instant) }
      }),
      concepts: list(value.concepts).map((entry) => {
        const concept = record(entry)
        return { id: text(concept.id), name: text(concept.name), description: nullable(concept.description, text), review_status: text(concept.review_status), sources: sources(concept.sources) }
      }),
      prerequisites: list(value.prerequisites).map((entry) => {
        const link = record(entry)
        return { concept_id: text(link.concept_id), prerequisite_concept_id: text(link.prerequisite_concept_id) }
      }),
      misconceptions: list(value.misconceptions).map((entry) => {
        const misconception = record(entry)
        return {
          id: text(misconception.id), concept_id: text(misconception.concept_id), statement: text(misconception.statement), correct_understanding: text(misconception.correct_understanding),
          detection_cues: texts(misconception.detection_cues), counter_examples: texts(misconception.counter_examples), review_status: text(misconception.review_status), sources: sources(misconception.sources),
        }
      }),
    }
  }

  async addMaterial(kbId: string, file: File, signal?: AbortSignal): Promise<KbQueued> {
    return queued((await this.api.request(`${kb(kbId)}/materials`, { method: 'POST', form: upload(file), idempotent: true, signal })).data)
  }

  async archive(kbId: string, signal?: AbortSignal): Promise<void> {
    await this.api.request(`${kb(kbId)}/archive`, { method: 'POST', signal })
  }

  async archiveConcept(kbId: string, conceptId: string, signal?: AbortSignal): Promise<void> {
    await this.api.request(`${kb(kbId)}/concepts/${encodeURIComponent(conceptId)}/archive`, { method: 'POST', signal })
  }

  async deleteMaterial(kbId: string, materialId: string, signal?: AbortSignal): Promise<void> {
    await this.api.request(`${kb(kbId)}/materials/${encodeURIComponent(materialId)}`, { method: 'DELETE', signal })
  }

  // The link is opened in a new tab, so only an https address is accepted.
  async materialFile(kbId: string, materialId: string, signal?: AbortSignal): Promise<string> {
    const value = record((await this.api.request(`${kb(kbId)}/materials/${encodeURIComponent(materialId)}/file`, { signal })).data)
    const url = text(value.url)
    if (!URL.canParse(url) || new URL(url).protocol !== 'https:') throw new ApiError(502, 'INVALID_RESPONSE')
    return url
  }

  async sections(kbId: string, signal?: AbortSignal): Promise<KbSection[]> {
    const { data } = await this.api.request(`${kb(kbId)}/sections`, { signal })
    return list(record(data).items).map((entry) => {
      const value = record(entry)
      return {
        id: text(value.id), material_id: text(value.material_id), title: text(value.title), level: count(value.level), page_start: count(value.page_start), page_end: count(value.page_end),
        suggested: flag(value.suggested), build_status: text(value.build_status), built_at: nullable(value.built_at, instant),
      }
    })
  }

  async build(kbId: string, sectionId: string, signal?: AbortSignal): Promise<{ job_id: string }> {
    const value = record((await this.api.request(`${kb(kbId)}/sections/${encodeURIComponent(sectionId)}/build`, { method: 'POST', signal })).data)
    return { job_id: text(value.job_id) }
  }

  async reviewQueue(kbId: string, signal?: AbortSignal): Promise<KbReviewQueue> {
    const value = record((await this.api.request(`${kb(kbId)}/review-queue`, { signal })).data)
    return { pending_concepts: count(value.pending_concepts), pending_misconceptions: count(value.pending_misconceptions) }
  }

  async edit(itemId: string, patch: KbItemPatch, signal?: AbortSignal): Promise<void> {
    const body = patch.kind === 'concept'
      ? { name: patch.name, description: patch.description } satisfies Schemas['ConceptPatchIn']
      : { statement: patch.statement, correct_understanding: patch.correct_understanding, detection_cues: patch.detection_cues, counter_examples: patch.counter_examples } satisfies Schemas['MisconceptionPatchIn']
    await this.api.request(item(patch.kind, itemId), { method: 'PATCH', body, signal })
  }

  async addConcept(kbId: string, concept: NewConcept, idempotencyKey: string, signal?: AbortSignal): Promise<{ id: string }> {
    const body: Schemas['ConceptCreateIn'] = { name: concept.name, ...(concept.description ? { description: concept.description } : {}), source_chunk_ids: [] }
    const value = record((await this.api.request(`/knowledge-bases/${encodeURIComponent(kbId)}/concepts`, { method: 'POST', body, headers: { 'Idempotency-Key': idempotencyKey }, signal })).data)
    return { id: text(value.id) } satisfies Pick<Schemas['ConceptOut'], 'id'>
  }

  async addMisconception(kbId: string, conceptId: string, misconception: NewMisconception, idempotencyKey: string, signal?: AbortSignal): Promise<{ id: string }> {
    const body: Schemas['MisconceptionCreateIn'] = { ...misconception, source_chunk_ids: [] }
    const value = record((await this.api.request(`/knowledge-bases/${encodeURIComponent(kbId)}/concepts/${encodeURIComponent(conceptId)}/misconceptions`, { method: 'POST', body, headers: { 'Idempotency-Key': idempotencyKey }, signal })).data)
    return { id: text(value.id) } satisfies Pick<Schemas['MisconceptionOut'], 'id'>
  }

  async review(kind: KbItemKind, itemId: string, status: ReviewStatus, signal?: AbortSignal): Promise<void> {
    const body: Schemas['ReviewIn'] = { review_status: status }
    await this.api.request(`${item(kind, itemId)}/review`, { method: 'POST', body, signal })
  }

  // ponytail: the one job reader, used for uploads, chapter builds and mission drafts; give jobs their own service when a role without a knowledge base needs them.
  async job(jobId: string, signal?: AbortSignal): Promise<Job> {
    const value = record((await this.api.request(`/jobs/${encodeURIComponent(jobId)}`, { signal })).data)
    return {
      id: text(value.id), kind: text(value.kind), status: text(value.status), error_code: nullable(value.error_code, text),
      generation_result: nullable(value.generation_result, (raw) => { const result = record(raw); return { version_number: count(result.version_number), ungrounded_concept_ids: texts(result.ungrounded_concept_ids) } }),
    }
  }
}

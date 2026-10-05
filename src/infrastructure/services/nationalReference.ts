import { ApiError } from '@/domain/model/ApiError'
import type { NationalReference, ReferenceCurriculum, ReferenceDetail, ReferenceReceipt, ReferenceReview, SourceStatement } from '@/domain/model/NationalReference'
import { count, flag, instant, list, nullable, record, text } from './HttpApi'
import type { components } from './contracts/backend'

type Schemas = components['schemas']
function choice<T extends string>(value: unknown, choices: readonly T[]): T {
  const result = text(value)
  if (!choices.includes(result as T)) throw new ApiError(502, 'INVALID_RESPONSE')
  return result as T
}
function statement(value: unknown): SourceStatement {
  const row = record(value)
  return { description: text(row.description), page_start: count(row.page_start), page_end: count(row.page_end) } satisfies Schemas['SourceStatementIn']
}
function curriculum(value: unknown): ReferenceCurriculum {
  const row = record(value)
  return {
    name: text(row.name), decree_code: text(row.decree_code), effective_on: text(row.effective_on), is_current: flag(row.is_current),
    subjects: list(row.subjects).map((value) => {
      const subject = record(value)
      return { name: text(subject.name), phase: choice(subject.phase, ['A', 'B', 'C', 'D', 'E', 'F']), elements: list(subject.elements).map((value) => {
        const element = record(value)
        return { ...statement(element), element: text(element.element), statements: list(element.statements).map(statement) }
      }) }
    }),
  } satisfies Schemas['ReferenceCurriculumIn']
}
function review(value: unknown): ReferenceReview {
  const row = record(value)
  return { curriculum: nullable(row.curriculum, curriculum), selected_pages: row.selected_pages === undefined ? [] : list(row.selected_pages).map(count) } satisfies Schemas['ReferenceReviewDraft']
}
export function referenceSummary(value: unknown): NationalReference {
  const row = record(value)
  return {
    id: text(row.id), kind: choice(row.kind, ['curriculum', 'guidance']), title: text(row.title), issuer: text(row.issuer), source_url: text(row.source_url), sha256: text(row.sha256),
    status: choice(row.status, ['uploading', 'extracting', 'review', 'indexing', 'published', 'failed']), revision: count(row.revision), created_at: instant(row.created_at), published_at: nullable(row.published_at, instant),
    curriculum_version_id: nullable(row.curriculum_version_id, text), job_id: nullable(row.job_id, text), error_code: nullable(row.error_code, text),
  } satisfies Schemas['ReferenceSummaryOut']
}
export function referenceDetail(value: unknown): ReferenceDetail {
  const row = record(value)
  return { ...referenceSummary(row), review: nullable(row.review, review), pages: list(row.pages).map((value) => { const page = record(value); return { page_number: count(page.page_number), text: text(page.text) } }) } satisfies Schemas['ReferenceDetailOut']
}
export function referenceReceipt(value: unknown): ReferenceReceipt {
  const row = record(value)
  return { document_id: text(row.document_id), job_id: text(row.job_id), status: choice(row.status, ['extracting', 'indexing']) } satisfies Schemas['ReferenceQueuedOut']
}

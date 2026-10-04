import { ApiError } from '@/domain/model/ApiError'
import type { AuditPage } from '@/domain/model/Audit'
import type { AdminSetup, AiUsageRow, CurriculumDetail, CurriculumVersion, NewCurriculum, NewSchool, PlatformSchool, SchoolDetails, SchoolsPage } from '@/domain/model/PlatformAdmin'
import { auditPage } from './audit'
import type { PlatformAdminService } from '@/domain/services/PlatformAdminService'
import { count, flag, instant, list, nullable, record, text } from './HttpApi'
import type { HttpApi } from './HttpApi'
import type { components } from './contracts/backend'

type Schemas = components['schemas']
const school = (schoolId: string) => `/platform/schools/${encodeURIComponent(schoolId)}`

function schoolOf(value: unknown): PlatformSchool {
  const item = record(value)
  return { id: text(item.id), name: text(item.name), npsn: nullable(item.npsn, text), city: nullable(item.city, text), status: text(item.status), admin_name: nullable(item.admin_name, text), user_count: count(item.user_count) }
}
const amount = (value: unknown) => { if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) throw new ApiError(502, 'INVALID_RESPONSE'); return value }

function version(value: unknown): CurriculumVersion {
  const item = record(value)
  return { id: text(item.id), name: text(item.name), decree_code: text(item.decree_code), effective_on: text(item.effective_on), published_at: nullable(item.published_at, instant), school_count: count(item.school_count), is_current: flag(item.is_current), status: text(item.status) }
}

export class HttpPlatformAdminService implements PlatformAdminService {
  constructor(private readonly api: HttpApi) {}

  async schools(q: string, cursor: string | null, signal?: AbortSignal): Promise<SchoolsPage> {
    const params = new URLSearchParams({ limit: '50', ...(q ? { q } : {}), ...(cursor ? { cursor } : {}) })
    const value = record((await this.api.request(`/platform/schools?${params}`, { signal })).data)
    return {
      items: list(value.items).map(schoolOf),
      next_cursor: nullable(value.next_cursor, text), total: count(value.total),
      counts: Object.fromEntries(Object.entries(record(value.counts)).map(([key, value]) => [key, count(value)])),
    }
  }

  async updateSchool(schoolId: string, details: SchoolDetails, signal?: AbortSignal): Promise<PlatformSchool> {
    const body: Schemas['SchoolPatchIn'] = details
    return schoolOf((await this.api.request(school(schoolId), { method: 'PATCH', body, signal })).data)
  }

  async aiUsage(from: string, to: string, signal?: AbortSignal): Promise<AiUsageRow[]> {
    return list((await this.api.request(`/platform/ai-usage?${new URLSearchParams({ from, to })}`, { signal })).data).map((entry) => {
      const item = record(entry)
      return { day: text(item.day), school_id: nullable(item.school_id, text), purpose: text(item.purpose), model: text(item.model), calls: count(item.calls), failed_calls: count(item.failed_calls), input_tokens: count(item.input_tokens), output_tokens: count(item.output_tokens), cost_usd: amount(item.cost_usd) } satisfies Schemas['AiUsageOut']
    })
  }

  async auditLog(cursor: number | null, signal?: AbortSignal): Promise<AuditPage> {
    return auditPage((await this.api.request(`/platform/audit-log?limit=50${cursor === null ? '' : `&cursor=${cursor}`}`, { signal })).data)
  }

  async createSchool(details: NewSchool, idempotencyKey: string, signal?: AbortSignal): Promise<AdminSetup> {
    const body: Schemas['SchoolIn'] = details
    const value = record((await this.api.request('/platform/schools', { method: 'POST', body, headers: { 'Idempotency-Key': idempotencyKey }, signal })).data)
    return { pending_activation: flag(value.pending_activation) }
  }

  async setSchoolStatus(schoolId: string, status: 'active' | 'suspended', signal?: AbortSignal): Promise<void> {
    const body: Schemas['SchoolStatusIn'] = { status }
    await this.api.request(`${school(schoolId)}/status`, { method: 'PATCH', body, signal })
  }

  async replaceAdmin(schoolId: string, email: string, idempotencyKey: string, signal?: AbortSignal): Promise<AdminSetup> {
    const body: Schemas['AdminEmailIn'] = { email }
    const value = record((await this.api.request(`${school(schoolId)}/admin`, { method: 'POST', body, headers: { 'Idempotency-Key': idempotencyKey }, signal })).data)
    return { pending_activation: flag(value.pending_activation) }
  }

  async curriculumVersions(signal?: AbortSignal): Promise<CurriculumVersion[]> {
    return list((await this.api.request('/platform/curriculum-versions', { signal })).data).map(version)
  }

  async curriculumVersion(versionId: string, signal?: AbortSignal): Promise<CurriculumDetail> {
    const value = record((await this.api.request(`/platform/curriculum-versions/${encodeURIComponent(versionId)}`, { signal })).data)
    return {
      ...version(value),
      subjects: list(value.subjects).map((entry) => {
        const subject = record(entry)
        return { name: text(subject.name), phase: text(subject.phase), learning_outcomes: list(subject.learning_outcomes).map((outcome) => { const item = record(outcome); return { description: text(item.description), element: nullable(item.element, text) } }) }
      }),
    }
  }

  async publishCurriculum(curriculum: NewCurriculum, idempotencyKey: string, signal?: AbortSignal): Promise<void> {
    const body: Schemas['CurriculumIn'] = { ...curriculum, subjects: curriculum.subjects.map((subject) => ({ ...subject, learning_outcomes: subject.learning_outcomes.map((outcome, ordinal) => ({ ...outcome, ordinal })) })) }
    await this.api.request('/platform/curriculum-versions', { method: 'POST', body, headers: { 'Idempotency-Key': idempotencyKey }, signal })
  }
}

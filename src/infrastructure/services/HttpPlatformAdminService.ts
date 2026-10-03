import type { AdminSetup, CurriculumDetail, CurriculumVersion, NewCurriculum, NewSchool, SchoolsPage } from '@/domain/model/PlatformAdmin'
import type { PlatformAdminService } from '@/domain/services/PlatformAdminService'
import { count, flag, instant, list, nullable, record, text } from './HttpApi'
import type { HttpApi } from './HttpApi'
import type { components } from './contracts/backend'

type Schemas = components['schemas']
const school = (schoolId: string) => `/platform/schools/${encodeURIComponent(schoolId)}`

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
      items: list(value.items).map((entry) => {
        const item = record(entry)
        return { id: text(item.id), name: text(item.name), npsn: nullable(item.npsn, text), city: nullable(item.city, text), status: text(item.status), admin_name: nullable(item.admin_name, text), user_count: count(item.user_count) }
      }),
      next_cursor: nullable(value.next_cursor, text), total: count(value.total),
      counts: Object.fromEntries(Object.entries(record(value.counts)).map(([key, value]) => [key, count(value)])),
    }
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

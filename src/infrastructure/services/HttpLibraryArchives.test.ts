import { describe, expect, it, vi } from 'vitest'
import { publishable, type MissionSummary } from '@/domain/model/Teacher'
import { HttpApi } from './HttpApi'
import { HttpKnowledgeBaseService } from './HttpKnowledgeBaseService'
import { HttpTeacherService } from './HttpTeacherService'

const archivedAt = '2026-10-11T08:00:00Z'
const topic = { id: 'topic', topic_title: 'Gaya', school_subject_id: 'subject', owner_name: 'Sari', material_count: 1, built_section_count: 1, pending_count: 1, approved_concept_count: 2, can_edit: true, archived_at: archivedAt }
const mission = { id: 'mission', title: 'Gerak', knowledge_base_id: 'topic', created_by_name: 'Sari', can_edit: true, archived_at: archivedAt, latest_version: { id: 'version', version_number: 1, status: 'locked' } }
const version = {
  id: 'version', version_number: 1, status: 'locked', can_edit: true, can_revise_with_ai: true, archived_at: archivedAt,
  anchor_problem: 'Mengapa bola melambat?', reference_reasoning: 'Gaya gesek.', rubric: { claim: [], evidence: [], mechanism: [], transfer: [] },
  target_concept_ids: [], misconception_ids: [], source_chunk_ids: [], question_bank: [], answer_terms: [], live_warmup: null, max_turns: 6, max_duration_minutes: 20,
}

describe('teacher library archive projections', () => {
  it.each(['knowledge-bases', 'missions'] as const)('preserves the %s archive filter and signal on every cursor page', async (library) => {
    const entry = library === 'knowledge-bases' ? topic : mission
    const request = vi.fn<typeof fetch>().mockResolvedValueOnce(Response.json({ items: [entry], next_cursor: 'next/page' })).mockResolvedValueOnce(Response.json({ items: [{ ...entry, id: 'second' }], next_cursor: null }))
    const api = new HttpApi({ apiBaseUrl: '/api/v1', fetch: request }), controller = new AbortController()
    const rows = library === 'knowledge-bases'
      ? await new HttpKnowledgeBaseService(api).list('school', controller.signal, 'archived')
      : await new HttpTeacherService(api).missions('school', controller.signal, 'archived')
    expect(request.mock.calls.map(([path]) => path)).toEqual([`/api/v1/schools/school/${library}?limit=100&status=archived`, `/api/v1/schools/school/${library}?limit=100&status=archived&cursor=next%2Fpage`])
    expect(request.mock.calls.every(([, init]) => init?.signal instanceof AbortSignal)).toBe(true)
    expect(rows.map((row) => [row.archived_at, row.can_edit, row.can_restore])).toEqual([[archivedAt, false, true], [archivedAt, false, true]])
    if (library === 'missions') expect(publishable(rows[0] as MissionSummary)).toBe(false)
  })

  it('keeps archived topic and version reads but suppresses stale write capabilities', async () => {
    const request = vi.fn<typeof fetch>().mockResolvedValueOnce(Response.json({ ...topic, materials: [], concepts: [], misconceptions: [], prerequisites: [] })).mockResolvedValueOnce(Response.json(version))
    const api = new HttpApi({ apiBaseUrl: '/api/v1', fetch: request })
    expect(await new HttpKnowledgeBaseService(api).detail('topic')).toMatchObject({ archived_at: archivedAt, can_edit: false })
    expect(await new HttpTeacherService(api).missionVersion('mission', 1)).toMatchObject({ archived_at: archivedAt, can_edit: false, can_revise_with_ai: false })
    expect(request.mock.calls.every(([, init]) => init?.method === 'GET')).toBe(true)
  })

  it('rejects an archive list without archive metadata instead of presenting it as editable', async () => {
    const request = vi.fn<typeof fetch>().mockResolvedValue(Response.json({ items: [{ ...topic, archived_at: null }], next_cursor: null }))
    await expect(new HttpKnowledgeBaseService(new HttpApi({ apiBaseUrl: '/api/v1', fetch: request })).list('school', undefined, 'archived')).rejects.toMatchObject({ code: 'INVALID_RESPONSE' })
  })

  it('restores a topic and a mission with a POST to their restore path', async () => {
    const request = vi.fn<typeof fetch>().mockImplementation(async () => new Response(null, { status: 204 }))
    const api = new HttpApi({ apiBaseUrl: '/api/v1', fetch: request })
    await new HttpKnowledgeBaseService(api).restore('topic')
    await new HttpTeacherService(api).restoreMission('mission')
    expect(request.mock.calls.map(([path, init]) => [path, init?.method])).toEqual([['/api/v1/knowledge-bases/topic/restore', 'POST'], ['/api/v1/missions/mission/restore', 'POST']])
  })
})

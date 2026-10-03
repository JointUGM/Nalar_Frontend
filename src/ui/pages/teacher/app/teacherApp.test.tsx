import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import type { Identity } from '@/domain/model/Identity'
import { KnowledgeBaseUseCases } from '@/application/knowledge-base-use-cases'
import { LiveUseCases } from '@/application/live-use-cases'
import { TeacherUseCases } from '@/application/teacher-use-cases'
import { HttpApi } from '@/infrastructure/services/HttpApi'
import { HttpKnowledgeBaseService } from '@/infrastructure/services/HttpKnowledgeBaseService'
import { HttpLiveService } from '@/infrastructure/services/HttpLiveService'
import { HttpTeacherService } from '@/infrastructure/services/HttpTeacherService'
import { AppRoutes } from '@/ui/routes'
import { ProtectedRole } from '@/ui/pages/account/ProtectedRole'
import type { AccountDependencies } from '@/ui/pages/account/AccountDependencies'
import { TeacherRoutes } from './TeacherRoutes'

const school = '00000000-0000-4000-8000-000000000002'
const publication = '00000000-0000-4000-8000-00000000000a'
const concept = '00000000-0000-4000-8000-00000000000b'
const misconception = '00000000-0000-4000-8000-00000000000c'
const student = '00000000-0000-4000-8000-00000000000d'
const base = `/teacher/${school}`
const identity: Identity = { userId: '00000000-0000-4000-8000-000000000001', fullName: 'Sari Wulandari', isParent: false, isPlatformAdmin: false, memberships: [{ role: 'teacher', schoolId: school, schoolName: 'SMPN 5 Yogyakarta' }] }
const account: AccountDependencies = {
  signIn: { execute: async () => ({ userId: identity.userId, expiresAt: 2000000000 }) },
  signOut: { execute: async () => {} },
  session: { read: async () => ({ userId: identity.userId, expiresAt: 2000000000 }), execute: () => () => {} },
  identity: { execute: async () => identity },
}

const originalShowModal = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'showModal')
const originalClose = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'close')
beforeAll(() => Object.defineProperties(HTMLDialogElement.prototype, {
  // jsdom lacks the native modal API; the real dialog is checked in a browser.
  showModal: { configurable: true, value(this: HTMLDialogElement) { this.open = true } },
  close: { configurable: true, value(this: HTMLDialogElement) { this.open = false } },
}))
afterAll(() => {
  if (originalShowModal) Object.defineProperty(HTMLDialogElement.prototype, 'showModal', originalShowModal)
  else Reflect.deleteProperty(HTMLDialogElement.prototype, 'showModal')
  if (originalClose) Object.defineProperty(HTMLDialogElement.prototype, 'close', originalClose)
  else Reflect.deleteProperty(HTMLDialogElement.prototype, 'close')
})

const publications = { items: [{ id: publication, class_id: school, class_name: '8B', mission_title: 'Kenapa kelereng berhenti?', released_to_parents_at: null, run: { id: school, mode: 'live', status: 'closed', join_code: null, opens_at: null, closes_at: null }, counts: { started: 30, completed: 28, timed_out: 2, evaluated: 28 } }], next_cursor: null }
const classMap = { denominator: 28, incomplete_count: 2, concepts: [{ concept_id: concept, name: 'Gaya gesek', mastered_count: 10, developing_count: 6, not_observed_count: 0, misconceptions: [{ misconception_id: misconception, statement: 'Gaya bisa habis', count: 18, resolved_count: 11, student_ids: [student], students: [{ student_id: student, name: 'Raka Pratama', session_id: student }] }] }], insight: { narrative: 'Sebanyak 18 siswa mengira gaya bisa habis.', generated_at: '2026-10-02T03:00:00+00:00' } }
const mission = '00000000-0000-4000-8000-00000000000e'
const version = '00000000-0000-4000-8000-00000000000f'
const draft = '00000000-0000-4000-8000-000000000010'
const klass = '00000000-0000-4000-8000-000000000011'
const missions = { items: [{ id: mission, title: 'Kenapa kelereng berhenti?', knowledge_base_id: school, created_by: school, can_edit: true, latest_version: { id: version, version_number: 2, status: 'reviewed' } }, { id: draft, title: 'Tekanan Zat', knowledge_base_id: school, created_by: school, can_edit: true, latest_version: { id: draft, version_number: 1, status: 'draft' } }], next_cursor: null }
const assignments = { items: [{ school_id: school, class_id: klass, class_name: '8B', grade_level: 8, school_subject_id: school, subject_name: 'IPA' }] }
const preview = (extra: Record<string, unknown> = {}) => ({ ready: true, blockers: [], eligible_count: 1, ineligible_count: 2, summaries: [{ student_id: student, name: 'Raka Pratama', summary_text: 'Raka mengubah pendapatnya sendiri.' }], released_at: null, ...extra })
const sessionId = '00000000-0000-4000-8000-000000000015'
const scoreId = '00000000-0000-4000-8000-000000000016'
const flagId = '00000000-0000-4000-8000-000000000017'
const turnId = '00000000-0000-4000-8000-000000000018'
const reportPath = `${base}/publications/${publication}/sessions/${sessionId}`
const levels = ['Tidak ada', 'Awal', 'Sebagian', 'Jelas', 'Lengkap']
const reportOut = (extra: Record<string, unknown> = {}) => ({
  student: { id: student, name: 'Raka Pratama' }, mission: { mission_id: mission, title: 'Kenapa kelereng berhenti?', version_number: 2 },
  rubric: { claim: ['Tidak ada klaim', 'Klaim kabur', 'Klaim cukup', 'Klaim jelas', 'Klaim tajam'], evidence: levels, mechanism: levels, transfer: levels },
  session: { status: 'paused_safety', attempt_number: 1, started_at: '2026-10-02T03:00:00Z', ended_at: null, end_reason: null },
  evaluation: { status: 'completed', summary: null },
  scores: [{ score_id: scoreId, dimension: 'claim', ai_level: 2, final_level: 2, rationale: 'Klaim jelas', evidence: [{ turn_id: turnId, quote: 'gaya gesek' }], overrides: [] }],
  concept_results: [{ concept_id: concept, misconception_id: misconception, outcome: 'developing', resolved_in_session: true }],
  flags: [{ id: flagId, flag_type: 'large_paste', severity: 'medium', status: 'open' }],
  turns: [{ turn_id: turnId, turn_index: 0, kind: 'opening', prompt: 'Kenapa kelereng berhenti?', answer: 'Karena gaya gesek.', answer_state: 'accepted', guard_result: null, move: null, move_source: null, reason: null, reason_code: null, safety_paused: false, activity: { paste_chars: 120, away_seconds: 4.5, typing_ms: 30000 } }],
  ...extra,
})
const kbId = '00000000-0000-4000-8000-000000000012'
const job = '00000000-0000-4000-8000-000000000013'
const section = '00000000-0000-4000-8000-000000000014'
const kbPath = `${base}/knowledge-base/${kbId}`
const kbDetail = (conceptStatus = 'pending', can_edit = true) => ({
  id: kbId, topic_title: 'Tekanan Zat', owner_teacher_id: identity.userId, can_edit, prerequisites: [],
  materials: [{ id: school, title: 'IPA Kelas 8.pdf', page_count: 42, pages_without_text: [], archived_at: null }],
  concepts: [{ id: concept, name: 'Tekanan hidrostatis', description: 'Tekanan zat cair bergantung pada kedalaman.', review_status: conceptStatus, cp_learning_outcome_id: null, source_chunk_ids: [], sources: [{ page_start: 3, page_end: 5 }, { page_start: 12, page_end: 12 }] }],
  misconceptions: [{ id: misconception, concept_id: concept, statement: 'Tekanan bergantung pada jumlah air', correct_understanding: 'Tekanan bergantung pada kedalaman.', detection_cues: ['airnya lebih banyak'], counter_examples: ['Dua wadah beda lebar'], review_status: 'pending', source_chunk_ids: [], sources: [] }],
})
const sections = { items: [{ id: section, material_id: school, parent_section_id: null, title: 'Bab 1 Tekanan', level: 1, ordinal: 1, page_start: 1, page_end: 20, suggested: true, build_status: 'pending', built_at: null }] }
const jobOut = (extra: Record<string, unknown> = {}) => ({ id: job, kind: 'kb_detect_sections', status: 'succeeded', entity_type: 'materials', entity_id: school, error_code: null, updated_at: '2026-10-02T03:00:00+00:00', ...extra })
const versionOut = (extra: Record<string, unknown> = {}) => ({
  id: draft, version_number: 1, status: 'draft', can_edit: true, anchor_problem: 'Kenapa kelereng melambat?', reference_reasoning: 'Gaya gesek memperlambat kelereng.',
  rubric: { claim: levels, evidence: levels, mechanism: levels, transfer: levels }, target_concept_ids: [concept], misconception_ids: [misconception], source_chunk_ids: [],
  question_bank: [{ id: 'q1', concept_id: concept, misconception_id: null, move: 'request_justification', text: 'Mengapa menurutmu begitu?' }], answer_terms: ['gaya gesek'], live_warmup: null, max_turns: 6, max_duration_minutes: 20, ...extra,
})
const kbList = { items: [{ id: kbId, topic_key: 'tekanan-zat', topic_title: 'Tekanan Zat', school_subject_id: school, owner_teacher_id: school, material_count: 1, built_section_count: 1, pending_count: 0, approved_concept_count: 2, can_edit: true }], next_cursor: null }

type Reply = () => Response
function backend(overrides: Record<string, Reply> = {}) {
  const routes: Record<string, Reply> = {
    'GET /teacher/publications?limit=100': () => Response.json(publications),
    [`GET /publications/${publication}/class-map`]: () => Response.json(classMap),
    [`GET /publications/${publication}/release-preview`]: () => Response.json(preview()),
    [`GET /schools/${school}/missions?limit=100`]: () => Response.json(missions),
    'GET /teacher/assignments': () => Response.json(assignments),
    [`GET /knowledge-bases/${kbId}`]: () => Response.json(kbDetail()),
    [`GET /knowledge-bases/${kbId}/sections`]: () => Response.json(sections),
    [`GET /knowledge-bases/${kbId}/review-queue`]: () => Response.json({ knowledge_base_id: kbId, pending_concepts: 1, pending_misconceptions: 1 }),
    [`GET /jobs/${job}`]: () => Response.json(jobOut()),
    [`GET /schools/${school}/knowledge-bases?limit=100`]: () => Response.json(kbList),
    [`GET /missions/${draft}/versions/1`]: () => Response.json(versionOut()),
    [`GET /publications/${publication}/monitor`]: () => Response.json({
      run: { id: school, mode: 'live', status: 'open', join_code: 'K7Q2MW', started_at: '2026-10-02T03:00:00Z' }, waiting_count: 1, server_now: '2026-10-02T03:05:00Z',
      students: [
        { student_id: student, name: 'Raka Pratama', status: 'in_progress', current_turn_index: 2, max_turns: 4, deadline_at: null, open_flag_count: 0, safety_paused: true, session_id: sessionId },
        { student_id: klass, name: 'Sinta Dewi', status: 'completed', current_turn_index: 4, max_turns: 4, deadline_at: null, open_flag_count: 1, safety_paused: false },
      ],
    }),
    [`GET /sessions/${sessionId}/report`]: () => Response.json(reportOut()),
    [`GET /teacher/attention?school_id=${school}&limit=50`]: () => Response.json({ next_cursor: null, counts: { safety: 1, flag: 0, kb_review: 1, release_ready: 0, total: 2 }, items: [
      { kind: 'safety', item_id: sessionId, created_at: '2026-10-02T03:10:00Z', session_id: sessionId, publication_id: publication, student_name: 'Raka Pratama', paused_at: '2026-10-02T03:10:00Z' },
      { kind: 'kb_review', item_id: kbId, created_at: '2026-10-02T01:00:00Z', knowledge_base_id: kbId, topic_title: 'Tekanan Zat', pending_concepts: 1, pending_misconceptions: 2 },
      { kind: 'something_new', item_id: kbId, created_at: '2026-10-02T01:00:00Z' },
    ] }),
    [`GET /teacher/dashboard?school_id=${school}`]: () => Response.json({
      as_of: '2026-10-02T05:00:00Z', timezone: 'Asia/Jakarta',
      this_week: { week_start: '2026-09-28T00:00:00+07:00', week_end: '2026-10-05T00:00:00+07:00', sessions_completed: 12, students: 30, active_misconceptions: 5, concepts_with_misconceptions: 2, changed_mind_rate: 0.4, open_flags: 1 },
      last_week: { week_start: '2026-09-21T00:00:00+07:00', week_end: '2026-09-28T00:00:00+07:00', sessions_completed: 10, students: 30, active_misconceptions: 6, concepts_with_misconceptions: 3, changed_mind_rate: null, open_flags: 0 },
      trend: [{ week_start: '2026-09-28T00:00:00+07:00', mastered: 10, developing: 6, misconception: 4 }],
      top_changed: [{ misconception_id: misconception, statement: 'Gaya bisa habis', held: 8, resolved: 5 }],
    }),
    [`GET /teacher/classes/${klass}/students`]: () => Response.json({ publication_id: null, items: [{ student_id: student, full_name: 'Raka Pratama', session_id: sessionId, status: 'completed', completed_at: '2026-10-02T04:00:00Z', evaluation_status: 'completed', open_flag_count: 1, concept_counts: { mastered: 2, developing: 1, misconception: 1 } }] }),
    'POST /publications': () => Response.json({ publication_id: publication, run_id: school, run_status: 'scheduled' }, { status: 201 }),
    ...overrides,
  }
  return vi.fn<typeof fetch>(async (input, init) => {
    const key = `${init?.method ?? 'GET'} ${String(input).replace('/api/v1', '')}`
    const reply = routes[key]
    if (!reply) throw new Error(`Unexpected request ${key}`)
    return reply()
  })
}
function open(path: string, request: typeof fetch) {
  const api = new HttpApi({ apiBaseUrl: '/api/v1', fetch: request })
  const service = new TeacherUseCases(new HttpTeacherService(api))
  const kb = new KnowledgeBaseUseCases(new HttpKnowledgeBaseService(api))
  const live = new LiveUseCases(new HttpLiveService({ apiBaseUrl: '/api/v1', fetch: request }))
  return render(<MemoryRouter initialEntries={[path]}><AppRoutes accountEntry={<h1>Masuk</h1>} privateEntry={<ProtectedRole dependencies={account} renderRole={(verified) => <TeacherRoutes service={service} kb={kb} live={live} identity={verified} />} />} /></MemoryRouter>)
}

describe('signed-in teacher pages', () => {
  it('lists published missions with their counts and links to projector, monitor, class map and release', async () => {
    open(`${base}/sessions`, backend())
    const card = within(await screen.findByRole('listitem', { name: 'Kenapa kelereng berhenti?, kelas 8B' }))
    expect(card.getAllByText('28')).toHaveLength(2)
    for (const [name, page] of [['Proyektor', 'projector'], ['Pantau', 'monitor'], ['Peta kelas', 'class-map'], ['Rilis ke orang tua', 'release']]) expect(card.getByRole('link', { name })).toHaveAttribute('href', `${base}/publications/${publication}/${page}`)
    expect(screen.queryByText('Pratinjau · data contoh')).not.toBeInTheDocument()
  })

  it('shows the class map with the exact counts and the saved explanation', async () => {
    open(`${base}/publications/${publication}/class-map`, backend())
    const row = within((await screen.findByRole('rowheader', { name: '“Gaya bisa habis”' })).closest('tr')!)
    expect(row.getByText('18')).toBeInTheDocument()
    expect(row.getByText('11 dari 18')).toBeInTheDocument()
    expect(screen.getByText('Sebanyak 18 siswa mengira gaya bisa habis.')).toBeInTheDocument()
    expect(screen.getByText('10 paham · 6 berkembang · 0 belum teramati')).toBeInTheDocument()
  })

  it('releases once, with the count the teacher saw, only after confirming', async () => {
    let released: string | null = null
    const request = backend({
      [`GET /publications/${publication}/release-preview`]: () => Response.json(preview({ released_at: released })),
      [`POST /publications/${publication}/release`]: () => { released = '2026-10-02T04:00:00+00:00'; return Response.json({ released_to_parents_at: released, summary_count: 1 }) },
    })
    open(`${base}/publications/${publication}/release`, request)
    fireEvent.click(await screen.findByRole('button', { name: 'Rilis 1 ringkasan' }))
    expect(request.mock.calls.filter(([, init]) => init?.method === 'POST')).toHaveLength(0)
    const confirm = screen.getByRole('button', { name: 'Rilis sekarang' })
    fireEvent.click(confirm)
    fireEvent.click(confirm)
    await screen.findByRole('button', { name: 'Sudah dirilis' })
    const posts = request.mock.calls.filter(([, init]) => init?.method === 'POST')
    expect(posts).toHaveLength(1)
    expect(JSON.parse(String(posts[0][1]?.body))).toEqual({ expected_eligible_count: 1 })
  })

  it('keeps release disabled and says why while something is still pending', async () => {
    open(`${base}/publications/${publication}/release`, backend({ [`GET /publications/${publication}/release-preview`]: () => Response.json(preview({ ready: false, blockers: [{ code: 'EVALUATION_PENDING', count: 3 }] })) }))
    await screen.findByText('3 sesi belum selesai dinilai.')
    await waitFor(() => expect(screen.getByRole('button', { name: 'Rilis 1 ringkasan' })).toBeDisabled())
  })

  it('offers publishing only for a reviewed version', async () => {
    open(`${base}/missions`, backend())
    const ready = within(await screen.findByRole('listitem', { name: 'Kenapa kelereng berhenti?' }))
    expect(ready.getByRole('link', { name: 'Terbitkan ke kelas' })).toHaveAttribute('href', `${base}/missions/${mission}/publish`)
    expect(within(screen.getByRole('listitem', { name: 'Tekanan Zat' })).queryByRole('link', { name: 'Terbitkan ke kelas' })).not.toBeInTheDocument()
  })

  it('publishes a live session to the chosen class once, only after a class is picked and the lock is confirmed', async () => {
    const request = backend()
    open(`${base}/missions/${mission}/publish`, request)
    fireEvent.click(await screen.findByRole('button', { name: 'Terbitkan' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Pilih satu kelas.')
    fireEvent.click(screen.getByRole('button', { name: /8B/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Terbitkan' }))
    const confirm = screen.getByRole('button', { name: 'Terbitkan sekarang' })
    fireEvent.click(confirm)
    fireEvent.click(confirm)
    await waitFor(() => expect(request.mock.calls.filter(([, init]) => init?.method === 'POST')).toHaveLength(1))
    const [, init] = request.mock.calls.find(([, options]) => options?.method === 'POST')!
    expect(JSON.parse(String(init?.body))).toEqual({ class_id: klass, mission_version_id: version, run: { mode: 'live' } })
  })

  it('shows the safety alert first and filters the monitored students by status', async () => {
    open(`${base}/publications/${publication}/monitor`, backend())
    expect(await screen.findByRole('alert')).toHaveTextContent('Raka Pratama mungkin butuh bantuan Anda')
    const done = screen.getByRole('button', { name: /SELESAI/ })
    expect(done).toHaveTextContent('1')
    fireEvent.click(done)
    expect(screen.getByText('Sinta Dewi')).toBeInTheDocument()
    expect(within(screen.getByRole('region', { name: /Siswa/ })).queryByText('Raka Pratama')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Kode K7Q2MW/ })).toHaveAttribute('href', `${base}/publications/${publication}/projector`)
    expect(within(screen.getByRole('alert')).getByRole('link', { name: 'Raka Pratama' })).toHaveAttribute('href', reportPath)
  })

  it('changes a score only with a reason, once, and keeps the AI level beside it', async () => {
    let final = 2
    const request = backend({
      [`GET /sessions/${sessionId}/report`]: () => Response.json(reportOut({ scores: [{ score_id: scoreId, dimension: 'claim', ai_level: 2, final_level: final, rationale: null, evidence: [], overrides: final === 2 ? [] : [{ previous_level: 2, new_level: final, reason: 'Arah gesekan benar', created_at: '2026-10-02T04:00:00Z' }] }] })),
      [`POST /scores/${scoreId}/overrides`]: () => { final = 3; return Response.json({ score_id: scoreId, ai_level: 2, final_level: 3, overridden_at: '2026-10-02T04:00:00Z' }) },
    })
    open(reportPath, request)
    fireEvent.click(await screen.findByRole('button', { name: 'Ubah skor Klaim' }))
    fireEvent.click(screen.getByRole('radio', { name: '3' }))
    const save = screen.getByRole('button', { name: 'Simpan skor' })
    expect(save).toBeDisabled()
    fireEvent.change(screen.getByRole('textbox', { name: /Alasan/ }), { target: { value: ' Arah gesekan benar ' } })
    fireEvent.click(save)
    fireEvent.click(save)
    expect(await screen.findByText(/dari 2 menjadi 3/)).toBeInTheDocument()
    const posts = request.mock.calls.filter(([, init]) => init?.method === 'POST')
    expect(posts).toHaveLength(1)
    expect(JSON.parse(String(posts[0][1]?.body))).toEqual({ final_level: 3, reason: 'Arah gesekan benar' })
  })

  it('shows the rubric meaning and activity, and grants one extra attempt with an idempotency key', async () => {
    const request = backend({
      [`GET /sessions/${sessionId}/report`]: () => Response.json(reportOut({ session: { status: 'completed', attempt_number: 1, started_at: '2026-10-02T03:00:00Z', ended_at: '2026-10-02T03:15:00Z', end_reason: null } })),
      [`POST /publications/${publication}/attempt-grants`]: () => Response.json({ grant_id: school, run_id: school }, { status: 201 }),
    })
    open(reportPath, request)
    expect(await screen.findByText(/Klaim cukup/)).toBeInTheDocument()
    expect(screen.getByText('120 karakter ditempel · 5 detik di luar halaman · 30 detik mengetik')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Beri kesempatan lagi' }))
    fireEvent.change(screen.getByRole('textbox', { name: /Alasan/ }), { target: { value: 'Sakit saat sesi' } })
    const grant = screen.getByRole('button', { name: 'Beri kesempatan' })
    fireEvent.click(grant)
    fireEvent.click(grant)
    expect(await screen.findByText('Kesempatan lagi diberikan', { selector: 'p' })).toBeInTheDocument()
    const posts = request.mock.calls.filter(([, init]) => init?.method === 'POST')
    expect(posts).toHaveLength(1)
    expect(new Headers(posts[0][1]?.headers).get('Idempotency-Key')).toMatch(/^[0-9a-f-]{36}$/)
    expect(JSON.parse(String(posts[0][1]?.body))).toEqual({ student_id: student, reason: 'Sakit saat sesi' })
  })

  it('reviews a flag and resumes a paused session only after confirming', async () => {
    const request = backend({
      [`POST /flags/${flagId}/review`]: () => Response.json({ status: 'cleared', reviewed_at: '2026-10-02T04:00:00Z' }),
      [`POST /sessions/${sessionId}/safety-actions`]: () => Response.json({ session_id: sessionId, status: 'in_progress', acted_at: '2026-10-02T04:00:00Z' }),
    })
    open(reportPath, request)
    fireEvent.click(await screen.findByRole('button', { name: 'Tidak ada masalah' }))
    await waitFor(() => expect(request.mock.calls.some(([url]) => String(url).endsWith('/review'))).toBe(true))
    fireEvent.click(screen.getByRole('button', { name: 'Lanjutkan sesi' }))
    expect(request.mock.calls.some(([url]) => String(url).endsWith('/safety-actions'))).toBe(false)
    const confirm = screen.getAllByRole('button', { name: 'Lanjutkan sesi' }).at(-1)!
    fireEvent.click(confirm)
    await waitFor(() => expect(request.mock.calls.filter(([url]) => String(url).endsWith('/safety-actions'))).toHaveLength(1))
    const bodies = request.mock.calls.filter(([, init]) => init?.method === 'POST').map(([, init]) => JSON.parse(String(init?.body)))
    expect(bodies).toEqual([{ decision: 'cleared', note: null }, { action: 'resume', note: null }])
  })

  it('opens on the weekly dashboard and badges what needs attention, each item linking to where it is handled', async () => {
    open(base, backend())
    expect(await screen.findByText('+2 dari minggu lalu')).toBeInTheDocument()
    expect(screen.getByText('40%')).toBeInTheDocument()
    expect(screen.getByText('“Gaya bisa habis”')).toBeInTheDocument()
    await waitFor(() => expect(screen.getAllByRole('link', { name: /Perlu perhatian/ })[0]).toHaveTextContent('2'))
    fireEvent.click(screen.getAllByRole('link', { name: /Perlu perhatian/ })[0])
    expect(await screen.findByRole('link', { name: /Raka Pratama/ })).toHaveAttribute('href', `${base}/publications/${publication}/sessions/${sessionId}`)
    expect(screen.getByRole('link', { name: /Tekanan Zat/ })).toHaveAttribute('href', `${base}/knowledge-base/${kbId}`)
  })

  it('lists a class with each student’s latest attempt and concept results', async () => {
    open(`${base}/classes`, backend())
    const row = within((await screen.findByRole('rowheader', { name: 'Raka Pratama' })).closest('tr')!)
    expect(row.getByText('Selesai · 1 perlu verifikasi')).toBeInTheDocument()
    expect(row.getByText('2 paham · 1 berkembang · 1 miskonsepsi')).toBeInTheDocument()
  })

  it('uploads a PDF as multipart and follows the reading job on the topic page', async () => {
    const request = backend({ [`POST /schools/${school}/knowledge-bases`]: () => Response.json({ knowledge_base_id: kbId, material_id: school, job_id: job, status: 'queued' }, { status: 202 }) })
    open(`${base}/knowledge-base/upload`, request)
    await screen.findByRole('option', { name: 'IPA' })
    fireEvent.change(screen.getByLabelText(/Nama topik/), { target: { value: ' Tekanan Zat ' } })
    fireEvent.change(screen.getByLabelText(/Berkas PDF/), { target: { files: [new File(['%PDF-1.7'], 'ipa.pdf', { type: 'application/pdf' })] } })
    fireEvent.click(screen.getByRole('button', { name: 'Unggah materi' }))
    expect(await screen.findByText('Materi selesai dibaca')).toBeInTheDocument()
    const form = request.mock.calls.find(([, init]) => init?.method === 'POST')![1]?.body as FormData
    expect([form.get('school_subject_id'), form.get('topic_title'), (form.get('file') as File).name]).toEqual([school, 'Tekanan Zat', 'ipa.pdf'])
  })

  it('approves the concept before its misconception, sending the decision once', async () => {
    let status = 'pending'
    const request = backend({
      [`GET /knowledge-bases/${kbId}`]: () => Response.json(kbDetail(status)),
      [`POST /concepts/${concept}/review`]: () => { status = 'approved'; return Response.json({ id: concept, review_status: status, reviewed_at: '2026-10-02T04:00:00+00:00' }) },
    })
    open(kbPath, request)
    const approve = within(await screen.findByRole('region', { name: 'Konsep: Tekanan hidrostatis' })).getByRole('button', { name: 'Setujui' })
    const misconceptionCard = within(screen.getByRole('region', { name: /^Miskonsepsi:/ }))
    expect(misconceptionCard.getByRole('button', { name: 'Setujui' })).toBeDisabled()
    fireEvent.click(approve)
    fireEvent.click(approve)
    await waitFor(() => expect(misconceptionCard.getByRole('button', { name: 'Setujui' })).toBeEnabled())
    const posts = request.mock.calls.filter(([, init]) => init?.method === 'POST')
    expect(posts).toHaveLength(1)
    expect(JSON.parse(String(posts[0][1]?.body))).toEqual({ review_status: 'approved' })
  })

  it('saves an edited misconception with one cue per line and blank lines dropped', async () => {
    const request = backend({ [`PATCH /misconceptions/${misconception}`]: () => Response.json({}) })
    open(kbPath, request)
    expect(await screen.findByText('Sumber: hlm. 3–5, 12')).toBeInTheDocument()
    const card = within(await screen.findByRole('region', { name: /^Miskonsepsi:/ }))
    fireEvent.click(card.getByRole('button', { name: 'Edit' }))
    fireEvent.change(card.getByLabelText(/Contoh ucapan siswa/), { target: { value: 'airnya lebih banyak\n\n  wadahnya besar ' } })
    fireEvent.click(card.getByRole('button', { name: 'Simpan' }))
    await waitFor(() => expect(request.mock.calls.some(([, init]) => init?.method === 'PATCH')).toBe(true))
    expect(JSON.parse(String(request.mock.calls.find(([, init]) => init?.method === 'PATCH')![1]?.body))).toEqual({
      statement: 'Tekanan bergantung pada jumlah air', correct_understanding: 'Tekanan bergantung pada kedalaman.',
      detection_cues: ['airnya lebih banyak', 'wadahnya besar'], counter_examples: ['Dua wadah beda lebar'],
    })
  })

  it('builds a chapter once and says why its job failed', async () => {
    const request = backend({
      [`POST /knowledge-bases/${kbId}/sections/${section}/build`]: () => Response.json({ job_id: job, section_id: section, status: 'queued' }, { status: 202 }),
      [`GET /jobs/${job}`]: () => Response.json(jobOut({ kind: 'kb_build_section', status: 'failed', error_code: 'SECTION_HAS_NO_TEXT' })),
    })
    open(kbPath, request)
    const build = await screen.findByRole('button', { name: 'Susun Bab 1 Tekanan' })
    fireEvent.click(build)
    fireEvent.click(build)
    expect(await screen.findByText('Bab gagal disusun')).toBeInTheDocument()
    expect(screen.getByText(/tidak punya teks/)).toBeInTheDocument()
    expect(request.mock.calls.filter(([, init]) => init?.method === 'POST')).toHaveLength(1)
  })

  it('shows a colleague’s knowledge base without any way to change it', async () => {
    open(kbPath, backend({ [`GET /knowledge-bases/${kbId}`]: () => Response.json(kbDetail('pending', false)) }))
    await screen.findByText(/milik rekan guru/)
    for (const name of ['Setujui', 'Tolak', 'Edit', 'Susun Bab 1 Tekanan']) expect(screen.queryByRole('button', { name })).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/Tambah materi/)).not.toBeInTheDocument()
  })

  it('creates a mission once, asks for its draft and opens the generated version', async () => {
    const request = backend({
      'POST /missions': () => Response.json({ mission_id: draft }, { status: 201 }),
      [`POST /missions/${draft}/generate`]: () => Response.json({ job_id: job, status: 'queued' }, { status: 202 }),
      [`GET /jobs/${job}`]: () => Response.json(jobOut({ kind: 'mission_generate', generation_result: { version_id: draft, version_number: 1, ungrounded_concept_ids: [] } })),
    })
    open(`${base}/missions/new`, request)
    await screen.findByRole('option', { name: /Tekanan Zat/ })
    fireEvent.change(screen.getByLabelText(/Judul misi/), { target: { value: ' Tekanan Zat ' } })
    fireEvent.change(screen.getByLabelText(/Tujuan pembelajaran/), { target: { value: 'Siswa menjelaskan tekanan hidrostatis.' } })
    const create = screen.getByRole('button', { name: 'Buat misi' })
    fireEvent.click(create)
    fireEvent.click(create)
    expect(await screen.findByText('Draf misi selesai disusun')).toBeInTheDocument()
    expect(await screen.findByText('Kenapa kelereng melambat?')).toBeInTheDocument()
    const posts = request.mock.calls.filter(([, init]) => init?.method === 'POST')
    expect(posts.map(([url]) => String(url))).toEqual(['/api/v1/missions', `/api/v1/missions/${draft}/generate`])
    expect(JSON.parse(String(posts[0][1]?.body))).toEqual({ knowledge_base_id: kbId, title: 'Tekanan Zat', learning_objective: 'Siswa menjelaskan tekanan hidrostatis.' })
  })

  it('saves an edit as a new version that carries the rest of the draft over', async () => {
    const request = backend({
      [`POST /missions/${draft}/versions`]: () => Response.json({ version_id: version, version_number: 2, status: 'draft' }, { status: 201 }),
      [`GET /missions/${draft}/versions/2`]: () => Response.json(versionOut({ id: version, version_number: 2, anchor_problem: 'Kenapa bola melambat?' })),
    })
    open(`${base}/missions/${draft}`, request)
    fireEvent.click(await screen.findByRole('button', { name: 'Edit soal dan acuan' }))
    fireEvent.change(screen.getByLabelText(/Soal pembuka ·/), { target: { value: ' Kenapa bola melambat? ' } })
    fireEvent.click(screen.getByRole('button', { name: 'Simpan sebagai versi baru' }))
    await screen.findByText(/Anda melihat versi 2/)
    const body = JSON.parse(String(request.mock.calls.find(([, init]) => init?.method === 'POST')![1]?.body))
    expect(body).toMatchObject({ base_version_id: draft, anchor_problem: 'Kenapa bola melambat?', reference_reasoning: 'Gaya gesek memperlambat kelereng.', target_concept_ids: [concept], misconception_ids: [misconception], max_turns: 6, max_duration_minutes: 20 })
    expect(body.question_bank).toEqual(versionOut().question_bank)
  })

  it('says which rules a draft breaks when it cannot be marked as reviewed', async () => {
    open(`${base}/missions/${draft}`, backend({
      [`POST /missions/${draft}/versions/1/review`]: () => Response.json({ error: { code: 'MISSION_VERSION_INVALID', message: 'rahasia', details: { problems: [{ code: 'ITEM_NOT_APPROVED', detail: concept }] } }, request_id: 'r' }, { status: 422 }),
    }))
    fireEvent.click(await screen.findByRole('button', { name: 'Tandai sudah ditinjau' }))
    expect(await screen.findByText('Versi ini belum bisa dipakai.')).toBeInTheDocument()
    expect(screen.getByText(/belum disetujui di basis pengetahuan/)).toBeInTheDocument()
    expect(screen.queryByText('rahasia')).not.toBeInTheDocument()
  })
})

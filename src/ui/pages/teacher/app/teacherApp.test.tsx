import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import type { Identity } from '@/domain/model/Identity'
import { TeacherUseCases } from '@/application/teacher-use-cases'
import { HttpApi } from '@/infrastructure/services/HttpApi'
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
const classMap = { denominator: 28, incomplete_count: 2, concepts: [{ concept_id: concept, name: 'Gaya gesek', mastered_count: 10, developing_count: 6, not_observed_count: 0, misconceptions: [{ misconception_id: misconception, statement: 'Gaya bisa habis', count: 18, resolved_count: 11, student_ids: [student] }] }], insight: { narrative: 'Sebanyak 18 siswa mengira gaya bisa habis.', generated_at: '2026-10-02T03:00:00+00:00' } }
const mission = '00000000-0000-4000-8000-00000000000e'
const version = '00000000-0000-4000-8000-00000000000f'
const draft = '00000000-0000-4000-8000-000000000010'
const klass = '00000000-0000-4000-8000-000000000011'
const missions = { items: [{ id: mission, title: 'Kenapa kelereng berhenti?', knowledge_base_id: school, created_by: school, can_edit: true, latest_version: { id: version, version_number: 2, status: 'reviewed' } }, { id: draft, title: 'Tekanan Zat', knowledge_base_id: school, created_by: school, can_edit: true, latest_version: { id: draft, version_number: 1, status: 'draft' } }], next_cursor: null }
const assignments = { items: [{ school_id: school, class_id: klass, class_name: '8B', grade_level: 8, school_subject_id: school, subject_name: 'IPA' }] }
const preview = (extra: Record<string, unknown> = {}) => ({ ready: true, blockers: [], eligible_count: 1, ineligible_count: 2, summaries: [{ student_id: student, name: 'Raka Pratama', summary_text: 'Raka mengubah pendapatnya sendiri.' }], released_at: null, ...extra })

type Reply = () => Response
function backend(overrides: Record<string, Reply> = {}) {
  const routes: Record<string, Reply> = {
    'GET /teacher/publications?limit=100': () => Response.json(publications),
    [`GET /publications/${publication}/class-map`]: () => Response.json(classMap),
    [`GET /publications/${publication}/release-preview`]: () => Response.json(preview()),
    [`GET /schools/${school}/missions?limit=100`]: () => Response.json(missions),
    'GET /teacher/assignments': () => Response.json(assignments),
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
  const service = new TeacherUseCases(new HttpTeacherService(new HttpApi({ apiBaseUrl: '/api/v1', fetch: request })))
  return render(<MemoryRouter initialEntries={[path]}><AppRoutes accountEntry={<h1>Masuk</h1>} privateEntry={<ProtectedRole dependencies={account} renderRole={(verified) => <TeacherRoutes service={service} identity={verified} />} />} /></MemoryRouter>)
}

describe('signed-in teacher pages', () => {
  it('lists published missions with their counts and links to projector, monitor, class map and release', async () => {
    open(base, backend())
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
    expect(within(screen.getByRole('listitem', { name: 'Tekanan Zat' })).queryByRole('link')).not.toBeInTheDocument()
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
})

import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, describe, expect, it } from 'vitest'
import { LiveError } from '@/domain/model/Live'
import type { LiveAnswer, LiveJoin, LiveLobby, LiveMonitor, LivePublications, LiveReflection, LiveState } from '@/domain/model/Live'
import type { LiveService } from '@/domain/services/LiveService'
import { LiveStudentSession } from './LiveStudentSession'

const initial: LiveState = { status: 'awaiting_answer', turn_index: 0, probe_number: 0, probe_total: 3, started_at: '2026-10-02T00:00:00Z', deadline_at: '2026-10-02T00:15:00Z', server_now: '2026-10-02T00:01:00Z', prompt: { kind: 'opening', text: 'Jelaskan alasanmu.', turn_index: 0 }, safety_message: null, reflection_ready: false }

class FakeLiveService implements LiveService {
  current = { ...initial }
  answers: LiveAnswer[] = []
  state = async () => this.current
  answer = async (_id: string, answer: LiveAnswer) => {
    this.answers.push(answer)
    if (this.answers.length === 1) throw new LiveError(0, 'UNAVAILABLE')
    this.current = { ...this.current, status: 'processing', prompt: null }
  }
  async join(): Promise<LiveJoin> { throw new Error('Unexpected join') }
  async lobby(): Promise<LiveLobby> { throw new Error('Unexpected lobby') }
  async warmup() { throw new Error('Unexpected warmup') }
  async reflection(): Promise<LiveReflection | null> { throw new Error('Unexpected reflection') }
  async publications(): Promise<LivePublications> { throw new Error('Unexpected publications') }
  async monitor(): Promise<LiveMonitor> { throw new Error('Unexpected monitor') }
  async control() { throw new Error('Unexpected control') }
}
const renderSession = (service: FakeLiveService) => render(<MemoryRouter><LiveStudentSession service={service} sessionId="session-id" base="/student/school-id" /></MemoryRouter>)
afterEach(cleanup)

describe('student live session', () => {
  it('keeps the draft and retries an uncertain answer with the same submission id', async () => {
    const service = new FakeLiveService()
    renderSession(service)
    const field = await screen.findByRole('textbox', { name: 'Jawabanmu' })
    await waitFor(() => expect(field).not.toHaveAttribute('readonly'))
    fireEvent.change(field, { target: { value: 'Karena ada gaya gesek.' } })
    fireEvent.click(screen.getByRole('button', { name: 'Kirim' }))
    await screen.findByText('Pembaruan belum berhasil. Periksa koneksi dan coba lagi.')
    expect(field).toHaveValue('Karena ada gaya gesek.')
    await waitFor(() => expect(screen.getByRole('button', { name: 'Kirim' })).toBeEnabled())
    fireEvent.click(screen.getByRole('button', { name: 'Kirim' }))
    await screen.findByText('Jawabanmu diterima. NALAR sedang berpikir…')
    expect(service.answers).toHaveLength(2)
    expect(service.answers[1]).toEqual(service.answers[0])
  })

  it('locks input at the server deadline even when the lab clock is earlier', async () => {
    const service = new FakeLiveService()
    service.current = { ...initial, deadline_at: '2026-10-02T00:00:30Z' }
    renderSession(service)
    await screen.findByText('Waktu habis. Memeriksa sesi…')
    expect(screen.getByRole('textbox', { name: 'Jawabanmu' })).toHaveAttribute('readonly')
    expect(screen.getByRole('button', { name: 'Kirim' })).toBeDisabled()
    expect(service.answers).toHaveLength(0)
  })

  it('shows the backend safety message without offering a student resume action', async () => {
    const service = new FakeLiveService()
    service.current = { ...initial, status: 'paused_safety', prompt: null, safety_message: 'Kamu boleh berhenti sejenak. Hubungi gurumu.' }
    renderSession(service)
    await screen.findByText('Kamu boleh berhenti sejenak. Hubungi gurumu.')
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /lanjut|resume/i })).not.toBeInTheDocument()
    await act(async () => {})
  })
})

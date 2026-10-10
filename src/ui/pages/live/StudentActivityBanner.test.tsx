import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import type { StudentActivityNotice } from '@/domain/model/Live'
import { StudentActivityBanner } from './StudentActivityBanner'

const own: StudentActivityNotice = { id: 'first', kind: 'own_words', message: 'Jelaskan alasanmu dengan kata-katamu sendiri.', created_at: '2026-10-10T03:42:00Z' }
const stay: StudentActivityNotice = { id: 'tab', kind: 'stay_on_page', message: 'Tetap di halaman ini saat mengerjakan.', created_at: '2026-10-10T03:43:00Z' }
const dismiss = () => screen.queryByRole('button', { name: 'Mengerti' })
afterEach(cleanup)

describe('student activity banner', () => {
  it('renders nothing when there are no notices', () => {
    render(<StudentActivityBanner notices={[]} />)
    expect(dismiss()).not.toBeInTheDocument()
  })

  it('keeps a dismissed notice hidden across polls but shows a new ID', () => {
    const view = render(<StudentActivityBanner notices={[own]} />)
    fireEvent.click(screen.getByRole('button', { name: 'Mengerti' }))
    view.rerender(<StudentActivityBanner notices={[{ ...own }]} />)
    expect(dismiss()).not.toBeInTheDocument()
    view.rerender(<StudentActivityBanner notices={[{ ...own, id: 'second' }]} />)
    expect(dismiss()).toBeInTheDocument()
  })

  it('groups both kinds under their own titles and dismisses them together', () => {
    render(<StudentActivityBanner notices={[own, stay]} />)
    expect(screen.getByRole('heading', { name: 'Tetap gunakan kata-katamu sendiri' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Tetap di halaman misi' })).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Mengerti' })).toHaveLength(1)
    fireEvent.click(screen.getByRole('button', { name: 'Mengerti' }))
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })

  it('drops a notice the backend no longer sends', () => {
    const view = render(<StudentActivityBanner notices={[own]} />)
    view.rerender(<StudentActivityBanner notices={[]} />)
    expect(dismiss()).not.toBeInTheDocument()
  })

  it('starts fresh for another session', () => {
    const view = render(<StudentActivityBanner key="a" notices={[own]} />)
    fireEvent.click(screen.getByRole('button', { name: 'Mengerti' }))
    view.rerender(<StudentActivityBanner key="b" notices={[own]} />)
    expect(dismiss()).toBeInTheDocument()
  })
})

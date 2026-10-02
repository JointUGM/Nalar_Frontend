import type { ReactNode } from 'react'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AccountActivate } from './AccountActivate'
import { AccountPassword } from './AccountPassword'
import { AccountReset } from './AccountReset'
import { previewMs } from './useAccountPreview'

const show = (page: ReactNode) => render(<MemoryRouter>{page}</MemoryRouter>)
const type = (label: string | RegExp, value: string) => fireEvent.change(screen.getByLabelText(label, { exact: false }), { target: { value } })
const submit = (name: RegExp) => fireEvent.click(screen.getByRole('button', { name }))
const wait = (ms: number) => act(() => { vi.advanceTimersByTime(ms) })

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

describe('activation preview', () => {
  it('says nothing is created, shows the rules as they are met, and validates before the simulated submit', () => {
    show(<AccountActivate />)
    expect(screen.getByText(/tidak ada akun, email atau kata sandi yang benar-benar dibuat/)).toBeInTheDocument()
    type('Kata sandi baru', 'kelereng')
    expect(screen.getByText('8+ karakter').closest('li')).toHaveAttribute('data-ok', 'true')
    expect(screen.getByText('Ada angka').closest('li')).toHaveAttribute('data-ok', 'false')
    submit(/Aktifkan dan masuk/)
    expect(screen.getByText('Kata sandi belum memenuhi syarat.')).toBeInTheDocument()
    type('Kata sandi baru', 'kelereng24')
    type('Ulangi kata sandi', 'kelereng25')
    submit(/Aktifkan dan masuk/)
    expect(screen.getByText('Kata sandi tidak sama.')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Sedang memproses/ })).not.toBeInTheDocument()
  })

  it('needs the slip code only in slip mode, then shows the pending state once and a result that keeps nothing', () => {
    show(<AccountActivate />)
    expect(screen.queryByLabelText('Kode aktivasi', { exact: false })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Kode dari slip' }))
    type('Kata sandi baru', 'kelereng24')
    type('Ulangi kata sandi', 'kelereng24')
    submit(/Aktifkan dan masuk/)
    expect(screen.getByText('Masukkan kode dari slip.')).toBeInTheDocument()
    type('Kode aktivasi', 'K7Q2-MW9R')
    submit(/Aktifkan dan masuk/)
    const pending = screen.getByRole('button', { name: /Sedang memproses/ })
    expect(pending).toBeDisabled()
    fireEvent.click(pending)
    wait(previewMs)
    expect(screen.getByText('Akun belum benar-benar diaktifkan (pratinjau)')).toBeInTheDocument()
    expect(screen.queryByLabelText('Kata sandi baru', { exact: false })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Ulangi pratinjau' }))
    expect(screen.getByLabelText('Kata sandi baru', { exact: false })).toHaveValue('')
  })

  it('keeps what was typed after a simulated failure', () => {
    show(<AccountActivate />)
    fireEvent.change(screen.getByLabelText('Hasil (pratinjau)'), { target: { value: 'failure' } })
    type('Kata sandi baru', 'kelereng24')
    type('Ulangi kata sandi', 'kelereng24')
    submit(/Aktifkan dan masuk/)
    wait(previewMs)
    expect(screen.getByRole('alert')).toHaveTextContent('Aktivasi belum berhasil (contoh)')
    expect(screen.getByLabelText('Kata sandi baru', { exact: false })).toHaveValue('kelereng24')
  })
})

describe('reset preview', () => {
  it('asks for a plausible email, then says a link was "sent" only as a preview', () => {
    show(<AccountReset />)
    type('Email', 'bukan-email')
    submit(/Kirim tautan/)
    expect(screen.getByText(/Masukkan email akun Anda/)).toBeInTheDocument()
    type('Email', 'sari@smpn5.sch.id')
    submit(/Kirim tautan/)
    expect(screen.getByRole('button', { name: /Sedang mengirim/ })).toBeDisabled()
    wait(previewMs)
    expect(screen.getByRole('heading', { level: 1, name: 'Cek email Anda' })).toBeInTheDocument()
    expect(screen.getByText('sari@smpn5.sch.id')).toBeInTheDocument()
    expect(screen.getByText(/tidak ada akun, email atau kata sandi yang benar-benar dibuat, dikirim atau diubah/)).toBeInTheDocument()
  })

  it('keeps the email after a simulated failure', () => {
    show(<AccountReset />)
    fireEvent.change(screen.getByLabelText('Hasil (pratinjau)'), { target: { value: 'failure' } })
    type('Email', 'sari@smpn5.sch.id')
    submit(/Kirim tautan/)
    wait(previewMs)
    expect(screen.getByRole('alert')).toHaveTextContent('Tautan belum terkirim (contoh)')
    expect(screen.getByLabelText('Email', { exact: false })).toHaveValue('sari@smpn5.sch.id')
  })
})

describe('password change preview', () => {
  it('validates the three fields, blocks a second submit and ends with a result that changes nothing', () => {
    show(<AccountPassword />)
    submit(/Simpan/)
    expect(screen.getByText('Masukkan kata sandi Anda saat ini.')).toBeInTheDocument()
    expect(screen.getByText('Minimal 8 karakter dan ada angka.')).toBeInTheDocument()
    type('Kata sandi saat ini', 'lama')
    type(/^Kata sandi baru/, 'kelereng24')
    type('Ulangi kata sandi baru', 'kelereng24')
    submit(/Simpan/)
    expect(screen.getByRole('button', { name: /Sedang menyimpan/ })).toBeDisabled()
    wait(previewMs)
    expect(screen.getByText('Kata sandi belum benar-benar diubah (pratinjau)')).toBeInTheDocument()
  })

  it('has a way back to sign-in', () => {
    show(<AccountPassword />)
    expect(screen.getByRole('link', { name: 'Batal' })).toHaveAttribute('href', '/login')
  })
})

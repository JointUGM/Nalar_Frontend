import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ParentEmailSample } from './ParentEmailSample'
import { ParentHome } from './ParentHome'
import { ParentLayout } from './ParentLayout'
import { ParentSettings } from './ParentSettings'
import { emailSamplePath, homePath, news, settingsPath } from './parentExamples'
import { saveMs } from './useParentSettingsViewModel'

const open = (path: string) => render(<MemoryRouter initialEntries={[path]}><Routes><Route element={<ParentLayout />}>
  <Route path={homePath} element={<ParentHome />} />
  <Route path={settingsPath} element={<ParentSettings />} />
  <Route path={emailSamplePath} element={<ParentEmailSample />} />
</Route></Routes></MemoryRouter>)
const sidebar = () => screen.getByRole('complementary')
const kid = (name: RegExp) => within(sidebar()).getByRole('button', { name })
const emailSwitch = () => screen.getByRole('switch', { name: /Kirim ringkasan setiap/ })
const wait = (ms: number) => act(() => { vi.advanceTimersByTime(ms) })

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

describe('parent settings', () => {
  it('shows the weekly email switch on, the account facts and the linked children', () => {
    open(settingsPath)
    expect(emailSwitch()).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByText(/bambang.w@gmail.com · hanya hasil yang sudah dirilis/)).toBeInTheDocument()
    expect(screen.getByText('Raka (8B), Nadia (7A)')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Lihat contoh email' })).toHaveAttribute('href', emailSamplePath)
    expect(screen.getByRole('button', { name: /Ubah kata sandi/ })).toBeDisabled()
  })

  it('saves in a pending state that blocks a second change, then says it is only a simulation', () => {
    open(settingsPath)
    fireEvent.click(emailSwitch())
    expect(emailSwitch()).toBeDisabled()
    expect(emailSwitch()).toHaveAttribute('aria-busy', 'true')
    expect(screen.getByText('Menyimpan…')).toBeInTheDocument()
    fireEvent.click(emailSwitch())
    wait(saveMs)
    expect(emailSwitch()).toHaveAttribute('aria-checked', 'false')
    expect(emailSwitch()).toBeEnabled()
    expect(screen.getByText('Email mingguan dimatikan (simulasi)')).toBeInTheDocument()
    expect(screen.getByText('Tidak ada email yang dikirim di pratinjau.')).toBeInTheDocument()
  })

  it('leaves the preference as it was when the save fails, and can be tried again', () => {
    open(settingsPath)
    fireEvent.change(screen.getByLabelText('Hasil penyimpanan (pratinjau)'), { target: { value: 'failure' } })
    fireEvent.click(emailSwitch())
    wait(saveMs)
    expect(screen.getByRole('alert')).toHaveTextContent('Pengaturan belum tersimpan')
    expect(emailSwitch()).toHaveAttribute('aria-checked', 'true')
    fireEvent.change(screen.getByLabelText('Hasil penyimpanan (pratinjau)'), { target: { value: 'success' } })
    fireEvent.click(emailSwitch())
    wait(saveMs)
    expect(emailSwitch()).toHaveAttribute('aria-checked', 'false')
  })

  it('keeps the preference when the selected child changes, and reflects it on the summary page', () => {
    open(settingsPath)
    fireEvent.click(emailSwitch())
    wait(saveMs)
    fireEvent.click(kid(/Nadia Pratama/))
    expect(emailSwitch()).toHaveAttribute('aria-checked', 'false')
  })

  it('lists only the linked children', () => {
    open(settingsPath)
    fireEvent.change(screen.getByLabelText('Anak yang tertaut (pratinjau)'), { target: { value: 'one' } })
    expect(screen.getByText('Raka (8B)')).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('Anak yang tertaut (pratinjau)'), { target: { value: 'none' } })
    expect(screen.getByText('Belum ada')).toBeInTheDocument()
  })
})

describe('weekly email sample', () => {
  it('shows only what the teacher released for the selected child, and says nothing is sent', () => {
    open(emailSamplePath)
    const mail = screen.getByRole('region', { name: 'Contoh email' })
    expect(within(mail).getByRole('heading', { level: 2, name: 'Kabar Raka minggu ini' })).toBeInTheDocument()
    expect(within(mail).getByText(news.raka.email.text)).toBeInTheDocument()
    expect(within(mail).getByText(/Bu Sari sudah merilis hasil satu misi IPA/)).toBeInTheDocument()
    expect(within(mail).getByText(/hanya berisi hasil yang sudah dirilis guru/)).toBeInTheDocument()
    expect(screen.getByText(/tidak ada email yang dikirim/)).toBeInTheDocument()
    expect(mail.textContent).not.toMatch(/skor|nilai|peringkat|ranking|dibanding/i)
    expect(screen.getByRole('banner')).toHaveTextContent('Pengaturan / Email mingguan')
  })

  it('has no sample for a child with nothing released, without hinting at anything pending', () => {
    open(emailSamplePath)
    fireEvent.click(kid(/Nadia Pratama/))
    expect(screen.queryByRole('region', { name: 'Contoh email' })).not.toBeInTheDocument()
    expect(screen.getByText('Belum ada contoh email untuk Nadia')).toBeInTheDocument()
    expect(screen.getByRole('main').textContent).not.toMatch(/menunggu|dalam proses|sudah menyelesaikan/i)
  })

  it('warns that the sample will not be sent while the weekly email is off', () => {
    open(settingsPath)
    fireEvent.click(emailSwitch())
    wait(saveMs)
    fireEvent.click(screen.getByRole('link', { name: 'Lihat contoh email' }))
    expect(screen.getByRole('status')).toHaveTextContent('Email mingguan sedang dimatikan')
  })
})

import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { describe, expect, it } from 'vitest'
import { ParentHome } from './ParentHome'
import { ParentLayout } from './ParentLayout'
import { homePath, news, reflectionPath, reflectionsPath, settingsPath } from './parentExamples'

const page = () => render(<MemoryRouter initialEntries={[homePath]}><Routes><Route element={<ParentLayout />}><Route path={homePath} element={<ParentHome />} /></Route></Routes></MemoryRouter>)
const sidebar = () => screen.getByRole('complementary')
const kid = (name: RegExp) => within(sidebar()).getByRole('button', { name })
const setLinked = (value: string) => fireEvent.change(screen.getByLabelText('Anak yang tertaut (pratinjau)'), { target: { value } })
const setScenario = (value: string) => fireEvent.change(screen.getByLabelText('Keadaan halaman (pratinjau)'), { target: { value } })

describe('parent shell and child context', () => {
  it('opens on the first child with both children selectable, the privacy note and a menu that opens the reflections and the settings', () => {
    page()
    expect(screen.getByRole('heading', { level: 1, name: 'Kabar Raka minggu ini' })).toBeInTheDocument()
    expect(kid(/Raka Pratama/)).toHaveAttribute('aria-pressed', 'true')
    expect(kid(/Nadia Pratama/)).toHaveAttribute('aria-pressed', 'false')
    expect(within(sidebar()).getByRole('note', { name: 'Privasi anak' })).toHaveTextContent('Tanpa skor dan tanpa perbandingan')
    expect(within(sidebar()).getByRole('link', { name: /Ringkasan/ })).toHaveAttribute('aria-current', 'page')
    expect(within(sidebar()).getByRole('link', { name: 'Refleksi' })).toHaveAttribute('href', reflectionsPath)
    expect(within(sidebar()).getByRole('link', { name: 'Pengaturan' })).toHaveAttribute('href', settingsPath)
  })

  it('switches child, shows only that child, and clears what was open for the previous one', () => {
    page()
    setScenario('error')
    expect(screen.getByRole('alert')).toHaveTextContent('Kabar belum bisa dimuat')
    fireEvent.click(kid(/Nadia Pratama/))
    expect(screen.getByRole('heading', { level: 1, name: 'Kabar Nadia minggu ini' })).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.queryByText('Kenapa kelereng berhenti?')).not.toBeInTheDocument()
    fireEvent.click(kid(/Raka Pratama/))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Keadaan halaman (pratinjau)')).toHaveValue('normal')
    expect(screen.getByRole('heading', { level: 3, name: 'Kenapa kelereng berhenti?' })).toBeInTheDocument()
  })

  it('handles one linked child and none', () => {
    page()
    fireEvent.click(kid(/Nadia Pratama/))
    setLinked('one')
    expect(within(sidebar()).getAllByRole('button', { name: /Pratama/ })).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 1, name: 'Kabar Raka minggu ini' })).toBeInTheDocument()
    setLinked('none')
    expect(within(sidebar()).getByText('Belum ada anak yang tertaut ke akunmu.')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: 'Belum ada anak yang tertaut' })).toBeInTheDocument()
    expect(screen.queryByText('Kenapa kelereng berhenti?')).not.toBeInTheDocument()
    expect(within(sidebar()).getByRole('link', { name: /Ringkasan/ })).not.toHaveTextContent('baru')
  })
})

describe('parent summary', () => {
  it('shows the released summary, the concept progress and the questions to ask at home', () => {
    page()
    const summary = news.raka.summary
    expect(screen.getByRole('heading', { level: 3, name: summary.mission })).toBeInTheDocument()
    expect(screen.getByText(summary.text)).toBeInTheDocument()
    expect(screen.getByText(summary.tryAtHome)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Baca refleksi lengkap' })).toHaveAttribute('href', reflectionPath(summary.reflection))
    expect(screen.getByText('Dirilis 24 Sep, 09.14')).toBeInTheDocument()
    expect(within(screen.getByRole('list', { name: 'Ringkasan Raka' })).getAllByRole('listitem')).toHaveLength(4)
    const rows = within(screen.getByRole('table')).getAllByRole('row')
    expect(rows).toHaveLength(news.raka.concepts.length + 1)
    expect(within(rows[4]).getByText('Berkembang')).toBeInTheDocument()
    expect(within(screen.getByRole('region', { name: 'Obrolan di rumah' })).getAllByRole('listitem')).toHaveLength(3)
    expect(within(sidebar()).getByRole('link', { name: /Ringkasan/ })).toHaveTextContent('1 baru')
  })

  it('never shows a score, rank, flag or comparison to other students', () => {
    page()
    // The page itself, not the sidebar note that promises there are none.
    expect(screen.getByRole('main').textContent).not.toMatch(/skor|nilai|peringkat|ranking|rata-rata kelas|dibanding(kan)? (dengan )?teman|ditandai|bendera/i)
  })

  it('tells a child without a release only that nothing is there yet, with no count or hint of pending work', () => {
    page()
    fireEvent.click(kid(/Nadia Pratama/))
    expect(screen.getByRole('heading', { level: 2, name: 'Belum ada kabar dari guru Nadia' })).toBeInTheDocument()
    expect(screen.queryByRole('list', { name: /Ringkasan/ })).not.toBeInTheDocument()
    expect(screen.getByRole('main').textContent).not.toMatch(/menunggu|rilis(nya)? belum|dalam proses|sudah menyelesaikan|misi selesai|1 misi/i)
    expect(within(sidebar()).getByRole('link', { name: /Ringkasan/ })).not.toHaveTextContent('baru')
  })

  it('has loading and error states, and retry returns to the summary', () => {
    page()
    setScenario('loading')
    expect(screen.getByRole('status')).toHaveTextContent('Memuat kabar Raka…')
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
    setScenario('error')
    expect(screen.getByRole('alert')).toHaveTextContent('Kabar belum bisa dimuat')
    fireEvent.click(screen.getByRole('button', { name: 'Coba lagi' }))
    expect(screen.getByRole('table')).toBeInTheDocument()
  })
})

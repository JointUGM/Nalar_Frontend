import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { TeacherContextProvider } from '@/ui/components/teacher-shell/TeacherContextProvider'
import { attentionItems, reviewedEarlier } from './teacherAttentionExamples'
import { teacherSchools } from './teacherHomeExamples'
import { generatedMissionId, missionsPath } from './teacherMissionExamples'
import { monitorExample, studentNames } from './teacherSessionExamples'
import { TeacherAttention } from './TeacherAttention'

const schools = teacherSchools.map((item) => item.name)
const page = () => render(<MemoryRouter><TeacherContextProvider schools={schools}><TeacherAttention /></TeacherContextProvider></MemoryRouter>)
const stat = (label: string) => within(screen.getByRole('list', { name: 'Ringkasan catatan' })).getByText(new RegExp(`^\\d+ ${label}$`))
const list = () => within(screen.getByRole('list', { name: 'Daftar catatan' })).getAllByRole('button')
const detail = () => within(screen.getByRole('region', { name: 'Detail catatan' }))

describe('attention example data', () => {
  it('uses the monitor\'s paused and flagged students, so both screens agree', () => {
    const named = (kind: string) => attentionItems.filter((item) => item.kind === kind).map((item) => item.name)
    expect(named('safety')).toEqual([studentNames[monitorExample.pausedIndex]])
    expect(named('flag')).toEqual(expect.arrayContaining(monitorExample.flaggedIndexes.map((index) => studentNames[index])))
    expect(attentionItems.every((item) => item.evidence.length > 0 && item.note)).toBe(true)
  })
})

describe('attention page', () => {
  it('counts open notes by kind, lists them newest first and shows the first one in detail', () => {
    page()
    expect(stat('Keselamatan')).toHaveTextContent('1')
    expect(stat('Perlu verifikasi')).toHaveTextContent('3')
    expect(stat('Menunggu persetujuan')).toHaveTextContent('1')
    expect(stat('Sudah ditinjau')).toHaveTextContent(String(reviewedEarlier))
    expect(list()).toHaveLength(attentionItems.length)
    expect(detail().getByRole('heading', { name: 'Citra Maharani' })).toBeInTheDocument()
    expect(detail().getByRole('button', { name: 'Sudah saya tangani' })).toBeInTheDocument()
  })

  it('filters by kind and by search, and changes the detail on selection', () => {
    page()
    fireEvent.click(screen.getByRole('button', { name: 'Verifikasi (3)' }))
    expect(list()).toHaveLength(3)
    fireEvent.change(screen.getByRole('searchbox', { name: 'Cari catatan' }), { target: { value: 'pindah tab' } })
    expect(list()).toHaveLength(1)
    expect(detail().getByRole('heading', { name: 'Raka Pratama' })).toBeInTheDocument()
    expect(detail().getByRole('link', { name: 'Buka laporan' })).toHaveAttribute('href', `${missionsPath}/${generatedMissionId}/class-map/report?kelas=8B`)
    fireEvent.change(screen.getByRole('searchbox', { name: 'Cari catatan' }), { target: { value: 'zzz' } })
    expect(screen.getByText('Tidak ada catatan yang cocok.')).toBeInTheDocument()
    fireEvent.change(screen.getByRole('searchbox', { name: 'Cari catatan' }), { target: { value: '' } })
    fireEvent.click(list()[0])
    expect(detail().getByRole('button', { name: 'Buka laporan' })).toBeDisabled()
  })

  it('moves a decided note to reviewed, announces it, keeps scores untouched, and can bring it back', () => {
    page()
    fireEvent.click(screen.getByRole('button', { name: 'Verifikasi (3)' }))
    fireEvent.click(list()[0])
    fireEvent.click(detail().getByRole('button', { name: 'Tidak ada masalah' }))
    expect(screen.getAllByRole('status').at(-1)).toHaveTextContent('Joko Susilo: tidak ada masalah. Dipindahkan ke Sudah ditinjau.')
    expect(list()).toHaveLength(2)
    expect(stat('Perlu verifikasi')).toHaveTextContent('2')
    expect(stat('Sudah ditinjau')).toHaveTextContent(String(reviewedEarlier + 1))
    fireEvent.click(screen.getByRole('button', { name: `Sudah ditinjau (${reviewedEarlier + 1})` }))
    expect(list()).toHaveLength(1)
    expect(detail().getByText(/Ditinjau: tidak ada masalah\. Hanya catatan Anda di pratinjau ini/)).toBeInTheDocument()
    fireEvent.click(detail().getByRole('button', { name: 'Kembalikan ke daftar' }))
    expect(stat('Perlu verifikasi')).toHaveTextContent('3')
    expect(screen.getByText(/Belum ada keputusan di halaman ini/)).toBeInTheDocument()
  })

  it('handles the safety note without calling it a verification, and links the draft to its review', () => {
    page()
    fireEvent.click(detail().getByRole('button', { name: 'Sudah saya tangani' }))
    expect(stat('Keselamatan')).toHaveTextContent('0')
    expect(screen.getAllByRole('status').at(-1)).toHaveTextContent('Citra Maharani: sudah ditangani')
    fireEvent.click(screen.getByRole('button', { name: 'Persetujuan (1)' }))
    expect(detail().getByRole('link', { name: 'Tinjau sekarang' })).toHaveAttribute('href', '/review/teacher/knowledge-base/tekanan-zat')
  })
})

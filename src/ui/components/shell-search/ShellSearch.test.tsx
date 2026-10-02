import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router'
import { describe, expect, it } from 'vitest'
import { ShellSearch } from './ShellSearch'

const targets = [{ label: 'Kelas', hint: 'Halaman', to: '/kelas' }, { label: 'Tarik tambang', hint: 'Misi · Gaya', to: '/misi' }]
const Where = () => <p>di {useLocation().pathname}</p>
const view = () => render(<MemoryRouter><ShellSearch className="" label="Cari" placeholder="Cari…" targets={targets} /><Routes><Route path="*" element={<Where />} /></Routes></MemoryRouter>)

describe('ShellSearch', () => {
  it('filters targets and opens the first match on Enter', () => {
    view()
    const input = screen.getByRole('searchbox', { name: 'Cari' })
    fireEvent.change(input, { target: { value: 'tarik' } })
    expect(screen.getByRole('button', { name: /Tarik tambang/ })).toBeTruthy()
    expect(screen.queryByRole('button', { name: /Kelas/ })).toBeNull()
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(screen.getByText('di /misi')).toBeTruthy()
  })

  it('says so when nothing matches', () => {
    view()
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'zzz' } })
    expect(screen.getByText(/Tidak ada hasil/)).toBeTruthy()
  })
})

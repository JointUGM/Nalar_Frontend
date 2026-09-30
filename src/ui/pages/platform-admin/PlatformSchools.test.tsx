import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import type { PlatformOverview } from '@/domain/model/platform/School'
import type { PlatformDependencies } from '@/ui/components/dependencies/DependenciesContext'
import { DependenciesProvider } from '@/ui/components/dependencies/DependenciesProvider'
import { PlatformSchools } from './PlatformSchools'

const overview: PlatformOverview = {
  schools: [
    { id: 'a', name: 'Sekolah Yogyakarta', city: 'Yogyakarta', npsn: '12345678', admin: 'Admin A', users: 12, status: 'active' },
    { id: 'b', name: 'Sekolah Sleman', city: 'Sleman', npsn: '87654321', admin: 'Admin B', users: 24, status: 'invited' },
  ],
  summary: { activeSchools: 14, users: 9900, curriculum: '046/2025' },
  nextCursor: null,
}

const originalShowModal = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'showModal')
const originalClose = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'close')
beforeAll(() => {
  Object.defineProperties(HTMLDialogElement.prototype, {
    showModal: { configurable: true, value(this: HTMLDialogElement) { this.open = true } },
    close: { configurable: true, value(this: HTMLDialogElement) { this.open = false } },
  })
})
afterAll(() => {
  if (originalShowModal) Object.defineProperty(HTMLDialogElement.prototype, 'showModal', originalShowModal)
  else Reflect.deleteProperty(HTMLDialogElement.prototype, 'showModal')
  if (originalClose) Object.defineProperty(HTMLDialogElement.prototype, 'close', originalClose)
  else Reflect.deleteProperty(HTMLDialogElement.prototype, 'close')
})

function Fixture({ listSchools }: { listSchools: PlatformDependencies['listSchools'] }) {
  return <MemoryRouter><DependenciesProvider value={{ listSchools, listCurriculum: { execute: async () => ({ versions: [], reference: null }) } }}><PlatformSchools /></DependenciesProvider></MemoryRouter>
}

describe('PlatformSchools', () => {
  it('opens the selected school action, blocks unavailable writes and restores focus to its menu action', async () => {
    const user = userEvent.setup()
    render(<Fixture listSchools={{ execute: async () => overview }} />)
    await screen.findByText('Sekolah Sleman')
    await user.click(screen.getByRole('button', { name: 'Tindakan Sekolah Sleman' }))
    const trigger = screen.getByRole('button', { name: 'Ganti admin sekolah' })
    await user.click(trigger)
    expect(screen.getByRole('dialog', { name: 'Ganti admin Sekolah Sleman' })).toHaveTextContent('Admin B akan kehilangan akses admin')
    expect(screen.getByRole('button', { name: 'Ganti admin' })).toBeDisabled()
    await user.click(screen.getByRole('button', { name: 'Batal' }))
    expect(trigger).toHaveFocus()
  })
  it('sends search to the read and keeps supplied platform totals', async () => {
    const user = userEvent.setup()
    const calls: Array<[string, string | null]> = []
    render(<Fixture listSchools={{ execute: async (query, cursor) => {
      calls.push([query, cursor])
      return { ...overview, schools: query ? [overview.schools[1]] : overview.schools }
    } }} />)
    expect(await screen.findByText('Sekolah Yogyakarta')).toBeInTheDocument()
    await user.type(screen.getByRole('textbox', { name: 'Cari sekolah' }), 'Sleman')
    expect(await screen.findByText('Sekolah Sleman')).toBeInTheDocument()
    expect(screen.queryByText('Sekolah Yogyakarta')).not.toBeInTheDocument()
    expect(screen.getByText('9.900')).toBeInTheDocument()
    expect(calls.at(-1)).toEqual(['Sleman', null])
  })

  it('resets a stale cursor on search and discards the old page response', async () => {
    const user = userEvent.setup()
    let resolveOld!: (value: PlatformOverview) => void
    const calls: Array<[string, string | null]> = []
    render(<Fixture listSchools={{ execute: (query, cursor) => {
      calls.push([query, cursor])
      if (cursor) return new Promise<PlatformOverview>((resolve) => { resolveOld = resolve })
      return Promise.resolve(query
        ? { ...overview, schools: [overview.schools[1]] }
        : { ...overview, schools: [overview.schools[0]], nextCursor: 'page-2' })
    } }} />)
    expect(await screen.findByText('Sekolah Yogyakarta')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Halaman berikutnya' }))
    expect(calls.at(-1)).toEqual(['', 'page-2'])
    await user.type(screen.getByRole('textbox', { name: 'Cari sekolah' }), 'Sleman')
    expect(await screen.findByText('Sekolah Sleman')).toBeInTheDocument()
    expect(calls.at(-1)).toEqual(['Sleman', null])
    await act(async () => { resolveOld({ ...overview, schools: [overview.schools[0]], nextCursor: null }) })
    expect(screen.queryByText('Sekolah Yogyakarta')).not.toBeInTheDocument()
  })

  it('ignores an old repository response when its dependency context changes', async () => {
    let resolveOld!: (value: PlatformOverview) => void
    const old = { execute: () => new Promise<PlatformOverview>((resolve) => { resolveOld = resolve }) }
    const { rerender } = render(<Fixture listSchools={old} />)
    rerender(<Fixture listSchools={{ execute: async () => ({ ...overview, schools: [overview.schools[1]] }) }} />)
    expect(await screen.findByText('Sekolah Sleman')).toBeInTheDocument()
    await act(async () => { resolveOld(overview) })
    expect(screen.queryByText('Sekolah Yogyakarta')).not.toBeInTheDocument()
  })

  it('provides retry after a failed read without displaying invented school data', async () => {
    const user = userEvent.setup()
    let attempts = 0
    render(<Fixture listSchools={{ execute: async () => { if (++attempts === 1) throw new Error('private response body'); return overview } }} />)
    expect(await screen.findByRole('alert')).not.toHaveTextContent('private response body')
    expect(screen.queryByText('Sekolah Yogyakarta')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Coba lagi' }))
    expect(await screen.findByText('Sekolah Yogyakarta')).toBeInTheDocument()
  })
})

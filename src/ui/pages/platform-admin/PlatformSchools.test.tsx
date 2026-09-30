import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { OperationError } from '@/domain/model/OperationError'
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
    const dialog = screen.getByRole('dialog', { name: 'Ganti admin Sekolah Sleman' })
    expect(dialog).toHaveTextContent('Admin B akan kehilangan akses admin')
    expect(within(dialog).getByRole('button', { name: 'Ganti admin' })).toBeDisabled()
    await user.click(within(dialog).getByRole('button', { name: 'Batal' }))
    expect(trigger).toHaveFocus()
  })

  it('closes a school action menu with Escape while keeping keyboard focus', async () => {
    const user = userEvent.setup()
    render(<Fixture listSchools={{ execute: async () => overview }} />)
    const menu = await screen.findByRole('button', { name: 'Tindakan Sekolah Sleman' })
    menu.focus()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('button', { name: 'Ganti admin sekolah' })).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('button', { name: 'Ganti admin sekolah' })).not.toBeInTheDocument()
    expect(menu).toHaveFocus()
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

  it('hides school data and retry when the read is denied', async () => {
    render(<Fixture listSchools={{ execute: async () => { throw new OperationError('forbidden', { requestId: 'req-denied' }) } }} />)
    expect(await screen.findByRole('heading', { name: 'Akses tidak tersedia' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Coba lagi' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Daftarkan sekolah' })).not.toBeInTheDocument()
    expect(screen.queryByText('Sekolah aktif')).not.toBeInTheDocument()
    expect(screen.queryByText('Sekolah Yogyakarta')).not.toBeInTheDocument()
  })

  it('lets an empty search return to the full school list', async () => {
    const user = userEvent.setup()
    render(<Fixture listSchools={{ execute: async (query) => query ? { ...overview, schools: [] } : overview }} />)
    expect(await screen.findByText('Sekolah Yogyakarta')).toBeInTheDocument()
    await user.type(screen.getByRole('textbox', { name: 'Cari sekolah' }), 'tidak-ada')
    expect(await screen.findByText('Tidak ada sekolah yang cocok dengan pencarian ini.')).toBeInTheDocument()
    expect(screen.queryByRole('table', { name: 'Metadata sekolah pada halaman ini' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Hapus pencarian' }))
    expect(await screen.findByText('Sekolah Yogyakarta')).toBeInTheDocument()
  })

  it('opens reversible suspension modal for an active school and restores focus on cancellation', async () => {
    const user = userEvent.setup()
    render(<Fixture listSchools={{ execute: async () => overview }} />)
    await screen.findByText('Sekolah Yogyakarta')
    await user.click(screen.getByRole('button', { name: 'Tindakan Sekolah Yogyakarta' }))
    const trigger = screen.getByRole('button', { name: 'Tangguhkan' })
    await user.click(trigger)
    const dialog = screen.getByRole('dialog', { name: 'Tangguhkan Sekolah Yogyakarta?' })
    expect(dialog).toHaveTextContent('Penangguhan bersifat sementara. Data sekolah tetap tersimpan.')
    expect(screen.getByRole('textbox', { name: 'Alasan' })).toBeInTheDocument()
    expect(within(dialog).getByRole('button', { name: 'Tangguhkan' })).toBeDisabled()
    await user.click(within(dialog).getByRole('button', { name: 'Batal' }))
    expect(trigger).toHaveFocus()
  })

  it('opens reactivation modal for a suspended school and presents explicit activation text', async () => {
    const user = userEvent.setup()
    const suspendedOverview: PlatformOverview = {
      ...overview,
      schools: [{ id: 'c', name: 'Sekolah Bandung', city: 'Bandung', npsn: '11223344', admin: 'Admin C', users: 5, status: 'suspended' }],
    }
    render(<Fixture listSchools={{ execute: async () => suspendedOverview }} />)
    await screen.findByText('Sekolah Bandung')
    await user.click(screen.getByRole('button', { name: 'Tindakan Sekolah Bandung' }))
    const trigger = screen.getByRole('button', { name: 'Aktifkan kembali' })
    await user.click(trigger)
    const dialog = screen.getByRole('dialog', { name: 'Aktifkan kembali Sekolah Bandung?' })
    expect(dialog).toHaveTextContent('Pengaktifan kembali memulihkan akses administrasi dan kelas sekolah.')
    expect(within(dialog).getByRole('button', { name: 'Aktifkan kembali' })).toBeDisabled()
    await user.click(within(dialog).getByRole('button', { name: 'Batal' }))
    expect(trigger).toHaveFocus()
  })
})

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

function Fixture({ listSchools, entry = '/review/platform/schools' }: { listSchools: PlatformDependencies['listSchools']; entry?: string }) {
  return <MemoryRouter initialEntries={[entry]}><DependenciesProvider value={{ listSchools, listCurriculum: { execute: async () => ({ versions: [], reference: null }) } }}><PlatformSchools /></DependenciesProvider></MemoryRouter>
}

describe('PlatformSchools', () => {
  it('retains onboarding edits and focuses the first invalid field', async () => {
    const user = userEvent.setup()
    render(<Fixture listSchools={{ execute: async () => overview }} />)
    await user.click(screen.getByRole('button', { name: 'Daftarkan sekolah' }))
    const dialog = screen.getByRole('dialog', { name: 'Daftarkan sekolah' })
    const name = within(dialog).getByRole('textbox', { name: 'Nama sekolah' })
    await user.click(within(dialog).getByRole('button', { name: 'Simulasikan undangan' }))
    expect(name).toHaveAttribute('aria-invalid', 'true')
    expect(name).toHaveFocus()
    await user.type(name, 'Sekolah Contoh')
    await user.type(within(dialog).getByRole('textbox', { name: 'NPSN' }), '00123456')
    const email = within(dialog).getByRole('textbox', { name: 'Email admin sekolah pertama' })
    await user.type(email, 'invalid')
    await user.click(within(dialog).getByRole('button', { name: 'Simulasikan undangan' }))
    expect(email).toHaveAttribute('aria-invalid', 'true')
    expect(email).toHaveFocus()
    expect(name).toHaveValue('Sekolah Contoh')
    expect(within(dialog).getByRole('textbox', { name: 'NPSN' })).toHaveValue('00123456')
  })

  it('blocks repeated confirmation while pending and shows a simulated summary', async () => {
    const user = userEvent.setup()
    render(<Fixture listSchools={{ execute: async () => overview }} />)
    const trigger = screen.getByRole('button', { name: 'Daftarkan sekolah' })
    await user.click(trigger)
    const dialog = screen.getByRole('dialog', { name: 'Daftarkan sekolah' })
    await user.type(within(dialog).getByRole('textbox', { name: 'Nama sekolah' }), 'Sekolah Contoh')
    await user.type(within(dialog).getByRole('textbox', { name: 'NPSN' }), '00123456')
    await user.type(within(dialog).getByRole('textbox', { name: 'Email admin sekolah pertama' }), 'operator@example.test')
    await user.dblClick(within(dialog).getByRole('button', { name: 'Simulasikan undangan' }))
    expect(within(dialog).getByRole('button', { name: /Menyiapkan simulasi/ })).toBeDisabled()
    expect(within(dialog).getByRole('textbox', { name: 'Nama sekolah' })).toBeDisabled()
    expect(await within(dialog).findByText('Simulasi pendaftaran selesai')).toBeInTheDocument()
    expect(dialog).toHaveTextContent('Sekolah Contoh')
    expect(dialog).toHaveTextContent('00123456')
    expect(dialog).toHaveTextContent('operator@example.test')
    await user.click(within(dialog).getByRole('button', { name: 'Selesai' }))
    expect(trigger).toHaveFocus()
    await user.click(trigger)
    expect(screen.getByRole('textbox', { name: 'Nama sekolah' })).toHaveValue('')
  })

  it('retains inputs after simulated failure and supports cancellation during retry', async () => {
    const user = userEvent.setup()
    render(<Fixture entry='/review/platform/schools?onboarding=failure' listSchools={{ execute: async () => overview }} />)
    const trigger = screen.getByRole('button', { name: 'Daftarkan sekolah' })
    await user.click(trigger)
    const dialog = screen.getByRole('dialog', { name: 'Daftarkan sekolah' })
    await user.type(within(dialog).getByRole('textbox', { name: 'Nama sekolah' }), 'Sekolah Contoh')
    await user.type(within(dialog).getByRole('textbox', { name: 'NPSN' }), '00123456')
    await user.type(within(dialog).getByRole('textbox', { name: 'Email admin sekolah pertama' }), 'operator@example.test')
    await user.click(within(dialog).getByRole('button', { name: 'Simulasikan undangan' }))
    expect(await within(dialog).findByRole('alert')).toHaveTextContent('Simulasi belum berhasil')
    expect(within(dialog).getByRole('textbox', { name: 'Nama sekolah' })).toHaveValue('Sekolah Contoh')
    expect(within(dialog).getByRole('textbox', { name: 'NPSN' })).toHaveValue('00123456')
    expect(within(dialog).getByRole('textbox', { name: 'Email admin sekolah pertama' })).toHaveValue('operator@example.test')
    await user.click(within(dialog).getByRole('button', { name: 'Coba lagi' }))
    await user.click(within(dialog).getByRole('button', { name: 'Batal' }))
    expect(trigger).toHaveFocus()
    await user.click(trigger)
    expect(screen.getByRole('textbox', { name: 'Nama sekolah' })).toHaveValue('')
  })

  it('validates the selected school handoff and restores focus without leaking edits to another school', async () => {
    const user = userEvent.setup()
    render(<Fixture listSchools={{ execute: async () => overview }} />)
    await screen.findByText('Sekolah Sleman')
    await user.click(screen.getByRole('button', { name: 'Tindakan Sekolah Sleman' }))
    const trigger = screen.getByRole('button', { name: 'Ganti admin sekolah' })
    await user.click(trigger)
    const dialog = screen.getByRole('dialog', { name: 'Ganti admin Sekolah Sleman' })
    expect(dialog).toHaveTextContent('Admin saat ini')
    expect(dialog).toHaveTextContent('Admin B')
    expect(dialog).not.toHaveTextContent('akan kehilangan akses admin')
    const email = within(dialog).getByRole('textbox', { name: 'Email admin baru' })
    await user.click(within(dialog).getByRole('button', { name: 'Tinjau penggantian' }))
    expect(email).toHaveFocus()
    expect(email).toHaveAttribute('aria-invalid', 'true')
    await user.type(email, 'invalid')
    await user.click(within(dialog).getByRole('button', { name: 'Tinjau penggantian' }))
    expect(email).toHaveAttribute('aria-invalid', 'true')
    expect(email).toHaveValue('invalid')
    await user.click(screen.getByRole('button', { name: 'Batal' }))
    expect(trigger).toHaveFocus()
    await user.click(screen.getByRole('button', { name: 'Tindakan Sekolah Yogyakarta' }))
    await user.click(screen.getByRole('button', { name: 'Ganti admin sekolah' }))
    const next = screen.getByRole('dialog', { name: 'Ganti admin Sekolah Yogyakarta' })
    expect(next).toHaveTextContent('Admin A')
    expect(next).not.toHaveTextContent('Admin B')
    expect(within(next).getByRole('textbox', { name: 'Email admin baru' })).toHaveValue('')
  })

  it('reviews the handoff, retains edits and blocks duplicate simulated confirmation without changing school data', async () => {
    const user = userEvent.setup()
    render(<Fixture listSchools={{ execute: async () => overview }} />)
    await user.click(await screen.findByRole('button', { name: 'Tindakan Sekolah Sleman' }))
    await user.click(screen.getByRole('button', { name: 'Ganti admin sekolah' }))
    const dialog = screen.getByRole('dialog', { name: 'Ganti admin Sekolah Sleman' })
    await user.type(within(dialog).getByRole('textbox', { name: 'Email admin baru' }), 'operator@example.test')
    await user.click(within(dialog).getByRole('button', { name: 'Tinjau penggantian' }))
    expect(within(dialog).getByRole('heading', { name: 'Konfirmasi penggantian admin' })).toHaveFocus()
    expect(dialog).toHaveTextContent('operator@example.test')
    await user.click(within(dialog).getByRole('button', { name: 'Ubah email' }))
    expect(within(dialog).getByRole('textbox', { name: 'Email admin baru' })).toHaveValue('operator@example.test')
    await user.click(within(dialog).getByRole('button', { name: 'Tinjau penggantian' }))
    await user.dblClick(within(dialog).getByRole('button', { name: 'Simulasikan penggantian' }))
    expect(within(dialog).getByRole('button', { name: /Menyiapkan simulasi/ })).toBeDisabled()
    expect(within(dialog).getByRole('button', { name: 'Ubah email' })).toBeDisabled()
    expect(await within(dialog).findByRole('heading', { name: 'Simulasi penggantian selesai' })).toHaveFocus()
    expect(dialog).toHaveTextContent('Admin sekolah tetap Admin B')
    await user.click(within(dialog).getByRole('button', { name: 'Selesai' }))
    expect(screen.getByRole('table')).toHaveTextContent('Admin B')
    expect(screen.getByRole('table')).not.toHaveTextContent('operator@example.test')
  })

  it('retains the new admin after simulated failure and resets a cancelled pending handoff', async () => {
    const user = userEvent.setup()
    render(<Fixture entry='/review/platform/schools?handoff=failure' listSchools={{ execute: async () => overview }} />)
    await user.click(await screen.findByRole('button', { name: 'Tindakan Sekolah Sleman' }))
    const trigger = screen.getByRole('button', { name: 'Ganti admin sekolah' })
    await user.click(trigger)
    const dialog = screen.getByRole('dialog', { name: 'Ganti admin Sekolah Sleman' })
    await user.type(within(dialog).getByRole('textbox', { name: 'Email admin baru' }), 'operator@example.test')
    await user.click(within(dialog).getByRole('button', { name: 'Tinjau penggantian' }))
    await user.click(within(dialog).getByRole('button', { name: 'Simulasikan penggantian' }))
    expect(await within(dialog).findByRole('alert')).toHaveTextContent('Simulasi belum berhasil')
    expect(dialog).toHaveTextContent('operator@example.test')
    await user.click(within(dialog).getByRole('button', { name: 'Ubah email' }))
    expect(within(dialog).getByRole('textbox', { name: 'Email admin baru' })).toHaveValue('operator@example.test')
    await user.click(within(dialog).getByRole('button', { name: 'Tinjau penggantian' }))
    await user.click(within(dialog).getByRole('button', { name: 'Simulasikan penggantian' }))
    await user.click(within(dialog).getByRole('button', { name: 'Batal' }))
    expect(trigger).toHaveFocus()
    await user.click(trigger)
    expect(screen.getByRole('textbox', { name: 'Email admin baru' })).toHaveValue('')
  })

  it('simulates suspension for the selected school without changing its data and restores focus', async () => {
    const user = userEvent.setup()
    render(<Fixture listSchools={{ execute: async () => overview }} />)
    await screen.findByText('Sekolah Yogyakarta')
    await user.click(screen.getByRole('button', { name: 'Tindakan Sekolah Yogyakarta' }))
    const trigger = screen.getByRole('button', { name: 'Tangguhkan' })
    await user.click(trigger)
    const dialog = screen.getByRole('dialog', { name: 'Tangguhkan Sekolah Yogyakarta?' })
    expect(dialog).toHaveTextContent('Status saat ini')
    expect(dialog).toHaveTextContent('Aktif')
    expect(dialog).toHaveTextContent('12 pengguna')
    expect(within(dialog).getByRole('heading', { name: 'Konfirmasi penangguhan sementara' })).toHaveFocus()
    await user.click(within(dialog).getByRole('button', { name: 'Simulasikan penangguhan' }))
    expect(within(dialog).getByRole('button', { name: 'Menyiapkan simulasi…' })).toBeDisabled()
    await within(dialog).findByRole('heading', { name: 'Simulasi penangguhan selesai' })
    expect(dialog).toHaveTextContent('Status sekolah tetap Aktif')
    expect(overview.schools[0].status).toBe('active')
    await user.click(within(dialog).getByRole('button', { name: 'Selesai' }))
    expect(trigger).toHaveFocus()
  })

  it('simulates reactivation while preserving the suspended school data', async () => {
    const user = userEvent.setup()
    const suspended = { ...overview.schools[0], status: 'suspended' as const }
    render(<Fixture listSchools={{ execute: async () => ({ ...overview, schools: [suspended] }) }} />)
    await screen.findByText('Sekolah Yogyakarta')
    await user.click(screen.getByRole('button', { name: 'Tindakan Sekolah Yogyakarta' }))
    await user.click(screen.getByRole('button', { name: 'Aktifkan kembali' }))
    const dialog = screen.getByRole('dialog', { name: 'Aktifkan kembali Sekolah Yogyakarta?' })
    expect(dialog).toHaveTextContent('Status saat ini')
    expect(dialog).toHaveTextContent('Ditangguhkan')
    expect(dialog).toHaveTextContent('akses 12 pengguna akan dibuka kembali')
    await user.click(within(dialog).getByRole('button', { name: 'Simulasikan pengaktifan' }))
    await within(dialog).findByRole('heading', { name: 'Simulasi pengaktifan selesai' })
    expect(dialog).toHaveTextContent('Status sekolah tetap Ditangguhkan')
    expect(suspended.status).toBe('suspended')
  })

  it('retains the status choice after failure and cancels a pending simulation on close', async () => {
    const user = userEvent.setup()
    render(<Fixture entry='/review/platform/schools?status=failure' listSchools={{ execute: async () => overview }} />)
    await user.click(await screen.findByRole('button', { name: 'Tindakan Sekolah Sleman' }))
    const trigger = screen.getByRole('button', { name: 'Tangguhkan' })
    await user.click(trigger)
    const dialog = screen.getByRole('dialog', { name: 'Tangguhkan Sekolah Sleman?' })
    expect(dialog).toHaveTextContent('Diundang')
    await user.click(within(dialog).getByRole('button', { name: 'Simulasikan penangguhan' }))
    await within(dialog).findByRole('alert')
    expect(dialog).toHaveTextContent('Pilihan tetap tersimpan')
    await user.click(within(dialog).getByRole('button', { name: 'Coba lagi' }))
    await user.click(within(dialog).getByRole('button', { name: 'Batal' }))
    expect(trigger).toHaveFocus()
    await user.click(trigger)
    expect(within(screen.getByRole('dialog')).getByRole('button', { name: 'Simulasikan penangguhan' })).toBeEnabled()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
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

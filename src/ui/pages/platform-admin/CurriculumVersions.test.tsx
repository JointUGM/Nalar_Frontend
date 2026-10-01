import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { OperationError } from '@/domain/model/OperationError'
import type { CurriculumCatalog } from '@/domain/model/platform/CurriculumVersion'
import type { PlatformDependencies } from '@/ui/components/dependencies/DependenciesContext'
import { DependenciesProvider } from '@/ui/components/dependencies/DependenciesProvider'
import { CurriculumVersions } from './CurriculumVersions'

const catalog: CurriculumCatalog = {
  versions: [{ id: '2025', name: 'Versi contoh 2025', published: '2 Jan 2026', schools: 3, current: true }],
  reference: null,
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

function Fixture({ listCurriculum }: { listCurriculum: PlatformDependencies['listCurriculum'] }) {
  return <MemoryRouter><DependenciesProvider value={{
    listSchools: { execute: async () => ({ schools: [], nextCursor: null, summary: { users: null, activeSchools: null, curriculum: null } }) },
    listCurriculum,
  }}><CurriculumVersions /></DependenciesProvider></MemoryRouter>
}

describe('CurriculumVersions', () => {
  it('validates publication selection, retains edits and simulates success without changing the catalog', async () => {
    const user = userEvent.setup()
    render(<Fixture listCurriculum={{ execute: async () => catalog }} />)
    const trigger = screen.getByRole('button', { name: 'Terbitkan versi baru' })
    await user.click(trigger)
    const dialog = screen.getByRole('dialog', { name: 'Terbitkan versi CP baru' })
    const decision = within(dialog).getByRole('textbox', { name: 'Nomor keputusan' })
    await user.click(within(dialog).getByRole('button', { name: 'Tinjau publikasi' }))
    expect(decision).toHaveFocus()
    expect(decision).toHaveAttribute('aria-invalid', 'true')
    await user.type(decision, 'BSKAP 012/2027')
    const document = within(dialog).getByRole('checkbox')
    await user.click(document)
    await user.click(within(dialog).getByRole('button', { name: 'Tinjau publikasi' }))
    expect(document).toHaveFocus()
    expect(document).toHaveAttribute('aria-invalid', 'true')
    await user.click(document)
    await user.click(within(dialog).getByRole('button', { name: 'Tinjau publikasi' }))
    await user.click(within(dialog).getByRole('button', { name: 'Ubah isian' }))
    expect(decision).toHaveValue('BSKAP 012/2027')
    await user.click(within(dialog).getByRole('button', { name: 'Tinjau publikasi' }))
    await user.click(within(dialog).getByRole('button', { name: 'Simulasikan publikasi' }))
    expect(within(dialog).getByRole('button', { name: 'Menyiapkan simulasi…' })).toBeDisabled()
    await within(dialog).findByRole('heading', { name: 'Simulasi publikasi selesai' })
    expect(dialog).toHaveTextContent('Katalog dan pemetaan CP sekolah tetap menggunakan data sebelumnya')
    await user.click(within(dialog).getByRole('button', { name: 'Selesai' }))
    expect(trigger).toHaveFocus()
    expect(await screen.findByRole('heading', { name: 'Versi contoh 2025' })).toBeInTheDocument()
  })

  it.each(['forbidden', 'not_found'] as const)('shows a generic denied state for %s without offering a connection retry', async (code) => {
    render(<Fixture listCurriculum={{ execute: async () => { throw new OperationError(code) } }} />)
    expect(await screen.findByRole('alert')).toHaveTextContent('Capaian Pembelajaran tidak tersedia')
    expect(screen.queryByRole('button', { name: 'Coba lagi' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Terbitkan versi baru' })).not.toBeInTheDocument()
    expect(screen.queryByRole('region', { name: 'Versi Capaian Pembelajaran' })).not.toBeInTheDocument()
  })

  it.each(['forbidden', 'not_found'] as const)('dismisses an open preview on %s and keeps it closed after recovery', async (code) => {
    const user = userEvent.setup()
    const { rerender } = render(<Fixture listCurriculum={{ execute: async () => catalog }} />)
    await screen.findByRole('heading', { name: 'Versi contoh 2025' })
    await user.click(screen.getByRole('button', { name: 'Terbitkan versi baru' }))
    expect(screen.getByRole('dialog', { name: 'Terbitkan versi CP baru' })).toBeInTheDocument()

    rerender(<Fixture listCurriculum={{ execute: async () => { throw new OperationError(code) } }} />)
    expect(await screen.findByRole('alert')).toHaveTextContent('Capaian Pembelajaran tidak tersedia')
    expect(screen.queryByRole('dialog', { name: 'Terbitkan versi CP baru' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Terbitkan versi baru' })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Versi contoh 2025' })).not.toBeInTheDocument()

    rerender(<Fixture listCurriculum={{ execute: async () => catalog }} />)
    await screen.findByRole('heading', { name: 'Versi contoh 2025' })
    expect(screen.getByRole('button', { name: 'Terbitkan versi baru' })).toBeInTheDocument()
    expect(screen.queryByRole('dialog', { name: 'Terbitkan versi CP baru' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Terbitkan versi baru' }))
    expect(screen.getByRole('dialog', { name: 'Terbitkan versi CP baru' })).toBeInTheDocument()
  })

  it('keeps supplied versions visible when their CP content is unavailable', async () => {
    render(<Fixture listCurriculum={{ execute: async () => catalog }} />)
    expect(await screen.findByRole('heading', { name: 'Versi contoh 2025' })).toBeInTheDocument()
    expect(screen.getByText('Contoh isi CP belum tersedia.')).toBeInTheDocument()
    expect(screen.queryByText('Belum ada versi Capaian Pembelajaran.')).not.toBeInTheDocument()
  })

  it('labels reference content as an incomplete example and explains empty statements', async () => {
    render(<Fixture listCurriculum={{ execute: async () => ({ ...catalog, reference: { title: 'IPA · Fase D', outcomes: [] } }) }} />)
    expect(await screen.findByRole('heading', { name: 'IPA · Fase D' })).toBeInTheDocument()
    expect(screen.getByText(/belum mencakup hierarki CP lengkap/)).toBeInTheDocument()
    expect(screen.getByText('Belum ada pernyataan CP pada contoh ini.')).toBeInTheDocument()
  })

  it('shows a safe read failure, then retries without inventing a current version', async () => {
    const user = userEvent.setup()
    let attempts = 0
    render(<MemoryRouter><DependenciesProvider value={{
      listSchools: { execute: async () => ({ schools: [], nextCursor: null, summary: { users: null, activeSchools: null, curriculum: null } }) },
      listCurriculum: { execute: async () => { if (++attempts === 1) throw new Error('private curriculum response'); return { versions: [], reference: null } } },
    }}><CurriculumVersions /></DependenciesProvider></MemoryRouter>)
    expect(await screen.findByRole('alert')).not.toHaveTextContent('private curriculum response')
    expect(screen.queryByText('BSKAP 046/2025')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Coba lagi' }))
    expect(await screen.findByText('Belum ada versi Capaian Pembelajaran.')).toBeInTheDocument()
  })
})

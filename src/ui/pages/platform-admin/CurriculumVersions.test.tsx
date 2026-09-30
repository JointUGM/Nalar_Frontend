import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { OperationError } from '@/domain/model/OperationError'
import type { CurriculumCatalog } from '@/domain/model/platform/CurriculumVersion'
import type { PlatformDependencies } from '@/ui/components/dependencies/DependenciesContext'
import { DependenciesProvider } from '@/ui/components/dependencies/DependenciesProvider'
import { CurriculumVersions } from './CurriculumVersions'

const catalog: CurriculumCatalog = {
  versions: [{ id: '2025', name: 'Versi contoh 2025', published: '2 Jan 2026', schools: 3, current: true }],
  reference: null,
}

function Fixture({ listCurriculum }: { listCurriculum: PlatformDependencies['listCurriculum'] }) {
  return <MemoryRouter><DependenciesProvider value={{
    listSchools: { execute: async () => ({ schools: [], nextCursor: null, summary: { users: null, activeSchools: null, curriculum: null } }) },
    listCurriculum,
  }}><CurriculumVersions /></DependenciesProvider></MemoryRouter>
}

describe('CurriculumVersions', () => {
  it.each(['forbidden', 'not_found'] as const)('shows a generic denied state for %s without offering a connection retry', async (code) => {
    render(<Fixture listCurriculum={{ execute: async () => { throw new OperationError(code) } }} />)
    expect(await screen.findByRole('alert')).toHaveTextContent('Capaian Pembelajaran tidak tersedia')
    expect(screen.queryByRole('button', { name: 'Coba lagi' })).not.toBeInTheDocument()
    expect(screen.queryByRole('region', { name: 'Versi Capaian Pembelajaran' })).not.toBeInTheDocument()
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

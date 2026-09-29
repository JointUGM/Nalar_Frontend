import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { DependenciesProvider } from '@/ui/components/dependencies/DependenciesProvider'
import { CurriculumVersions } from './CurriculumVersions'

describe('CurriculumVersions', () => {
  it('shows a safe read failure, then retries without inventing a current version', async () => {
    const user = userEvent.setup()
    let attempts = 0
    render(<MemoryRouter><DependenciesProvider value={{
      listSchools: { execute: async () => ({ schools: [], summary: { users: null, activeSchools: null, curriculum: null } }) },
      listCurriculum: { execute: async () => { if (++attempts === 1) throw new Error('private curriculum response'); return { versions: [], reference: null } } },
    }}><CurriculumVersions /></DependenciesProvider></MemoryRouter>)
    expect(await screen.findByRole('alert')).not.toHaveTextContent('private curriculum response')
    expect(screen.queryByText('BSKAP 046/2025')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Coba lagi' }))
    expect(await screen.findByText('Belum ada versi Capaian Pembelajaran.')).toBeInTheDocument()
  })
})

import { describe, expect, it } from 'vitest'
import { ReferencePlatformRepository } from '@/infrastructure/services/review/ReferencePlatformRepository'
import { ListSchoolsUseCase } from './list-schools-use-case'

describe('ListSchoolsUseCase with review pagination', () => {
  it('filters the full metadata set before paging and keeps overview totals independent', async () => {
    const list = new ListSchoolsUseCase(new ReferencePlatformRepository())
    const first = await list.execute('', null)
    expect(first.schools).toHaveLength(2)
    expect(first.nextCursor).not.toBeNull()

    const second = await list.execute('', first.nextCursor)
    expect(second.schools).toHaveLength(2)
    expect(second.schools[0].id).not.toBe(first.schools[0].id)
    expect(second.nextCursor).toBeNull()
    expect(second.summary).toEqual(first.summary)

    const filtered = await list.execute('  sleman  ', null)
    expect(filtered.schools.map((school) => school.id)).toEqual(['sleman'])
    expect(filtered.nextCursor).toBeNull()
    expect(filtered.summary).toEqual(first.summary)
  })
})

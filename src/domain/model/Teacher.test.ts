import { describe, expect, it } from 'vitest'
import { orderByPrerequisites } from './Teacher'

const ids = (list: { concept_id: string }[]) => list.map((item) => item.concept_id)
const c = (concept_id: string) => ({ concept_id })

describe('orderByPrerequisites', () => {
  it('puts a prerequisite before the concept that needs it and keeps the rest in order', () => {
    expect(ids(orderByPrerequisites([c('a'), c('b'), c('c')], [{ concept_id: 'a', prerequisite_id: 'c' }]))).toEqual(['b', 'c', 'a'])
  })
  it('ignores edges to unknown concepts, self edges and cycles', () => {
    expect(ids(orderByPrerequisites([c('a'), c('b')], [{ concept_id: 'a', prerequisite_id: 'x' }, { concept_id: 'b', prerequisite_id: 'b' }]))).toEqual(['a', 'b'])
    expect(ids(orderByPrerequisites([c('a'), c('b')], [{ concept_id: 'a', prerequisite_id: 'b' }, { concept_id: 'b', prerequisite_id: 'a' }]))).toEqual(['a', 'b'])
  })
})

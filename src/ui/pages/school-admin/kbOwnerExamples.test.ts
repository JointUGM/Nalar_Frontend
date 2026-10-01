import { describe, expect, it } from 'vitest'
import { assignmentExamples, withAssignment } from './assignmentExamples'
import { eligibleOwners, initials, kbExamples } from './kbOwnerExamples'

describe('knowledge base owner examples', () => {
  it('derives initials from the first two name parts', () => {
    expect(initials('Sari Wulandari')).toBe('SW')
    expect(initials('  hari purnomo ')).toBe('HP')
    expect(initials('Madonna')).toBe('M')
  })
  it('excludes the current owner and departed teachers from eligible new owners', () => {
    const ipa = kbExamples[0], ips = kbExamples[1]
    const ipaNames = eligibleOwners(ipa, assignmentExamples).map((item) => item.name)
    expect(ipaNames).not.toContain('Sari Wulandari')
    expect(ipaNames).not.toContain('Hari Purnomo')
    expect(ipaNames).toContain('Ratna Dewi')
    expect(eligibleOwners(ips, assignmentExamples).map((item) => item.name)).not.toContain('Hari Purnomo')
  })
  it('lists teachers who teach the subject first and flags who does not', () => {
    const [first, ...rest] = eligibleOwners(kbExamples[0], assignmentExamples)
    expect(first).toMatchObject({ name: 'Ratna Dewi', teaches: true, status: 'Undangan terkirim' })
    expect(rest.every((item) => !item.teaches)).toBe(true)
    const moved = withAssignment(assignmentExamples, '8A', 'IPA', 'Dewi Lestari')
    expect(eligibleOwners(kbExamples[0], moved).filter((item) => item.teaches).map((item) => item.name)).toEqual(expect.arrayContaining(['Dewi Lestari', 'Ratna Dewi']))
  })
})

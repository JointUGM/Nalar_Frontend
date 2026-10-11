import { describe, expect, it } from 'vitest'
import { dayLabel } from './homeInsights'

describe('teacher home day labels', () => {
  it('names days on the Jakarta calendar, not the computer’s', () => {
    // 01:00 WIB on the 3rd is still the 2nd in UTC.
    const now = new Date('2026-10-02T18:00:00Z')
    expect(dayLabel('2026-10-03T01:00:00+07:00', now)).toBe('Hari ini')
    expect(dayLabel('2026-10-04T08:00:00+07:00', now)).toBe('Besok')
    expect(dayLabel('2026-10-02T08:00:00+07:00', now)).toBe('Kemarin')
    expect(dayLabel('2026-09-28T08:00:00+07:00', now)).toMatch(/^Sen,? 28 Sep$/)
  })
})

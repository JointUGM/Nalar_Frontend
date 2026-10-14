import { describe, expect, it } from 'vitest'
import { withTeacherNote } from './mgmpNote'

describe('withTeacherNote', () => {
  it('leaves the file alone without a note', () => {
    expect(withTeacherNote('a,b\n1,2\n', '  ')).toBe('a,b\n1,2\n')
  })

  it('quotes the note and neutralises a leading spreadsheet formula', () => {
    expect(withTeacherNote('a,b\n1,2\n', '=HYPERLINK("x")')).toBe('a,b\n1,2\r\n"catatan_guru","\'=HYPERLINK(""x"")"\r\n')
  })
})

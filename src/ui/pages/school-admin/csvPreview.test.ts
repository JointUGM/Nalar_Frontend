import { describe, expect, it } from 'vitest'
import { csvSample, previewCsv } from './csvPreview'

const header = 'peran,nama,nisn,email,kelas,nisn_anak'
describe('local CSV format preview', () => {
  it('keeps leading zeros and reports issues against physical file lines', () => {
    const preview = previewCsv(csvSample)
    expect(preview.error).toBeUndefined()
    expect(preview.rows).toHaveLength(6)
    expect(preview.rows[0].values[2]).toBe('0098123401')
    expect(preview.rows.filter((row) => row.issues.length).map((row) => row.line)).toEqual([6, 7])
  })
  it('reads BOM, CRLF, quoted commas, escaped quotes and multiline values', () => {
    const preview = previewCsv(`\uFEFF${header}\r\n\r\nsiswa,"Adinda, ""Putri""\r\nContoh",0098123401,,8B,\r\nguru,Sari,,sari@example.test,,`)
    expect(preview.error).toBeUndefined()
    expect(preview.rows[0]).toEqual({ line: 3, values: ['siswa', 'Adinda, "Putri"\nContoh', '0098123401', '', '8B', ''], issues: [] })
    expect(preview.rows[1].line).toBe(5)
  })
  it('rejects malformed quoting and header structure without displaying partial rows', () => {
    for (const text of [`${header}\nsiswa,"Adinda`, `${header}\nsiswa,Ad"inda,0098123401,,8B,`, `${header}\nsiswa,"Adinda"oops,0098123401,,8B,`, 'nama;peran\nAdinda;siswa']) {
      expect(previewCsv(text)).toEqual({ rows: [], error: expect.any(String) })
    }
  })
  it('accepts a header-only file and bounds large previews', () => {
    expect(previewCsv(header)).toEqual({ rows: [] })
    expect(previewCsv(header + '\n' + 'siswa,Adinda,0098123401,,8B,\n'.repeat(201)).error).toMatch('200')
  })
  it('flags column count and identifiers without coercing them to numbers', () => {
    const preview = previewCsv(`${header}\nsiswa,Adinda,98123401,,8B\norang_tua,Bambang,,,,123`)
    expect(preview.rows[0].issues).toHaveLength(2)
    expect(preview.rows[1].issues).toHaveLength(1)
  })
})

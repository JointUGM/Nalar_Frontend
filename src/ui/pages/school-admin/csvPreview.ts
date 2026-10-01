export const csvColumns = ['peran', 'nama', 'nisn', 'email', 'kelas', 'nisn_anak'] as const
export const csvSample = `peran,nama,nisn,email,kelas,nisn_anak
siswa,Adinda Putri,0098123401,,8B,
siswa,Bagas Saputra,0098123402,,8B,
guru,Sari Wulandari,,sari@example.test,,
orang_tua,Bambang Wicaksono,,,,0098123401
siswa,Fikri Ramadhan,,,8B,
walimurid,Galih Pamungkas,,,,0098123402
`

export interface CsvPreviewRow { line: number; values: string[]; issues: string[] }
export interface CsvPreview { rows: CsvPreviewRow[]; error?: string }

// Bounded, browser-only format preview. This does not check school membership.
export function previewCsv(text: string): CsvPreview {
  const records: { line: number; values: string[] }[] = []
  let values: string[] = [], value = '', quoted = false, closed = false, line = 1, startLine = 1
  const input = text.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n')
  for (let i = 0; i <= input.length; i++) {
    const char = input[i]
    if (quoted) {
      if (char === undefined) return { rows: [], error: `Tanda kutip belum ditutup pada baris ${startLine}.` }
      if (char === '"') {
        if (input[i + 1] === '"') { value += '"'; i++ }
        else { quoted = false; closed = true }
      } else { value += char; if (char === '\n') line++ }
      continue
    }
    if (char === '"') {
      if (value || closed) return { rows: [], error: `Tanda kutip tidak sesuai pada baris ${line}.` }
      quoted = true
    } else if (char === ',' || char === '\n' || char === undefined) {
      values.push(value.trim()); value = ''; closed = false
      if (char !== ',') {
        if (values.some(Boolean)) records.push({ line: startLine, values })
        values = []; line++; startLine = line
        if (records.length > 201) return { rows: [], error: 'Pratinjau dibatasi hingga 200 baris orang. Gunakan file contoh yang lebih kecil.' }
      }
    } else {
      if (closed && char.trim()) return { rows: [], error: `Ada teks setelah tanda kutip pada baris ${line}.` }
      if (!closed) value += char
    }
  }
  const header = records.shift()
  if (!header || header.values.length !== csvColumns.length || header.values.some((column, i) => column !== csvColumns[i])) {
    return { rows: [], error: `Gunakan enam kolom berurutan: ${csvColumns.join(', ')}. Pemisah kolom harus koma.` }
  }
  return { rows: records.map(({ line: rowLine, values: cells }) => {
    const issues: string[] = []
    if (cells.length !== 6) issues.push(`Dibutuhkan 6 kolom; ditemukan ${cells.length}.`)
    if (!['siswa', 'guru', 'orang_tua'].includes(cells[0])) issues.push('Peran harus siswa, guru, atau orang_tua.')
    if (!cells[1]) issues.push('Nama kosong.')
    if (cells[0] === 'siswa' && !/^\d{10}$/.test(cells[2] ?? '')) issues.push('NISN siswa harus berupa 10 digit.')
    if (cells[5] && !/^\d{10}$/.test(cells[5])) issues.push('nisn_anak harus berupa 10 digit jika diisi.')
    return { line: rowLine, values: cells, issues }
  }) }
}

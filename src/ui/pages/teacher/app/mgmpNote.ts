// The teacher's own note about what they tried is typed at export time and never stored: it is appended to the downloaded file only.
export function withTeacherNote(csv: string, note: string): string {
  const text = note.trim()
  if (!text) return csv
  // Same spreadsheet-safety rule the backend applies to every cell.
  const safe = /^[=+\-@\t\r\n]/.test(text) ? `'${text}` : text
  return `${csv.replace(/\s+$/, '')}\r\n"catatan_guru","${safe.replace(/"/g, '""')}"\r\n`
}

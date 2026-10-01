import { useRef, useState } from 'react'
import { csvSample, previewCsv } from './csvPreview'
import type { CsvPreview } from './csvPreview'

export function useSchoolImportViewModel() {
  const [file, setFile] = useState<{ name: string; text: string } | null>(null)
  const [preview, setPreview] = useState<CsvPreview | null>(null)
  const [error, setError] = useState('')
  const [reading, setReading] = useState(false)
  const request = useRef(0)
  function reset() { request.current++; setFile(null); setPreview(null); setError(''); setReading(false) }
  async function selectFile(selected: File): Promise<void> {
    const version = ++request.current
    setPreview(null); setError(''); setFile(null)
    if (!selected.name.toLowerCase().endsWith('.csv') || selected.size > 100_000) {
      setReading(false); setError('Pilih file .csv maksimal 100 KB, berisi data fiktif.'); return
    }
    setReading(true)
    try {
      const text = await selected.text()
      if (version === request.current) setFile({ name: selected.name, text })
    } catch { if (version === request.current) setError('File tidak dapat dibaca. Pilih ulang file CSV contoh.') }
    finally { if (version === request.current) setReading(false) }
  }
  function selectSample() { request.current++; setFile({ name: 'roster-contoh-2026-2027.csv', text: csvSample }); setPreview(null); setError(''); setReading(false) }
  function inspect() { if (file) setPreview(previewCsv(file.text)) }
  return { file, preview, error, reading, selectFile, selectSample, inspect, reset, back: () => setPreview(null) }
}

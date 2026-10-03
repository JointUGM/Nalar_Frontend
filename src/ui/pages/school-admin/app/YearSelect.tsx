import { Feedback } from '@/ui/components/feedback/Feedback'
import shared from '@/ui/pages/school-admin/dialogForm.module.css'
import type { useAcademicYears } from './useAcademicYears'

export function YearSelect({ years }: { years: ReturnType<typeof useAcademicYears> }) {
  if (years.loaded && years.list.length === 0) return <Feedback tone="warning" title="Belum ada tahun ajaran">Buat tahun ajaran lebih dulu di halaman Tahun ajaran.</Feedback>
  if (years.list.length < 2) return years.list[0] ? <p>Tahun ajaran {years.list[0].name}</p> : null
  return <label className={shared.field}>Tahun ajaran
    <select value={years.yearId} onChange={(event) => years.choose(event.target.value)}>{years.list.map((year) => <option key={year.id} value={year.id}>{year.name}{year.is_current ? ' · berjalan' : ''}</option>)}</select>
  </label>
}

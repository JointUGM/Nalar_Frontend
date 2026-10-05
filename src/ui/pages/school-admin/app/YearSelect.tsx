import { Feedback } from '@/ui/components/feedback/Feedback'
import { Select } from '@/ui/components/select/Select'
import type { useAcademicYears } from './useAcademicYears'

export function YearSelect({ years }: { years: ReturnType<typeof useAcademicYears> }) {
  if (years.loaded && years.list.length === 0) return <Feedback tone="warning" title="Belum ada tahun ajaran">Buat tahun ajaran lebih dulu di halaman Tahun ajaran.</Feedback>
  if (years.list.length < 2) return years.list[0] ? <p>Tahun ajaran {years.list[0].name}</p> : null
  return (
    <Select
      label="Tahun ajaran"
      value={years.yearId}
      onChange={(value) => years.choose(value)}
      options={years.list.map((year) => ({
        value: year.id,
        label: `${year.name}${year.is_current ? ' (berjalan)' : ''}`,
      }))}
    />
  )
}

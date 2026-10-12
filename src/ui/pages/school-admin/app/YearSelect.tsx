import { Feedback } from '@/ui/components/feedback/Feedback'
import { Icon } from '@/ui/components/icon/Icon'
import { Select } from '@/ui/components/select/Select'
import type { useAcademicYears } from './useAcademicYears'

export function YearSelect({ years }: { years: ReturnType<typeof useAcademicYears> }) {
  if (years.loaded && years.list.length === 0) return <Feedback tone="warning" title="Belum ada tahun ajaran">Buat tahun ajaran lebih dulu di halaman Tahun ajaran.</Feedback>
  if (years.list.length < 2) {
    if (!years.list[0]) return null
    return (
      <div className="inline-flex items-center gap-2 rounded-button border border-role-border bg-surface px-3 py-1.5 text-[13px] font-semibold text-ink shadow-2xs">
        <Icon name="calendar" size={14} />
        <span>Tahun ajaran <strong>{years.list[0].name}</strong></span>
        {years.list[0].id === years.activeYearId && <span className="rounded-pill bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">Berjalan</span>}
      </div>
    )
  }
  return (
    <div className="w-[min(100%,280px)]">
      <Select
        compact
        label="Tahun ajaran"
        value={years.yearId}
        onChange={(value) => years.choose(value)}
        options={years.list.map((year) => ({
          value: year.id,
          label: `${year.name}${year.id === years.activeYearId ? ' (berjalan)' : ''}`,
        }))}
      />
    </div>
  )
}


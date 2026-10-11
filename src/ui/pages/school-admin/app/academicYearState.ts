import type { AcademicYear } from '@/domain/model/SchoolAdmin'

export const getTodayDateString = (): string => {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dayNum = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dayNum}`
}

export function getStoredActiveYearId(schoolId: string): string | null {
  try {
    return localStorage.getItem(`nalar_active_year_${schoolId}`)
  } catch {
    return null
  }
}

export function setStoredActiveYearId(schoolId: string, yearId: string): void {
  try {
    localStorage.setItem(`nalar_active_year_${schoolId}`, yearId)
    window.dispatchEvent(new CustomEvent('nalar-active-year-change', { detail: { schoolId, yearId } }))
  } catch {
    // Ignore storage quota or security errors
  }
}

/**
 * Resolves the true currently active / running academic year for a school.
 * 1. Checks explicit stored preference in localStorage.
 * 2. If absent, finds a year whose date range spans today (starts_on <= today <= ends_on).
 *    If multiple span today, prefers the one with is_current flag, else latest starts_on.
 * 3. If none span today, finds the closest started year (starts_on <= today).
 * 4. As a fallback, uses backend is_current flag or the first item.
 */
export function resolveActiveYearId(schoolId: string, list: AcademicYear[], today: string = getTodayDateString()): string {
  if (list.length === 0) return ''

  // 1. Explicitly stored active year for this school
  const stored = getStoredActiveYearId(schoolId)
  if (stored && list.some((y) => y.id === stored)) {
    return stored
  }

  // 2. Years currently in effect today
  const activeNow = list.filter((y) => y.starts_on <= today && y.ends_on >= today)
  if (activeNow.length > 0) {
    const marked = activeNow.find((y) => y.is_current)
    if (marked) return marked.id
    // Latest start date among active now
    return [...activeNow].sort((a, b) => b.starts_on.localeCompare(a.starts_on))[0].id
  }

  // 3. Years that have already started in the past (closest past/ongoing period)
  const pastOrStarted = list.filter((y) => y.starts_on <= today)
  if (pastOrStarted.length > 0) {
    const marked = pastOrStarted.find((y) => y.is_current)
    if (marked) return marked.id
    return [...pastOrStarted].sort((a, b) => b.starts_on.localeCompare(a.starts_on))[0].id
  }

  // 4. Fallback if all years are scheduled in the future
  return list.find((y) => y.is_current)?.id ?? list[0].id
}

export function resolveActiveYear(schoolId: string, list: AcademicYear[], today: string = getTodayDateString()): AcademicYear | undefined {
  const id = resolveActiveYearId(schoolId, list, today)
  return list.find((y) => y.id === id)
}

export type YearStatusType = 'current' | 'upcoming' | 'done' | 'archived'

export interface ResolvedYearStatus {
  type: YearStatusType
  label: 'Berjalan' | 'Terjadwal' | 'Selesai' | 'Diarsipkan'
  icon: 'calendar' | 'clock' | 'archive'
  isCurrent: boolean
  hint: string
}

export function resolveYearStatus(
  year: AcademicYear,
  activeYearId: string,
  today: string = getTodayDateString(),
  fmt: (dateStr: string) => string = (s) => s,
): ResolvedYearStatus {
  // If this is the active/running year
  if (year.id === activeYearId) {
    return {
      type: 'current',
      label: 'Berjalan',
      icon: 'calendar',
      isCurrent: true,
      hint: 'Tahun ajaran aktif saat ini. Semua kelas, siswa, dan penugasan terhubung ke periode ini.',
    }
  }

  // If this year has not started yet (scheduled for the future)
  if (year.starts_on > today) {
    return {
      type: 'upcoming',
      label: 'Terjadwal',
      icon: 'clock',
      isCurrent: false,
      hint: `Mulai ${fmt(year.starts_on)}. Disiapkan tanpa menimpa tahun berjalan.`,
    }
  }

  // If this year has already ended
  if (year.ends_on < today) {
    return {
      type: 'done',
      label: 'Selesai',
      icon: 'clock',
      isCurrent: false,
      hint: `Periode telah berakhir (${fmt(year.ends_on)}). Data akademik tersimpan rapi.`,
    }
  }

  // Covers today or in the past, but another period is currently active
  return {
    type: 'archived',
    label: 'Diarsipkan',
    icon: 'clock',
    isCurrent: false,
    hint: 'Periode digantikan oleh tahun berjalan. Riwayat kelas dan data akademik tetap tersimpan aman.',
  }
}

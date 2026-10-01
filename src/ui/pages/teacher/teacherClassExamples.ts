import { monitorExample, studentNames } from './teacherSessionExamples'

export type ClassStudentStatus = 'done' | 'verify' | 'idle'
export interface ClassStudent { name: string; initials: string; done: string; understood: number; developing: number; misconception: number; status: ClassStudentStatus }

export const statusLabels: Record<ClassStudentStatus, string> = { done: 'Selesai', verify: 'Perlu verifikasi', idle: 'Belum mulai' }

export const classKpis = (students: number) => [
  { label: 'Siswa', value: String(students), caption: 'Terdaftar', trend: null },
  { label: 'Misi selesai', value: '4', caption: 'Semester ini', trend: [1, 2, 3, 4] },
  { label: 'Rata-rata sesi', value: '12 mnt', caption: 'Target ≤ 15 menit', trend: [16, 14, 13, 12] },
  { label: 'Berubah pikiran', value: '44%', caption: 'Dari yang punya miskonsepsi', trend: [28, 35, 39, 44] },
] as const

/**
 * Supplied "Kelas saya" sample: the shared example names, sized to the class. Every class shows the same fictional names, and the
 * verification flags are the monitor's, so the two screens agree. Percentages follow the supplied pattern; nothing is calculated.
 */
export function classRoster(count: number): ClassStudent[] {
  return studentNames.slice(0, count).map((name, index) => {
    const understood = 40 + (index * 13) % 45
    const misconception = (index * 7) % 25
    return {
      name, initials: name.split(' ').map((part) => part[0]).join(''), done: `${3 + (index % 2)} dari 4`,
      understood, misconception, developing: 100 - understood - misconception,
      status: monitorExample.flaggedIndexes.includes(index) ? 'verify' : index % 4 === 3 ? 'idle' : 'done',
    }
  })
}

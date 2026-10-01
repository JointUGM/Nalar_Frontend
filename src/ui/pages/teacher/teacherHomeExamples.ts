export interface TeacherClass { name: string; students: number }
export interface TeacherSchool { name: string; classes: readonly TeacherClass[] }
export type KpiTone = 'success' | 'misconception' | 'verification'
export interface KpiExample { id: string; label: string; value: string; chip: string; tone: KpiTone; icon: 'arrowUp' | 'clock'; caption: string; trend: readonly number[] }

export const teacherUser = 'Sari Wulandari'
export const teacherSubject = 'IPA'

export const teacherSchools: readonly TeacherSchool[] = [
  { name: 'SMPN 5 Yogyakarta', classes: [{ name: '8A', students: 31 }, { name: '8B', students: 30 }, { name: '8C', students: 32 }, { name: '8D', students: 31 }] },
  { name: 'SMP Muhammadiyah 2', classes: [] },
]

export function summarize(classes: readonly TeacherClass[]): { classCount: number; students: number } {
  return { classCount: classes.length, students: classes.reduce((total, item) => total + item.students, 0) }
}

export function kpiExamples(students: number): readonly KpiExample[] {
  return [
    { id: 'sessions', label: 'Sesi selesai', value: '93', chip: '12 dari minggu lalu', tone: 'success', icon: 'arrowUp', caption: `Dari ${students} siswa`, trend: [61, 70, 81, 93] },
    { id: 'misconceptions', label: 'Miskonsepsi aktif', value: '38', chip: '6 baru', tone: 'misconception', icon: 'arrowUp', caption: 'Di 3 konsep', trend: [29, 31, 32, 38] },
    { id: 'changed', label: 'Berubah pikiran', value: '41%', chip: '8% minggu ini', tone: 'success', icon: 'arrowUp', caption: 'Saat sesi, tanpa diberi tahu', trend: [22, 29, 33, 41] },
    { id: 'verify', label: 'Perlu verifikasi', value: '3', chip: 'Belum ditinjau', tone: 'verification', icon: 'clock', caption: 'Tidak mengubah skor', trend: [5, 2, 4, 3] },
  ]
}

export function sparklinePoints(trend: readonly number[], width = 64, height = 24): { points: string; lastY: number } {
  const min = Math.min(...trend), span = Math.max(...trend) - min || 1
  const ys = trend.map((value) => height - 2 - ((value - min) / span) * (height - 4))
  return { points: ys.map((y, index) => `${(index * width / Math.max(trend.length - 1, 1)).toFixed(1)},${y.toFixed(1)}`).join(' '), lastY: ys[ys.length - 1] }
}

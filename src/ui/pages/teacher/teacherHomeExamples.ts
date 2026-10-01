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
    { id: 'sessions', label: 'Sesi selesai', value: String(weekSessions), chip: '12 dari minggu lalu', tone: 'success', icon: 'arrowUp', caption: `Dari ${students} siswa`, trend: [61, 70, 81, 93] },
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

export const weekSessions = 93

export type ActionTone = 'review' | 'urgent'
export interface ActionExample { id: string; tone: ActionTone; chip: string; icon: 'clock' | 'alert'; when: string; title: string; body: string; suggestion: string; cta: string }
export const actionExamples: readonly ActionExample[] = [
  { id: 'kb-review', tone: 'review', chip: 'Perlu tinjauan', icon: 'clock', when: 'Tadi pagi', title: 'Basis pengetahuan Tekanan Zat', body: '7 konsep dan 9 miskonsepsi siap Anda periksa sebelum dipakai siswa.', suggestion: 'Periksa 2 miskonsepsi tekanan hidrostatis. Contoh pembandingnya masih terlalu umum.', cta: 'Tinjau sekarang' },
  { id: 'release-8a', tone: 'urgent', chip: 'Mendesak', icon: 'alert', when: '3 hari lalu', title: 'Rilis hasil 8A ke orang tua', body: 'Publikasi sudah ditutup. 30 ringkasan menunggu pratinjau Anda.', suggestion: '2 siswa belum selesai. Ringkasan mereka tidak ikut dirilis sampai sesi dievaluasi.', cta: 'Buka rilis' },
]

export interface TrendSeries { id: 'understood' | 'developing' | 'misconception'; label: string; values: readonly number[] }
// The reference plots nine points against four week labels; these are the points nearest each label.
export const trendWeeks = ['Mg 1', 'Mg 2', 'Mg 3', 'Mg 4']
export const trendSeries: readonly TrendSeries[] = [
  { id: 'understood', label: 'Paham', values: [34, 35, 45, 50] },
  { id: 'developing', label: 'Berkembang', values: [28, 30, 30, 31] },
  { id: 'misconception', label: 'Miskonsepsi', values: [22, 18, 13, 10] },
]

export interface AttentionStudent { name: string; meta: string }
export const attentionSummary = { count: 14, delta: '3 dari minggu lalu', note: 'Miskonsepsi bertahan setelah 2 contoh pembanding' }
export const attentionStudents: readonly AttentionStudent[] = [
  { name: 'Dimas Prasetyo', meta: '8B · 3 misi' }, { name: 'Lukman Hakim', meta: '8B · 2 misi' },
  { name: 'Salsabila Nur', meta: '8A · 2 misi' }, { name: 'Evan Pradana', meta: '8C · 2 misi' },
]

export interface ChangedMindExample { misconception: string; where: string; held: number; resolved: number }
export const changedMindExamples: readonly ChangedMindExample[] = [
  { misconception: 'Gaya bisa habis', where: '8B · Kenapa kelereng berhenti?', held: 18, resolved: 10 },
  { misconception: 'Benda diam tidak diberi gaya', where: '8A · Kenapa kelereng berhenti?', held: 9, resolved: 3 },
  { misconception: 'Gerak butuh gaya terus-menerus', where: '8C · Tarik tambang', held: 7, resolved: 4 },
]

export function trendPoint(weekIndex: number, percent: number): { x: number; y: number } {
  return { x: 36 + weekIndex * 80, y: 130 - percent * 2 }
}

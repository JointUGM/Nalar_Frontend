// Supplied "NALAR — Siswa" dashboard sample for Raka Pratama (the same fictional student as the Guru report). Nothing here is a score,
// a correctness label or another student's content. All of it is fictional review data.
export const studentUser = 'Raka Pratama'
export const studentDetail = 'Kelas 8B · SMPN 5'
// A fixed fictional "today", formatted for Indonesia at the display boundary.
export const studentToday = '2026-09-24T07:30:00+07:00'

export interface OpenMission {
  id: string; title: string; teacher: string
  kind: 'start' | 'resume'
  badge: string; blurb: string
  topic?: string; questions?: string
  progress?: { done: number; total: number }
}

export const openMissions: readonly OpenMission[] = [
  { id: 'kelereng', title: 'Kenapa kelereng berhenti?', teacher: 'IPA · Bu Sari', kind: 'start', badge: 'Ditutup 15.00',
    blurb: 'Satu soal, lalu beberapa pertanyaan tentang alasanmu. Sekitar 15 menit.', topic: 'Gaya dan Gerak', questions: '1 + 4 sampai 6' },
  { id: 'tekanan', title: 'Tekanan Zat', teacher: 'IPA · Bu Sari', kind: 'resume', badge: 'Terputus',
    blurb: 'Jawabanmu sampai pertanyaan 2 sudah tersimpan. Lanjutkan sebelum 14.30.', progress: { done: 2, total: 5 } },
]

export interface MissionRow { title: string; topic: string; when: string }
export const missionRows: Readonly<{ upcoming: readonly MissionRow[]; done: readonly MissionRow[] }> = {
  upcoming: [{ title: 'Mendorong lemari', topic: 'Gaya dan Gerak', when: 'Sen, 28 Sep' }, { title: 'Pisau tumpul, pisau tajam', topic: 'Tekanan Zat', when: 'Kam, 1 Okt' }],
  done: [{ title: 'Bola yang dilempar ke atas', topic: 'Gaya dan Gerak', when: '17 Sep' }, { title: 'Tarik tambang', topic: 'Gaya dan Gerak', when: '10 Sep' }, { title: 'Mendorong mobil mogok', topic: 'Gaya dan Gerak', when: '3 Sep' }],
}

export interface StudentKpi { label: string; value: string; caption: string; trend?: readonly number[] }
export const studentKpis: readonly StudentKpi[] = [
  { label: 'Misi terbuka', value: String(openMissions.length), caption: '1 ditutup hari ini' },
  { label: 'Misi selesai', value: '4', caption: 'Semester ini', trend: [1, 2, 3, 4] },
  { label: 'Berubah pikiran', value: '3 kali', caption: 'Jawaban yang kamu ubah sendiri', trend: [0, 1, 1, 3] },
  { label: 'Refleksi baru', value: '1', caption: 'Belum kamu baca' },
]

// The student's own words before and after; shown as quotes, never judged.
export interface Shift { title: string; date: string; before: string; after: string }
export const shifts: readonly Shift[] = [
  { title: 'Kenapa kelereng berhenti?', date: '24 Sep', before: 'dorongan dari tangan sudah habis', after: 'bukan dorongannya yang habis, tapi ada yang melawan' },
  { title: 'Tarik tambang', date: '10 Sep', before: 'tim yang lebih kuat pasti menang', after: 'kalau gayanya sama besar, talinya diam' },
  { title: 'Bola yang dilempar ke atas', date: '17 Sep', before: 'waktu naik tidak ada gaya gravitasi', after: 'gravitasi tetap menarik ke bawah dari awal' },
]

export const formatToday = () => new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Asia/Jakarta' }).format(new Date(studentToday))

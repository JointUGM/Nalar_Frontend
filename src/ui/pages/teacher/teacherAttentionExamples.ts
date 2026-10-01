import { monitorExample, studentNames } from './teacherSessionExamples'

export type AttentionKind = 'safety' | 'flag' | 'approve'
export interface AttentionItem {
  id: string; kind: AttentionKind; context: string; when: string; name: string; title: string; summary: string
  metaLeft: string; metaRight: string
  progress: { percent: number; label: string; text: string }
  last: { value: string; caption: string }
  signal: { value: string; caption: string }
  note: string; boxTitle: string; box: string; evidence: readonly string[]
}

export const severity = {
  safety: { label: 'KESELAMATAN', icon: 'heart' },
  flag: { label: 'PERLU VERIFIKASI', icon: 'flag' },
  approve: { label: 'MENUNGGU PERSETUJUAN', icon: 'clock' },
} as const

/** The teacher already reviewed twelve notes this week (supplied count); only the open ones below are listed. */
export const reviewedEarlier = 12

const mission = 'Kenapa kelereng berhenti? · 8B'
const [jokoIndex, rakaIndex] = monitorExample.flaggedIndexes

// Supplied "Perlu perhatian" sample. The paused and flagged students are the monitor's, so the screens agree. Fictional, teacher-only.
export const attentionItems: readonly AttentionItem[] = [
  { id: 'citra-pause', kind: 'safety', context: mission, when: monitorExample.pausedAt, name: studentNames[monitorExample.pausedIndex], title: 'Sesi dijeda pada pertanyaan 2',
    summary: 'Tulisannya menunjukkan tanda tertekan. Sesi dijeda dan pesan dukungan ditampilkan ke siswa.', metaLeft: 'Guru pengawas: Anda', metaRight: 'Tidak dicatat sebagai verifikasi',
    progress: { percent: 40, label: '2/5', text: 'Dijeda' }, last: { value: monitorExample.pausedAt, caption: '6 menit lalu' }, signal: { value: 'Tertekan', caption: 'Dari isi jawaban' },
    note: 'Sesi dijeda otomatis. Siswa melihat pesan dukungan dan ajakan berbicara dengan guru. Sesi bisa dilanjutkan bersama Anda.',
    boxTitle: 'Langkah yang disarankan', box: 'Hampiri siswa secara pribadi. Jika perlu, hubungi guru BK sekolah. Isi jawaban hanya terlihat oleh Anda.',
    evidence: [`Jeda pada ${monitorExample.pausedAt}, pertanyaan 2 dari 5`, 'Pemberitahuan terkirim ke Anda dalam 3 detik', 'Tidak memengaruhi skor atau catatan verifikasi'] },
  { id: 'joko-paste', kind: 'flag', context: mission, when: '10.42', name: studentNames[jokoIndex], title: 'Tempel teks besar',
    summary: '214 karakter ditempel pada 10.42, 86% dari jawaban soal pembuka. Dua jawaban berikutnya jauh lebih singkat.', metaLeft: 'Sinyal: 2', metaRight: 'Tidak mengubah skor',
    progress: { percent: 100, label: '5/5', text: 'Selesai 10.51' }, last: { value: '10.51', caption: 'Selesai' }, signal: { value: '214 karakter', caption: 'Ditempel sekaligus' },
    note: 'Jawaban soal pembuka memakai istilah “Hukum I Newton” yang tidak muncul lagi di jawaban berikutnya.',
    boxTitle: 'Yang terlihat dari sesi', box: 'Jawaban pembuka sangat lengkap, lalu kualitas giliran 1 dan 2 turun tajam. Pola ini disebut “kuat di awal, runtuh setelah ditanya”.',
    evidence: ['Tempel 214 karakter pada 10.42', 'Kualitas giliran: 4 → 1 → 1', 'Tidak pindah tab'] },
  { id: 'raka-tab', kind: 'flag', context: mission, when: '10.46', name: studentNames[rakaIndex], title: 'Pindah tab',
    summary: 'Meninggalkan halaman 2 kali, total 41 detik, saat menjawab pertanyaan 2.', metaLeft: 'Sinyal: 1', metaRight: 'Tidak mengubah skor',
    progress: { percent: 100, label: '5/5', text: 'Selesai 10.52' }, last: { value: '10.52', caption: 'Selesai' }, signal: { value: '41 detik', caption: '2 kali pindah tab' },
    note: 'Jawaban setelah kembali konsisten dengan jawaban sebelumnya. Raka berubah pikiran di giliran 1, sebelum pindah tab.',
    boxTitle: 'Yang terlihat dari sesi', box: 'Tidak ada lonjakan kualitas setelah kembali. Catatan ini kemungkinan besar tidak bermasalah.',
    evidence: ['Pindah tab 10.46 selama 28 detik', 'Pindah tab 10.47 selama 13 detik', 'Kualitas giliran stabil: 2 → 3 → 3'] },
  { id: 'maya-collapse', kind: 'flag', context: 'Bola yang dilempar ke atas · 8B', when: 'Kemarin', name: 'Maya Sari', title: 'Kuat di awal, runtuh setelah ditanya',
    summary: 'Soal pembuka dijawab sangat lengkap, dua pertanyaan berikutnya hanya dijawab “gatau”.', metaLeft: 'Sinyal: 1', metaRight: 'Tidak mengubah skor',
    progress: { percent: 100, label: '5/5', text: 'Selesai' }, last: { value: 'Kemarin', caption: '14.10' }, signal: { value: '4 → 0', caption: 'Kualitas giliran' },
    note: 'Tidak ada tempel atau pindah tab. Bisa jadi Maya menghafal, atau kelelahan.',
    boxTitle: 'Yang terlihat dari sesi', box: 'Jawaban pembuka memakai kalimat buku paket hampir kata per kata. Pertanyaan tentang situasi baru tidak dijawab.',
    evidence: ['Kualitas giliran: 4 → 0 → 0', 'Mengetik 3 menit di soal pembuka', 'Tidak ada tempel'] },
  { id: 'kb-tekanan', kind: 'approve', context: 'Basis pengetahuan · IPA', when: 'Tadi pagi', name: 'Tekanan Zat', title: 'Draf siap ditinjau',
    summary: '7 konsep dan 9 miskonsepsi dari 18 halaman. Belum bisa dipakai misi sebelum Anda setujui.', metaLeft: 'Pemilik: Anda', metaRight: 'Dibuat AI',
    progress: { percent: 100, label: '5/5', text: 'Draf lengkap' }, last: { value: '07.12', caption: 'Selesai disusun' }, signal: { value: 'Menunggu', caption: 'Persetujuan Anda' },
    note: 'Setiap konsep menunjuk halaman sumbernya. Anda bisa mengarsipkan item yang keliru.',
    boxTitle: 'Saran Asisten NALAR', box: 'Periksa 2 miskonsepsi tekanan hidrostatis. Contoh pembandingnya masih umum untuk siswa kelas 8.',
    evidence: ['7 konsep, 6 hubungan prasyarat', '9 miskonsepsi, 18 contoh pembanding', 'Dicocokkan ke CP Fase D'] },
]

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

export const joinPath = '/review/student/join'
export const missionStartPath = (id: string) => `/review/student/missions/${id}/start`
export const homePath = '/review/student/home'

// Supplied join screen. This code is the one the teacher's projector example shows; every other code resolves by the review scenario.
export const joinExample = { code: 'K7Q2MW', mission: 'Kenapa kelereng berhenti?', teacher: 'Bu Sari', klass: '8B' }

// Supplied mission introduction (the window-entry screen). Times are WIB.
export const introExample = {
  subject: 'IPA · Gaya dan Gerak', teacher: 'Bu Sari', attempts: '1 kesempatan', opens: '07.30', closes: '15.00',
  stats: [
    { icon: 'message', value: '1 soal + 4–6 pertanyaan', caption: 'Tentang alasanmu' },
    { icon: 'clock', value: '± 15 menit', caption: 'Maksimal 20 menit' },
    { icon: 'lock', value: 'Tanpa nilai', caption: 'Tidak ada benar atau salah' },
  ] as const,
  steps: [
    ['Jawab satu soal dengan kata-katamu', 'Tidak perlu istilah yang rumit.'],
    ['NALAR bertanya tentang alasanmu', '4 sampai 6 pertanyaan lanjutan.'],
    ['Kamu dapat refleksi', 'Tentang cara kamu berpikir hari ini.'],
  ] as const,
  notes: ['Tidak ada jawaban yang dinilai benar atau salah di sini. Yang penting alasanmu.', 'Boleh berubah pikiran. Itu tanda kamu sedang berpikir.', 'Tetap di halaman ini sampai selesai, ya.'] as const,
}

export const lobbyPath = (id: string) => `/review/student/missions/${id}/lobby`

// Supplied waiting room and warm-up. The warm-up question is unscored: no option is marked right or wrong and nothing is revealed.
export const lobbyExample = {
  subject: 'IPA · Gaya dan Gerak', teacher: 'Bu Sari', klass: '8B', attempts: '1 kesempatan',
  warmQuestion: 'Kelereng digelindingkan di lantai yang sangat licin, hampir tanpa gesekan. Apa yang terjadi?',
  warmOptions: ['Berhenti secepat di lantai biasa', 'Melaju jauh sekali sebelum berhenti', 'Langsung berhenti begitu dilepas'],
  steps: [
    ['Jawab dengan kata-katamu', 'Satu soal pembuka. Tidak perlu istilah yang rumit.'],
    ['NALAR menanyakan alasanmu', '4 sampai 6 pertanyaan lanjutan. Tiap jawabanmu membuka pertanyaan berikutnya.'],
    ['Kamu dapat refleksi', 'Tentang cara kamu berpikir hari ini. Bukan nilai.'],
  ] as const,
  pills: [['lock', 'Tanpa nilai'], ['refresh', 'Boleh berubah pikiran'], ['clock', 'Sekitar 15 menit, paling lama 20'], ['monitor', 'Tetap di halaman ini sampai selesai']] as const,
}

export const sessionPath = (id: string) => `/review/student/missions/${id}/session`

// Supplied focus-session sample: a fixed script, not generated questions. The sample answers only fill the composer on request,
// as a labelled review shortcut; the student's own typed answers are the ones shown back. Elapsed times are fixed examples, not a clock.
export const sessionExample = {
  questions: [
    'Raka menggelindingkan kelereng di lantai keramik kelas. Kelereng itu melaju, makin lambat, lalu berhenti di dekat pintu. Kenapa kelereng itu akhirnya berhenti?',
    'Kamu bilang dorongannya habis. Kalau begitu, kenapa pesawat luar angkasa tetap melaju walau mesinnya mati?',
    'Apa yang membuatmu yakin? Gaya apa saja yang bekerja pada kelereng itu setelah lepas dari tangan?',
    'Bayangkan kelereng yang sama digelindingkan di atas es. Apa yang berbeda, dan kenapa?',
    'Kalau lantainya diganti karpet, apa yang berubah pada gaya-gaya itu?',
    'Sebuah sepeda tetap melaju sebentar setelah kamu berhenti mengayuh. Bagaimana kamu menjelaskannya dengan idemu tadi?',
  ],
  sampleAnswers: [
    'Karena dorongan dari tangan Raka sudah habis, jadi kelerengnya berhenti.',
    'Hmm, di luar angkasa tidak ada udara yang menahan. Jadi mungkin bukan dorongannya yang habis, tapi ada yang melawan kalau di bumi?',
    'Ada gaya gesek dari lantai yang arahnya berlawanan dengan gerak kelereng. Sama gaya gravitasi ke bawah, tapi itu ditahan lantai.',
    'Kelerengnya bakal lebih jauh karena es licin, gesekannya kecil. Jadi melambatnya lebih pelan.',
    'Gesekannya jadi lebih besar, jadi kelereng cepat berhenti. Gaya dari tangan tidak berubah, yang beda gaya lawannya.',
    'Sepeda masih bergerak karena tidak ada yang langsung menghentikannya. Pelan-pelan berhenti karena gesekan ban dan udara.',
  ],
  elapsedSeconds: [0, 95, 190, 290, 410, 520],
  closes: '15.00',
}
export const formatClock = (seconds: number) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`

export const resumePath = (id: string) => `/review/student/missions/${id}/resume`

// Supplied "Lanjutkan sesi" screen: what was saved when the connection dropped. Times are WIB.
export const resumeExample = { savedAt: '13.52', closes: '14.30' }

// Supplied safety-pause copy. The pause is supportive, never a verdict, and only the teacher can end it.
export const pauseExample = {
  title: 'Kita berhenti sebentar, ya.',
  message: (teacher: string) => `Terima kasih sudah jujur menulis itu. ${teacher} sudah diberi tahu dan akan menghampirimu. Kamu tidak sendirian.`,
  saved: 'Sesimu disimpan. Kamu bisa melanjutkannya nanti bersama gurumu.',
  help: 'Butuh teman bicara di luar sekolah? Layanan SAPA 129 bisa dihubungi kapan saja.',
}

// Neutral end states. These two are not in the supplied screens; they only say what happened and what is kept.
export type EndKind = 'timedOut' | 'ended'
export const endExample: Readonly<Record<EndKind, { badge: string; title: string; message: (teacher: string) => string }>> = {
  timedOut: { badge: 'Misi ditutup', title: 'Waktu mengerjakan sudah habis.', message: () => 'Jawaban yang sudah kamu kirim tetap tersimpan. Tidak ada yang perlu kamu lakukan lagi.' },
  ended: { badge: 'Sesi selesai', title: 'Sesi kelas ini sudah diakhiri.', message: (teacher) => `${teacher} mengakhiri sesi ini. Jawaban yang sudah kamu kirim tetap tersimpan.` },
}

import type { AliveMood } from '@/ui/pages/landing/components/NalaAlive'

// Example content only. It follows the documented demo topic (IPA kelas 8, Gaya dan Gerak) and its
// misconception "gaya dorong bisa habis". Names, class and counts are fictional and labelled as such on the page.

export const SECTIONS = [
  ['beranda', 'Beranda'],
  ['dialog', 'Dialog Sokratik'],
  ['bukti', 'Untuk Guru'],
  ['peta-kelas', 'Peta Kelas'],
  ['cara-kerja', 'Cara Kerja'],
  ['tanya-jawab', 'Tanya Jawab'],
] as const

export type HeroScene = 'hello' | 'ask' | 'think' | 'evidence'

/** The hero's looped motion graphic: Nala greets, asks, waits while the student answers, then the teacher's evidence lands. */
export const HERO_SCENES: readonly { scene: HeroScene; mood: AliveMood; ms: number }[] = [
  { scene: 'hello', mood: 'hello', ms: 3200 },
  { scene: 'ask', mood: 'ask', ms: 3600 },
  { scene: 'think', mood: 'think', ms: 3400 },
  { scene: 'evidence', mood: 'calm', ms: 4600 },
]

export const HERO_LINES = {
  greeting: 'Halo, aku Nala. Aku tidak memberi jawaban. Aku bertanya.',
  probe: 'Kamu bilang dorongannya habis. Kalau begitu, kenapa pesawat luar angkasa tetap melaju walau mesinnya mati?',
  answer: 'Hmm, di luar angkasa tidak ada yang menghalangi. Mungkin di lantai ada yang melawan gerak kelereng?',
  evidence: 'mungkin di lantai ada yang melawan gerak kelereng',
} as const

export const JOIN_CODE = 'KLR8MB'
export const TOTAL_PROMPTS = 5

export interface Seat {
  initials: string
  /** Order in which this student joins the lobby; null when absent. */
  joins: number | null
  /** Prompts reached when the example settles, out of TOTAL_PROMPTS. */
  reached: number
}

const roster: readonly [string, number][] = [
  ['AR', 5], ['BS', 3], ['CN', 4], ['DP', 2], ['EK', 5], ['FA', 3], ['GW', 4], ['HS', 0],
  ['IM', 3], ['JL', 5], ['KR', 2], ['LT', 4], ['MY', 0], ['NP', 3], ['OF', 5], ['PA', 4],
  ['QI', 3], ['RK', 5], ['SD', 2], ['TN', 0], ['UH', 4], ['VR', 3], ['WS', 5], ['XA', 4],
  ['YD', 3], ['ZM', 0], ['AB', 5], ['BC', 2], ['CD', 4], ['DE', 0], ['EF', 3], ['FG', 5],
]
// A shuffled but fixed join order over the present students, so the room fills unevenly the way a real class does.
const joinOrder = [3, 17, 8, 0, 30, 5, 21, 14, 27, 1, 10, 23, 6, 2, 16, 9, 24, 4, 31, 15, 11, 20, 26, 13, 18, 22, 28]

export const SEATS: readonly Seat[] = roster.map(([initials, reached], index) => {
  const order = joinOrder.indexOf(index)
  return { initials, joins: order === -1 ? null : order, reached }
})

export const JOINED = SEATS.filter((seat) => seat.joins !== null).length
export const FINISHED = SEATS.filter((seat) => seat.joins !== null && seat.reached === TOTAL_PROMPTS).length

export interface DialogueStep {
  id: string
  title: string
  note: string
  /** What the teacher later reads on the report: the move and its plain-language reason. Never shown to students. */
  teacherNote?: { move: string; reason: string }
  screen: {
    prompt: string
    promptKind: 'anchor' | 'probe'
    mood: AliveMood
    previous?: string
    answer: string
    answerState: 'typing' | 'sent'
    position: number
  }
}

export const DIALOGUE: readonly DialogueStep[] = [
  {
    id: 'pembuka',
    title: 'Soal pembuka dari misi guru',
    note: 'Satu masalah dari kehidupan sehari-hari yang tidak bisa dijawab dengan satu kata. Siswa menjawab dengan kalimatnya sendiri.',
    screen: {
      prompt: 'Sebuah kelereng digelindingkan di lantai keramik. Lama-lama kelereng itu melambat, lalu berhenti. Kenapa begitu?',
      promptKind: 'anchor',
      mood: 'ask',
      answer: 'Karena dorongan dari tangan sudah habis, jadi kelerengnya berhenti.',
      answerState: 'sent',
      position: 1,
    },
  },
  {
    id: 'pembanding',
    title: 'Nala menguji ide itu',
    note: 'Nala memakai kata-kata siswa untuk menyodorkan contoh pembanding. Tidak ada koreksi, tidak ada petunjuk jawaban.',
    teacherNote: { move: 'Contoh pembanding', reason: 'siswa menyebut “dorongannya habis”' },
    screen: {
      prompt: 'Kamu bilang dorongannya habis. Kalau begitu, kenapa pesawat luar angkasa tetap melaju walau mesinnya dimatikan?',
      promptKind: 'probe',
      mood: 'think',
      previous: 'Karena dorongan dari tangan sudah habis, jadi kelerengnya berhenti.',
      answer: 'Hmm, di luar angkasa tidak ada yang menghalangi. Mungkin di lantai ada sesuatu yang melawan gerak kelereng?',
      answerState: 'sent',
      position: 2,
    },
  },
  {
    id: 'alasan',
    title: 'Siswa berpikir ulang sendiri',
    note: 'Tidak ada yang memberi tahu siswa bahwa idenya keliru. Pertanyaannya yang membuat ia meninjau ulang alasannya.',
    teacherNote: { move: 'Minta alasan', reason: 'memastikan siswa bisa menjelaskan mekanismenya' },
    screen: {
      prompt: 'Apa yang membuatmu yakin? Gaya apa saja yang bekerja pada kelereng itu setelah tanganmu lepas?',
      promptKind: 'probe',
      mood: 'ask',
      previous: 'Hmm, di luar angkasa tidak ada yang menghalangi. Mungkin di lantai ada sesuatu yang melawan gerak kelereng?',
      answer: 'Ada gesekan dengan lantai, sama udara juga sedikit. Itu yang bikin pelan.',
      answerState: 'sent',
      position: 3,
    },
  },
  {
    id: 'situasi-baru',
    title: 'Setiap konsep target diuji',
    note: 'Permintaan seperti “udahan dong” tidak memperpendek sesi. Setiap konsep target tetap mendapat pertanyaan tantangan sebelum sesi selesai.',
    teacherNote: { move: 'Situasi baru', reason: 'menguji apakah pemahaman bisa dipindahkan' },
    screen: {
      prompt: 'Bayangkan kelereng yang sama digelindingkan di atas es. Apa yang berbeda, dan kenapa?',
      promptKind: 'probe',
      mood: 'ask',
      previous: 'Ada gesekan dengan lantai, sama udara juga sedikit. Itu yang bikin pelan.',
      answer: 'Di es lebih licin, jadi gesekannya kecil dan kelereng',
      answerState: 'typing',
      position: 4,
    },
  },
]

export interface EvidenceRow {
  dimension: string
  question: string
  level: number
  aiLevel?: number
  quote: string
  turn: number
  override?: string
}

export const EVIDENCE: readonly EvidenceRow[] = [
  { dimension: 'Klaim', question: 'Apa jawabannya?', level: 3, quote: 'Mungkin di lantai ada sesuatu yang melawan gerak kelereng?', turn: 2 },
  { dimension: 'Bukti', question: 'Apa yang mendukungnya?', level: 2, quote: 'di luar angkasa tidak ada yang menghalangi', turn: 2 },
  {
    dimension: 'Mekanisme',
    question: 'Bagaimana cara kerjanya?',
    level: 3,
    aiLevel: 2,
    quote: 'Ada gesekan dengan lantai, sama udara juga sedikit. Itu yang bikin pelan.',
    turn: 3,
    override: 'Siswa menyebut dua gaya penghambat dengan kata-katanya sendiri.',
  },
  { dimension: 'Transfer', question: 'Apakah berlaku di situasi lain?', level: 2, quote: 'Di es lebih licin, jadi gesekannya kecil dan kelereng menggelinding lebih jauh.', turn: 4 },
]

export interface MisconceptionCount {
  key: string
  statement: string
  count: number
}

export const CLASS_TOTAL = JOINED
export const MISCONCEPTIONS: readonly MisconceptionCount[] = [
  { key: 'gaya_habis', statement: 'Gaya dorong bisa habis', count: 11 },
  { key: 'diam_tanpa_gaya', statement: 'Benda diam tidak punya gaya', count: 6 },
  { key: 'berat_lebih_cepat', statement: 'Benda berat jatuh lebih cepat', count: 4 },
]
export const CHANGED_MIND = 7

export interface Stage {
  title: string
  body: string
  gate?: { title: string; body: string }
}

export const STAGES: readonly Stage[] = [
  {
    title: 'Materi ajar',
    body: 'Guru mengunggah buku atau modul. Sistem memecahnya per bab dan mengusulkan konsep serta miskonsepsi yang umum.',
    gate: { title: 'Guru menyetujui satu per satu', body: 'Hanya konsep dan miskonsepsi yang disetujui yang boleh dipakai dalam misi.' },
  },
  {
    title: 'Misi',
    body: 'Dari tujuan belajar, sistem menyusun soal pembuka, rubrik empat dimensi, dan bank pertanyaan lanjutan.',
    gate: { title: 'Guru meninjau lalu menerbitkan', body: 'Versi yang diterbitkan terkunci. Suntingan berikutnya menjadi versi baru.' },
  },
  {
    title: 'Sesi kelas',
    body: 'Lewat kode di proyektor atau jadwal yang dibuka guru. Sekitar 15 menit per siswa, dengan batas 20 menit.',
  },
  {
    title: 'Laporan dan peta kelas',
    body: 'Skor dengan kutipan bukti untuk tiap siswa, jumlah persis per miskonsepsi untuk seluruh kelas.',
    gate: { title: 'Guru bisa mengubah skor', body: 'Alasan wajib diisi. Skor asli dari AI tetap tersimpan.' },
  },
  {
    title: 'Ringkasan orang tua',
    body: 'Ringkasan perkembangan tanpa angka, ditulis sekali dan bisa dipratinjau guru.',
    gate: { title: 'Guru merilis', body: 'Sebelum dirilis, orang tua tidak melihat apa pun dari misi itu.' },
  },
]

export type Access = 'ya' | 'tidak' | 'setelah-rilis'

export const VISIBILITY: readonly { item: string; siswa: Access; guru: Access; orangTua: Access }[] = [
  { item: 'Pertanyaan dari Nala', siswa: 'ya', guru: 'ya', orangTua: 'tidak' },
  { item: 'Skor penalaran', siswa: 'tidak', guru: 'ya', orangTua: 'tidak' },
  { item: 'Kutipan bukti dan alasan tiap pertanyaan', siswa: 'tidak', guru: 'ya', orangTua: 'tidak' },
  { item: 'Catatan perlu verifikasi', siswa: 'tidak', guru: 'ya', orangTua: 'tidak' },
  { item: 'Peta kelas', siswa: 'tidak', guru: 'ya', orangTua: 'tidak' },
  { item: 'Ringkasan perkembangan', siswa: 'tidak', guru: 'ya', orangTua: 'setelah-rilis' },
]

export const FAQ: readonly { question: string; answer: string }[] = [
  {
    question: 'Apakah NALAR menggantikan guru?',
    answer: 'Tidak. Guru menyetujui basis pengetahuan dan misi, bisa mengubah setiap skor dengan alasan, dan memutuskan kapan hasil dirilis ke orang tua.',
  },
  {
    question: 'Apakah siswa melihat nilainya?',
    answer: 'Tidak. Setelah sesi, siswa menerima refleksi tanpa angka: apa yang sudah kuat, di mana ia berubah pikiran, dan satu pertanyaan untuk dipikirkan.',
  },
  {
    question: 'Apakah NALAR menuduh siswa menyontek?',
    answer: 'Tidak pernah. Tempelan teks yang panjang, perpindahan tab, atau pola jawaban yang janggal dicatat sebagai “Perlu verifikasi” lengkap dengan waktu dan jumlah karakternya. Guru yang memeriksa, catatan itu tidak mengubah skor, dan isi ketikan tidak pernah direkam.',
  },
  {
    question: 'Bagaimana jika siswa menulis sesuatu yang mengkhawatirkan?',
    answer: 'Sesi dijeda, siswa melihat pesan yang menenangkan, dan guru yang mengawasi langsung diberi tahu. Ini terpisah dari catatan perlu verifikasi.',
  },
  {
    question: 'Berapa lama satu sesi?',
    answer: 'Sekitar 15 menit: satu soal pembuka lalu 4 sampai 6 pertanyaan lanjutan. Batasnya 20 menit sejak siswa mulai.',
  },
  {
    question: 'Bagaimana cara mendapatkan akun?',
    answer: 'Akun dibuat oleh admin sekolah, bukan oleh pengguna sendiri. Guru, siswa, dan orang tua masuk dengan akun yang diberikan sekolah.',
  },
]

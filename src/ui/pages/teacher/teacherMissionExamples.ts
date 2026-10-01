export const missionsPath = '/review/teacher/missions'
export const generatedMissionId = 'kenapa-kelereng-berhenti'

export interface Mission { id: string; topic: string; title: string; goal: string; version: string; draft: boolean; classes: readonly string[]; changedMinds: number | null }
export interface MissionCheck { label: string; pass: boolean; note?: string }
export interface MissionVersion { version: string; note: string; date: string; tag: string; draft: boolean }
export interface MissionReview {
  subtitle: string
  concepts: readonly string[]
  anchor: { question: string; answer: string }
  stats: readonly (readonly [label: string, value: string])[]
  checks: readonly MissionCheck[]
  rubric: readonly { dimension: string; levels: readonly string[] }[]
  bank: readonly { move: string; count: string; questions: readonly string[] }[]
  versions: readonly MissionVersion[]
}

export const missionLabel = (mission: Pick<Mission, 'version' | 'draft'>) => mission.draft ? `${mission.version} · draf` : mission.version

// Supplied "Misi" sample. Only the first mission has an example review in the reference.
export const missionsBySchool: Readonly<Record<string, readonly Mission[]>> = {
  'SMPN 5 Yogyakarta': [
    { id: generatedMissionId, topic: 'Gaya dan Gerak', title: 'Kenapa kelereng berhenti?', goal: 'Menjelaskan perlambatan dengan konsep gaya gesek.', version: 'Versi 3', draft: true, classes: ['8A', '8B'], changedMinds: 10 },
    { id: 'bola-dilempar-ke-atas', topic: 'Gaya dan Gerak', title: 'Bola yang dilempar ke atas', goal: 'Menjelaskan arah gaya gravitasi pada benda yang bergerak naik.', version: 'Versi 1', draft: false, classes: ['8B', '8C', '8D'], changedMinds: 17 },
    { id: 'tarik-tambang', topic: 'Gaya dan Gerak', title: 'Tarik tambang', goal: 'Menentukan resultan dua gaya yang berlawanan.', version: 'Versi 2', draft: false, classes: ['8C'], changedMinds: 4 },
    { id: 'pisau-tumpul-pisau-tajam', topic: 'Tekanan Zat', title: 'Pisau tumpul, pisau tajam', goal: 'Menghubungkan luas bidang tekan dengan besar tekanan.', version: 'Versi 1', draft: true, classes: [], changedMinds: null },
    { id: 'mendorong-lemari', topic: 'Gaya dan Gerak', title: 'Mendorong lemari', goal: 'Membedakan gaya gesek statis dan kinetis.', version: 'Versi 1', draft: false, classes: ['8B'], changedMinds: 6 },
  ],
  'SMP Muhammadiyah 2': [],
}

export const missionReviews: Readonly<Record<string, MissionReview>> = {
  [generatedMissionId]: {
    subtitle: 'Gaya dan Gerak · versi 2 terkunci di 8A dan 8B',
    concepts: ['Gaya gesek', 'Kelembaman'],
    anchor: {
      question: 'Raka menggelindingkan kelereng di lantai keramik kelas. Kelereng itu melaju, makin lambat, lalu berhenti di dekat pintu. Kenapa kelereng itu akhirnya berhenti?',
      answer: 'Kelereng melambat karena gaya gesek antara kelereng dan lantai bekerja berlawanan arah gerak. Tanpa gesekan, kelereng terus bergerak dengan kecepatan tetap (kelembaman).',
    },
    stats: [['Pertanyaan lanjutan', '4–6'], ['Durasi maks.', '20 menit'], ['Mode penanya', 'Hibrida']],
    checks: [
      { label: 'Tidak menyebut konsep', pass: true },
      { label: 'Tidak ada kebocoran', pass: true },
      { label: 'Minimal 2 pertanyaan per langkah', pass: true },
      { label: 'Panjang pertanyaan', pass: false, note: '1 pertanyaan terlalu panjang' },
    ],
    rubric: [
      { dimension: 'Klaim', levels: ['Tidak ada klaim', 'Klaim tidak jelas', 'Jelas, tidak terkait', 'Jelas dan terkait', 'Tepat dan spesifik'] },
      { dimension: 'Bukti', levels: ['Tanpa bukti', 'Tidak relevan', 'Satu bukti relevan', 'Beberapa bukti', 'Dari situasi nyata'] },
      { dimension: 'Mekanisme', levels: ['Tidak menjelaskan', 'Menyebut istilah', 'Sebab-akibat sebagian', 'Sebab-akibat lengkap', 'Dengan arah gaya'] },
      { dimension: 'Transfer', levels: ['Tidak mencoba', 'Mengulang jawaban', 'Menerapkan sebagian', 'Menerapkan dengan benar', 'Menerapkan dan memprediksi'] },
    ],
    bank: [
      { move: 'Minta alasan', count: '4 pertanyaan', questions: ['Apa yang membuatmu yakin? Gaya apa saja yang bekerja pada kelereng itu?', 'Bagaimana kamu tahu kelereng itu melambat karena hal itu?'] },
      { move: 'Contoh pembanding', count: '4 pertanyaan', questions: ['Kalau dorongannya habis, kenapa pesawat luar angkasa tetap melaju walau mesinnya mati?'] },
      { move: 'Situasi baru', count: '4 pertanyaan', questions: ['Bayangkan kelereng yang sama digelindingkan di atas es. Apa yang berbeda, dan kenapa?'] },
      { move: 'Pecah jadi lebih kecil', count: '4 pertanyaan', questions: ['Kita pelan-pelan. Setelah tanganmu lepas, apa saja yang masih menyentuh kelereng?'] },
      { move: 'Alasan lebih dalam', count: '4 pertanyaan', questions: ['Kalau lantainya diganti karpet, apa yang berubah pada gaya-gaya itu?'] },
      { move: 'Menolak dan kembali', count: '2 pertanyaan', questions: ['Aku tidak bisa memberi jawabannya, tapi aku penasaran pendapatmu. Kenapa kelereng itu berhenti?'] },
    ],
    versions: [
      { version: 'Versi 3', note: 'Soal pembuka dipersingkat, tambah 2 pertanyaan situasi baru', date: 'Hari ini, 08.12 · Sari Wulandari', tag: 'Draf', draft: true },
      { version: 'Versi 2', note: 'Rubrik transfer diperjelas', date: '15 Sep 2026', tag: 'Terkunci · 8A, 8B', draft: false },
      { version: 'Versi 1', note: 'Dibuat AI dari tujuan pembelajaran', date: '12 Sep 2026', tag: 'Terkunci · 7B 2025', draft: false },
    ],
  },
}

// Supplied "Misi baru" form. The suggested concepts are a fixed example, not derived from the typed goal.
export const newMissionExample = {
  goal: 'Siswa dapat menjelaskan mengapa benda yang bergerak melambat lalu berhenti, dengan konsep gaya gesek.',
  topics: ['Gaya dan Gerak', 'Tekanan Zat'],
  cps: ['IPA Fase D · Gaya', 'IPA Fase D · Tekanan zat'],
  concepts: ['Gaya gesek', 'Kelembaman', 'Resultan gaya', 'Gaya normal'],
  selectedConcepts: ['Gaya gesek', 'Kelembaman'],
  generateMs: 1400,
}

// Supplied "Sesi langsung" and "Peta miskonsepsi" samples for the class 8B session. Every number here is fictional
// scenario data; nothing is measured, inferred or generated on the client.
export const studentNames = ['Adinda Putri', 'Bagas Saputra', 'Citra Maharani', 'Dimas Prasetyo', 'Eka Lestari', 'Fajar Nugroho', 'Gita Anjani', 'Hana Safitri', 'Indra Kusuma', 'Joko Susilo', 'Kirana Dewi', 'Lukman Hakim', 'Maya Sari', 'Nanda Pratiwi', 'Oki Setiawan', 'Putri Ayu', 'Qori Amalia', 'Raka Pratama', 'Salsabila Nur', 'Taufik Rahman', 'Umi Kalsum', 'Vina Oktaviani', 'Wahyu Aji', 'Xena Larasati', 'Yusuf Hidayat', 'Zahra Aulia', 'Arif Budiman', 'Bella Anggraini', 'Candra Wijaya', 'Dewi Kartika', 'Evan Pradana', 'Farah Nabila']

export const monitorExample = {
  startSeconds: 760,
  refreshSeconds: 5,
  steps: 6, // progress dots; step 6 means finished, steps 1-5 are the follow-up questions
  pausedIndex: 2, pausedAt: '10.44', notStartedIndex: 29, flaggedIndexes: [9, 17],
  mode: 'hibrida',
}

export interface MapConcept { id: string; name: string; x: number; y: number; counts: readonly [understood: number, developing: number, misconception: number] }
export interface MapMisconception { name: string; held: number; changed: number; concept: string }

export const classMapExample = {
  total: 32,
  withMisconception: 21,
  reviewedFlags: 0,
  flagged: 2,
  // x/y are percentages of the 520x360 map; leadsTo lists exactly the six lines the reference draws.
  concepts: [
    { id: 'gaya', name: 'Gaya', x: 19, y: 17, counts: [27, 5, 0] },
    { id: 'gesek', name: 'Gaya gesek', x: 50, y: 37, counts: [18, 6, 8] },
    { id: 'resultan', name: 'Resultan gaya', x: 81, y: 17, counts: [13, 15, 4] },
    { id: 'normal', name: 'Gaya normal', x: 19, y: 62, counts: [17, 9, 6] },
    { id: 'lembam', name: 'Kelembaman', x: 50, y: 80, counts: [11, 15, 6] },
    { id: 'kecepatan', name: 'Kecepatan', x: 81, y: 62, counts: [24, 8, 0] },
  ] as readonly MapConcept[],
  leadsTo: [['gaya', 'gesek'], ['gaya', 'normal'], ['gesek', 'resultan'], ['gesek', 'lembam'], ['normal', 'lembam'], ['resultan', 'kecepatan']] as readonly (readonly [string, string])[],
  misconceptions: [
    { name: 'Gaya bisa habis', held: 18, changed: 10, concept: 'Gaya gesek' },
    { name: 'Benda diam tidak diberi gaya', held: 9, changed: 3, concept: 'Gaya normal' },
    { name: 'Gerak butuh gaya terus-menerus', held: 7, changed: 1, concept: 'Kelembaman' },
    { name: 'Benda berat jatuh lebih cepat', held: 4, changed: 0, concept: 'Gaya' },
  ] as readonly MapMisconception[],
  summary: { idea: 'gaya dari tangan bisa habis', example: 'pesawat luar angkasa' },
  suggestions: [
    'Demonstrasikan keping hoki di meja licin, lalu minta 8 siswa yang belum berubah menjelaskan ke mana “tenaganya” pergi.',
    'Pasangkan siswa yang berubah pikiran dengan yang belum untuk menggambar diagram gaya bersama.',
  ],
}

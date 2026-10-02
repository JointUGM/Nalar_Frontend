// Supplied "Laporan siswa" sample for Raka Pratama (index 17 of the shared 8B roster). Teacher-only content: it
// never appears on the projector, to students or to parents. All of it is fictional scenario data.
export interface ReportTurn { label: string; move: string; why: string; question: string; answer: string; state: string; telemetry: string }
export interface ReportScore { dimension: string; score: number; turn: number; quote: string }

export const reportExample = {
  studentIndex: 17,
  attempt: 1,
  duration: '12 menit 40 detik',
  maxScore: 4,
  // The class-map misconception this student holds (it is one of `classMapExample.misconceptions`; tested).
  misconception: 'Gaya bisa habis',
  flag: { title: 'Pindah tab 2 kali, total 41 detik', where: 'Saat menjawab pertanyaan 2 · 10.46' },
  concepts: [['Gaya gesek', 'Paham'], ['Kelembaman', 'Berkembang'], ['“Gaya bisa habis”', 'Berubah selama sesi']] as readonly (readonly [string, string])[],
  // `turn` indexes `turns`; every quote is an exact excerpt of that turn's answer (tested).
  scores: [
    { dimension: 'Klaim', score: 3, turn: 1, quote: 'bukan dorongannya yang habis, tapi ada yang melawan' },
    { dimension: 'Bukti', score: 3, turn: 3, quote: 'Kelerengnya bakal lebih jauh karena es licin, gesekannya kecil' },
    { dimension: 'Mekanisme', score: 3, turn: 2, quote: 'gaya gesek dari lantai yang arahnya berlawanan dengan gerak kelereng' },
    { dimension: 'Transfer', score: 2, turn: 5, quote: 'Sepeda masih bergerak karena tidak ada yang langsung menghentikannya' },
  ] as readonly ReportScore[],
  // Review scenario: the teacher raised Transfer from 2 to 3. The original AI score is kept next to it.
  override: { dimension: 'Transfer', value: 3, reason: 'Gesekan ban dan udara disebut sebagai penyebab berhenti di giliran 5' },
  // Supplied "Kesempatan lagi" choices; the window is a fixed example, not read from the publication.
  extraAttempt: {
    window: { label: 'Jendela waktu', detail: 'Sel, 29 Sep · 07.30 – 15.00' },
    live: { label: 'Sesi langsung kecil', detail: 'Anda mulai sendiri dengan kode baru' },
  },
  turns: [
    { label: 'PEMBUKA', move: 'Soal pembuka', why: '', question: 'Raka menggelindingkan kelereng di lantai keramik kelas. Kelereng itu melaju, makin lambat, lalu berhenti di dekat pintu. Kenapa kelereng itu akhirnya berhenti?', answer: 'Karena dorongan dari tangan Raka sudah habis, jadi kelerengnya berhenti.', state: 'Miskonsepsi: “gaya bisa habis”', telemetry: 'Mengetik 48 detik · tanpa tempel' },
    { label: 'GILIRAN 1', move: 'Contoh pembanding', why: 'Dipilih karena siswa menyebut ide keliru “gaya habis”', question: 'Kamu bilang dorongannya habis. Kalau begitu, kenapa pesawat luar angkasa tetap melaju walau mesinnya mati?', answer: 'Hmm, di luar angkasa tidak ada udara yang menahan. Jadi mungkin bukan dorongannya yang habis, tapi ada yang melawan kalau di bumi?', state: 'Sebagian benar · mulai berubah', telemetry: 'Mengetik 1 menit 12 detik' },
    { label: 'GILIRAN 2', move: 'Minta alasan', why: 'Langkah bawaan untuk jawaban tanpa alasan lengkap', question: 'Apa yang membuatmu yakin? Gaya apa saja yang bekerja pada kelereng itu setelah lepas dari tangan?', answer: 'Ada gaya gesek dari lantai yang arahnya berlawanan dengan gerak kelereng. Sama gaya gravitasi ke bawah, tapi itu ditahan lantai.', state: 'Benar dengan alasan', telemetry: 'Pindah tab 2× · 41 detik' },
    { label: 'GILIRAN 3', move: 'Situasi baru', why: 'Langkah bawaan untuk jawaban benar dengan alasan', question: 'Bayangkan kelereng yang sama digelindingkan di atas es. Apa yang berbeda, dan kenapa?', answer: 'Kelerengnya bakal lebih jauh karena es licin, gesekannya kecil. Jadi melambatnya lebih pelan.', state: 'Benar dengan alasan', telemetry: 'Mengetik 54 detik' },
    { label: 'GILIRAN 4', move: 'Alasan lebih dalam', why: 'Dipilih karena jawaban terdengar hafalan', question: 'Kalau lantainya diganti karpet, apa yang berubah pada gaya-gaya itu?', answer: 'Gesekannya jadi lebih besar, jadi kelereng cepat berhenti. Gaya dari tangan tidak berubah, yang beda gaya lawannya.', state: 'Benar dengan alasan', telemetry: 'Mengetik 1 menit 3 detik' },
    { label: 'GILIRAN 5', move: 'Situasi baru', why: 'Tantangan untuk kelembaman yang belum diuji', question: 'Sebuah sepeda tetap melaju sebentar setelah kamu berhenti mengayuh. Bagaimana kamu menjelaskannya dengan idemu tadi?', answer: 'Sepeda masih bergerak karena tidak ada yang langsung menghentikannya. Pelan-pelan berhenti karena gesekan ban dan udara.', state: 'Sebagian benar', telemetry: 'Mengetik 1 menit 20 detik' },
  ] as readonly ReportTurn[],
}

import type { MissionRevisionFeedback } from '@/domain/model/Teacher'
import type { ApiError } from '@/domain/model/ApiError'
import type { MissionRubric } from '@/domain/model/Teacher'

export const versionWord: Readonly<Record<string, string>> = { draft: 'Draf', reviewed: 'Ditinjau', locked: 'Terkunci' }
export const rubricWord: readonly [keyof MissionRubric, string][] = [['claim', 'Klaim'], ['evidence', 'Bukti'], ['mechanism', 'Mekanisme'], ['transfer', 'Transfer']]
export const moveWord: Readonly<Record<string, string>> = {
  request_justification: 'Minta alasan', counter_example: 'Contoh pembanding', transfer: 'Terapkan ke situasi lain', decompose: 'Urai langkah',
  refuse_and_redirect: 'Tolak dan arahkan kembali', deeper_reason: 'Alasan lebih dalam', explain_mechanism: 'Jelaskan mekanisme', simpler_reason: 'Alasan lebih sederhana',
}

const refusals: Readonly<Record<string, string>> = {
  REVISION_IN_PROGRESS: 'Misi ini sedang disusun atau direvisi. Tunggu sampai proses selesai.',
  MISSION_VERSION_CHANGED: 'Ada versi baru sejak halaman dibuka. Periksa versi terbaru, lalu kirim revisi lagi.',
  IDEMPOTENCY_KEY_REUSED: 'Isian berubah setelah dikirim. Periksa kembali permintaan revisi.',
  REVISION_NO_CHANGE: 'Pilih bagian atau ubah tujuan, konsep, atau judul versi.',
  REVISION_BASE_INVALID: 'Versi dasar belum memiliki paket lengkap. Buat draf lengkap terlebih dahulu.',
  REVISION_SETTINGS_UNSUPPORTED: 'Revisi AI mendukung 2–3 konsep, 4–6 giliran, dan durasi 5–20 menit.',
  REVISION_QUESTIONS_UNKNOWN: 'Pertanyaan yang dipilih tidak ditemukan dalam versi dasar.',
  MISSION_REVISION_UNAVAILABLE: 'Revisi AI belum tersedia. Versi yang ada tetap dapat digunakan.',
  ITEM_NOT_APPROVED: 'Konsep atau miskonsepsi versi ini sudah tidak aktif atau belum disetujui.',
  MISSION_BUSY: 'Draf misi ini sedang disusun. Tunggu sampai selesai, lalu arsipkan.',
  MISSION_VERSION_INVALID: 'Versi ini belum bisa dipakai.',
  VERSION_LOCKED: 'Versi ini sudah diterbitkan dan terkunci. Simpan perubahan sebagai versi baru.',
  MISSION_TARGETS_UNAVAILABLE: 'Basis pengetahuan misi ini perlu sedikitnya dua konsep yang disetujui sebelum draf bisa disusun.',
  NOT_OWNER: 'Hanya pembuat misi yang bisa mengubahnya.',
}
// A refusal the teacher can act on; anything else falls back to the status message.
export const missionRefusal = (error: ApiError) => refusals[error.code] ?? null

const problems: Readonly<Record<string, string>> = {
  ITEM_NOT_APPROVED: 'Ada konsep atau miskonsepsi yang belum disetujui di basis pengetahuan.',
  TARGET_COUNT: 'Konsep sasaran harus 2 sampai 3.',
  TARGET_DUPLICATE: 'Konsep sasaran tidak boleh berulang.',
  MAX_TURNS_RANGE: 'Jumlah giliran harus 2 sampai 10.',
  MAX_TURNS_BELOW_TARGETS: 'Jumlah giliran kurang dari jumlah konsep sasaran.',
  DURATION_RANGE: 'Durasi harus 5 sampai 60 menit.',
  RUBRIC_SHAPE: 'Rubrik harus punya 4 dimensi, masing-masing 5 tingkat.',
  ANSWER_TERMS_RANGE: 'Istilah jawaban harus 1 sampai 50.',
  MOVE_MISSING: 'Bank pertanyaan belum mencakup semua jenis pertanyaan untuk tiap konsep sasaran.',
  AI_PACK_REJECTED: 'AI menolak isi versi ini. Buat ulang drafnya.',
}
export const problemWord = (code: string) => problems[code] ?? `Bank pertanyaan atau isi versi belum konsisten (${code}).`

export const revisionComponentWord: Record<MissionRevisionFeedback['component'], string> = {
  anchor_problem: 'Soal pembuka', reference_reasoning: 'Jawaban acuan', rubric: 'Rubrik', bank: 'Bank pertanyaan',
}

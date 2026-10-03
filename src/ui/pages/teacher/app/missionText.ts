import type { ApiError } from '@/domain/model/ApiError'
import type { MissionRubric } from '@/domain/model/Teacher'

export const versionWord: Readonly<Record<string, string>> = { draft: 'Draf', reviewed: 'Ditinjau', locked: 'Terkunci' }
export const rubricWord: readonly [keyof MissionRubric, string][] = [['claim', 'Klaim'], ['evidence', 'Bukti'], ['mechanism', 'Mekanisme'], ['transfer', 'Transfer']]
export const moveWord: Readonly<Record<string, string>> = {
  request_justification: 'Minta alasan', counter_example: 'Contoh pembanding', transfer: 'Terapkan ke situasi lain', decompose: 'Urai langkah',
  refuse_and_redirect: 'Tolak dan arahkan kembali', deeper_reason: 'Alasan lebih dalam', explain_mechanism: 'Jelaskan mekanisme', simpler_reason: 'Alasan lebih sederhana',
}

const refusals: Readonly<Record<string, string>> = {
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

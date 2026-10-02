import type { ApiError } from '@/domain/model/ApiError'

export const reviewWord: Readonly<Record<string, string>> = { pending: 'Menunggu tinjauan', approved: 'Disetujui', rejected: 'Ditolak' }
export const buildWord: Readonly<Record<string, string>> = { queued: 'Dalam antrean', building: 'Sedang disusun', built: 'Sudah disusun', failed: 'Gagal disusun' }

const refusals: Readonly<Record<string, string>> = {
  FILE_TOO_LARGE: 'Berkas lebih dari 50 MB. Pilih berkas yang lebih kecil.',
  FILE_NOT_PDF: 'Hanya berkas PDF yang bisa diunggah.',
  NOT_ASSIGNED_TO_SUBJECT: 'Anda tidak ditugaskan mengajar mata pelajaran ini di sekolah ini.',
  TOPIC_ALREADY_EXISTS: 'Topik dengan nama ini sudah ada. Buka topiknya dan tambahkan materi di sana.',
  NOT_OWNER: 'Hanya pemilik basis pengetahuan ini yang bisa mengubahnya.',
  ITEM_NOT_PENDING: 'Butir ini sudah ditinjau, jadi tidak bisa diubah lagi.',
  ITEM_CHANGED: 'Butir ini baru saja diubah. Periksa isi terbarunya, lalu simpan lagi.',
  CONCEPT_NOT_APPROVED: 'Setujui konsepnya dulu, baru miskonsepsinya.',
  SECTION_OVERLAP: 'Halaman bab ini tumpang-tindih dengan bab lain yang sudah disusun.',
}
// A refusal the teacher can act on; anything else falls back to the status message.
export const kbRefusal = (error: ApiError) => refusals[error.code] ?? null

export const jobFailure: Readonly<Record<string, string>> = {
  SECTION_HAS_NO_TEXT: 'Bab ini tidak punya teks yang bisa dibaca (mungkin hasil pindai).',
}

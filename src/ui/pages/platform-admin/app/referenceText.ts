import type { ApiError } from '@/domain/model/ApiError'
import type { DraftRejectionReason, NationalReference, ReferenceKind, ReferenceStatus } from '@/domain/model/NationalReference'
import type { NalaMood } from '@/ui/components/nala/Nala'

export const referenceStatuses: Record<ReferenceStatus, string> = { uploading: 'Unggahan belum selesai', extracting: 'Mengekstrak teks', review: 'Perlu tinjauan', indexing: 'Menyiapkan publikasi', published: 'Diterbitkan', failed: 'Pemrosesan gagal' }
export const referenceKinds: Record<ReferenceKind, string> = { curriculum: 'Kurikulum / CP', guidance: 'Buku / panduan' }

// The four steps a source walks through. `stageAt` is the step a status is on; 4 means every step is done, -1 means it stopped.
export const referenceStages = ['Unggah', 'Ekstrak', 'Tinjau', 'Terbit'] as const
export const stageAt: Record<ReferenceStatus, number> = { uploading: 0, extracting: 1, review: 2, indexing: 3, published: 4, failed: -1 }

// Groups run in the order the admin should work through them: what needs a person first, what is only waiting last.
export type ReferenceGroup = 'review' | 'failed' | 'processing' | 'published'
export const referenceGroups: { key: ReferenceGroup; tab: string; title: string; hint: string }[] = [
  { key: 'review', tab: 'Perlu tinjauan', title: 'Menunggu tinjauan Anda', hint: 'Periksa teks hasil ekstraksi, simpan, lalu terbitkan.' },
  { key: 'failed', tab: 'Gagal', title: 'Gagal diproses', hint: 'Buka sumber untuk melihat penyebabnya.' },
  { key: 'processing', tab: 'Diproses', title: 'Sedang diproses', hint: 'Berjalan di latar belakang. Muat ulang untuk melihat kemajuannya.' },
  { key: 'published', tab: 'Terbit', title: 'Sudah terbit', hint: 'Dipakai sekolah dan tidak dapat diubah.' },
]
export const groupOf = (status: ReferenceStatus): ReferenceGroup => status === 'review' || status === 'failed' || status === 'published' ? status : 'processing'

export const rowAction: Record<ReferenceStatus, string> = { uploading: 'Lihat status', extracting: 'Lihat status', review: 'Tinjau', indexing: 'Lihat status', published: 'Buka', failed: 'Lihat penyebab' }

/** What Nala says about the loaded library: the most urgent thing first, and always something the page can act on. */
export function libraryNote(rows: NationalReference[]): [NalaMood, string] {
  const count = (group: ReferenceGroup) => rows.filter((row) => groupOf(row.status) === group).length
  const review = count('review'), failed = count('failed'), processing = count('processing')
  if (review) return ['read', `${review} sumber menunggu tinjauan Anda${failed ? `, ${failed} gagal diproses` : ''}.`]
  if (failed) return ['oops', `${failed} sumber gagal diproses. Buka untuk melihat penyebabnya.`]
  if (processing) return ['think', `${processing} sumber sedang diproses. Muat ulang untuk melihat kemajuannya.`]
  return ['proud', `Semua ${rows.length} sumber sudah terbit.`]
}

/** One line for a single source's header: where it stands and what to do next. */
export const documentGuidance: Record<ReferenceStatus, string> = {
  uploading: 'Unggahan belum selesai. Catatan pemulihan ada di bawah.',
  extracting: 'Teks PDF sedang dibaca. Halaman ini memperbarui dirinya sendiri.',
  review: 'Teks sudah siap. Periksa, simpan, lalu terbitkan.',
  indexing: 'Sedang disiapkan untuk terbit. Anda boleh meninggalkan halaman ini.',
  published: 'Sumber sudah terbit dan tidak dapat diubah.',
  failed: 'Pemrosesan berhenti. Penyebabnya ada di bawah.',
}
export const documentMood: Record<ReferenceStatus, NalaMood> = { uploading: 'oops', extracting: 'think', review: 'read', indexing: 'think', published: 'proud', failed: 'oops' }
const messages: Record<string, string> = {
  FILE_TOO_LARGE: 'PDF melebihi batas bawaan 50 MiB. Pilih berkas lebih kecil.',
  FILE_NOT_PDF: 'Pilih berkas PDF yang valid.',
  REFERENCE_METADATA_REQUIRED: 'Isi judul dan penerbit (maksimal 200 karakter), serta URL sumber HTTP(S).',
  REFERENCE_EXISTS: 'PDF dengan jenis ini sudah ada. Periksa daftar referensi sebelum mengunggah kembali.',
  IDEMPOTENCY_CONFLICT: 'Isian berbeda dari pengiriman sebelumnya. Periksa maksud pengiriman sebelum mencoba lagi.',
  REFERENCE_REVISION_CONFLICT: 'Tinjauan telah berubah. Draf Anda tetap tersimpan di layar; bandingkan dengan tinjauan terbaru sebelum menyimpan.',
  REFERENCE_REVIEW_REQUIRED: 'Simpan tinjauan sebelum menerbitkan.',
  SOURCE_PAGE_INVALID: 'Nomor halaman harus tersedia dan memiliki teks. Periksa rentang halaman.',
  SOURCE_TEXT_MISMATCH: 'Teks harus sama persis dengan sumber setelah normalisasi spasi. Periksa teks dan halaman kutipan.',
  STATEMENT_OUTSIDE_ELEMENT: 'Pernyataan harus ada dalam teks elemen dan rentang halaman kutipannya.',
  CURRICULUM_REVIEW_REQUIRED: 'Lengkapi versi, mata pelajaran, elemen, dan pernyataan CP.',
  GUIDANCE_REVIEW_REQUIRED: 'Pilih minimal satu halaman yang memiliki teks.',
  CURRICULUM_SUBJECT_DUPLICATE: 'Kombinasi nama mata pelajaran dan fase harus unik.',
  CURRICULUM_STATEMENT_DUPLICATE: 'Pernyataan dalam satu mata pelajaran tidak boleh berulang.',
  CURRICULUM_STATEMENT_LIMIT: 'Jumlah pernyataan melampaui batas pemrosesan (bawaan 2048).',
  REFERENCE_OCR_REQUIRED: 'PDF tidak memiliki teks yang dapat diekstrak. Unggah PDF dengan teks yang bisa dipilih; OCR otomatis belum tersedia.',
  REFERENCE_PDF_ENCRYPTED: 'PDF terkunci. Gunakan sumber yang dapat dibuka tanpa enkripsi.',
  REFERENCE_PDF_INVALID: 'PDF tidak dapat dibaca. Gunakan berkas PDF yang valid.',
  REFERENCE_PAGE_LIMIT: 'PDF melampaui batas halaman pemrosesan (bawaan 500).',
  REFERENCE_TEXT_LIMIT: 'Teks PDF melampaui batas pemrosesan (bawaan 2.000.000 karakter).',
  REFERENCE_STORAGE_UNAVAILABLE: 'Penyimpanan belum tersedia. Coba lagi dengan berkas dan isian yang sama; kunci pengiriman tetap dipertahankan.',
  UNAVAILABLE: 'Jawaban server belum diterima. Coba lagi dengan isian yang sama; kunci pengiriman tetap dipertahankan.',
  REFERENCE_SOURCE_CHANGED: 'Sumber berubah. Hubungi dukungan sebelum mencoba ulang.',
  REFERENCE_ADMIN_REVOKED: 'Akses admin pemohon telah berubah. Hubungi dukungan.',
  EMBEDDING_MODEL_MISMATCH: 'Konfigurasi model pemrosesan tidak cocok. Hubungi dukungan.',
  EMBEDDING_INVALID: 'Hasil pemrosesan tidak valid. Hubungi dukungan.',
  REFERENCE_PROCESSING_FAILED: 'Pemrosesan sumber gagal. Periksa tinjauan atau hubungi dukungan sebelum mencoba ulang.',
  CURRICULUM_EXISTS: 'Nomor keputusan sudah diterbitkan. Periksa versi yang ada; jangan mengganti kode hanya untuk melewati konflik.',
}
export const draftCopy: Record<'pending' | 'ready' | 'failed' | 'skipped', string> = {
  pending: 'Nala sedang menyiapkan draf CP dari PDF ini…',
  ready: 'Draf otomatis siap. Periksa nomor keputusan, tanggal berlaku, dan pilihan versi berlaku sebelum menerbitkan.',
  failed: 'Draf otomatis gagal dibuat. Anda dapat meminta draf ulang atau mengisi tinjauan sendiri.',
  skipped: 'PDF terlalu besar untuk draf otomatis. Unggah bagian mata pelajaran saja, atau isi tinjauan sendiri.',
}
export const rejectionCopy: Record<DraftRejectionReason, string> = {
  not_in_source: 'Tidak ditemukan persis di PDF',
  outside_element: 'Di luar teks elemennya',
  no_statements: 'Elemen tanpa pernyataan',
  limit: 'Melebihi batas pernyataan',
  unnamed: 'Tanpa nama elemen atau mata pelajaran',
}
export const referenceError = (error: ApiError) => messages[error.code] ?? error.message
export const processingError = (code: string) => messages[code] ?? 'Pemrosesan belum berhasil. Periksa sumber dan tinjauan atau hubungi dukungan.'
export const sourceLink = (value: string) => /^https?:\/\//i.test(value) ? value : undefined

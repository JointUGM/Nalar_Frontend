import type { ApiError } from '@/domain/model/ApiError'
import type { ReferenceStatus } from '@/domain/model/NationalReference'

export const referenceStatuses: Record<ReferenceStatus, string> = { uploading: 'Unggahan belum selesai', extracting: 'Mengekstrak teks', review: 'Perlu tinjauan', indexing: 'Menyiapkan publikasi', published: 'Diterbitkan', failed: 'Pemrosesan gagal' }
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
export const referenceError = (error: ApiError) => messages[error.code] ?? error.message
export const processingError = (code: string) => messages[code] ?? 'Pemrosesan belum berhasil. Periksa sumber dan tinjauan atau hubungi dukungan.'
export const sourceLink = (value: string) => /^https?:\/\//i.test(value) ? value : undefined

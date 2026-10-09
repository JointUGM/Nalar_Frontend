import { FileDrop } from '@/ui/components/file-drop/FileDrop'
import type { FileDropCopy, FileDropState } from '@/ui/components/file-drop/FileDrop'
import { rosterMaxBytes } from '@/domain/model/SchoolAdmin'

const isCsv = (file: File) => /\.csv$/i.test(file.name) || file.type === 'text/csv'
const copy: FileDropCopy = {
  wrongType: 'Hanya berkas CSV (.csv) yang bisa diimpor.',
  idle: ['Pilih atau tarik berkas CSV', 'Data siswa dan guru sekolah · maks. 5 MB'],
  dragging: ['Lepaskan untuk memilih berkas ini', 'Satu berkas CSV saja.'],
  pending: ['Mengunggah berkas…', 'Sebentar, lalu Nalar mulai memeriksa barisnya.'],
  refused: 'Pilih CSV lain atau tarik ke sini.',
  failed: ['Unggahan belum berhasil', 'Berkas masih terpilih. Coba unggah lagi.'],
  chosen: 'Siap diunggah',
}

/** The roster CSV drop zone: the shared FileDrop with the import's rules and words. */
export function RosterFileDrop(props: FileDropState) {
  return <FileDrop {...props} label="Berkas CSV" accept=".csv,text/csv" maxBytes={rosterMaxBytes} isAccepted={isCsv}
    badge="CSV" badgeClass="bg-success-bg text-success-strong" copy={copy} />
}

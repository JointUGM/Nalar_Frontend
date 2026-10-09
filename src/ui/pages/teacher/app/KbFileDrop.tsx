import { FileDrop } from '@/ui/components/file-drop/FileDrop'
import type { FileDropCopy, FileDropState } from '@/ui/components/file-drop/FileDrop'

const isPdf = (file: File) => file.type === 'application/pdf' || /\.pdf$/i.test(file.name)
const copy: FileDropCopy = {
  wrongType: 'Hanya berkas PDF yang bisa dibaca.',
  idle: ['Pilih atau tarik PDF materi', 'Buku siswa, modul ajar, atau LKPD · maks. 50 MB'],
  dragging: ['Lepaskan untuk memilih berkas ini', 'Satu berkas PDF saja.'],
  pending: ['Mengunggah materi…', 'Sebentar, lalu Anda diarahkan ke halaman topik.'],
  refused: 'Pilih PDF lain atau tarik ke sini.',
  failed: ['Unggahan belum berhasil', 'Berkas masih terpilih. Coba unggah lagi.'],
  chosen: 'Siap diunggah',
}

/** The teacher's PDF drop zone: the shared FileDrop with the knowledge-base rules and words. */
export function KbFileDrop(props: FileDropState) {
  return <FileDrop {...props} label="Berkas PDF" required accept=".pdf,application/pdf" maxBytes={50 * 1024 * 1024} isAccepted={isPdf}
    badge="PDF" badgeClass="bg-misconception-bg text-misconception-text" copy={copy} />
}

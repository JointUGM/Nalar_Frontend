import { useId, useRef, useState } from 'react'
import type { ChangeEvent, DragEvent } from 'react'
import { Icon } from '@/ui/components/icon/Icon'
import { Nala, type NalaMood } from '@/ui/components/nala/Nala'
import styles from '@/ui/pages/teacher/TeacherKbUpload.styles'

const maxBytes = 50 * 1024 * 1024
const decimal = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 1 })
const sizeLabel = (bytes: number) => bytes < 1024 * 1024 ? `${decimal.format(Math.max(bytes / 1024, 0.1))} KB` : `${decimal.format(bytes / 1024 / 1024)} MB`
const isPdf = (file: File) => file.type === 'application/pdf' || /\.pdf$/i.test(file.name)
const carriesFiles = (event: DragEvent) => event.dataTransfer.types.includes('Files')

interface Props {
  file: File | null
  pending: boolean
  /** Why the file was refused or is missing; shown in the zone. */
  error: string
  /** The upload itself failed (the page shows the reason). */
  failed: boolean
  onPick: (file: File) => void
  onReject: (message: string) => void
  onRemove: () => void
}

/** A PDF drop zone on a real file input: drop, press "Pilih berkas", or replace/remove the chosen file. Nala reacts to each state. */
export function KbFileDrop({ file, pending, error, failed, onPick, onReject, onRemove }: Props) {
  const id = useId()
  const input = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [removed, setRemoved] = useState(false)

  function take(next: File | undefined) {
    if (!next) return
    if (!isPdf(next)) return onReject('Hanya berkas PDF yang bisa dibaca.')
    if (next.size > maxBytes) return onReject(`Berkas ini ${sizeLabel(next.size)}, melebihi batas 50 MB.`)
    setRemoved(false)
    onPick(next)
  }
  function change(event: ChangeEvent<HTMLInputElement>) {
    take(event.target.files?.[0])
    event.target.value = '' // choosing the same file again must still fire a change
  }
  function remove() {
    setRemoved(true)
    onRemove()
    input.current?.focus() // the button disappears with the file; keep the keyboard on the zone
  }
  const drag = pending ? {} : {
    onDragEnter: (event: DragEvent) => { if (carriesFiles(event)) { event.preventDefault(); setDragging(true) } },
    onDragOver: (event: DragEvent) => { if (carriesFiles(event)) { event.preventDefault(); event.dataTransfer.dropEffect = 'copy' } },
    onDragLeave: (event: DragEvent) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDragging(false) },
    onDrop: (event: DragEvent) => { event.preventDefault(); setDragging(false); take(event.dataTransfer.files[0]) },
  }

  const trouble = !dragging && (Boolean(error) || failed)
  const mood: NalaMood = pending ? 'read' : dragging ? 'wow' : trouble ? 'oops' : file ? 'proud' : 'hello'
  const [title, hint] = pending ? ['Mengunggah materi…', 'Sebentar, lalu Anda diarahkan ke halaman topik.']
    : dragging ? ['Lepaskan untuk memilih berkas ini', 'Satu berkas PDF saja.']
    : error ? [error, 'Pilih PDF lain atau tarik ke sini.']
    : failed ? ['Unggahan belum berhasil', 'Berkas masih terpilih. Coba unggah lagi.']
    : file ? ['Siap diunggah', ''] : ['Pilih atau tarik PDF materi', 'Buku siswa, modul ajar, atau LKPD · maks. 50 MB']

  return <div className={styles.dropField}>
    <label className={styles.dropLabel} htmlFor={id}>Berkas PDF<span aria-hidden="true"> *</span></label>
    <div className={styles.drop} data-dragging={dragging} data-state={file ? 'chosen' : 'empty'} data-trouble={trouble} {...drag}>
      <input ref={input} id={id} type="file" className="sr-only" required accept=".pdf,application/pdf" disabled={pending} onChange={change} />
      <span className={styles.halo}><Nala key={mood} mood={mood} size={112} animate /></span>
      {error && !dragging ? <p role="alert" className={styles.dropTitle}>{title}</p> : <p className={styles.dropTitle}>{title}</p>}
      {hint && <p className={styles.dropHint}>{hint}</p>}
      {dragging ? null : file ? <div className={styles.file}>
        <span className={styles.badge} aria-hidden="true">PDF</span>
        <span className={styles.fileText}><strong>{file.name}</strong><small>{sizeLabel(file.size)}</small></span>
        {!pending && <span className={styles.fileActions}>
          <label className={styles.replace} htmlFor={id}>Ganti</label>
          <button type="button" className={styles.remove} aria-label={`Hapus berkas ${file.name}`} title="Hapus berkas" onClick={remove}><Icon name="x" size={18} /></button>
        </span>}
      </div> : <label className={styles.pick} htmlFor={id}><Icon name="upload" size={16} />Pilih berkas</label>}
    </div>
    <p className="sr-only" role="status">{file ? `Berkas ${file.name}, ${sizeLabel(file.size)}, dipilih.` : removed ? 'Berkas dihapus.' : ''}</p>
  </div>
}

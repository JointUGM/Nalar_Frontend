import { useId, useRef, useState } from 'react'
import type { ChangeEvent, DragEvent } from 'react'
import { cn } from '@/ui/cn'
import { Icon } from '@/ui/components/icon/Icon'
import { Nala, type NalaMood } from '@/ui/components/nala/Nala'

const decimal = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 1 })
const sizeLabel = (bytes: number) => bytes < 1024 * 1024 ? `${decimal.format(Math.max(bytes / 1024, 0.1))} KB` : `${decimal.format(bytes / 1024 / 1024)} MB`
const carriesFiles = (event: DragEvent) => event.dataTransfer.types.includes('Files')

const s = {
  field: 'grid min-w-0 gap-2',
  label: 'w-fit cursor-pointer text-sm leading-5 font-semibold text-ink',
  drop: 'relative flex min-w-0 flex-col items-center gap-1 rounded-[20px] border-2 border-dashed border-accent bg-accent/10 px-6 pt-6 pb-7 text-center transition-[transform,background-color,border-color,box-shadow] duration-200 ease-[cubic-bezier(.23,1,.32,1)] motion-reduce:transition-none has-focus-visible:border-primary has-focus-visible:shadow-[0_0_0_3px_rgb(36_71_209/18%)] data-[state=chosen]:border-solid data-[dragging=true]:scale-[1.01] data-[dragging=true]:border-solid data-[dragging=true]:border-primary data-[dragging=true]:bg-accent/20 data-[trouble=true]:border-solid data-[trouble=true]:border-danger-text data-[trouble=true]:bg-danger-bg max-sm:px-4 max-sm:pt-5',
  halo: 'relative grid h-30 w-36 shrink-0 place-items-center before:absolute before:bottom-1 before:size-25 before:rounded-full before:bg-accent/30 before:transition-transform before:duration-200 before:ease-[cubic-bezier(.23,1,.32,1)] before:content-[""] motion-reduce:before:transition-none [[data-dragging=true]_&]:before:scale-125 [&>svg]:relative',
  title: 'm-0 mt-2 text-[16px] leading-6 font-bold text-pretty text-ink',
  hint: 'm-0 max-w-[48ch] text-[13px] leading-5 text-pretty text-text-secondary',
  pick: 'mt-3 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-pill bg-primary px-5 text-[14px] font-bold text-surface transition-[background-color,transform] duration-160 select-none active:translate-y-px hover:bg-primary-hover motion-reduce:transition-none',
  file: 'mt-3 flex w-full max-w-[460px] min-w-0 flex-wrap items-center gap-x-3 gap-y-1 rounded-[14px] border border-role-border bg-surface py-2 pr-2 pl-3 text-start animate-file-in motion-reduce:animate-none',
  fileActions: 'ml-auto flex items-center',
  badge: 'grid size-9 flex-none place-items-center rounded-[10px] text-[10px] font-bold',
  fileText: 'min-w-0 flex-[1_1_9rem] [&_strong]:block [&_strong]:text-[13px] [&_strong]:leading-5 [&_strong]:wrap-anywhere [&_small]:block [&_small]:text-[12px] [&_small]:leading-4 [&_small]:text-text-muted',
  replace: 'inline-flex min-h-11 cursor-pointer items-center rounded-pill px-3 text-[13px] font-semibold text-primary-hover select-none hover:bg-nav-hover',
  remove: 'grid size-11 flex-none place-items-center rounded-full border-transparent bg-transparent p-0 text-text-secondary transition-[background-color,color,transform] duration-160 hover:not-disabled:bg-danger-bg hover:not-disabled:text-danger-text active:not-disabled:scale-95 motion-reduce:transition-none',
}

/** Every sentence the zone says, so each page speaks in its own words. Pairs are [title, hint]. */
export interface FileDropCopy {
  wrongType: string
  idle: readonly [string, string]
  dragging: readonly [string, string]
  pending: readonly [string, string]
  /** Under the reason a file was refused. */
  refused: string
  /** The upload itself failed; the page shows the reason. */
  failed: readonly [string, string]
  chosen: string
}

export interface FileDropState {
  file: File | null
  pending: boolean
  /** Why the file was refused or is missing; shown in the zone. */
  error: string
  failed: boolean
  onPick: (file: File) => void
  onReject: (message: string) => void
  onRemove: () => void
}

interface Props extends FileDropState {
  label: string
  required?: boolean
  accept: string
  maxBytes: number
  isAccepted: (file: File) => boolean
  badge: string
  badgeClass: string
  copy: FileDropCopy
}

/** A drop zone on a real file input: drop, press "Pilih berkas", or replace/remove the chosen file. Nala reacts to each state. */
export function FileDrop({ label, required = false, accept, maxBytes, isAccepted, badge, badgeClass, copy, file, pending, error, failed, onPick, onReject, onRemove }: Props) {
  const id = useId()
  const input = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [removed, setRemoved] = useState(false)

  function take(next: File | undefined) {
    if (!next) return
    if (!isAccepted(next)) return onReject(copy.wrongType)
    if (next.size > maxBytes) return onReject(`Berkas ini ${sizeLabel(next.size)}, melebihi batas ${decimal.format(maxBytes / 1024 / 1024)} MB.`)
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
  const [title, hint] = pending ? copy.pending
    : dragging ? copy.dragging
    : error ? [error, copy.refused]
    : failed ? copy.failed
    : file ? [copy.chosen, ''] : copy.idle

  return <div className={s.field}>
    <label className={s.label} htmlFor={id}>{label}{required && <span aria-hidden="true"> *</span>}</label>
    <div className={s.drop} data-dragging={dragging} data-state={file ? 'chosen' : 'empty'} data-trouble={trouble} {...drag}>
      <input ref={input} id={id} type="file" className="sr-only" required={required} accept={accept} disabled={pending} onChange={change} />
      <span className={s.halo}><Nala key={mood} mood={mood} size={112} animate /></span>
      {error && !dragging ? <p role="alert" className={s.title}>{title}</p> : <p className={s.title}>{title}</p>}
      {hint && <p className={s.hint}>{hint}</p>}
      {dragging ? null : file ? <div className={s.file}>
        <span className={cn(s.badge, badgeClass)} aria-hidden="true">{badge}</span>
        <span className={s.fileText}><strong>{file.name}</strong><small>{sizeLabel(file.size)}</small></span>
        {!pending && <span className={s.fileActions}>
          <label className={s.replace} htmlFor={id}>Ganti</label>
          <button type="button" className={s.remove} aria-label={`Hapus berkas ${file.name}`} title="Hapus berkas" onClick={remove}><Icon name="x" size={18} /></button>
        </span>}
      </div> : <label className={s.pick} htmlFor={id}><Icon name="upload" size={16} />Pilih berkas</label>}
    </div>
    <p className="sr-only" role="status">{file ? `Berkas ${file.name}, ${sizeLabel(file.size)}, dipilih.` : removed ? 'Berkas dihapus.' : ''}</p>
  </div>
}

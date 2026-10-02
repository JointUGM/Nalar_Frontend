import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { Button } from '@/ui/components/button/Button'
import { ButtonLink } from '@/ui/components/button/ButtonLink'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Field } from '@/ui/components/field/Field'
import { Icon } from '@/ui/components/icon/Icon'
import { TeacherShell } from '@/ui/components/teacher-shell/TeacherShell'
import { useTeacherContext } from '@/ui/components/teacher-shell/useTeacherContext'
import { teacherUser } from './teacherHomeExamples'
import { kbBuildSteps, kbFailureStep, kbSampleTopicId } from './teacherKbExamples'
import { formatPdfSize, useTeacherKbUploadViewModel } from './useTeacherKbUploadViewModel'
import type { StepState } from './useTeacherKbUploadViewModel'
import styles from './TeacherKbUpload.module.css'

const stateLabels: Record<StepState, string> = { waiting: 'Menunggu', running: 'Berjalan', done: 'Selesai', failed: 'Gagal' }

export function TeacherKbUpload() {
  const { selection } = useTeacherContext()
  // A school change remounts the form: a draft or simulation never carries over to another school.
  return <TeacherShell title="Basis pengetahuan" user={teacherUser}><UploadForm key={selection} /></TeacherShell>
}

function UploadForm() {
  const view = useTeacherKbUploadViewModel()
  const formRef = useRef<HTMLFormElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const previous = useRef(view.phase)
  const [invalid, setInvalid] = useState<{ field: 'name' | 'file' } | null>(null)
  const locked = view.phase !== 'idle'
  const running = view.phase === 'running'
  const total = kbBuildSteps.length
  useEffect(() => {
    if (previous.current === view.phase) return
    previous.current = view.phase
    if (view.phase === 'idle') formRef.current?.querySelector('input')?.focus()
    else if (view.phase === 'running') headingRef.current?.focus()
  }, [view.phase])
  // After commit, so the field's error text is already associated when focus lands.
  useEffect(() => { if (invalid) formRef.current?.querySelector<HTMLInputElement>(invalid.field === 'name' ? 'input[type="text"]' : 'input[type="file"]')?.focus() }, [invalid])
  const details = view.file && [view.file.pages && `${view.file.pages} halaman`, formatPdfSize(view.file.bytes), 'terpilih di browser'].filter(Boolean).join(' · ')

  return <div className={styles.content}>
    <Link className={styles.back} to="/review/teacher/knowledge-base"><Icon name="chevronLeft" size={14} />Basis pengetahuan</Link>
    <h1>Unggah materi ajar</h1>
    <p className={styles.lead}>Draf konsep dan miskonsepsi harus Anda setujui sebelum sampai ke siswa.</p>
    <p className={styles.note}>Pratinjau lokal · file hanya dipilih di browser dan tidak diunggah. Penyusunan draf adalah simulasi: tidak ada AI yang dipanggil dan tidak ada data yang tersimpan.</p>
    <form ref={formRef} className={styles.grid} noValidate onSubmit={(event) => {
      event.preventDefault()
      const field = view.start()
      if (field) setInvalid({ field })
    }}>
      <section className={styles.card} aria-label="Materi ajar">
        <Field label="Nama topik" type="text" required maxLength={80} autoComplete="off" value={view.name} disabled={locked} error={view.nameError} onChange={(event) => view.setName(event.target.value)} />
        <div className={styles.drop} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); const dropped = event.dataTransfer.files[0]; if (dropped) view.selectFile(dropped) }}>
          <span className={styles.dropIcon} aria-hidden="true"><Icon name="upload" size={16} /></span>
          <strong>Tarik PDF ke sini atau pilih file</strong>
          <span>Buku siswa, modul ajar, atau LKPD · maks. 50 MB</span>
          <Field label="Pilih file PDF" type="file" accept=".pdf,application/pdf" disabled={locked} error={view.fileError} onChange={(event) => { const picked = event.target.files?.[0]; if (picked) view.selectFile(picked); event.target.value = '' }} />
          <Button tone="secondary" disabled={locked} onClick={view.selectSample}>Gunakan file contoh</Button>
        </div>
        <div role="status">{view.file && <div className={styles.file}>
          <span className={styles.badge} aria-hidden="true">PDF</span>
          <span className={styles.fileText}><strong>{view.file.name}</strong><small>{details}</small></span>
          <span className={styles.ok} aria-hidden="true"><Icon name="check" size={16} /></span>
          {!locked && <Button tone="ghost" onClick={view.clearFile}>Hapus pilihan</Button>}
        </div>}</div>
      </section>
      <section className={styles.card} aria-labelledby="kb-build-heading">
        <div className={styles.buildHead}><h2 id="kb-build-heading" ref={headingRef} tabIndex={-1}>Menyusun draf (simulasi)</h2><span>Contoh: 3–5 menit</span></div>
        <ol className={styles.steps} aria-label="Langkah penyusunan draf">{view.steps.map((step) => <li key={step.label} data-state={step.state} aria-current={step.state === 'running' ? 'step' : undefined}>
          <span className={styles.mark} aria-hidden="true">{step.state === 'done' ? <Icon name="check" size={12} /> : step.state === 'failed' ? '!' : step.state === 'running' ? <span className={styles.spinner} /> : null}</span>
          <span className={styles.stepLabel}>{step.label}</span>
          <span className={styles.stepState}>{stateLabels[step.state]}</span>
        </li>)}</ol>
        <p role="status" className={styles.hidden}>{running ? `Langkah ${view.step + 1} dari ${total}: ${kbBuildSteps[view.step]}` : ''}</p>
        {view.phase === 'failed' && <Feedback tone="danger" title={`Simulasi gagal pada langkah ${view.step + 1} dari ${total}`} announce>Ini hasil skenario contoh, bukan kegagalan sebenarnya. Nama topik dan file tetap tersimpan selama halaman ini terbuka; pilih skenario lain atau coba lagi.</Feedback>}
        {view.phase === 'done' && <Feedback tone="success" title="Simulasi selesai" announce>Tidak ada draf yang dibuat dan tidak ada data yang tersimpan. Tinjauan draf belum tersedia di pratinjau.</Feedback>}
        <label className={styles.scenario}>Skenario pratinjau
          <select value={view.outcome} disabled={running} onChange={(event) => view.setOutcome(event.target.value === 'failure' ? 'failure' : 'success')}>
            <option value="success">Semua langkah selesai</option>
            <option value="failure">Gagal pada langkah {kbFailureStep + 1}</option>
          </select>
        </label>
        <div className={styles.actions}>{view.phase === 'failed'
          ? <><Button onClick={view.retry}>Coba lagi</Button><Button tone="secondary" onClick={view.back}>Ubah materi</Button></>
          : view.phase === 'done'
            ? <><ButtonLink to={`/review/teacher/knowledge-base/${kbSampleTopicId}`}>Tinjau draf</ButtonLink><Button tone="secondary" onClick={view.back}>Ubah materi</Button></>
            : <Button type="submit" pending={running} pendingLabel="Sedang menyusun…">Mulai menyusun (simulasi)</Button>}</div>
      </section>
    </form>
  </div>
}

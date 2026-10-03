import { useRef, useState } from 'react'
import type { SchoolAdminUseCases } from '@/application/school-admin-use-cases'
import { Button } from '@/ui/components/button/Button'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Field } from '@/ui/components/field/Field'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { useCommand } from '@/ui/pages/live/useLiveResource'
import shared from '@/ui/pages/school-admin/dialogForm.module.css'
import styles from '@/ui/pages/school-admin/SchoolYear.module.css'
import { useAcademicYears } from './useAcademicYears'

const refusals: Readonly<Record<string, string>> = {
  ACADEMIC_YEAR_EXISTS: 'Tahun ajaran dengan nama itu sudah ada.',
  IDEMPOTENCY_CONFLICT: 'Isian berubah setelah dikirim. Tinjau lagi lalu kirim ulang.',
  NAME_REQUIRED: 'Isi nama tahun ajaran.',
  INVALID_DATES: 'Isi kedua tanggal; tanggal selesai harus setelah tanggal mulai.',
}
const day = new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' })
const date = (value: string) => day.format(new Date(`${value}T00:00:00`))

export function SchoolYearPage({ service, schoolId }: { service: SchoolAdminUseCases; schoolId: string }) {
  const years = useAcademicYears(service, schoolId)
  const current = years.list.find((year) => year.is_current)
  const [fields, setFields] = useState({ name: '', starts_on: '', ends_on: '', copy: '' })
  const copy = fields.copy === 'none' ? null : fields.copy || current?.id || null
  const [confirming, setConfirming] = useState(false)
  const [done, setDone] = useState('')
  const command = useCommand()
  // One key per reviewed submission: a retry after a lost answer reuses it, so the backend never starts a second year.
  const key = useRef('')
  const said = command.failure && (refusals[command.failure.code] ?? command.failure.message)
  const update = (next: Partial<typeof fields>) => { command.reset(); setConfirming(false); setFields((value) => ({ ...value, ...next })) }

  async function create() {
    const year = { name: fields.name, starts_on: fields.starts_on, ends_on: fields.ends_on, copy_classes_from: copy }
    if (await command.run((signal) => service.createAcademicYear(schoolId, year, key.current, signal))) {
      setDone(`Tahun ajaran ${fields.name.trim()} sekarang berjalan.`)
      setFields({ name: '', starts_on: '', ends_on: '', copy: '' }); setConfirming(false); years.refresh()
    }
  }

  return <div className={styles.content}>
    <h1>Tahun ajaran</h1>
    <p className={styles.lead}>Tahun ajaran baru langsung menjadi tahun berjalan. Riwayat misi dan hasil tahun sebelumnya tetap tersimpan.</p>
    <LiveFeedback error={years.error} online refresh={years.refresh} />
    {!years.loaded && !years.error && <p role="status">Memuat tahun ajaran…</p>}
    {done && <Feedback tone="success" title={done} announce>Langkah berikutnya: impor data siswa untuk tahun ini.</Feedback>}
    {years.list.length > 0 && <ol className={styles.steps}>{years.list.map((year) => <li key={year.id} className={[styles.step, year.is_current ? styles.current : styles.done].join(' ')} aria-current={year.is_current ? 'step' : undefined}>
      <div><h2>{year.name}</h2><p>{date(year.starts_on)} – {date(year.ends_on)}</p><span className={styles.state}>{year.is_current ? 'Berjalan' : 'Selesai'}</span></div>
    </li>)}</ol>}
    {years.loaded && <section className={styles.step} aria-labelledby="new-year">
      <form className={shared.form} noValidate onSubmit={(event) => { event.preventDefault(); if (!confirming) { key.current = crypto.randomUUID(); setConfirming(true) } else void create() }}>
        <h2 id="new-year">Mulai tahun ajaran baru</h2>
        <Field label="Nama" required placeholder="2027/2028" maxLength={200} value={fields.name} disabled={command.pending} onChange={(event) => update({ name: event.target.value })} />
        <Field label="Tanggal mulai" type="date" required value={fields.starts_on} disabled={command.pending} onChange={(event) => update({ starts_on: event.target.value })} />
        <Field label="Tanggal selesai" type="date" required value={fields.ends_on} disabled={command.pending} onChange={(event) => update({ ends_on: event.target.value })} />
        {years.list.length > 0 && <label className={shared.field}>Salin kelas dari
          <select value={copy ?? 'none'} disabled={command.pending} onChange={(event) => update({ copy: event.target.value })}>
            <option value="none">Jangan salin kelas</option>
            {years.list.map((year) => <option key={year.id} value={year.id}>{year.name}</option>)}
          </select>
          <small>Hanya nama dan tingkat kelas yang disalin. Siswa, wali kelas, dan penugasan guru diatur lagi.</small>
        </label>}
        {confirming && <Feedback tone="warning" title={`Mulai ${fields.name.trim() || 'tahun ajaran baru'} sekarang?`} announce>{current ? `${current.name} berhenti menjadi tahun berjalan. ` : ''}{copy ? `Kelas dari ${years.list.find((year) => year.id === copy)?.name ?? ''} disalin tanpa siswa.` : 'Tidak ada kelas yang disalin.'}</Feedback>}
        {said && <Feedback tone="warning" title={said} announce>{command.failure?.requestId && <small>Referensi: {command.failure.requestId}</small>}</Feedback>}
        <div className={shared.actions}>
          {confirming && <Button tone="secondary" disabled={command.pending} onClick={() => { command.reset(); setConfirming(false) }}>Ubah isian</Button>}
          <Button type="submit" pending={command.pending} pendingLabel="Membuat…">{confirming ? 'Mulai tahun ajaran' : 'Tinjau'}</Button>
        </div>
      </form>
    </section>}
  </div>
}

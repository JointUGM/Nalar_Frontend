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
import { Loading } from '@/ui/components/loading/Loading'
import { Select } from '@/ui/components/select/Select'
import { DatePicker } from '@/ui/components/date-picker/DatePicker'
import { NalaEmpty, NalaNote } from '@/ui/components/nala/NalaState'
import type { NalaMood } from '@/ui/components/nala/Nala'

const refusals: Readonly<Record<string, string>> = {
  ACADEMIC_YEAR_EXISTS: 'Tahun ajaran dengan nama itu sudah ada.',
  IDEMPOTENCY_CONFLICT: 'Isian berubah setelah dikirim. Tinjau lagi lalu kirim ulang.',
  NAME_REQUIRED: 'Isi nama tahun ajaran.',
  INVALID_DATES: 'Isi kedua tanggal; tanggal selesai harus setelah tanggal mulai.',
}
const day = new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' })
const date = (value: string) => day.format(new Date(`${value}T00:00:00`))

const companion = (current?: { name: string }, total = 0): readonly [NalaMood, string] => {
  if (current) return ['calm', `Tahun ajaran aktif saat ini adalah ${current.name}. Semua kelas dan penugasan terhubung ke tahun ini.`]
  if (total === 0) return ['ask', 'Mulai buat tahun ajaran pertama untuk sekolah ini agar data kelas dan siswa dapat diatur.']
  return ['think', 'Pilih atau mulai tahun ajaran baru untuk mengaktifkan kegiatan belajar.']
}

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
  const note = years.loaded ? companion(current, years.list.length) : null

  async function create() {
    const year = { name: fields.name, starts_on: fields.starts_on, ends_on: fields.ends_on, copy_classes_from: copy }
    if (await command.run((signal) => service.createAcademicYear(schoolId, year, key.current, signal))) {
      setDone(`Tahun ajaran ${fields.name.trim()} sekarang berjalan.`)
      setFields({ name: '', starts_on: '', ends_on: '', copy: '' }); setConfirming(false); years.refresh()
    }
  }

  return <div className={styles.content}>
    <div className={styles.heading}>
      <div>
        <h1>Tahun ajaran</h1>
        <p className={styles.lead}>Tahun ajaran baru langsung menjadi tahun berjalan. Riwayat misi dan hasil tahun sebelumnya tetap tersimpan.</p>
      </div>
      {note && <NalaNote mood={note[0]} text={note[1]} />}
    </div>
    <LiveFeedback error={years.error} online refresh={years.refresh} />
    {!years.loaded && !years.error && <Loading label="Memuat tahun ajaran…" />}
    {done && <Feedback tone="success" title={done} announce>Langkah berikutnya: impor data siswa untuk tahun ini.</Feedback>}
    {years.list.length > 0 ? <ol className={styles.steps}>{years.list.map((year) => <li key={year.id} className={[styles.step, year.is_current ? styles.current : styles.done].join(' ')} aria-current={year.is_current ? 'step' : undefined}>
      <div><h2>{year.name}</h2><p>{date(year.starts_on)} – {date(year.ends_on)}</p><span className={styles.state}>{year.is_current ? 'Berjalan' : 'Selesai'}</span></div>
    </li>)}</ol> : years.loaded && !years.error && <div className={styles.emptyState}><NalaEmpty mood="ask" title="Belum ada tahun ajaran">Mulai tahun ajaran baru di bawah ini agar data kelas, guru, dan siswa dapat dikelola.</NalaEmpty></div>}
    {years.loaded && <section className={styles.step} aria-labelledby="new-year">
      <form className={shared.form} noValidate onSubmit={(event) => { event.preventDefault(); if (!confirming) { key.current = crypto.randomUUID(); setConfirming(true) } else void create() }}>
        <h2 id="new-year">Mulai tahun ajaran baru</h2>
        <Field label="Nama" required placeholder="2027/2028" maxLength={200} value={fields.name} disabled={command.pending} onChange={(event) => update({ name: event.target.value })} />
        <DatePicker label="Tanggal mulai" required value={fields.starts_on} disabled={command.pending} onChange={(val) => update({ starts_on: val })} />
        <DatePicker label="Tanggal selesai" required value={fields.ends_on} disabled={command.pending} onChange={(val) => update({ ends_on: val })} />
        {years.list.length > 0 && <div style={{ display: 'grid', gap: '4px' }}>
          <Select
            label="Salin kelas dari"
            value={copy ?? 'none'}
            disabled={command.pending}
            onChange={(val) => update({ copy: val === 'none' ? null : val })}
            options={[
              { value: 'none', label: 'Jangan salin kelas' },
              ...years.list.map((year) => ({ value: year.id, label: year.name }))
            ]}
          />
          <small style={{ color: 'var(--color-text-secondary)', fontSize: '12px' }}>Hanya nama dan tingkat kelas yang disalin. Siswa, wali kelas, dan penugasan guru diatur lagi.</small>
        </div>}
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

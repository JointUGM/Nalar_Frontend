import { useRef, useState } from 'react'
import type { SchoolAdminUseCases } from '@/application/school-admin-use-cases'
import { Button } from '@/ui/components/button/Button'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Field } from '@/ui/components/field/Field'
import { Icon } from '@/ui/components/icon/Icon'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { useCommand } from '@/ui/pages/live/useLiveResource'
import shared from '@/ui/pages/school-admin/dialogForm.styles'
import styles from '@/ui/pages/school-admin/SchoolYear.styles'
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
  const [fields, setFields] = useState<{ name: string; starts_on: string; ends_on: string; copy: string | null }>({ name: '', starts_on: '', ends_on: '', copy: '' })
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
        <h1 className="m-0 text-[32px] leading-[40px] font-bold tracking-[-0.04em] text-ink">Tahun ajaran</h1>
        <p className={styles.lead}>Tahun ajaran baru langsung menjadi tahun berjalan. Riwayat misi dan hasil tahun sebelumnya tetap tersimpan.</p>
      </div>
      {note && <NalaNote mood={note[0]} text={note[1]} />}
    </div>
    <LiveFeedback error={years.error} online refresh={years.refresh} />
    {!years.loaded && !years.error && <Loading label="Memuat tahun ajaran…" />}
    {done && <Feedback tone="success" title={done} announce>Langkah berikutnya: impor data siswa untuk tahun ini.</Feedback>}

    <div className={styles.layout}>
      <div className={styles.yearsColumn}>
        {years.list.length > 0 ? (
          <div className={styles.yearsSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <Icon name="calendar" size={18} />
                <span>Daftar tahun ajaran</span>
              </h2>
              <span className={styles.countBadge}>{years.list.length} tahun ajaran</span>
            </div>
            <ol className={styles.steps}>
              {years.list.map((year) => (
                <li
                  key={year.id}
                  className={[styles.step, year.is_current ? styles.current : styles.done].join(' ')}
                  aria-current={year.is_current ? 'step' : undefined}
                >
                  <div className={styles.stepIcon}>
                    <Icon name={year.is_current ? 'calendar' : 'clock'} size={20} />
                  </div>
                  <div className={styles.stepBody}>
                    <div className={styles.stepTop}>
                      <h2>{year.name}</h2>
                      <span className={styles.state}>{year.is_current ? 'Berjalan' : 'Selesai'}</span>
                    </div>
                    <p className={styles.dates}>
                      <Icon name="calendar" size={14} />
                      <span>{date(year.starts_on)} – {date(year.ends_on)}</span>
                    </p>
                    {year.is_current && (
                      <p className={styles.currentHint}>
                        Tahun ajaran aktif saat ini. Semua kelas, siswa, dan penugasan guru terhubung ke periode ini.
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        ) : years.loaded && !years.error && (
          <div className={styles.emptyState}>
            <NalaEmpty mood="ask" title="Belum ada tahun ajaran">
              Mulai tahun ajaran baru di formulir sebelah untuk mengelola data kelas, guru, dan siswa.
            </NalaEmpty>
          </div>
        )}
      </div>

      {years.loaded && (
        <section className={styles.formSection} aria-labelledby="new-year">
          <div className={styles.formCard}>
            <div className={styles.formHeading}>
              <div className={styles.formIconWrapper}>
                <Icon name="plus" size={18} />
              </div>
              <div>
                <h2 id="new-year" className={styles.formTitle}>Mulai tahun ajaran baru</h2>
                <p className={styles.formSubtitle}>Tahun ajaran baru otomatis menjadi tahun berjalan setelah dimulai.</p>
              </div>
            </div>
            <form className={shared.form} noValidate onSubmit={(event) => { event.preventDefault(); if (!confirming) { key.current = crypto.randomUUID(); setConfirming(true) } else void create() }}>
              <Field label="Nama" required placeholder="2027/2028" maxLength={200} value={fields.name} disabled={command.pending} onChange={(event) => update({ name: event.target.value })} />
              <div className={styles.dateGrid}>
                <DatePicker label="Tanggal mulai" required value={fields.starts_on} disabled={command.pending} onChange={(val) => update({ starts_on: val })} />
                <DatePicker label="Tanggal selesai" required value={fields.ends_on} disabled={command.pending} onChange={(val) => update({ ends_on: val })} />
              </div>
              {years.list.length > 0 && <div className="grid gap-1">
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
                <small className={styles.copyNote}>Hanya nama dan tingkat kelas yang disalin. Siswa, wali kelas, dan penugasan guru diatur lagi.</small>
              </div>}
              {confirming && <Feedback tone="warning" title={`Mulai ${fields.name.trim() || 'tahun ajaran baru'} sekarang?`} announce>{current ? `${current.name} berhenti menjadi tahun berjalan. ` : ''}{copy ? `Kelas dari ${years.list.find((year) => year.id === copy)?.name ?? ''} disalin tanpa siswa.` : 'Tidak ada kelas yang disalin.'}</Feedback>}
              {said && <Feedback tone="warning" title={said} announce>{command.failure?.requestId && <small>Referensi: {command.failure.requestId}</small>}</Feedback>}
              <div className={shared.actions}>
                {confirming && <Button tone="secondary" disabled={command.pending} onClick={() => { command.reset(); setConfirming(false) }}>Ubah isian</Button>}
                <Button type="submit" pending={command.pending} pendingLabel="Membuat…">{confirming ? 'Mulai tahun ajaran' : 'Tinjau'}</Button>
              </div>
            </form>
          </div>
        </section>
      )}
    </div>
  </div>
}

import { useRef, useState } from 'react'
import type { SchoolAdminUseCases } from '@/application/school-admin-use-cases'
import { Button } from '@/ui/components/button/Button'
import { DatePicker } from '@/ui/components/date-picker/DatePicker'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Field } from '@/ui/components/field/Field'
import { Icon } from '@/ui/components/icon/Icon'
import { Loading } from '@/ui/components/loading/Loading'
import { Nala, type NalaMood } from '@/ui/components/nala/Nala'
import { NalaEmpty, NalaNote } from '@/ui/components/nala/NalaState'
import { Select } from '@/ui/components/select/Select'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { useCommand } from '@/ui/pages/live/useLiveResource'
import styles from '@/ui/pages/school-admin/SchoolYear.styles'
import { useAcademicYears } from './useAcademicYears'
import { getTodayDateString, resolveYearStatus } from './academicYearState'

const refusals: Readonly<Record<string, string>> = {
  ACADEMIC_YEAR_EXISTS: 'Tahun ajaran dengan nama itu sudah ada.',
  IDEMPOTENCY_CONFLICT: 'Isian berubah setelah dikirim. Tinjau lagi lalu kirim ulang.',
  NAME_REQUIRED: 'Isi nama tahun ajaran.',
  INVALID_DATES: 'Isi kedua tanggal; tanggal selesai harus setelah tanggal mulai.',
}
const day = new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' })
const fmt = (value: string) => day.format(new Date(`${value}T00:00:00`))

const companion = (current?: { name: string }, total = 0): readonly [NalaMood, string] => {
  if (current) return ['calm', `Tahun ajaran aktif: ${current.name}. Semua kelas terhubung ke periode ini.`]
  if (total === 0) return ['ask', 'Mulai tahun ajaran pertama agar data kelas dan siswa dapat diatur.']
  return ['think', 'Belum ada tahun ajaran yang berjalan saat ini.']
}

export function SchoolYearPage({ service, schoolId }: { service: SchoolAdminUseCases; schoolId: string }) {
  const years = useAcademicYears(service, schoolId)
  const current = years.activeYear ?? years.list.find((year) => year.id === years.activeYearId) ?? years.list[0]
  const note = years.loaded ? companion(current, years.list.length) : null
  const todayStr = getTodayDateString()

  const [fields, setFields] = useState<{
    name: string
    starts_on: string
    ends_on: string
    copy: string | null
    activation: 'scheduled' | 'immediate'
  }>({
    name: '',
    starts_on: '',
    ends_on: '',
    copy: '',
    activation: 'scheduled',
  })
  const copy = fields.copy === 'none' ? null : fields.copy || current?.id || null
  const [confirming, setConfirming] = useState(false)
  const [done, setDone] = useState('')
  const command = useCommand()
  // One key per reviewed submission: a retry after a lost answer reuses it, so the backend never starts a second year.
  const key = useRef('')
  const said = command.failure && (refusals[command.failure.code] ?? command.failure.message)
  const isFuture = Boolean(fields.starts_on && fields.starts_on > todayStr)

  const update = (next: Partial<typeof fields>) => {
    command.reset()
    setConfirming(false)
    setFields((value) => ({ ...value, ...next }))
  }

  async function create() {
    const year = { name: fields.name, starts_on: fields.starts_on, ends_on: fields.ends_on, copy_classes_from: copy }
    const previousActiveId = years.activeYearId
    if (await command.run((signal) => service.createAcademicYear(schoolId, year, key.current, signal))) {
      const refreshedList = await service.academicYears(schoolId)
      const created = refreshedList.find((y) => y.name === fields.name.trim())

      if (fields.activation === 'scheduled') {
        // Keep the current active year active so scheduled future year does not overwrite it
        if (previousActiveId) {
          years.activateYear(previousActiveId)
        }
        const successMsg = `Tahun ajaran ${fields.name.trim()} berhasil dijadwalkan (mulai ${fields.starts_on ? fmt(fields.starts_on) : 'sesuai jadwal'}).${current ? ` Tahun berjalan (${current.name}) tetap aktif.` : ''}`
        setDone(successMsg)
      } else {
        // Immediate activation: switch active year to the new one!
        if (created) {
          years.activateYear(created.id)
        }
        setDone(`Tahun ajaran ${fields.name.trim()} sekarang berjalan.`)
      }

      setFields({ name: '', starts_on: '', ends_on: '', copy: '', activation: 'scheduled' })
      setConfirming(false)
      years.refresh()
    }
  }

  const getYearStatus = (year: { id: string; name: string; starts_on: string; ends_on: string; is_current: boolean }) => {
    const resolved = resolveYearStatus(year, years.activeYearId, todayStr, fmt)
    return {
      type: resolved.type,
      label: resolved.label,
      icon: resolved.icon,
      iconClass: resolved.type === 'current' ? styles.stepIconCurrent : resolved.type === 'upcoming' ? styles.stepIconUpcoming : styles.stepIconDone,
      badgeClass: resolved.type === 'current' ? styles.stateCurrent : resolved.type === 'upcoming' ? styles.stateUpcoming : styles.stateDone,
      itemClass: resolved.type === 'current' ? styles.current : resolved.type === 'upcoming' ? styles.upcoming : styles.done,
      hintClass: resolved.type === 'current' ? styles.currentHint : resolved.type === 'upcoming' ? styles.upcomingHint : styles.doneHint,
      hintIcon: (resolved.type === 'current' ? 'check' : resolved.type === 'upcoming' ? 'clock' : 'archive') as 'check' | 'clock' | 'archive',
      hint: resolved.hint,
      isCurrent: resolved.isCurrent,
    }
  }

  return (
    <div className={styles.content}>
      <div className={styles.head}>
        <div className={styles.headText}>
          <h1 className={styles.title}>Tahun ajaran</h1>
          <p className={styles.lead}>
            Kelola periode tahun ajaran sekolah. Anda dapat menyiapkan tahun ajaran mendatang atau mengaktifkan periode baru dengan fleksibel tanpa kehilangan riwayat sebelumnya.
          </p>
        </div>
        {note && <NalaNote mood={note[0]} text={note[1]} />}
      </div>

      <LiveFeedback error={years.error} online refresh={years.refresh} />
      {!years.loaded && !years.error && <Loading label="Memuat tahun ajaran…" />}
      {done && (
        <Feedback tone="success" title={done} announce>
          Langkah berikutnya: impor data siswa untuk tahun ini.
        </Feedback>
      )}

      <div className={styles.layout}>
        <div className={styles.main}>
          {years.list.length > 0 ? (
            <section className={styles.history} aria-labelledby="years-heading">
              <div className={styles.historyHead}>
                <h2 id="years-heading" className={styles.historyTitle}>
                  <Icon name="calendar" size={17} />
                  Daftar tahun ajaran
                </h2>
                <span className={styles.total}>{years.list.length} periode</span>
              </div>

              <ol className={styles.steps}>
                {years.list.map((year) => {
                  const status = getYearStatus(year)
                  return (
                    <li
                      key={year.id}
                      className={[styles.step, status.itemClass].join(' ')}
                      aria-current={status.isCurrent ? 'step' : undefined}
                    >
                      <div className={[styles.stepIcon, status.iconClass].join(' ')}>
                        <Icon name={status.icon} size={18} />
                      </div>
                      <div className={styles.stepBody}>
                        <div className={styles.stepTop}>
                          <h2>{year.name}</h2>
                          <span className={[styles.state, status.badgeClass].join(' ')}>
                            {status.label}
                          </span>
                        </div>
                        <p className={styles.dates}>
                          <Icon name="calendar" size={13} />
                          <span>
                            {fmt(year.starts_on)} – {fmt(year.ends_on)}
                          </span>
                        </p>
                        <p className={status.hintClass}>
                          <Icon name={status.hintIcon} size={12} />
                          <span>{status.hint}</span>
                        </p>
                        {!status.isCurrent && (
                          <div className="mt-2 pt-2 border-t border-role-border/60 flex items-center justify-between">
                            <span className="text-[11px] text-text-muted">
                              {status.type === 'upcoming' ? 'Periode terjadwal' : 'Periode riwayat'}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                years.activateYear(year.id)
                                setDone(`Tahun ajaran ${year.name} sekarang berjalan. Semua kelas dan data terhubung ke periode ini.`)
                              }}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11.5px] font-semibold text-primary hover:text-primary-hover hover:bg-primary/5 rounded-button border border-primary/25 hover:border-primary/50 transition-colors cursor-pointer"
                            >
                              <Icon name="check" size={12} />
                              <span>Jadikan tahun berjalan</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ol>

              <div className={styles.helperCard}>
                <span className={styles.helperIcon}>
                  <Icon name="idea" size={15} />
                </span>
                <div className="min-w-0">
                  <strong className="block text-[12.5px] font-bold text-ink">Pengaturan Fleksibel</strong>
                  <p className="m-0 mt-0.5 text-[12px] leading-relaxed text-text-secondary">
                    Tahun ajaran baru dapat dijadwalkan lebih awal tanpa memengaruhi data tahun yang sedang aktif. Riwayat kelas, nilai, dan refleksi tetap tersimpan rapi.
                  </p>
                </div>
              </div>
            </section>
          ) : (
            years.loaded &&
            !years.error && (
              <div className={styles.emptyState}>
                <NalaEmpty mood="ask" title="Belum ada tahun ajaran">
                  Mulai tahun ajaran baru di formulir agar data kelas, guru, dan siswa dapat dikelola.
                </NalaEmpty>
              </div>
            )
          )}
        </div>

        {years.loaded && (
          <section className={styles.workspace} aria-labelledby="new-year">
            <div>
              <h2 id="new-year" className={styles.workspaceTitle}>
                Tambah tahun ajaran
              </h2>
              <p className={styles.workspaceLead}>
                Tentukan periode kalender akademik dan pilih cara aktivasi periode baru.
              </p>
            </div>

            <form
              className={styles.form}
              noValidate
              onSubmit={(event) => {
                event.preventDefault()
                if (!confirming) {
                  key.current = crypto.randomUUID()
                  setConfirming(true)
                } else {
                  void create()
                }
              }}
            >
              <div className="grid gap-3.5">
                <Field
                  label="Nama"
                  required
                  placeholder="Contoh: 2027/2028"
                  maxLength={200}
                  value={fields.name}
                  disabled={command.pending}
                  onChange={(event) => update({ name: event.target.value })}
                />
                <div className="grid grid-cols-2 gap-3 max-[460px]:grid-cols-1">
                  <DatePicker
                    label="Tanggal mulai"
                    required
                    value={fields.starts_on}
                    disabled={command.pending}
                    onChange={(val) => update({ starts_on: val })}
                  />
                  <DatePicker
                    label="Tanggal selesai"
                    required
                    value={fields.ends_on}
                    disabled={command.pending}
                    onChange={(val) => update({ ends_on: val })}
                  />
                </div>

                <div className="grid gap-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[13px] font-bold text-ink">Pilihan aktivasi</span>
                    <span className="text-[11.5px] font-semibold text-text-secondary px-2 py-0.5 rounded-md bg-surface-muted border border-role-border">
                      {isFuture ? 'Periode mendatang' : 'Periode aktif'}
                    </span>
                  </div>
                  <div className="grid gap-2">
                    <label
                      className={[
                        styles.activationOption,
                        fields.activation === 'scheduled' ? styles.activationActive : styles.activationInactive,
                      ].join(' ')}
                    >
                      <input
                        type="radio"
                        name="activation"
                        value="scheduled"
                        checked={fields.activation === 'scheduled'}
                        disabled={command.pending}
                        onChange={() => update({ activation: 'scheduled' })}
                        className="mt-0.5 accent-primary cursor-pointer shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap justify-between">
                          <span className="text-[13px] font-bold text-ink">
                            Mulai setelah waktu yang ditentukan
                          </span>
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-pill bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/20">
                            Terjadwal
                          </span>
                        </div>
                        <p className="m-0 mt-0.5 text-[12px] leading-4 text-text-secondary">
                          {fields.starts_on
                            ? `Otomatis mulai pada ${fmt(fields.starts_on)}. `
                            : 'Disiapkan untuk masa mendatang. '}
                          {current
                            ? `Tahun berjalan (${current.name}) TIDAK akan ditimpa dan tetap aktif.`
                            : 'Disiapkan tanpa menimpa data yang ada.'}
                        </p>
                      </div>
                    </label>

                    <label
                      className={[
                        styles.activationOption,
                        fields.activation === 'immediate' ? styles.activationActive : styles.activationInactive,
                      ].join(' ')}
                    >
                      <input
                        type="radio"
                        name="activation"
                        value="immediate"
                        checked={fields.activation === 'immediate'}
                        disabled={command.pending}
                        onChange={() => update({ activation: 'immediate' })}
                        className="mt-0.5 accent-primary cursor-pointer shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap justify-between">
                          <span className="text-[13px] font-bold text-ink">
                            Langsung timpa & jadikan tahun berjalan sekarang
                          </span>
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-pill bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                            Timpa sekarang
                          </span>
                        </div>
                        <p className="m-0 mt-0.5 text-[12px] leading-4 text-text-secondary">
                          {current
                            ? `Langsung menggantikan ${current.name} sebagai tahun berjalan hari ini tanpa menunggu tanggal mulai.`
                            : 'Langsung aktif sebagai tahun berjalan pertama.'}
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {years.list.length > 0 && (
                  <div className="grid gap-1">
                    <Select
                      label="Salin kelas dari"
                      value={copy ?? 'none'}
                      disabled={command.pending}
                      onChange={(val) => update({ copy: val === 'none' ? null : val })}
                      options={[
                        { value: 'none', label: 'Jangan salin kelas' },
                        ...years.list.map((year) => ({ value: year.id, label: year.name })),
                      ]}
                    />
                    <small className="text-[12px] leading-[17px] text-text-secondary">
                      Hanya nama dan tingkat kelas yang disalin. Siswa, wali kelas, dan penugasan guru diatur lagi.
                    </small>
                  </div>
                )}
                {confirming && (
                  <Feedback
                    tone={fields.activation === 'scheduled' ? 'info' : 'warning'}
                    title={
                      fields.activation === 'scheduled'
                        ? `Jadwalkan ${fields.name.trim() || 'tahun ajaran baru'} untuk ${fields.starts_on ? fmt(fields.starts_on) : 'masa mendatang'}?`
                        : `Mulai & timpa dengan ${fields.name.trim() || 'tahun ajaran baru'} sekarang?`
                    }
                    announce
                  >
                    {fields.activation === 'scheduled'
                      ? (current
                          ? `Tahun ajaran saat ini (${current.name}) TIDAK akan ditimpa dan tetap berjalan normal. `
                          : 'Tahun ajaran disiapkan untuk periode mendatang. ')
                      : (current
                          ? `${current.name} berhenti menjadi tahun berjalan dan langsung digantikan hari ini. `
                          : '')}
                    {copy
                      ? `Kelas dari ${years.list.find((year) => year.id === copy)?.name ?? ''} disalin tanpa siswa.`
                      : 'Tidak ada kelas yang disalin.'}
                  </Feedback>
                )}
                {said && (
                  <Feedback tone="warning" title={said} announce>
                    {command.failure?.requestId && <small>Referensi: {command.failure.requestId}</small>}
                  </Feedback>
                )}
              </div>
              <div className={styles.bar}>
                {confirming ? (
                  <div className="flex items-center gap-3 w-full">
                    <Button
                      tone="secondary"
                      className="flex-1 justify-center min-h-10 text-[13.5px] rounded-[12px]"
                      disabled={command.pending}
                      onClick={() => {
                        command.reset()
                        setConfirming(false)
                      }}
                    >
                      Ubah isian
                    </Button>
                    <Button
                      type="submit"
                      className="flex-[2] justify-center min-h-10 text-[13.5px] font-bold rounded-[12px]"
                      pending={command.pending}
                      pendingLabel="Membuat…"
                    >
                      {fields.activation === 'scheduled' ? 'Jadwalkan tahun ajaran' : 'Mulai tahun ajaran'}
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="submit"
                    className="w-full justify-center min-h-10 text-[13.5px] font-bold rounded-[12px] gap-2 shadow-2xs hover:shadow-xs"
                  >
                    <span>Tinjau</span>
                    <Icon name="arrow" size={15} />
                  </Button>
                )}
              </div>
            </form>
          </section>
        )}
      </div>
    </div>
  )
}

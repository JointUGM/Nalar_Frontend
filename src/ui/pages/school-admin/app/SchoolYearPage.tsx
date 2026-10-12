import { useRef, useState } from 'react'
import type { SchoolAdminUseCases } from '@/application/school-admin-use-cases'
import type { AcademicYear } from '@/domain/model/SchoolAdmin'
import { Button } from '@/ui/components/button/Button'
import { DatePicker } from '@/ui/components/date-picker/DatePicker'
import { Dialog } from '@/ui/components/dialog/Dialog'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Field } from '@/ui/components/field/Field'
import { Icon } from '@/ui/components/icon/Icon'
import { Loading } from '@/ui/components/loading/Loading'
import type { NalaMood } from '@/ui/components/nala/Nala'
import { NalaEmpty, NalaNote } from '@/ui/components/nala/NalaState'
import { Select } from '@/ui/components/select/Select'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { useCommand } from '@/ui/pages/live/useLiveResource'
import shared from '@/ui/pages/school-admin/dialogForm.styles'
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

  const [adding, setAdding] = useState(false)
  const [activatingYear, setActivatingYear] = useState<AcademicYear | null>(null)
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
  const defaultCopySource = current?.id ?? 'none'
  const effectiveCopyValue = fields.copy || defaultCopySource
  const copySourceId = effectiveCopyValue === 'none' ? null : effectiveCopyValue
  const [confirming, setConfirming] = useState(false)
  const [done, setDone] = useState('')
  const command = useCommand()
  // One key per reviewed submission: a retry after a lost answer reuses it, so the backend never starts a second year.
  const key = useRef('')
  const said = command.failure && (refusals[command.failure.code] ?? command.failure.message)

  const update = (next: Partial<typeof fields>) => {
    command.reset()
    setConfirming(false)
    setFields((value) => ({ ...value, ...next }))
  }

  async function create() {
    const year = { name: fields.name.trim(), starts_on: fields.starts_on, ends_on: fields.ends_on, copy_classes_from: copySourceId }
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
      setAdding(false)
      years.refresh()
    }
  }

  const getYearStatus = (year: { id: string; name: string; starts_on: string; ends_on: string; is_current: boolean }) => {
    const resolved = resolveYearStatus(year, years.activeYearId, todayStr, fmt)
    return {
      type: resolved.type,
      label: resolved.label,
      icon: resolved.icon,
      badgeClass: resolved.type === 'current' ? styles.stateCurrent : resolved.type === 'upcoming' ? styles.stateUpcoming : styles.stateDone,
      isCurrent: resolved.isCurrent,
    }
  }

  return (
    <div className={styles.content}>
      <div className={styles.head}>
        <div className={styles.headText}>
          <h1 className={styles.title}>Tahun ajaran</h1>
          <p className={styles.lead}>Kelola kalender akademik dan periode aktif sekolah.</p>
        </div>
        {note && <NalaNote mood={note[0]} text={note[1]} />}
        <Button
          type="button"
          className={styles.addButton}
          onClick={() => {
            command.reset()
            setConfirming(false)
            setAdding(true)
          }}
        >
          <Icon name="plus" size={16} />
          <span>Tambah tahun ajaran</span>
        </Button>
      </div>

      <div className={styles.context}>
        {current ? (
          <div className="flex items-center gap-2 text-[13.5px] font-semibold text-text-secondary">
            <span className="size-2 rounded-full bg-success-text animate-pulse" />
            <span>Tahun ajaran berjalan: <strong className="text-ink">{current.name}</strong></span>
            <span className="text-text-muted font-normal text-[12.5px] tabular-nums hidden sm:inline">
              ({fmt(current.starts_on)} – {fmt(current.ends_on)})
            </span>
          </div>
        ) : <div />}
        {years.list.length > 0 && (
          <p className={styles.summary} role="status">{years.list.length} periode kalender akademik</p>
        )}
      </div>

      <LiveFeedback error={years.error} online refresh={years.refresh} />
      {!years.loaded && !years.error && <Loading label="Memuat tahun ajaran…" />}
      {done && (
        <Feedback tone="success" title={done} announce>
          Langkah berikutnya: impor data siswa untuk tahun ini.
        </Feedback>
      )}

      {years.list.length === 0 ? (
        years.loaded && !years.error && (
          <div className={styles.emptyCard}>
            <NalaEmpty mood="ask" title="Belum ada tahun ajaran">
              <p>Mulai tahun ajaran baru agar data kelas, guru, dan siswa dapat dikelola.</p>
            </NalaEmpty>
            <div className="p-6 pt-0 flex justify-center">
              <Button
                type="button"
                className={styles.addButton}
                onClick={() => {
                  command.reset()
                  setConfirming(false)
                  setAdding(true)
                }}
              >
                <Icon name="plus" size={16} />
                <span>Tambah tahun ajaran</span>
              </Button>
            </div>
          </div>
        )
      ) : (
        <div className={styles.card} role="region" aria-label="Tabel daftar tahun ajaran, dapat digulir mendatar" tabIndex={0}>
          <div className={styles.tableScroll}>
            <table className={styles.table}>
              <caption className={styles.hidden}>Daftar tahun ajaran sekolah</caption>
              <thead className={styles.thead}>
                <tr>
                  <th scope="col" className={styles.thYear}>Tahun ajaran</th>
                  <th scope="col" className={styles.thDates}>Rentang kalender</th>
                  <th scope="col" className={styles.thStatus}>Status</th>
                  <th scope="col" className={styles.thAction}><span className={styles.hidden}>Tindakan</span></th>
                </tr>
              </thead>
              <tbody>
                {years.list.map((year) => {
                  const status = getYearStatus(year)
                  return (
                    <tr key={year.id} className={styles.tr}>
                      <th scope="row" className={status.isCurrent ? styles.yearCurrent : styles.classroom}>
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className={status.isCurrent ? styles.yearIconCurrent : styles.yearIcon}>
                            <Icon name={status.icon} size={15} />
                          </span>
                          <span className="truncate">{year.name}</span>
                        </div>
                      </th>
                      <td className={styles.td}>
                        <span className={styles.datesText}>
                          <span className="text-text-muted"><Icon name="calendar" size={13} /></span>
                          <span>{fmt(year.starts_on)} – {fmt(year.ends_on)}</span>
                        </span>
                      </td>
                      <td className={styles.td}>
                        <span className={status.badgeClass}>
                          {status.isCurrent ? (
                            <span className="size-2 rounded-full bg-success-text shrink-0" />
                          ) : status.type === 'upcoming' ? (
                            <Icon name="clock" size={12} className="text-primary shrink-0" />
                          ) : (
                            <Icon name="archive" size={12} className="text-text-muted shrink-0" />
                          )}
                          <span>{status.isCurrent ? 'Tahun Berjalan' : status.label}</span>
                        </span>
                      </td>
                      <td className={styles.tdEnd}>
                        {status.isCurrent ? (
                          <div className={styles.activeCell}>
                            <span className={styles.activeLabel}>
                              <Icon name="check" size={13} className="text-success-strong" />
                              <span>Sedang aktif</span>
                            </span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setActivatingYear(year)}
                            className={status.type === 'archived' || status.type === 'done' ? styles.cellButtonArchived : styles.cellButton}
                          >
                            <span>Jadikan tahun berjalan</span>
                            <Icon name="chevronRight" size={13} className="text-text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Dialog
        open={Boolean(activatingYear)}
        onClose={() => setActivatingYear(null)}
        title="Jadikan tahun berjalan?"
        description="Konfirmasi peralihan periode kalender akademik aktif sekolah."
        icon="calendar"
      >
        {activatingYear && (
          <div className={shared.form}>
            <div className={styles.targetCard}>
              <div className={styles.targetIconWrap}>
                <Icon name="calendar" size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <strong className={styles.targetTitle}>{activatingYear.name}</strong>
                  <span className={styles.targetBadge}>
                    Akan diaktifkan
                  </span>
                </div>
                <p className={styles.targetDates}>
                  <Icon name="calendar" size={13} />
                  <span>{fmt(activatingYear.starts_on)} – {fmt(activatingYear.ends_on)}</span>
                </p>
              </div>
            </div>

            <div className={styles.cautionCard}>
              <div className={styles.cautionHead}>
                <div className={styles.cautionIcon}>
                  <Icon name="info" size={12} />
                </div>
                <span>Hal yang perlu diperhatikan:</span>
              </div>
              <ul className={styles.cautionList}>
                {current && current.id !== activatingYear.id && (
                  <li>
                    Periode saat ini (<strong>{current.name}</strong>) tidak lagi menjadi tahun berjalan dan beralih status ke arsip.
                  </li>
                )}
                <li>
                  Seluruh kelas, jadwal pelajaran guru, dan data siswa di dashboard akan terhubung ke periode <strong>{activatingYear.name}</strong>.
                </li>
                <li>
                  Riwayat akademik dan nilai periode sebelumnya tetap tersimpan aman.
                </li>
              </ul>
            </div>

            <div className={shared.actions}>
              <Button
                type="button"
                tone="secondary"
                onClick={() => setActivatingYear(null)}
              >
                Batal
              </Button>
              <Button
                type="button"
                className="gap-1.5"
                onClick={() => {
                  const target = activatingYear
                  setActivatingYear(null)
                  years.activateYear(target.id)
                  setDone(`Tahun ajaran ${target.name} sekarang berjalan. Semua kelas dan data terhubung ke periode ini.`)
                }}
              >
                <Icon name="check" size={15} />
                <span>Ya, jadikan tahun berjalan</span>
              </Button>
            </div>
          </div>
        )}
      </Dialog>

      <Dialog
        open={adding}
        onClose={() => {
          if (!command.pending) {
            setAdding(false)
            setConfirming(false)
            command.reset()
          }
        }}
        dismissible={!command.pending}
        title="Tambah tahun ajaran"
        description="Tentukan kalender akademik dan periode aktivasi sekolah."
        icon="calendar"
      >
        <form
          className={shared.form}
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
          <div className="grid gap-3 sm:gap-3.5">
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

            <div className="grid gap-2">
              <span className="text-[13px] font-bold text-ink">Pilihan aktivasi</span>
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
                    className="sr-only"
                  />
                  <span
                    className={[
                      styles.radioIndicator,
                      fields.activation === 'scheduled'
                        ? 'border-primary bg-primary ring-2 ring-primary/20 shadow-2xs'
                        : 'border-control-border/70 bg-surface group-hover:border-control-border',
                    ].join(' ')}
                  >
                    {fields.activation === 'scheduled' && (
                      <span className="size-1.5 rounded-full bg-white" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 justify-between flex-wrap">
                      <span className="text-[13.5px] font-bold text-ink leading-snug">
                        Mulai setelah waktu yang ditentukan
                      </span>
                      <span className="shrink-0 whitespace-nowrap text-[11px] font-bold px-2.5 py-0.5 rounded-pill bg-info-bg text-primary border border-primary/25">
                        Terjadwal
                      </span>
                    </div>
                    <p className="m-0 mt-0.5 text-[12px] text-text-secondary leading-normal">
                      Aktif otomatis saat tanggal tiba. Tahun berjalan tetap aktif.
                    </p>
                  </div>
                </label>

                <label
                  className={[
                    styles.activationOption,
                    fields.activation === 'immediate'
                      ? 'border-warning-text/80 bg-warning-bg/40 ring-1 ring-warning-text/25 shadow-xs'
                      : styles.activationInactive,
                  ].join(' ')}
                >
                  <input
                    type="radio"
                    name="activation"
                    value="immediate"
                    checked={fields.activation === 'immediate'}
                    disabled={command.pending}
                    onChange={() => update({ activation: 'immediate' })}
                    className="sr-only"
                  />
                  <span
                    className={[
                      styles.radioIndicator,
                      fields.activation === 'immediate'
                        ? 'border-warning-text bg-warning-text ring-2 ring-warning-text/20 shadow-2xs'
                        : 'border-control-border/70 bg-surface group-hover:border-control-border',
                    ].join(' ')}
                  >
                    {fields.activation === 'immediate' && (
                      <span className="size-1.5 rounded-full bg-white" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 justify-between flex-wrap">
                      <span className="text-[13.5px] font-bold text-ink leading-snug">
                        Langsung timpa & jadikan tahun berjalan sekarang
                      </span>
                      <span className="shrink-0 whitespace-nowrap text-[11px] font-bold px-2.5 py-0.5 rounded-pill bg-warning-bg text-warning-text border border-warning-text/30">
                        Langsung aktif
                      </span>
                    </div>
                    <p className="m-0 mt-0.5 text-[12px] text-text-secondary leading-normal">
                      Langsung aktif hari ini menggantikan tahun berjalan.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {fields.name.trim() && (
              <div className={styles.previewBox}>
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-text-muted text-[11.5px] font-semibold">Pratinjau:</span>
                  <span className="font-bold text-ink truncate">{fields.name.trim()}</span>
                  {fields.starts_on && fields.ends_on && (
                    <span className="text-text-muted truncate text-[11.5px]">
                      ({fmt(fields.starts_on)} – {fmt(fields.ends_on)})
                    </span>
                  )}
                </div>
                <span
                  className={[
                    'shrink-0 whitespace-nowrap px-2.5 py-0.5 rounded-pill text-[11px] font-bold border',
                    fields.activation === 'scheduled'
                      ? 'bg-info-bg text-primary border-primary/25'
                      : 'bg-warning-bg text-warning-text border-warning-text/30',
                  ].join(' ')}
                >
                  {fields.activation === 'scheduled' ? 'Terjadwal' : 'Langsung Aktif'}
                </span>
              </div>
            )}

            {years.list.length > 0 && (
              <div className="grid gap-1">
                <Select
                  label="Salin kelas dari"
                  value={effectiveCopyValue}
                  disabled={command.pending}
                  onChange={(val) => update({ copy: val })}
                  options={[
                    { value: 'none', label: 'Jangan salin kelas' },
                    ...years.list.map((year) => ({ value: year.id, label: year.name })),
                  ]}
                />
                <small className="text-[11.5px] text-text-muted">
                  Hanya nama dan tingkat kelas yang disalin.
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
                {copySourceId
                  ? `Kelas dari ${years.list.find((year) => year.id === copySourceId)?.name ?? ''} disalin tanpa siswa.`
                  : 'Tidak ada kelas yang disalin.'}
              </Feedback>
            )}
            {said && (
              <Feedback tone="warning" title={said} announce>
                {command.failure?.requestId && <small>Referensi: {command.failure.requestId}</small>}
              </Feedback>
            )}
          </div>
          <div className={shared.actions}>
            {confirming ? (
              <>
                <Button
                  type="button"
                  tone="secondary"
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
                  pending={command.pending}
                  pendingLabel="Membuat…"
                >
                  {fields.activation === 'scheduled' ? 'Jadwalkan tahun ajaran' : 'Mulai tahun ajaran'}
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  tone="secondary"
                  disabled={command.pending}
                  onClick={() => {
                    if (!command.pending) {
                      setAdding(false)
                      setConfirming(false)
                      command.reset()
                    }
                  }}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  className="gap-1.5"
                >
                  <span>Tinjau</span>
                  <Icon name="arrow" size={15} />
                </Button>
              </>
            )}
          </div>
        </form>
      </Dialog>
    </div>
  )
}

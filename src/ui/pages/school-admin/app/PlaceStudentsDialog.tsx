import { useCallback, useEffect, useState } from 'react'
import type { SchoolAdminUseCases } from '@/application/school-admin-use-cases'
import { placementMax } from '@/domain/model/SchoolAdmin'
import type { Person, SchoolClass } from '@/domain/model/SchoolAdmin'
import { Button } from '@/ui/components/button/Button'
import { Dialog } from '@/ui/components/dialog/Dialog'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Field } from '@/ui/components/field/Field'
import { noPollMs, useCommand, useLiveResource } from '@/ui/pages/live/useLiveResource'
import shared from '@/ui/pages/school-admin/dialogForm.module.css'
import { NalaAvatar } from '@/ui/components/nala/NalaIcon'

const refusals: Readonly<Record<string, string>> = {
  INVALID_INPUT: `Pilih 1 sampai ${placementMax} siswa.`,
  NOT_FOUND: 'Ada siswa yang tidak aktif atau bukan siswa sekolah ini. Muat ulang daftar lalu pilih lagi.',
}

// Puts many students into one class at once, for example into the classes of a new year. Other years keep their records.
export function PlaceStudentsDialog({ service, schoolId, klass, onClose }: { service: SchoolAdminUseCases; schoolId: string; klass: SchoolClass; onClose: (done?: string) => void }) {
  const [search, setSearch] = useState('')
  const [q, setQ] = useState('')
  const [cursor, setCursor] = useState<string | null>(null)
  const [earlier, setEarlier] = useState<Person[]>([])
  const [unplacedOnly, setUnplacedOnly] = useState(false)
  const [chosen, setChosen] = useState<ReadonlyMap<string, string>>(new Map())
  const command = useCommand()
  const said = command.failure && (refusals[command.failure.code] ?? command.failure.message)
  useEffect(() => { const timer = setTimeout(() => { setQ(search.trim()); setCursor(null); setEarlier([]) }, 300); return () => clearTimeout(timer) }, [search])
  const read = useCallback((signal: AbortSignal) => service.people(schoolId, 'student', q, cursor, signal), [service, schoolId, q, cursor])
  const { data, error } = useLiveResource(read, noPollMs)
  // "Muat lebih banyak" keeps the pages already read; a new search starts again.
  const rows = [...earlier, ...(data?.items ?? [])]
  const shown = unplacedOnly ? rows.filter((row) => !row.class_name) : rows
  const toggle = (person: Person) => { command.reset(); setChosen((before) => { const next = new Map(before); if (next.has(person.user_id)) next.delete(person.user_id); else next.set(person.user_id, person.full_name); return next }) }
  const addShown = () => { command.reset(); setChosen((before) => { const next = new Map(before); for (const row of shown) if (next.size < placementMax) next.set(row.user_id, row.full_name); return next }) }

  async function save() {
    if (await command.run((signal) => service.placeStudents(schoolId, klass.class_id, [...chosen.keys()], signal))) onClose(`${chosen.size} siswa ditempatkan di ${klass.name}.`)
  }

  return <Dialog open onClose={() => onClose()} dismissible={!command.pending} title={`Tempatkan siswa di ${klass.name}`} description="Pilih siswa yang masuk ke kelas ini. Siswa yang sudah ada di kelas lain pindah ke sini untuk tahun ajaran kelas ini.">
    <form className={shared.form} noValidate onSubmit={(event) => { event.preventDefault(); void save() }}>
      <Field label="Cari siswa (nama atau NISN)" type="search" value={search} disabled={command.pending} onChange={(event) => setSearch(event.target.value)} />
      <label className={shared.checkboxLabel}>
        <input type="checkbox" checked={unplacedOnly} onChange={(event) => setUnplacedOnly(event.target.checked)} />
        <span>Hanya yang belum punya kelas</span>
      </label>
      {error && <Feedback tone="warning" title={error.message} announce />}
      {!data && !error && <p role="status">Memuat siswa…</p>}
      {data && shown.length === 0 && <p role="status">{q || unplacedOnly ? 'Tidak ada siswa yang cocok.' : 'Belum ada siswa.'}</p>}
      {shown.length > 0 && <>
        <div className={shared.selectionBar}>
          <Button tone="secondary" disabled={command.pending} onClick={addShown}>Pilih semua yang tampil</Button>
          <span className={shared.selectionCount}>{chosen.size} dari {placementMax} dipilih</span>
        </div>
        <ul className={shared.selectionList} aria-label="Siswa">
          {shown.map((person) => {
            const isChecked = chosen.has(person.user_id)
            return (
              <li key={person.user_id}>
                <label className={[shared.selectionItem, isChecked ? shared.selectedItem : ''].join(' ')}>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    disabled={command.pending || (!isChecked && chosen.size >= placementMax)}
                    onChange={() => toggle(person)}
                  />
                  <span className={shared.avatar}>
                    <NalaAvatar seed={person.full_name} size={28} />
                  </span>
                  <div className={shared.selectionText}>
                    <span className={shared.personName}>{person.full_name}</span>
                    <span className={[shared.selectionBadge, person.class_name ? '' : shared.unplacedBadge].join(' ')}>
                      {person.class_name ? `Kelas ${person.class_name}` : 'Belum berkelas'}
                    </span>
                  </div>
                </label>
              </li>
            )
          })}
        </ul>
      </>}
      {data?.next_cursor && <Button tone="secondary" disabled={command.pending} onClick={() => { setEarlier(rows); setCursor(data.next_cursor) }}>Muat lebih banyak</Button>}
      <p role="status">{chosen.size} dipilih (maksimal {placementMax}).</p>
      {said && <Feedback tone="warning" title={said} announce>{command.failure?.requestId && <small>Referensi: {command.failure.requestId}</small>}</Feedback>}
      <div className={shared.actions}>
        <Button tone="secondary" disabled={command.pending} onClick={() => onClose()}>Batal</Button>
        <Button type="submit" disabled={chosen.size === 0} pending={command.pending} pendingLabel="Menempatkan…">Tempatkan {chosen.size || ''} siswa</Button>
      </div>
    </form>
  </Dialog>
}

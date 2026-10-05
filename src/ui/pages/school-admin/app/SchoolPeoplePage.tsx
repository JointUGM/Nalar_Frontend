import { useCallback, useEffect, useRef, useState } from 'react'
import type { SchoolAdminUseCases } from '@/application/school-admin-use-cases'
import type { Person, PeopleRole } from '@/domain/model/SchoolAdmin'
import { Button } from '@/ui/components/button/Button'
import { Dialog } from '@/ui/components/dialog/Dialog'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Field } from '@/ui/components/field/Field'
import { Icon } from '@/ui/components/icon/Icon'
import { StatusBadge } from '@/ui/components/status-badge/StatusBadge'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { NewPersonDialog } from './NewPersonDialog'
import { PersonLinks } from './PersonLinks'
import { noPollMs, useCommand, useLiveResource } from '@/ui/pages/live/useLiveResource'
import shared from '@/ui/pages/school-admin/dialogForm.module.css'
import styles from '@/ui/pages/school-admin/SchoolPeople.module.css'
import { Select } from '@/ui/components/select/Select'
import { Loading } from '@/ui/components/loading/Loading'
import { NalaAvatar } from '@/ui/components/nala/NalaIcon'
import { NalaEmpty, NalaNote } from '@/ui/components/nala/NalaState'

const roles: readonly [PeopleRole, string][] = [['student', 'Siswa'], ['teacher', 'Guru'], ['parent', 'Orang tua'], ['school_admin', 'Admin sekolah']]
const stateWord: Readonly<Record<string, string>> = { active: 'Aktif', inactive: 'Nonaktif', pending_activation: 'Menunggu aktivasi' }
const refusals: Readonly<Record<string, string>> = {
  LAST_SCHOOL_ADMIN: 'Ini admin sekolah terakhir yang aktif. Minta admin platform menunjuk admin baru lebih dulu.',
  NAME_REQUIRED: 'Isi nama lengkap.',
  REACTIVATION_HISTORY_MISSING: 'Riwayat penonaktifan tidak ditemukan, jadi akun ini tidak bisa diaktifkan lagi dari sini.',
  ADMIN_REACTIVATION_REQUIRES_HANDOFF: 'Admin sekolah yang nonaktif hanya bisa diganti lewat admin platform.',
}

export function SchoolPeoplePage({ service, schoolId }: { service: SchoolAdminUseCases; schoolId: string }) {
  const [role, setRole] = useState<PeopleRole>('student')
  const [query, setQuery] = useState('')
  const [q, setQ] = useState('')
  const [cursor, setCursor] = useState<string | null>(null)
  const [open, setOpen] = useState<Person | null>(null)
  const [adding, setAdding] = useState(false)
  const [message, setMessage] = useState('')
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  // The list is asked for once the admin pauses typing, not on every key.
  useEffect(() => { const timer = setTimeout(() => { setQ(query.trim()); setCursor(null) }, 300); return () => clearTimeout(timer) }, [query])
  const read = useCallback((signal: AbortSignal) => service.people(schoolId, role, q, cursor, signal), [service, schoolId, role, q, cursor])
  const { data, error, online, refresh } = useLiveResource(read, noPollMs)
  const label = roles.find(([value]) => value === role)?.[1] ?? ''
  const choose = (next: PeopleRole) => { setRole(next); setCursor(null); setMessage('') }
  const note = q
    ? (['search', `Menemukan ${data ? data.total : 0} ${label.toLowerCase()} yang cocok.`] as const)
    : data && data.total > 0
      ? (['hello', `${data.total} akun ${label.toLowerCase()} terdaftar di sekolah ini.`] as const)
      : null

  return <div className={styles.content}>
    <div className={styles.heading}>
      <div>
        <h1>Orang</h1>
        <p className={styles.subtitle}>Kelola akun guru, siswa, orang tua, dan admin sekolah.</p>
      </div>
      {note && <NalaNote mood={note[0]} text={note[1]} />}
      <Button className={styles.addButton} onClick={() => { setMessage(''); setAdding(true) }}><Icon name="plus" size={16} />Tambah orang</Button>
    </div>
    <div className={styles.filters}>
      <div className={styles.tabs} role="tablist" aria-label="Peran">{roles.map(([value, text], index) => <button key={value} ref={(element) => { tabs.current[index] = element }} role="tab" aria-selected={role === value} aria-controls="people-panel" tabIndex={role === value ? 0 : -1} className={role === value ? styles.selected : undefined} onClick={() => choose(value)} onKeyDown={(event) => {
        const next = event.key === 'ArrowRight' ? (index + 1) % roles.length : event.key === 'ArrowLeft' ? (index + roles.length - 1) % roles.length : undefined
        if (next !== undefined) { event.preventDefault(); choose(roles[next][0]); tabs.current[next]?.focus() }
      }}>{text}</button>)}</div>
      <div className={styles.searchBox}>
        <Icon name="search" size={18} />
        <input
          type="search"
          aria-label="Cari nama, NISN, atau email"
          placeholder="Cari nama, NISN, atau email…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        {query && (
          <button type="button" className={styles.clearSearch} onClick={() => setQuery('')} aria-label="Hapus pencarian">
            <Icon name="x" size={14} />
          </button>
        )}
      </div>
    </div>
    <p className={styles.note}>Satu akun baru bisa ditambah di sini; banyak akun sekaligus lewat Impor data. Nama dan kelas bisa diubah, dan akun bisa dinonaktifkan atau diaktifkan lagi; riwayatnya tetap tersimpan.</p>
    {message && <Feedback tone="success" title={message} announce />}
    <LiveFeedback error={error} online={online} refresh={refresh} />
    <section id="people-panel" role="tabpanel" aria-label={label} tabIndex={0}>
      {!data && !error && <Loading label="Memuat daftar…" />}
      {data && (data.items.length ? <div className={styles.card}><table className={styles.table}>
        <caption className={styles.hidden}>Daftar {label.toLocaleLowerCase('id-ID')}</caption>
        <thead><tr><th scope="col">Nama</th><th scope="col">{role === 'student' ? 'NISN' : 'Email'}</th><th scope="col">Kelas</th><th scope="col">Status</th><th scope="col"><span className={styles.hidden}>Tindakan</span></th></tr></thead>
        <tbody>{data.items.map((person) => <tr key={person.user_id}>
          <td className={styles.name}>
            <div className={styles.personCell}>
              <span className={styles.avatar}><NalaAvatar seed={person.full_name} size={36} /></span>
              <span className={styles.personName}>{person.full_name}</span>
            </div>
          </td>
          <td className={styles.identifier}>{(role === 'student' ? person.nisn : person.email) ?? '—'}</td>
          <td className={styles.classroom}>{person.class_name ?? '—'}</td>
          <td><StatusBadge tone={person.account_state === 'active' ? 'success' : person.account_state === 'inactive' ? 'neutral' : 'warning'}>{stateWord[person.account_state] ?? person.account_state}</StatusBadge></td>
          <td><Button tone="ghost" className={styles.more} aria-label={`Kelola ${person.full_name}`} onClick={() => { setMessage(''); setOpen(person) }}><Icon name="more" /></Button></td>
        </tr>)}</tbody>
      </table></div> : <div className={styles.emptyCard}><NalaEmpty mood={q ? 'search' : 'hello'} title={q ? 'Tidak ada yang cocok' : `Belum ada ${label.toLowerCase()}`} action={!q && <Button tone="secondary" onClick={() => { setMessage(''); setAdding(true) }}><Icon name="plus" size={16} />Tambah {label.toLowerCase()} pertama</Button>}><p>{q ? 'Tidak ada yang cocok dengan pencarian ini.' : `Belum ada ${label.toLocaleLowerCase('id-ID')} di sekolah ini.`}</p></NalaEmpty></div>)}
      {data && <nav className={styles.pagination} aria-label="Halaman daftar"><span role="status">{data.total} {label.toLocaleLowerCase('id-ID')}{q ? ' cocok' : ''}</span>
        {cursor && <Button tone="secondary" onClick={() => setCursor(null)}>Kembali ke awal</Button>}
        {data.next_cursor && <Button tone="secondary" onClick={() => setCursor(data.next_cursor)}>Berikutnya</Button>}
      </nav>}
    </section>
    {adding && <NewPersonDialog service={service} schoolId={schoolId} initialRole={role === 'school_admin' ? 'student' : role} onClose={(done) => { setAdding(false); if (done) { setMessage(done); refresh() } }} />}
    {open && <PersonDrawer service={service} schoolId={schoolId} person={open} onClose={(done) => { setOpen(null); if (done) { setMessage(done); refresh() } }} />}
  </div>
}

function PersonDrawer({ service, schoolId, person, onClose }: { service: SchoolAdminUseCases; schoolId: string; person: Person; onClose: (done?: string) => void }) {
  const student = person.role === 'student' && person.account_state !== 'inactive'
  // A student moves between the classes of the current year only.
  const readClasses = useCallback(async (signal: AbortSignal) => {
    if (!student) return []
    const year = (await service.academicYears(schoolId, signal)).find((item) => item.is_current)
    return year ? service.classes(schoolId, year.id, signal) : []
  }, [service, schoolId, student])
  const classes = useLiveResource(readClasses, noPollMs).data ?? []
  const [name, setName] = useState(person.full_name)
  const [classId, setClassId] = useState('')
  const [confirming, setConfirming] = useState(false)
  const command = useCommand()
  const said = command.failure && (refusals[command.failure.code] ?? command.failure.message)
  const changed = name.trim() !== person.full_name || classId !== ''

  async function save() {
    const edit = { ...(name.trim() !== person.full_name ? { full_name: name } : {}), ...(classId ? { class_id: classId } : {}) }
    if (await command.run((signal) => service.editPerson(schoolId, person.user_id, edit, signal))) onClose(`Data ${name.trim()} tersimpan.`)
  }
  async function reactivate() {
    if (await command.run((signal) => service.reactivatePerson(schoolId, person.user_id, signal))) onClose(`${person.full_name} aktif lagi.`)
  }
  async function deactivate() {
    if (await command.run((signal) => service.deactivatePerson(schoolId, person.user_id, signal))) onClose(`${person.full_name} dinonaktifkan. Riwayatnya tetap tersimpan.`)
  }

  return <Dialog open onClose={() => onClose()} dismissible={!command.pending} title={person.full_name} description={stateWord[person.account_state] ?? person.account_state}>
    {confirming ? <div className={shared.form}>
      <Feedback tone="warning" title={`Nonaktifkan ${person.full_name}?`} announce>Akun ini tidak bisa masuk lagi ke sekolah ini dan sesi yang terbuka diakhiri. Riwayat misi dan hasilnya tetap tersimpan.</Feedback>
      {said && <Feedback tone="warning" title={said} announce>{command.failure?.requestId && <small>Referensi: {command.failure.requestId}</small>}</Feedback>}
      <div className={shared.actions}><Button tone="secondary" disabled={command.pending} onClick={() => { command.reset(); setConfirming(false) }}>Kembali</Button><Button tone="danger" pending={command.pending} pendingLabel="Menonaktifkan…" onClick={() => void deactivate()}>Nonaktifkan</Button></div>
    </div> : <form className={shared.form} noValidate onSubmit={(event) => { event.preventDefault(); if (changed) void save() }}>
      <Field label="Nama lengkap" required value={name} disabled={command.pending} maxLength={200} onChange={(event) => { command.reset(); setName(event.target.value) }} />
      {(person.nisn || person.email) && (
        <div className={shared.metaChips}>
          {person.nisn && <span className={shared.metaChip}>NISN: <strong>{person.nisn}</strong></span>}
          {person.email && <span className={shared.metaChip}>Email: <strong>{person.email}</strong></span>}
        </div>
      )}
      {student && <div style={{ display: 'grid', gap: '4px' }}>
        <Select
          label="Pindah kelas"
          value={classId}
          disabled={command.pending}
          placeholder={person.class_name ? `Tetap di ${person.class_name}` : 'Pilih kelas'}
          onChange={(val) => { command.reset(); setClassId(val) }}
          options={[
            { value: '', label: person.class_name ? `Tetap di ${person.class_name}` : 'Pilih kelas' },
            ...classes.filter((item) => item.name !== person.class_name).map((item) => ({ value: item.class_id, label: item.name }))
          ]}
        />
        <small style={{ color: 'var(--color-text-secondary)', fontSize: '12px' }}>Hasil misi lama tetap tercatat di kelas sebelumnya.</small>
      </div>}
      <PersonLinks service={service} schoolId={schoolId} person={person} editable={person.account_state !== 'inactive' && (person.role === 'parent' || person.role === 'student')} onDone={(done) => onClose(done)} />
      {said && <Feedback tone="warning" title={said} announce>{command.failure?.requestId && <small>Referensi: {command.failure.requestId}</small>}</Feedback>}
      <div className={shared.actions}>
        <Button tone="secondary" disabled={command.pending} onClick={() => onClose()}>Batal</Button>
        <Button type="submit" disabled={!changed} pending={command.pending} pendingLabel="Menyimpan…">Simpan</Button>
      </div>
      {person.account_state === 'inactive' && <Button tone="secondary" pending={command.pending} pendingLabel="Mengaktifkan…" onClick={() => void reactivate()}>Aktifkan kembali</Button>}
      {person.account_state !== 'inactive' && <Button tone="ghost" disabled={command.pending} onClick={() => { command.reset(); setConfirming(true) }}>Nonaktifkan akun</Button>}
    </form>}
  </Dialog>
}

import { useRef } from 'react'
import { AdultShell } from '@/ui/components/adult-shell/AdultShell'
import { Button } from '@/ui/components/button/Button'
import { Dialog } from '@/ui/components/dialog/Dialog'
import { Field } from '@/ui/components/field/Field'
import { Icon } from '@/ui/components/icon/Icon'
import { StatusBadge } from '@/ui/components/status-badge/StatusBadge'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { roleLabels, schoolExample } from './peopleExamples'
import type { PeopleRole } from './peopleExamples'
import { useSchoolPeopleViewModel } from './useSchoolPeopleViewModel'
import { StudentFormDialog } from './StudentFormDialog'
import styles from './SchoolPeople.module.css'

const roles: PeopleRole[] = ['student', 'teacher', 'parent']

export function SchoolPeople() {
  const view = useSchoolPeopleViewModel()
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const openerRef = useRef<HTMLButtonElement | null>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  const identifierLabel = view.role === 'student' ? 'NISN' : 'Email'
  return <AdultShell schoolContext={schoolExample}>
    <div className={styles.content}>
      <div className={styles.heading}><h1>Orang</h1><Button disabled={view.role !== 'student'} title={view.role !== 'student' ? 'Formulir guru dan orang tua belum tersedia' : undefined} className={styles.addButton} onClick={(event) => { openerRef.current = event.currentTarget; view.addStudent() }}><Icon name="plus" size={16} />{view.role === 'student' ? 'Tambah siswa' : 'Tambah orang'}</Button></div>
      <div className={styles.filters}>
        <div className={styles.tabs} role="tablist" aria-label="Peran orang">{roles.map((role, index) => <button key={role} ref={(element) => { tabRefs.current[index] = element }} role="tab" id={`people-tab-${role}`} aria-selected={view.role === role} aria-controls="people-panel" tabIndex={view.role === role ? 0 : -1} className={view.role === role ? styles.selected : undefined} onClick={() => view.changeRole(role)} onKeyDown={(event) => {
          let next: number | undefined
          if (event.key === 'ArrowRight') next = (index + 1) % roles.length
          if (event.key === 'ArrowLeft') next = (index + roles.length - 1) % roles.length
          if (event.key === 'Home') next = 0
          if (event.key === 'End') next = roles.length - 1
          if (next !== undefined) { event.preventDefault(); view.changeRole(roles[next]); tabRefs.current[next]?.focus() }
        }}>{roleLabels[role]}</button>)}</div>
        <div ref={searchRef}><Field label="Cari nama, NISN, atau email" type="search" placeholder="Cari nama, NISN, atau email" value={view.query} onChange={(event) => view.search(event.target.value)} /></div>
      </div>
      <p className={styles.note}>Data contoh · {view.total} {roleLabels[view.role].toLocaleLowerCase('id-ID')}. {view.role === 'student' ? 'Tambah/ubah siswa hanya berlaku dalam simulasi lokal.' : 'Formulir guru dan orang tua belum tersedia.'}</p>
      {view.message && <Feedback tone="success" title={view.message} announce />}
      <section id="people-panel" role="tabpanel" aria-labelledby={`people-tab-${view.role}`} tabIndex={0}>
        {view.people.length ? <div className={styles.card}><table className={styles.table}><caption className={styles.hidden}>Daftar {roleLabels[view.role].toLocaleLowerCase('id-ID')} contoh</caption><thead><tr><th scope="col">Nama</th><th scope="col">{identifierLabel}</th><th scope="col">Kelas</th><th scope="col">Status</th><th scope="col"><span className={styles.hidden}>Tindakan</span></th></tr></thead><tbody>{view.people.map((person) => <tr key={person.id}>
          <td className={styles.name}>{person.name}</td><td className={styles.identifier}>{person.identifier}</td><td className={styles.classroom}>{person.classroom}</td><td><StatusBadge tone={person.status === 'Aktif' ? 'success' : person.status === 'Nonaktif' ? 'neutral' : 'warning'}>{person.status}</StatusBadge></td><td><Button tone="ghost" className={styles.more} aria-label={`${view.role === 'student' ? 'Ubah data' : 'Lihat detail'} ${person.name}`} onClick={(event) => { if (view.role === 'student') { openerRef.current = event.currentTarget; view.setEditor({ person }) } else view.setSelected(person) }}><Icon name="more" /></Button></td>
        </tr>)}</tbody></table></div> : <div className={styles.empty}><p>Tidak ada orang yang cocok dengan pencarian ini.</p><Button tone="secondary" onClick={() => view.search('')}>Hapus pencarian</Button></div>}
        <nav className={styles.pagination} aria-label="Halaman orang"><span role="status">{view.count} hasil contoh · Halaman {view.page + 1} dari {view.pageCount}</span>{view.page > 0 && <Button tone="secondary" onClick={() => view.setPage(view.page - 1)}>Sebelumnya</Button>}{view.page + 1 < view.pageCount && <Button tone="secondary" onClick={() => view.setPage(view.page + 1)}>Berikutnya</Button>}</nav>
      </section>
    </div>
    {view.editor && <StudentFormDialog person={view.editor.person} newId={view.newId} students={view.students} onSave={view.saveStudent} onClose={() => { view.setEditor(null); requestAnimationFrame(() => { if (!openerRef.current?.isConnected) searchRef.current?.querySelector('input')?.focus() }) }} />}
    {view.selected && <Dialog open onClose={() => view.setSelected(null)} title={view.selected.name} description="Metadata contoh dalam pratinjau. Data dan akses tidak berubah."><dl className={styles.details}><dt>Peran</dt><dd>{roleLabels[view.role]}</dd><dt>{identifierLabel}</dt><dd>{view.selected.identifier}</dd><dt>Kelas</dt><dd>{view.selected.classroom}</dd><dt>Status</dt><dd>{view.selected.status}</dd><dt>Sekolah · tahun ajaran</dt><dd>{schoolExample.name} · {schoolExample.year}</dd></dl><Button onClick={() => view.setSelected(null)}>Tutup</Button></Dialog>}
  </AdultShell>
}

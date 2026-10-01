import { AdultShell } from '@/ui/components/adult-shell/AdultShell'
import { Button } from '@/ui/components/button/Button'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Icon } from '@/ui/components/icon/Icon'
import { ClassFormDialog } from './ClassFormDialog'
import { schoolExample } from './peopleExamples'
import { useSchoolClassesViewModel } from './useSchoolClassesViewModel'
import styles from './SchoolClasses.module.css'

export function SchoolClasses() {
  const view = useSchoolClassesViewModel()
  return <AdultShell schoolContext={schoolExample}>
    <div className={styles.content}>
      <div className={styles.heading}>
        <div><p>Tahun ajaran {schoolExample.year}</p><h1>Kelas</h1></div>
        <Button className={styles.addButton} onClick={() => view.setCreating(true)}><Icon name="plus" size={16} />Kelas baru</Button>
      </div>
      <p className={styles.note}>Data contoh · {view.classes.length} kelas. Pembuatan kelas hanya berlaku dalam simulasi lokal.</p>
      {view.message && <Feedback tone="success" title={view.message} announce />}
      {view.groups.map((group) => <section key={group.grade} className={styles.group} aria-labelledby={`grade-${group.grade}`}>
        <h2 id={`grade-${group.grade}`}>Kelas {group.grade}</h2>
        {group.items.length ? <ul className={styles.grid}>{group.items.map((item) => <li key={item.id} className={styles.card}><strong>{item.name}</strong><span>{item.students} siswa</span><small>Wali: {item.homeroom}</small></li>)}</ul> : <p className={styles.empty}>Belum ada kelas untuk tingkat ini.</p>}
      </section>)}
    </div>
    {view.creating && <ClassFormDialog classes={view.classes} onSave={view.addClass} onClose={() => view.setCreating(false)} />}
  </AdultShell>
}

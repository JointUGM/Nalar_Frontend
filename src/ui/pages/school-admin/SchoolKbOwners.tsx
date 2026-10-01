import { AdultShell } from '@/ui/components/adult-shell/AdultShell'
import { Button } from '@/ui/components/button/Button'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { initials, ownerStateLabels } from './kbOwnerExamples'
import { KbOwnerDialog } from './KbOwnerDialog'
import { schoolExample } from './peopleExamples'
import { useSchoolKbOwnersViewModel } from './useSchoolKbOwnersViewModel'
import styles from './SchoolKbOwners.module.css'

export function SchoolKbOwners() {
  const view = useSchoolKbOwnersViewModel()
  return <AdultShell schoolContext={schoolExample}>
    <div className={styles.content}>
      <h1>Pemilik basis pengetahuan</h1>
      <p className={styles.lead}>Satu per mata pelajaran. Hanya pemilik yang bisa menyetujui dan mengubahnya.</p>
      <p className={styles.note}>Data contoh · Pengalihan pemilik hanya berlaku dalam simulasi lokal. Halaman ini hanya menampilkan metadata kepemilikan, bukan isi basis pengetahuan.</p>
      {view.message && <Feedback tone="success" title={view.message} announce />}
      <ul className={styles.grid}>{view.kbs.map((kb) => <li key={kb.id} className={styles.card}>
        <div className={styles.head}><h2>{kb.subject}</h2><span>{kb.topics} topik · {kb.concepts} konsep</span></div>
        <div className={styles.owner}>
          <span className={[styles.avatar, styles[kb.ownerState]].join(' ')} aria-hidden="true">{initials(kb.owner)}</span>
          <span className={styles.who}><strong>{kb.owner}</strong><small className={styles[`state-${kb.ownerState}`]}>{ownerStateLabels[kb.ownerState]}</small></span>
          <Button tone={kb.ownerState === 'left' ? 'primary' : 'secondary'} className={styles.transfer} aria-label={`Alihkan pemilik basis pengetahuan ${kb.subject}`} onClick={() => view.setEditing(kb)}>Alihkan</Button>
        </div>
      </li>)}</ul>
    </div>
    {view.editing && <KbOwnerDialog kb={view.editing} onApply={view.applyOwner} onClose={() => view.setEditing(null)} />}
  </AdultShell>
}

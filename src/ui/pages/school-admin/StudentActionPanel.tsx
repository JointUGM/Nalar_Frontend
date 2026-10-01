import { useCallback, useEffect } from 'react'
import { Button } from '@/ui/components/button/Button'
import { Feedback } from '@/ui/components/feedback/Feedback'
import type { PersonExample } from './peopleExamples'
import type { StudentAction } from './useStudentActionViewModel'
import { useStudentActionViewModel } from './useStudentActionViewModel'
import styles from './StudentFormDialog.module.css'

const copy = {
  invite: { title: 'Kirim ulang undangan?', body: 'Pratinjau ini tidak mengirim email, tautan, atau kode apa pun.', confirm: 'Konfirmasi kirim ulang', pending: 'Mengirim simulasi…', done: 'Undangan ulang tersimpan dalam simulasi', doneBody: 'Tidak ada pesan terkirim dan akses akun tidak berubah.' },
  deactivate: { title: 'Nonaktifkan siswa?', body: 'Status contoh berubah menjadi Nonaktif. Riwayat tetap tersimpan dan tidak ada data yang dihapus; akun sebenarnya tidak berubah.', confirm: 'Konfirmasi nonaktifkan', pending: 'Menonaktifkan simulasi…', done: 'Siswa dinonaktifkan dalam simulasi', doneBody: 'Daftar contoh diperbarui. Muat ulang mengembalikan data awal.' },
}

export function StudentActionPanel({ action, person, onApply, onBack, onClose, onBusy }: { action: StudentAction; person: PersonExample; onApply: (person: PersonExample | null, notice: string) => void; onBack: () => void; onClose: () => void; onBusy: (busy: boolean) => void }) {
  const text = copy[action]
  const apply = useCallback(() => onApply(action === 'deactivate' ? { ...person, status: 'Nonaktif' } : null, `${person.name}: ${text.done.toLocaleLowerCase('id-ID')}. Data sekolah dan akses akun tidak berubah; muat ulang akan mengembalikan data contoh.`), [action, person, text.done, onApply])
  const view = useStudentActionViewModel(apply)
  const busy = view.status === 'pending'
  useEffect(() => { onBusy(busy); return () => onBusy(false) }, [busy, onBusy])
  return <div className={styles.form}>
    {view.status === 'confirming' && <Feedback tone="warning" title={`${text.title} ${person.name} · ${person.identifier}`} announce>{text.body}</Feedback>}
    {busy && <Feedback title={text.pending} announce>Menunggu hasil contoh. Panel tetap terbuka.</Feedback>}
    {view.status === 'failure' && <Feedback tone="danger" title="Simulasi gagal" announce>Tidak ada perubahan pada daftar contoh. Ubah skenario atau coba lagi.</Feedback>}
    {view.status === 'success' && <Feedback tone="success" title={text.done} announce>{text.doneBody}</Feedback>}
    {view.status !== 'success' && <label className={styles.scenario}>Hasil skenario<select disabled={busy} value={view.outcome} onChange={(event) => view.setOutcome(event.target.value as 'success' | 'failure')}><option value="success">Berhasil</option><option value="failure">Gagal</option></select></label>}
    <div className={styles.actions}>{view.status === 'success' ? <Button autoFocus onClick={onClose}>Tutup</Button> : <><Button tone="secondary" autoFocus disabled={busy} onClick={onBack}>Kembali</Button><Button tone={action === 'deactivate' ? 'danger' : 'primary'} pending={busy} pendingLabel={text.pending} onClick={view.confirm}>{text.confirm}</Button></>}</div>
  </div>
}

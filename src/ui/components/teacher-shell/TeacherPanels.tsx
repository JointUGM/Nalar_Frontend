import { useState } from 'react'
import { Link } from 'react-router'
import { Dialog } from '@/ui/components/dialog/Dialog'
import { Icon } from '@/ui/components/icon/Icon'
import styles from './TeacherPanels.module.css'

// Review-only panels: the answers and notifications below are example data held in memory.
const suggestions = [
  { ask: 'Ringkas miskonsepsi kelas 8B', answer: 'Contoh: 18 siswa awalnya mengira benda yang lebih berat jatuh lebih cepat; 10 sudah berubah pikiran setelah sesi.' },
  { ask: 'Siapa yang perlu perhatian?', answer: 'Contoh: 5 siswa belum menyelesaikan sesi minggu ini. Daftar lengkap ada di halaman Perlu perhatian.' },
  { ask: 'Bantu susun misi baru', answer: 'Contoh: mulai dari konsep tekanan zat. Buka Misi › Misi baru untuk membuat draf dari materi Anda.' },
]
const notifications = [
  { id: 'kb', title: 'Basis pengetahuan Tekanan Zat siap ditinjau', when: 'Tadi pagi', to: '/review/teacher/knowledge-base/tekanan-zat' },
  { id: 'release', title: 'Rilis hasil 8A ke orang tua mendesak', when: '3 hari lalu', to: '/review/teacher/attention' },
  { id: 'session', title: 'Sesi 8B selesai: 28 dari 30 siswa', when: 'Kemarin', to: '/review/teacher/missions/kenapa-kelereng-berhenti/class-map?kelas=8B' },
]

export function AssistantPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [thread, setThread] = useState<{ role: 'you' | 'nalar'; text: string }[]>([])
  const [draft, setDraft] = useState('')
  const send = (ask: string, answer = 'Contoh: asisten belum terhubung ke layanan, jadi jawaban ini hanya gambaran tampilan.') => {
    if (!ask.trim()) return
    setThread((current) => [...current, { role: 'you', text: ask.trim() }, { role: 'nalar', text: answer }])
    setDraft('')
  }
  return <Dialog open={open} onClose={onClose} title="Asisten NALAR" description="Pratinjau · jawaban contoh, belum terhubung ke layanan." presentation="drawer">
    <div className={styles.chat}>
      <ul className={styles.thread} aria-label="Percakapan" aria-live="polite">
        {thread.length === 0 && <li className={styles.empty}>Tanyakan sesuatu tentang kelas Anda, atau pilih salah satu contoh di bawah.</li>}
        {thread.map((message, index) => <li key={index} className={message.role === 'you' ? styles.you : styles.nalar}>{message.text}</li>)}
      </ul>
      <div className={styles.suggestions}>{suggestions.map((item) => <button key={item.ask} type="button" onClick={() => send(item.ask, item.answer)}>{item.ask}</button>)}</div>
      <form className={styles.form} onSubmit={(event) => { event.preventDefault(); send(draft) }}>
        <input aria-label="Pertanyaan untuk asisten" placeholder="Tulis pertanyaan…" value={draft} onChange={(event) => setDraft(event.target.value)} />
        <button type="submit" aria-label="Kirim"><Icon name="send" size={16} /></button>
      </form>
    </div>
  </Dialog>
}

export function NotificationsPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  return <Dialog open={open} onClose={onClose} title="Notifikasi" description="Pratinjau · data contoh." presentation="drawer">
    <ul className={styles.notifications}>
      {notifications.map((item) => <li key={item.id}><Link to={item.to} onClick={onClose}><strong>{item.title}</strong><small>{item.when}</small></Link></li>)}
    </ul>
  </Dialog>
}

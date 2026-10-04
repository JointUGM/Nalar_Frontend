import { Link } from 'react-router'
import type { ParentNotices } from '@/domain/model/Parent'
import { Dialog } from '@/ui/components/dialog/Dialog'
import { formatDayTime } from '@/ui/formatInstant'
import styles from './ParentNotifications.module.css'
import { parentPaths } from './parentPaths'

// A notice carries only its type and time, never the child or the text, so each type has one fixed sentence.
const sentence: Readonly<Record<string, string>> = {
  parent_periodic_summary: 'Ringkasan berkala dari guru sudah tersedia.',
  account_invitation: 'Undangan akun NALAR sudah dikirim ke email Anda.',
}

export function ParentNotifications({ open, data, onClose }: { open: boolean; data: ParentNotices | null; onClose: () => void }) {
  return <Dialog open={open} onClose={onClose} title="Notifikasi" description="Pemberitahuan untuk akun Anda.">
    {!data ? <p className={styles.note}>Notifikasi belum dapat dimuat. Coba lagi nanti.</p>
      : data.items.length === 0 ? <p className={styles.note}>Belum ada notifikasi.</p>
      : <ul className={styles.list}>{data.items.map((notice) => <li key={notice.id} data-unread={notice.read_at === null}>
        {notice.type === 'parent_periodic_summary' ? <Link to={parentPaths.home} onClick={onClose}>{sentence[notice.type]}</Link> : <span>{sentence[notice.type] ?? 'Ada pemberitahuan baru.'}</span>}
        <small>{formatDayTime(notice.created_at)}</small>
      </li>)}</ul>}
  </Dialog>
}

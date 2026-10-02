import { useCallback, useRef, useState } from 'react'
import { Link } from 'react-router'
import type { ParentService } from '@/domain/services/ParentService'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Icon } from '@/ui/components/icon/Icon'
import { useParentContext } from '@/ui/components/parent-shell/useParentContext'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { noPollMs, useCommandSignal, useLiveResource } from '@/ui/pages/live/useLiveResource'
import styles from '@/ui/pages/parent/ParentSettings.module.css'

export function ParentSettingsPage({ service, user }: { service: ParentService; user: string }) {
  const { linkedChildren } = useParentContext()
  const read = useCallback((signal: AbortSignal) => service.preferences(signal), [service])
  const { data, error, online, refresh } = useLiveResource(read, noPollMs)
  const signal = useCommandSignal()
  const busy = useRef(false)
  const [saved, setSaved] = useState<boolean | null>(null)
  const [status, setStatus] = useState<'idle' | 'pending' | 'saved' | 'failed'>('idle')
  // The switch always shows the last value the server confirmed.
  const enabled = saved ?? data?.weekly_digest_enabled ?? false
  const pending = status === 'pending'

  async function toggle() {
    // One save at a time; a second press while one is going on does nothing.
    if (busy.current || !data) return
    busy.current = true
    setStatus('pending')
    try {
      setSaved((await service.setPreferences({ weekly_digest_enabled: !enabled }, signal())).weekly_digest_enabled)
      setStatus('saved')
    } catch { setStatus('failed') } finally { busy.current = false }
  }

  return <div className={styles.content}>
    <h1>Pengaturan</h1>
    <p className={styles.lead}>Akun dan pemberitahuan</p>
    <LiveFeedback error={error} online={online} refresh={refresh} />
    <div className={styles.grid}>
      <section className={styles.card} aria-labelledby="email-title">
        <h2 id="email-title"><Icon name="bell" size={16} />Email mingguan</h2>
        <div className={styles.row}>
          <div>
            <span id="email-label" className={styles.rowTitle}>Kirim ringkasan mingguan</span>
            <span id="email-help" className={styles.rowHelp}>Ke email akun ini · hanya hasil yang sudah dirilis guru</span>
          </div>
          <button type="button" role="switch" aria-checked={enabled} aria-labelledby="email-label" aria-describedby="email-help" aria-busy={pending || undefined} disabled={pending || !data} className={styles.switch} onClick={() => { void toggle() }}><span aria-hidden="true" /></button>
        </div>
        <div aria-live="polite" className={styles.result}>
          {pending && <p className={styles.pending}>Menyimpan…</p>}
          {status === 'saved' && <Feedback tone="success" title={enabled ? 'Email mingguan dinyalakan' : 'Email mingguan dimatikan'} />}
        </div>
        {status === 'failed' && <Feedback tone="danger" title="Pengaturan belum tersimpan" announce>Email mingguan tetap {enabled ? 'menyala' : 'mati'}. Coba lagi.</Feedback>}
      </section>
      <section className={styles.card} aria-labelledby="account-title">
        <h2 id="account-title"><Icon name="users" size={16} />Akun</h2>
        <dl className={styles.facts}>
          <div><dt>Nama</dt><dd>{user}</dd></div>
          <div><dt>Anak tertaut</dt><dd>{linkedChildren.map((child) => child.name).join(', ') || 'Belum ada'}</dd></div>
        </dl>
        <div className={styles.links}><Link to="/login" state={{ signOut: true }}><Icon name="logout" size={14} />Keluar</Link></div>
      </section>
    </div>
  </div>
}

import { useCallback, useRef, useState } from 'react'
import { Link } from 'react-router'
import type { ParentService } from '@/domain/services/ParentService'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Icon } from '@/ui/components/icon/Icon'
import { NalaAvatar, NalaIcon } from '@/ui/components/nala/NalaIcon'
import type { NalaMood } from '@/ui/components/nala/Nala'
import { NalaNote } from '@/ui/components/nala/NalaState'
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
  const initials = user.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toLocaleUpperCase('id-ID')

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

  // Nala reflects the setting the server last confirmed, and steps aside while an error banner is up.
  const note: [NalaMood, string] | null = !data ? (error ? null : ['think', 'Sebentar, pengaturan sedang dimuat.'])
    : status === 'failed' ? ['oops', 'Pengaturan belum tersimpan. Coba lagi.']
    : !data.mail_enabled ? ['calm', 'Email mingguan belum dikirim. Ringkasan tetap bisa dibuka di sini.']
    : enabled ? ['hello', 'Ringkasan mingguan akan dikirim ke email Anda.'] : ['calm', 'Email mingguan mati. Ringkasan tetap bisa dibuka di sini.']
  return <div className={styles.content}>
    <div className={styles.header}>
      <div><h1>Pengaturan</h1><p>Akun dan pemberitahuan</p></div>
      {note && <NalaNote mood={note[0]} text={note[1]} />}
    </div>
    <LiveFeedback error={error} online={online} refresh={refresh} />
    <div className={styles.grid}>
      <section className={styles.card} aria-labelledby="email-title">
        <h2 id="email-title"><NalaIcon name="mail" />Email mingguan</h2>
        <div className={styles.row}>
          <div>
            <span id="email-label" className={styles.rowTitle}>Kirim ringkasan mingguan</span>
            <span id="email-help" className={styles.rowHelp}>{data && !data.mail_enabled ? 'Pengiriman email belum aktif. Pilihan Anda tersimpan dan berlaku saat pengiriman dimulai.' : 'Ke email akun ini, hanya hasil yang sudah dirilis guru.'}</span>
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
        <h2 id="account-title"><NalaIcon name="account" />Akun</h2>
        <div className={styles.me}>
          <span className={styles.avatar} aria-hidden="true">{initials}</span>
          <div><strong>{user}</strong><small>Orang tua</small></div>
        </div>
        <h3 className={styles.sub}>Anak tertaut</h3>
        {linkedChildren.length === 0 ? <p className={styles.rowHelp}>Belum ada</p> : <ul className={styles.kids}>{linkedChildren.map((child) => <li key={child.id}>
          <span className={styles.kid}><NalaAvatar seed={child.name} size={40} /></span>
          <div><strong>{child.name}</strong><small>{child.detail}</small></div>
        </li>)}</ul>}
        <div className={styles.links}><Link to="/login" state={{ signOut: true }}><Icon name="logout" size={16} />Keluar</Link></div>
      </section>
    </div>
  </div>
}

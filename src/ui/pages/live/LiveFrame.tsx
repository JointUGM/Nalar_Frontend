import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { BrandMark } from '@/ui/components/brand/BrandMark'
import { Button } from '@/ui/components/button/Button'
import { Feedback } from '@/ui/components/feedback/Feedback'
import type { LiveError } from '@/domain/model/Live'
import styles from './Live.module.css'

export function LiveFrame({ title, user, home, children }: { title: string; user: string; home: string; children: ReactNode }) {
  return <div className={styles.shell}>
    <a className={styles.skip} href="#live-content">Lewati ke konten</a>
    <header className={styles.header}><BrandMark /><strong>NALAR</strong><span>{title}</span><span>{user}</span><Link to={home}>Beranda</Link><Link to="/login" state={{ signOut: true }}>Keluar</Link></header>
    <main className={styles.main} id="live-content" tabIndex={-1}>{children}</main>
  </div>
}

export function LiveFeedback({ error, online, refresh, loading = false }: { error: LiveError | null; online: boolean; refresh: () => void; loading?: boolean }) {
  if (error?.status === 401) return <Feedback tone="warning" title={error.message} announce><Link to="/login">Masuk kembali</Link></Feedback>
  if (error) return <div className={styles.feedback}><Feedback tone="warning" title={error.message} announce>{error.requestId && <small>Referensi: {error.requestId}</small>}</Feedback>{![403, 404].includes(error.status) && <Button tone="secondary" onClick={refresh}>Coba lagi</Button>}</div>
  if (!online) return <Feedback tone="warning" title="Koneksi terputus" announce>Menampilkan pembaruan terakhir. Tulisanmu tetap ada di layar ini.</Feedback>
  if (loading) return <p role="status">Memuat sesi…</p>
  return null
}

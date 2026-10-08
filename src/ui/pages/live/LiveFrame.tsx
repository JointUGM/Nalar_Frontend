import { Link } from 'react-router'
import { Button } from '@/ui/components/button/Button'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Loading } from '@/ui/components/loading/Loading'
import type { ApiError } from '@/domain/model/ApiError'
import styles from './Live.styles'

export function LiveFeedback({ error, online, refresh, loading = false }: { error: ApiError | null; online: boolean; refresh: () => void; loading?: boolean }) {
  if (error?.status === 401) return <Feedback tone="warning" title={error.message} announce><Link to="/login">Masuk kembali</Link></Feedback>
  if (error) return <div className={styles.feedback}><Feedback tone="warning" title={error.message} announce>{error.requestId && <small>Referensi: {error.requestId}</small>}</Feedback>{![403, 404].includes(error.status) && <Button tone="secondary" onClick={refresh}>Coba lagi</Button>}</div>
  if (!online) return <Feedback tone="warning" title="Koneksi terputus" announce>Menampilkan pembaruan terakhir. Tulisanmu tetap ada di layar ini.</Feedback>
  if (loading) return <Loading label="Memuat sesi…" />
  return null
}

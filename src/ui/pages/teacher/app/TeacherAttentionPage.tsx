import { useState } from 'react'
import { Link } from 'react-router'
import type { AttentionItem, AttentionPage } from '@/domain/model/Teacher'
import type { ApiError } from '@/domain/model/ApiError'
import { Icon } from '@/ui/components/icon/Icon'
import type { IconName } from '@/ui/components/icon/Icon'
import { formatDayTime } from '@/ui/formatInstant'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import styles from '@/ui/pages/teacher/TeacherAttention.module.css'

type Kind = AttentionItem['kind']
const kinds: readonly [Kind, string, string, IconName, string][] = [
  ['safety', 'Keselamatan', 'KESELAMATAN', 'heart', 'safety'],
  ['flag', 'Perlu verifikasi', 'PERLU VERIFIKASI', 'flag', 'flag'],
  ['kb_review', 'Tinjauan basis pengetahuan', 'MENUNGGU PERSETUJUAN', 'clock', 'approve'],
  ['release_ready', 'Siap dirilis', 'SIAP DIRILIS', 'send', 'approve'],
]
const flagWord: Readonly<Record<string, string>> = { large_paste: 'Tempelan teks panjang', tab_switching: 'Sering berpindah tab', inconsistency_gap: 'Jawaban tidak konsisten', style_shift: 'Gaya tulisan berubah', cross_student_similarity: 'Mirip jawaban siswa lain', disconnect_pattern: 'Koneksi sering terputus' }

// Each item opens the page where the teacher acts on it.
function describe(item: AttentionItem, base: string): { to: string; who: string; summary: string } {
  if (item.kind === 'safety') return { to: `${base}/publications/${item.publication_id}/sessions/${item.session_id}`, who: item.student_name, summary: 'Sesinya dijeda karena keselamatan. Temui siswa, lalu lanjutkan atau akhiri sesi.' }
  if (item.kind === 'flag') return { to: `${base}/publications/${item.publication_id}/sessions/${item.session_id}`, who: item.student_name, summary: `${flagWord[item.flag_type] ?? item.flag_type}. Catatan ini petunjuk, bukan tuduhan.` }
  if (item.kind === 'kb_review') return { to: `${base}/knowledge-base/${item.knowledge_base_id}`, who: item.topic_title, summary: `${item.pending_concepts} konsep dan ${item.pending_misconceptions} miskonsepsi menunggu tinjauan.` }
  return { to: `${base}/publications/${item.publication_id}/release`, who: `${item.mission_title} · ${item.class_name}`, summary: `${item.eligible_count} ringkasan siap dirilis ke orang tua.` }
}

// The queue is read once by TeacherRoutes and shared with the sidebar badge.
export function TeacherAttentionPage({ data, error, online, refresh, base }: { data: AttentionPage | null; error: ApiError | null; online: boolean; refresh: () => void; base: string }) {
  const [kind, setKind] = useState<Kind | null>(null)
  const visible = data?.items.filter((item) => !kind || item.kind === kind) ?? []
  return <div className={styles.content}>
    <div className={styles.header}><div><h1>Perlu perhatian</h1><p>Keselamatan siswa, catatan verifikasi, tinjauan basis pengetahuan, dan hasil yang siap dirilis.</p></div></div>
    <LiveFeedback error={error} online={online} refresh={refresh} />
    {!data && !error && <p role="status">Memuat daftar…</p>}
    {data && <>
      <ul className={styles.stats} aria-label="Ringkasan catatan">{kinds.map(([key, label]) => <li key={key}><strong>{data.counts[key]} {label.toLowerCase()}</strong></li>)}</ul>
      <section className={styles.card} aria-labelledby="attention-list">
        <h2 id="attention-list" className={styles.hidden}>Catatan</h2>
        <div className={styles.tabs} role="group" aria-label="Jenis catatan">
          <button type="button" aria-pressed={kind === null} onClick={() => setKind(null)}>Semua ({data.counts.total})</button>
          {kinds.map(([key, label]) => <button key={key} type="button" aria-pressed={kind === key} onClick={() => setKind(key)}>{label} ({data.counts[key]})</button>)}
        </div>
        <div className={styles.list}>
          {visible.length === 0 ? <p className={styles.empty}>Tidak ada yang perlu perhatian di sini.</p> : <ul aria-label="Daftar catatan">{visible.map((item) => {
            const [, , tag, icon, tone] = kinds.find(([key]) => key === item.kind)!
            const { to, who, summary } = describe(item, base)
            return <li key={`${item.kind}-${item.item_id}`}><Link className={styles.row} to={to}>
              <span className={styles.rowHead}><span className={styles.sev} data-kind={tone}><Icon name={icon} size={10} />{tag}</span><span className={styles.when}>{formatDayTime(item.kind === 'safety' && item.paused_at ? item.paused_at : item.created_at)}</span></span>
              <span className={styles.who}><span><strong>{who}</strong></span></span>
              <span className={styles.summary}>{summary}</span>
            </Link></li>
          })}</ul>}
        </div>
      </section>
    </>}
  </div>
}

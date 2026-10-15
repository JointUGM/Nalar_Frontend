import { useCallback, useState } from 'react'
import { Link } from 'react-router'
import type { StudentReflection } from '@/domain/model/Student'
import type { StudentService } from '@/domain/services/StudentService'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Button } from '@/ui/components/button/Button'
import { ButtonLink } from '@/ui/components/button/ButtonLink'
import { Icon } from '@/ui/components/icon/Icon'
import { Nala } from '@/ui/components/nala/Nala'
import { formatDateBlock, formatDay, formatRelative } from '@/ui/formatInstant'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { noPollMs, useLiveResource } from '@/ui/pages/live/useLiveResource'
import home from '@/ui/pages/student/StudentHome.styles'
import styles from '@/ui/pages/student/StudentReflections.styles'
import { Loading } from '@/ui/components/loading/Loading'

const excerpt = (text: string, max: number) => text.length > max ? `${text.slice(0, max - 3).trimEnd()}…` : text
// "kemarin", "3 hari yang lalu" for the last week, a plain date after that.
const when = (iso: string) => Date.now() - Date.parse(iso) < 7 * 864e5 ? formatRelative(iso) : formatDay(iso)
const newestFirst = (a: StudentReflection, b: StudentReflection) => Date.parse(b.completed_at) - Date.parse(a.completed_at)

// Each reflection opens on its finished session, where the full text and the warm-up guess are shown.
export function StudentReflectionsPage({ service, base }: { service: StudentService; base: string }) {
  const read = useCallback((signal: AbortSignal) => service.reflections(signal), [service])
  const { data, error, online, refresh } = useLiveResource(read, noPollMs)
  const [search, setSearch] = useState('')
  const query = search.trim().toLocaleLowerCase('id-ID')
  const [latest, ...rest] = [...(data ?? [])].sort(newestFirst)
  const filtered = rest.filter((item) => `${item.mission_title} ${item.content}`.toLocaleLowerCase('id-ID').includes(query))
  const loading = !data && !error
  return <div className={styles.content} aria-busy={loading}>
    <div className={home.header}>
      <h1>Refleksimu</h1>
      <p>{data && data.length > 0 ? <><strong>{data.length} refleksi</strong> tentang cara kamu berpikir</> : 'Cerita tentang cara kamu berpikir di setiap misi.'}</p>
    </div>
    <LiveFeedback error={error} online={online} refresh={refresh} />
    {loading && <Loading label="Memuat refleksimu…" />}

    {data && !latest && <section className={home.spotlight} aria-labelledby="reflections-empty">
      <div className={home.spotlightCopy}>
        <h2 id="reflections-empty">Belum ada refleksi</h2>
        <p className={home.line}>Refleksi muncul di sini setelah kamu menyelesaikan sebuah misi. Aku akan menuliskannya untukmu.</p>
        <div className={home.spotlightFoot}><ButtonLink className={home.cta} to={base}>Lihat Misi saya<Icon name="chevronRight" size={16} /></ButtonLink></div>
      </div>
      <div className={home.mascot}><Nala mood="calm" size={148} /></div>
    </section>}

    {latest && <article className={home.spotlight} aria-labelledby={`reflection-${latest.session_id}`}>
      <div className={home.spotlightCopy}>
        <p className={home.chips}><span><Icon name="sparkle" size={14} />Refleksi terbaru</span>{latest.subject_name && <span>{latest.subject_name}</span>}</p>
        <h2 id={`reflection-${latest.session_id}`}>{latest.mission_title}</h2>
        <blockquote className={styles.quote}>{excerpt(latest.content, 160)}</blockquote>
        <div className={home.spotlightFoot}>
          <ButtonLink className={home.cta} to={`${base}/sessions/${latest.session_id}`}>Baca refleksi lengkap<Icon name="chevronRight" size={16} /></ButtonLink>
          <span className={home.facts}><time dateTime={latest.completed_at} title={formatDay(latest.completed_at)}>Selesai {when(latest.completed_at)}</time></span>
        </div>
      </div>
      <div className={home.mascot}><Nala mood="read" size={148} animate /></div>
    </article>}

    {rest.length > 0 && <section className={styles.earlier} aria-labelledby="reflections-earlier">
      <div className={styles.toolbar}>
        <h2 id="reflections-earlier" className={home.sectionTitle}>Sebelumnya <span>{rest.length}</span></h2>
        <label className={styles.search}><Icon name="search" size={18} /><span className={styles.hidden}>Cari refleksi</span><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari misi atau cerita…" /></label>
      </div>
      <p className={styles.hidden} role="status">{query ? `${filtered.length} dari ${rest.length} refleksi` : ''}</p>
      {filtered.length === 0 && <div className={styles.empty}><Feedback title="Belum menemukan refleksinya">Coba judul misi atau kata lain dari refleksimu.</Feedback><Button tone="secondary" onClick={() => setSearch('')}>Tampilkan semua refleksi</Button></div>}
      {filtered.length > 0 && <ul className={home.rows} aria-label="Daftar refleksi">{filtered.map((item) => <li key={item.session_id}>
        <Link className={styles.row} to={`${base}/sessions/${item.session_id}`}>
          <span className={styles.date} aria-hidden="true"><strong>{formatDateBlock(item.completed_at).day}</strong>{formatDateBlock(item.completed_at).month}</span>
          <span className={styles.body}>
            <strong>{item.mission_title}</strong>
            <span className={styles.meta}>{item.subject_name && <>{item.subject_name} · </>}<time dateTime={item.completed_at}>{when(item.completed_at)}</time></span>
            <span className={styles.excerpt}>{excerpt(item.content, 180)}</span>
          </span>
          <Icon name="chevronRight" size={18} className={styles.chevron} />
        </Link>
      </li>)}</ul>}
    </section>}
  </div>
}

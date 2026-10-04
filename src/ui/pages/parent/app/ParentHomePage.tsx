import { useCallback, useEffect, type ReactNode } from 'react'
import type { ParentProgress } from '@/domain/model/Parent'
import type { ParentService } from '@/domain/services/ParentService'
import { ButtonLink } from '@/ui/components/button/ButtonLink'
import { Icon } from '@/ui/components/icon/Icon'
import { NalaIcon } from '@/ui/components/nala/NalaIcon'
import { Nala } from '@/ui/components/nala/Nala'
import { NalaEmpty } from '@/ui/components/nala/NalaState'
import { useParentContext } from '@/ui/components/parent-shell/useParentContext'
import { formatDayTime } from '@/ui/formatInstant'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { noPollMs, useLiveResource } from '@/ui/pages/live/useLiveResource'
import styles from '@/ui/pages/parent/ParentHome.module.css'
import { ConversationCard } from './ConversationCard'
import { parentPaths } from './parentPaths'
import { Loading } from '@/ui/components/loading/Loading'

const number = new Intl.NumberFormat('id-ID')
const paragraphs = (text: string) => text.split(/\n+/).filter((line) => line.trim())

// One warm sentence instead of a row of numbers; it counts only what the teacher has released.
function story(first: string, data: ParentProgress): ReactNode {
  const understood = data.concepts_understood.length, growing = data.concepts_developing.length
  const concepts = understood > 0 && growing > 0 ? <><strong>{number.format(understood)}&nbsp;konsep</strong> sudah dipahami dan <strong>{number.format(growing)}&nbsp;konsep</strong> masih berkembang.</>
    : understood > 0 ? <><strong>{number.format(understood)}&nbsp;konsep</strong> sudah dipahami.</>
    : growing > 0 ? <><strong>{number.format(growing)}&nbsp;konsep</strong> sedang berkembang.</> : null
  return <>{data.sessions_completed > 0 && <>{first} sudah menyelesaikan <strong>{number.format(data.sessions_completed)}&nbsp;misi</strong>. </>}{concepts}</>
}

function Chips({ names, status }: { names: readonly string[]; status: 'done' | 'growing' }) {
  return <ul className={styles.chips} data-status={status}>{names.map((name) => <li key={name}><Icon name={status === 'done' ? 'check' : 'idea'} size={14} />{name}</li>)}</ul>
}

export function ParentHomePage({ service }: { service: ParentService }) {
  const { child } = useParentContext()
  const childId = child?.id
  const read = useCallback((signal: AbortSignal) => childId ? service.progress(childId, signal) : Promise.resolve(null), [service, childId])
  const { data, error, online, refresh } = useLiveResource(read, noPollMs)
  // Opening the summary counts as a visit; the "Baru" marks below still compare against the previous one.
  const loaded = data !== null
  useEffect(() => { if (childId && loaded) service.markSeen(childId).catch(() => {}) }, [service, childId, loaded])
  if (!child) return <div className={styles.content}>
    <NalaEmpty as="h1" mood="ask" title="Belum ada anak yang tertaut">Hubungi wali kelas atau admin sekolah supaya akunmu bisa melihat kabar anakmu.</NalaEmpty>
  </div>

  const first = child.name.split(' ')[0]
  const loading = !data && !error
  const summaries = data ? [...data.summaries].sort((a, b) => Date.parse(b.released_at) - Date.parse(a.released_at)) : []
  const [latest, ...earlier] = summaries
  const lastSeen = child.lastSeenAt ? Date.parse(child.lastSeenAt) : null
  const fresh = (releasedAt: string) => lastSeen !== null && Date.parse(releasedAt) > lastSeen
  // Nothing released is one neutral state: no count, title or status of work that is still with the teacher.
  const empty = data !== null && data.sessions_completed === 0 && summaries.length === 0 && data.concepts_understood.length + data.concepts_developing.length === 0
  return <div className={styles.content} aria-busy={loading}>
    <section className={styles.hero} aria-labelledby="home-title">
      <div className={styles.heroCopy}>
        <h1 id="home-title">Kabar {first}</h1>
        <p className={styles.school}>{child.detail}</p>
        {data && !empty && <p className={styles.story}>{story(first, data)}</p>}
        {latest && <p className={styles.released}><Icon name="check" size={14} />Terakhir dirilis guru {formatDayTime(latest.released_at)}</p>}
      </div>
      <div className={styles.nala}>
        <p className={styles.speech}>{latest ? 'Ini kabar terbaru dari guru.' : `Halo, ini kabar ${first}.`}</p>
        <div className={styles.perch}><Nala mood={empty ? 'calm' : latest ? 'proud' : 'hello'} size={168} animate /></div>
      </div>
    </section>
    <LiveFeedback error={error} online={online} refresh={refresh} />
    {loading && <>
      <Loading label={`Memuat kabar ${first}…`} />
      <div className={styles.skeleton} aria-hidden="true"><span /><span /></div>
    </>}
    {/* The calm Nala in the hero is this state's only Nala. */}
    {empty && <section className={styles.plain} aria-labelledby="empty-title"><h2 id="empty-title">Belum ada ringkasan yang tersedia</h2><p>Ringkasan muncul di sini setelah guru merilis hasil misi.</p></section>}
    {data && !empty && <div className={styles.grid}>
      <div className={styles.main}>
        {latest && <section className={styles.letter} aria-labelledby="latest-title">
          <h2 id="latest-title"><NalaIcon name="file" />Ringkasan dari guru</h2>
          <h3>{latest.mission_title}{fresh(latest.released_at) && <span className={styles.fresh}>Baru</span>}</h3>
          <p className={styles.date}>Dirilis {formatDayTime(latest.released_at)}</p>
          <div className={styles.text}>{paragraphs(latest.text).map((line, index) => <p key={index}>{line}</p>)}</div>
          <ButtonLink tone="secondary" to={parentPaths.reflections}>Baca refleksi {first}<Icon name="chevronRight" size={16} /></ButtonLink>
        </section>}
        {earlier.length > 0 && <section className={styles.earlier} aria-labelledby="earlier-title">
          <h2 id="earlier-title">Ringkasan sebelumnya</h2>
          <ul>{earlier.map((summary) => <li key={summary.publication_id}>
            <h3>{summary.mission_title}{fresh(summary.released_at) && <span className={styles.fresh}>Baru</span>}</h3>
            <p className={styles.date}>Dirilis {formatDayTime(summary.released_at)}</p>
            <div className={styles.text}>{paragraphs(summary.text).map((line, index) => <p key={index}>{line}</p>)}</div>
          </li>)}</ul>
        </section>}
      </div>
      <div className={styles.side}>
        <section className={styles.concepts} aria-labelledby="concepts-title">
          <h2 id="concepts-title"><NalaIcon name="idea" />Perkembangan konsep</h2>
          {data.concepts_understood.length > 0 && <div><h3>Sudah dipahami</h3><Chips names={data.concepts_understood} status="done" /></div>}
          {data.concepts_developing.length > 0 && <div><h3>Sedang berkembang</h3><p className={styles.hint}>Wajar, ini bagian dari belajar.</p><Chips names={data.concepts_developing} status="growing" /></div>}
          {data.concepts_understood.length + data.concepts_developing.length === 0 && <p className={styles.hint}>Konsep muncul di sini setelah guru merilis hasil misi.</p>}
        </section>
        <ConversationCard growing={data.concepts_developing[0]} />
      </div>
    </div>}
  </div>
}

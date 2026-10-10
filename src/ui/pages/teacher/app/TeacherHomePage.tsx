import { useCallback } from 'react'
import { Link } from 'react-router'
import type { ApiError } from '@/domain/model/ApiError'
import type { AttentionItem, AttentionPage, TeacherDashboard, TeacherPublication } from '@/domain/model/Teacher'
import type { KnowledgeBaseService } from '@/domain/services/KnowledgeBaseService'
import type { TeacherService } from '@/domain/services/TeacherService'
import { Icon } from '@/ui/components/icon/Icon'
import { Loading } from '@/ui/components/loading/Loading'
import { Nala } from '@/ui/components/nala/Nala'
import { TeacherPageHead } from '@/ui/components/teacher-shell/TeacherPageHead'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { noPollMs, useLiveResource } from '@/ui/pages/live/useLiveResource'
import { attentionKind, attentionRank, describeAttention, isKnownAttention, waitedFor } from '@/ui/pages/teacher/app/attentionText'
import styles from '@/ui/pages/teacher/TeacherHome.styles'

// Layout follows the home screen of "NALAR Guru.dc.html": sessions and changed minds on top, then attention, class
// patterns and a rail with release and the knowledge base. Every number comes from the API; nothing is invented.
interface AttentionResource { data: AttentionPage | null; error: ApiError | null; online: boolean; refresh: () => void }
const number = new Intl.NumberFormat('id-ID')
const clock = new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' })
const today = new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta' })
const jakartaHour = new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hourCycle: 'h23', timeZone: 'Asia/Jakarta' })

// School days run on WIB, whatever the computer's clock says.
function greeting(now = new Date()) {
  const hour = Number(jakartaHour.format(now))
  return hour >= 4 && hour < 11 ? 'Selamat pagi' : hour >= 11 && hour < 15 ? 'Selamat siang' : hour >= 15 && hour < 18 ? 'Selamat sore' : 'Selamat malam'
}
const initials = (name: string) => name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toLocaleUpperCase('id-ID')

const isActive = (publication: TeacherPublication) => ['lobby', 'open'].includes(publication.run.status)
const rank = (publication: TeacherPublication) => isActive(publication) ? 0 : publication.run.status === 'scheduled' ? 1 : 2
const when = (publication: TeacherPublication) => publication.run.opens_at ?? publication.run.closes_at
const sessionPath = (publication: TeacherPublication, base: string) => `${base}/publications/${publication.id}/${publication.run.mode === 'live' && isActive(publication) ? 'monitor' : 'class-map'}`

function Schedule({ resource, base }: { resource: { data: TeacherPublication[] | null; error: ApiError | null; online: boolean; refresh: () => void }; base: string }) {
  const { data, error, online, refresh } = resource
  // Running sessions first, then what is coming, then the most recent results.
  const time = (publication: TeacherPublication) => Date.parse(when(publication) ?? '') || 0
  const rows = [...(data ?? [])].sort((a, b) => rank(a) - rank(b) || (rank(a) === 1 ? time(a) - time(b) : time(b) - time(a))).slice(0, 5)
  return <section className={styles.card} aria-labelledby="home-sessions" aria-busy={!data && !error}>
    <div className={styles.head}><h2 id="home-sessions">Sesi kelas</h2>{data && <span>{number.format(data.length)} sesi</span>}<Link to={`${base}/sessions`}>Semua sesi</Link></div>
    <LiveFeedback error={error} online={online} refresh={refresh} />
    {!data && !error && <Loading label="Memuat sesi…" />}
    {data && data.length === 0 && <p className={styles.empty}>Belum ada sesi kelas. <Link to={`${base}/missions`}>Terbitkan misi yang sudah ditinjau</Link> untuk memulai.</p>}
    {rows.length > 0 && <ol className={styles.schedule}>{rows.map((publication) => {
      const { run, counts } = publication
      const at = when(publication)
      const tone = isActive(publication) ? 'live' : run.status === 'scheduled' ? 'planned' : 'done'
      return <li key={publication.id}>
        <span className={styles.slot}>{at ? clock.format(new Date(at)) : run.mode === 'live' ? 'Live' : '—'}</span>
        <div className={styles.block} data-tone={tone}>
          <Link to={sessionPath(publication, base)} state={{ publication }} className={styles.blockTitle}><strong>{publication.class_name}</strong><span>{publication.mission_title}</span></Link>
          <div className={styles.blockFoot}>
            <span>{tone === 'live' ? (run.status === 'lobby' ? 'Lobi terbuka' : `Berlangsung · ${number.format(counts.started)} siswa`) : tone === 'planned' ? (run.opens_at && run.closes_at ? `Jendela ${clock.format(new Date(run.opens_at))}–${clock.format(new Date(run.closes_at))}` : 'Belum dimulai') : `${number.format(counts.completed)} dari ${number.format(counts.started)} sesi selesai`}</span>
            {tone === 'live' ? <Link className={styles.blockAction} to={`${base}/publications/${publication.id}/${run.status === 'lobby' ? 'projector' : 'monitor'}`} state={{ publication }}><Icon name="play" size={12} />{run.status === 'lobby' ? 'Buka lobi' : 'Pantau'}</Link>
              : tone === 'planned' ? <b>Terjadwal</b> : <b data-done><Icon name="check" size={14} />Selesai</b>}
          </div>
        </div>
      </li>
    })}</ol>}
  </section>
}

// A rule, not a model: misconceptions most students let go of come first.
function Changed({ data, failed, base }: { data: TeacherDashboard | null; failed: boolean; base: string }) {
  const items = data ? [...data.top_changed].sort((a, b) => b.resolved - a.resolved || b.held - a.held).slice(0, 4) : []
  const resolved = items.reduce((sum, item) => sum + item.resolved, 0)
  const rate = data?.this_week.changed_mind_rate
  return <section className={styles.card} aria-labelledby="home-changed" aria-busy={!data && !failed}>
    <div className={styles.head}><div><h2 id="home-changed" className={styles.big}>Berubah pikiran minggu ini</h2><p>{data ? `${number.format(data.this_week.sessions_completed)} sesi selesai dari ${number.format(data.this_week.students)} siswa` : 'Miskonsepsi yang dikoreksi siswa sendiri selama dialog.'}</p></div><Link to={`${base}/sessions`}>Hasil kelas</Link></div>
    {resolved > 0 && <p className={styles.proud}><Nala mood="proud" size={32} head /><strong>{number.format(resolved)} siswa</strong><span>mengoreksi miskonsepsinya sendiri selama dialog{rate != null && <> · <b>{Math.round(rate * 100)}%</b> miskonsepsi berubah</>}</span></p>}
    {!data ? <p className={styles.empty}>{failed ? 'Ringkasan minggu ini belum bisa dimuat.' : 'Nala sedang membaca hasil kelas Anda…'}</p>
      : items.length === 0 ? <p className={styles.empty}>Daftar ini terisi setelah siswa berdialog minggu ini.</p>
      : <ul className={styles.changes}>{items.slice(0, 2).map((item) => <li key={item.misconception_id}>
        <q>“{item.statement}”</q>
        <dl><div><dt>Awalnya</dt><dd>{number.format(item.held)} siswa</dd></div><div data-good={item.resolved > 0}><dt>Di akhir berubah</dt><dd>{number.format(item.resolved)} siswa</dd></div></dl>
      </li>)}</ul>}
  </section>
}

const tiles = [['safety', 'Keselamatan'], ['flag', 'Perlu verifikasi'], ['kb_review', 'Persetujuan']] as const
function Attention({ resource, base }: { resource: AttentionResource; base: string }) {
  const { data, error, online, refresh } = resource
  const items = (data?.items ?? []).filter(isKnownAttention).sort((a, b) => attentionRank(a) - attentionRank(b))
  const [lead, ...rest] = items
  const row = (item: AttentionItem) => describeAttention(item, base)
  return <section className={styles.card} aria-labelledby="home-attention" aria-busy={!data && !error}>
    <div className={styles.head}><h2 id="home-attention">Perlu perhatian</h2><Link to={`${base}/attention`}>Buka semua</Link></div>
    <LiveFeedback error={error} online={online} refresh={refresh} />
    {!data && !error && <Loading label="Memuat tugas Anda…" />}
    {data && <>
      <dl className={styles.tiles}>{tiles.map(([kind, label]) => <div key={kind} data-urgent={kind === 'safety' && data.counts[kind] > 0}><dt>{label}</dt><dd>{number.format(data.counts[kind])}</dd></div>)}</dl>
      {!lead ? <p className={styles.empty}><Icon name="check" size={16} />Tidak ada yang menunggu Anda.</p> : <>
        <div className={styles.lead} data-kind={lead.kind}>
          <span aria-hidden="true">{initials(row(lead).who)}</span>
          <div><strong>{row(lead).who}</strong><small>{row(lead).summary}</small></div>
          <time dateTime={row(lead).at}>{waitedFor(row(lead).at)}</time>
          <Link to={row(lead).to}>{attentionKind[lead.kind].action}<span className="sr-only">: {row(lead).title}</span></Link>
        </div>
        {rest.length > 0 && <div className={styles.next}><p>Berikutnya</p><ul>{rest.slice(0, 3).map((item) => <li key={`${item.kind}-${item.item_id}`}><Link to={row(item).to}><b>{attentionKind[item.kind].label}</b><span>{row(item).title}</span></Link></li>)}</ul></div>}
      </>}
    </>}
  </section>
}

function Patterns({ data, base }: { data: TeacherDashboard | null; base: string }) {
  const items = data ? [...data.top_changed].sort((a, b) => b.held - a.held).slice(0, 3) : []
  const most = Math.max(1, ...items.map((item) => item.held))
  const still = items.reduce((sum, item) => sum + Math.max(0, item.held - item.resolved), 0)
  return <section className={styles.card} aria-labelledby="home-patterns">
    <div className={styles.head}><div><h2 id="home-patterns">Pola kelas</h2><p>{data ? `${number.format(data.this_week.active_misconceptions)} miskonsepsi aktif di ${number.format(data.this_week.concepts_with_misconceptions)} konsep` : 'Minggu ini'}</p></div><Link to={`${base}/sessions`}>Peta kelas</Link></div>
    {items.length === 0 ? <p className={styles.empty}>Pola muncul setelah sesi minggu ini dinilai.</p> : <>
      <p className={styles.label}>Miskonsepsi terbanyak</p>
      <ul className={styles.bars}>{items.map((item) => <li key={item.misconception_id}><span><span>{item.statement}</span><b>{number.format(item.held)} siswa</b></span><i aria-hidden="true"><i style={{ inlineSize: `${item.held / most * 100}%` }} /></i></li>)}</ul>
    </>}
    {still > 0 && <p className={styles.note}><Nala mood="search" size={36} head /><span>{number.format(still)} siswa masih memegang miskonsepsi ini. <Link to={`${base}/missions/new`}>Buat misi lanjutan</Link></span></p>}
  </section>
}

function Rail({ attention, kb, base }: { attention: AttentionPage | null; kb: Awaited<ReturnType<KnowledgeBaseService['list']>> | null; base: string }) {
  const release = attention?.items.find((item): item is Extract<AttentionItem, { kind: 'release_ready' }> => item.kind === 'release_ready')
  const topics = (kb ?? []).slice(0, 3)
  return <div className={styles.rail}>
    <section className={styles.release} aria-label="Siap dirilis ke orang tua">
      <p>Siap dirilis ke orang tua</p>
      {release ? <>
        <p><strong>{number.format(release.eligible_count)}</strong>ringkasan · {release.class_name}</p>
        <p>{release.mission_title} · skor dan catatan verifikasi tidak ikut terkirim.</p>
        <Link to={`${base}/publications/${release.publication_id}/release`}>Pratinjau dan rilis</Link>
      </> : <p>Belum ada ringkasan yang menunggu rilis.</p>}
    </section>
    <section className={styles.card} aria-labelledby="home-kb">
      <h2 id="home-kb"><Link to={`${base}/knowledge-base`}>Basis pengetahuan</Link></h2>
      {topics.length === 0 ? <p className={styles.empty}>Belum ada topik.</p> : <ul className={styles.topics}>{topics.map((topic) => <li key={topic.id}>
        <Link to={`${base}/knowledge-base/${topic.id}`}><span>{topic.topic_title}</span><b data-waiting={topic.pending_count > 0}>{topic.pending_count > 0 ? `${number.format(topic.pending_count)} menunggu` : `${number.format(topic.approved_concept_count)} disetujui`}</b></Link>
        <i aria-hidden="true"><i style={{ flexGrow: topic.approved_concept_count }} /><i style={{ flexGrow: topic.pending_count }} /></i>
      </li>)}</ul>}
    </section>
  </div>
}

export function TeacherHomePage({ service, kb, base, schoolId, user, attention }: { service: TeacherService; kb: KnowledgeBaseService; base: string; schoolId: string; user: string; attention: AttentionResource }) {
  const read = useCallback((signal: AbortSignal) => service.dashboard(schoolId, signal), [service, schoolId])
  const { data, error } = useLiveResource(read, noPollMs)
  const readSessions = useCallback((signal: AbortSignal) => service.publications(signal), [service])
  const sessions = useLiveResource(readSessions, noPollMs)
  const readTopics = useCallback((signal: AbortSignal) => kb.list(schoolId, signal), [kb, schoolId])
  const topics = useLiveResource(readTopics, noPollMs)
  const queue = attention.online && !attention.error ? attention.data : null
  return <div className={styles.page}>
    <TeacherPageHead title={`${greeting()}, ${user.trim().split(/\s+/)[0]}`} subtitle={today.format(new Date())} />
    <div className={styles.top}>
      <Schedule resource={sessions} base={base} />
      <Changed data={data} failed={Boolean(error)} base={base} />
    </div>
    <div className={styles.bottom}>
      <Attention resource={attention} base={base} />
      <Patterns data={data} base={base} />
      <Rail attention={queue} kb={topics.data} base={base} />
    </div>
  </div>
}

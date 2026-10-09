import { useCallback, useState } from 'react'
import { Link } from 'react-router'
import type { ApiError } from '@/domain/model/ApiError'
import type { AttentionItem, AttentionPage, DashboardWeek, TeacherDashboard, TeacherPublication } from '@/domain/model/Teacher'
import type { TeacherService } from '@/domain/services/TeacherService'
import { ButtonLink } from '@/ui/components/button/ButtonLink'
import { Icon } from '@/ui/components/icon/Icon'
import type { IconName } from '@/ui/components/icon/Icon'
import { Nala } from '@/ui/components/nala/Nala'
import { NalaIcon } from '@/ui/components/nala/NalaIcon'
import type { NalaMood } from '@/ui/components/nala/Nala'
import { formatDay, formatDayTime } from '@/ui/formatInstant'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { noPollMs, useLiveResource } from '@/ui/pages/live/useLiveResource'
import styles, { statusTone, taskTone } from '@/ui/pages/teacher/TeacherHome.styles'
import { Loading } from '@/ui/components/loading/Loading'

interface AttentionResource { data: AttentionPage | null; error: ApiError | null; online: boolean; refresh: () => void }
const number = new Intl.NumberFormat('id-ID')
const shortDay = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', timeZone: 'Asia/Jakarta' })
const clock = new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' })
const jakartaHour = new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hourCycle: 'h23', timeZone: 'Asia/Jakarta' })
const series = [['mastered', 'Paham'], ['developing', 'Berkembang'], ['misconception', 'Miskonsepsi']] as const
const priority = { safety: 0, flag: 1, kb_review: 2, release_ready: 3 }
const day = 86_400_000

// School days run on WIB, whatever the computer's clock says.
function greeting(now = new Date()) {
  const hour = Number(jakartaHour.format(now))
  return hour >= 4 && hour < 11 ? 'Selamat pagi' : hour >= 11 && hour < 15 ? 'Selamat siang' : hour >= 15 && hour < 18 ? 'Selamat sore' : 'Selamat malam'
}

type Tone = 'good' | 'bad' | 'flat'
// `better` says which way is good news; the chip's colour judges, the sign and words carry the direction.
function change(now: number, before: number, better: 'up' | 'down', unit = ''): { tone: Tone; text: string } {
  if (now === before) return { tone: 'flat', text: 'Sama dengan minggu lalu' }
  return { tone: (now > before) === (better === 'up') ? 'good' : 'bad', text: `${now > before ? '+' : '−'}${number.format(Math.abs(now - before))}${unit} vs minggu lalu` }
}

function Dots({ share }: { share: number }) {
  const on = Math.round(Math.min(Math.max(share, 0), 1) * 10)
  return <span className={styles.dots} aria-hidden="true">{Array.from({ length: 10 }, (_, index) => <i key={index} data-on={index < on} />)}</span>
}

function Week({ week, last }: { week: DashboardWeek; last: DashboardWeek }) {
  const rate = week.changed_mind_rate === null ? null : Math.round(week.changed_mind_rate * 100)
  const before = last.changed_mind_rate === null ? null : Math.round(last.changed_mind_rate * 100)
  const rateChange = rate === null || before === null ? { tone: 'flat' as const, text: 'Belum ada pembanding' } : change(rate, before, 'up', ' poin')
  const rest = [
    { icon: 'done' as const, label: 'Sesi selesai', value: number.format(week.sessions_completed), unit: `dari ${number.format(week.students)} siswa`, chip: change(week.sessions_completed, last.sessions_completed, 'up') },
    { icon: 'idea' as const, label: 'Miskonsepsi aktif', value: number.format(week.active_misconceptions), unit: `di ${number.format(week.concepts_with_misconceptions)} konsep`, chip: change(week.active_misconceptions, last.active_misconceptions, 'down') },
    { icon: week.open_flags > 0 ? 'verify' as const : 'done' as const, label: 'Perlu verifikasi', value: number.format(week.open_flags), unit: 'sesi', chip: week.open_flags > 0 ? { tone: 'bad' as const, text: 'Belum ditinjau' } : { tone: 'good' as const, text: 'Semua ditinjau' } },
  ]
  return <dl className={styles.stats}>
    <div className={styles.featured}>
      <dt><NalaIcon name="changed" size={34} />Berubah pikiran</dt>
      <dd className={styles.featuredValue} data-empty={rate === null}>{rate === null ? 'Belum ada' : `${rate}%`}</dd>
      {rate !== null && <dd className={styles.featuredDots}><Dots share={rate / 100} /></dd>}
      <dd className={styles.featuredChip}>{rateChange.text}</dd>
    </div>
    {rest.map((stat) => <div key={stat.label} className={styles.stat}>
      <dt><NalaIcon name={stat.icon} size={30} />{stat.label}</dt>
      <dd className={styles.value}>{stat.value}<span>{stat.unit}</span></dd>
      <dd className={styles.chip} data-tone={stat.chip.tone}>{stat.chip.text}</dd>
    </div>)}
  </dl>
}

function attentionLink(item: AttentionItem, base: string): { title: string; detail: string; action: string; icon: IconName; to: string } {
  switch (item.kind) {
    case 'safety': return { title: `${item.student_name} membutuhkan pendampingan`, detail: 'Sesi dijeda untuk keselamatan. Periksa kondisi siswa sebelum melanjutkan.', action: 'Dampingi siswa', icon: 'heart', to: `${base}/publications/${item.publication_id}/sessions/${item.session_id}` }
    case 'flag': return { title: `Verifikasi sesi ${item.student_name}`, detail: 'Catatan ini tidak mengubah skor.', action: 'Tinjau sesi', icon: 'flag', to: `${base}/publications/${item.publication_id}/sessions/${item.session_id}` }
    case 'kb_review': return { title: `Tinjau materi ${item.topic_title}`, detail: `${number.format(item.pending_concepts)} konsep, ${number.format(item.pending_misconceptions)} miskonsepsi menunggu.`, action: 'Tinjau materi', icon: 'book', to: `${base}/knowledge-base/${item.knowledge_base_id}` }
    case 'release_ready': return { title: `Ringkasan kelas ${item.class_name} siap dirilis`, detail: `${number.format(item.eligible_count)} ringkasan, ${item.mission_title}`, action: 'Pratinjau rilis', icon: 'send', to: `${base}/publications/${item.publication_id}/release` }
  }
}

function oldest(items: readonly AttentionItem[], now = Date.now()) {
  const first = [...items].sort((a, b) => Date.parse(a.created_at) - Date.parse(b.created_at))[0]
  if (!first) return null
  const days = Math.floor((now - Date.parse(first.created_at)) / day)
  return { item: first, waited: days < 1 ? 'sejak hari ini' : `${number.format(days)} hari` }
}

function Queue({ resource, base }: { resource: AttentionResource; base: string }) {
  const { data, error, online, refresh } = resource
  const items = data ? [...data.items].sort((a, b) => priority[a.kind] - priority[b.kind]).slice(0, 4) : []
  const longest = data ? oldest(data.items) : null
  return <section className={styles.queue} aria-labelledby="home-next" aria-busy={!data && !error}>
    <div className={styles.head}><h2 id="home-next">Perlu perhatian</h2>{data && data.counts.total > 0 && <span className={styles.waiting}>{number.format(data.counts.total)} menunggu</span>}</div>
    <LiveFeedback error={error} online={online} refresh={refresh} />
    {!data && !error && <Loading label="Memuat tugas Anda…" />}
    {data && (data.counts.total === 0 ? <div className={styles.clear}><span><Icon name="check" size={18} /></span><div><h3>Tidak ada tinjauan yang menunggu.</h3><p>Anda bisa menyiapkan misi berikutnya atau melihat hasil kelas.</p></div></div> : items.length === 0 ? <p className={styles.empty}>Buka Perlu perhatian untuk melihat tugas yang tersedia.</p> : <ul className={styles.tasks}>{items.map((item) => {
      const entry = attentionLink(item, base)
      return <li key={`${item.kind}-${item.item_id}`}><Link to={entry.to} className={styles.task} data-kind={item.kind}>
        <span className={`${styles.taskIcon} ${taskTone[item.kind]}`}><Icon name={entry.icon} size={16} /></span>
        <span className={styles.taskText}><strong>{entry.title}</strong><span>{entry.detail}</span></span>
        <span className={styles.taskAction}>{entry.action}<Icon name="chevronRight" size={14} /></span>
      </Link></li>
    })}</ul>)}
    {longest && <p className={styles.oldest}><Icon name="clock" size={16} /><span><strong>Paling lama menunggu: {longest.waited}</strong>{attentionLink(longest.item, base).title}</span></p>}
    <Link className={styles.more} to={`${base}/attention`}>Lihat semua perhatian<Icon name="chevronRight" size={16} /></Link>
  </section>
}

// A rule, not a model: the misconceptions most students still hold after this week's dialogues come first.
function NalaTip({ data, failed, base }: { data: TeacherDashboard | null; failed: boolean; base: string }) {
  const held = data ? [...data.top_changed].filter((item) => item.held > item.resolved).sort((a, b) => (b.held - b.resolved) - (a.held - a.resolved)).slice(0, 2) : []
  const still = held.reduce((sum, item) => sum + item.held - item.resolved, 0)
  const [mood, title]: [NalaMood, string] = !data ? (failed ? ['oops', 'Saran belum bisa dimuat. Ringkasan minggu ini juga belum tersedia.'] : ['read', 'Nala sedang membaca hasil kelas Anda…'])
    : held.length > 0 ? ['think', `${number.format(still)} siswa masih memegang ${held.length} miskonsepsi`]
    : data.top_changed.length > 0 ? ['proud', 'Miskonsepsi minggu ini sudah dikoreksi siswa.']
    : ['hello', 'Saran muncul setelah siswa berdialog minggu ini.']
  return <section className={styles.tip} aria-labelledby="home-tip">
    <span className={styles.tipBadge}><Icon name="sparkle" size={14} />Saran Nala</span>
    <span className={styles.tipNala}><Nala key={mood} mood={mood} size={100} animate /></span>
    <h2 id="home-tip">{title}</h2>
    {held.length > 0 && <ul className={styles.tipItems}>{held.map((item) => <li key={item.misconception_id}><Link to={`${base}/sessions`} title={item.statement}><span><strong>“{item.statement}”</strong><small>{number.format(item.resolved)} dari {number.format(item.held)} siswa sudah berubah pikiran</small></span><Icon name="arrow" size={16} /></Link></li>)}</ul>}
    <div className={styles.tipFoot}><ButtonLink to={`${base}/missions/new`} className={styles.tipAction}>{held.length > 0 ? 'Buat misi lanjutan' : 'Buat misi'}</ButtonLink></div>
  </section>
}

const isActive = (publication: TeacherPublication) => ['lobby', 'open'].includes(publication.run.status)
const tabs = [['active', 'Berlangsung'], ['scheduled', 'Terjadwal'], ['closed', 'Selesai']] as const
type SessionTab = typeof tabs[number][0]
const inTab = (publication: TeacherPublication, tab: SessionTab) => tab === 'active' ? isActive(publication) : publication.run.status === tab
const statusLabel = (status: string) => ({ lobby: 'Lobi terbuka', open: 'Berlangsung', scheduled: 'Terjadwal', closed: 'Selesai' } as Readonly<Record<string, string>>)[status] ?? status
const when = (publication: TeacherPublication) => publication.run.status === 'closed' ? publication.run.closes_at : publication.run.opens_at

function Sessions({ service, base }: { service: TeacherService; base: string }) {
  const read = useCallback((signal: AbortSignal) => service.publications(signal), [service])
  const { data, error, online, refresh } = useLiveResource(read, noPollMs)
  const [picked, setPicked] = useState<SessionTab | null>(null)
  const tab = picked ?? tabs.find(([key]) => data?.some((publication) => inTab(publication, key)))?.[0] ?? 'active'
  const rows = (data ?? []).filter((publication) => inTab(publication, tab)).sort((a, b) => {
    const order = Date.parse(when(a) ?? '') - Date.parse(when(b) ?? '')
    return Number.isNaN(order) ? 0 : tab === 'closed' ? -order : order
  }).slice(0, 4)
  return <section className={styles.panel} aria-labelledby="home-sessions" aria-busy={!data && !error}>
    <div className={styles.head}><h2 id="home-sessions">Sesi kelas</h2>
      {data && data.length > 0 && <div className={styles.segmented} role="group" aria-label="Tampilkan sesi">{tabs.map(([key, label]) => <button key={key} type="button" aria-pressed={tab === key} onClick={() => setPicked(key)}>{label}<span>{number.format(data.filter((publication) => inTab(publication, key)).length)}</span></button>)}</div>}
    </div>
    <LiveFeedback error={error} online={online} refresh={refresh} />
    {!data && !error && <Loading label="Memuat sesi…" />}
    {data && (data.length === 0 ? <p className={styles.empty}>Belum ada sesi kelas. <Link to={`${base}/missions`}>Terbitkan misi yang sudah ditinjau</Link> untuk memulai.</p>
      : rows.length === 0 ? <p className={styles.empty}>Tidak ada sesi {tabs.find(([key]) => key === tab)?.[1].toLowerCase()}.</p>
      : <ul className={styles.sessions}>{rows.map((publication) => {
        const { run, counts } = publication
        const at = when(publication)
        const path = `${base}/publications/${publication.id}/${run.mode === 'live' && isActive(publication) ? 'monitor' : 'class-map'}`
        return <li key={publication.id}><Link to={path} state={{ publication }} className={styles.session}>
          <span className={styles.time}><strong>{at ? clock.format(new Date(at)) : run.mode === 'live' ? 'Langsung' : 'Tanpa jadwal'}</strong>{at && <small>{shortDay.format(new Date(at))}</small>}</span>
          <span className={styles.sessionText}><strong>{publication.mission_title}</strong><small>Kelas {publication.class_name}{publication.subject_name && `, ${publication.subject_name}`}. {run.mode === 'live' ? 'Langsung' : 'Jendela waktu'}</small></span>
          <span className={styles.progress}>{counts.started === 0 ? 'Belum ada siswa' : `${number.format(counts.completed)}/${number.format(counts.started)} selesai`}</span>
          <span className={`${styles.status} ${statusTone[run.status] ?? statusTone.closed}`}>{statusLabel(run.status)}</span>
          <span className={styles.go} aria-hidden="true"><Icon name="chevronRight" size={16} /></span>
        </Link></li>
      })}</ul>)}
    {data && data.length > 0 && <Link className={styles.more} to={`${base}/sessions`}>Lihat semua sesi<Icon name="chevronRight" size={16} /></Link>}
  </section>
}

// The heading says what the weeks show, recomputed from the data, so it never goes stale after a refresh.
function Weeks({ trend }: { trend: TeacherDashboard['trend'] }) {
  const weeks = trend.map((week) => ({ ...week, total: week.mastered + week.developing + week.misconception }))
  const shares = weeks.filter((week) => week.total > 0).map((week) => Math.round(week.mastered / week.total * 100))
  const first = shares[0], last = shares[shares.length - 1]
  const title = shares.length < 2 ? 'Pemahaman per minggu' : last > first ? `Hasil paham naik dari ${first}% ke ${last}%` : last < first ? `Hasil paham turun dari ${first}% ke ${last}%` : `Hasil paham stabil di ${last}%`
  return <section className={styles.panel} aria-labelledby="home-trend">
    <div className={styles.head}><h2 id="home-trend">{title}</h2><ul className={styles.legend}>{series.map(([key, label]) => <li key={key}><span className={styles[key]} aria-hidden="true" />{label}</li>)}</ul></div>
    <p className={styles.lede}>Komposisi hasil konsep dalam {number.format(trend.length)} minggu terakhir, bukan jumlah siswa.</p>
    {shares.length === 0 ? <p className={styles.empty}>Tren akan muncul setelah hasil konsep tersedia.</p> : <>
      <ol className={styles.weeks}>{weeks.map((week, index) => <li key={week.week_start} data-current={index === weeks.length - 1}>
        <span className={styles.weekDay}>{index === weeks.length - 1 ? 'Terbaru' : 'Minggu'}<span>{shortDay.format(new Date(week.week_start))}</span></span>
        <strong>{week.total ? `${Math.round(week.mastered / week.total * 100)}%` : '0'}</strong>
        <small>{week.total ? 'paham' : 'belum ada hasil'}</small>
        <span className={styles.weekBar} aria-hidden="true">{series.filter(([key]) => week[key] > 0).map(([key]) => <span key={key} className={styles[key]} style={{ flexGrow: week[key] }} />)}</span>
      </li>)}</ol>
      <details className={styles.table}><summary>Lihat data tren sebagai tabel<Icon name="chevronDown" size={16} /></summary><div className={styles.tableScroll}>
        <table><caption>Jumlah hasil konsep per minggu, bukan jumlah siswa</caption><thead><tr><th scope="col">Minggu mulai</th>{series.map(([key, label]) => <th key={key} scope="col">{label}</th>)}</tr></thead><tbody>{trend.map((week) => <tr key={week.week_start}><th scope="row">{formatDay(week.week_start)}</th>{series.map(([key]) => <td key={key}>{number.format(week[key])}</td>)}</tr>)}</tbody></table>
      </div></details>
    </>}
  </section>
}

function summary(data: TeacherDashboard | null, attention: AttentionPage | null) {
  if (!data) return 'Setiap kelas punya cerita belajar. Temukan perkembangannya, siapkan langkah berikutnya.'
  const done = data.this_week.sessions_completed
  const week = done === 0 ? 'Belum ada sesi selesai minggu ini.' : `${number.format(done)} sesi selesai minggu ini.`
  const waiting = attention?.counts.total ? ` ${number.format(attention.counts.total)} hal menunggu tinjauan Anda.` : ''
  return week + waiting
}

export function TeacherHomePage({ service, base, schoolId, user, attention }: { service: TeacherService; base: string; schoolId: string; user: string; attention: AttentionResource }) {
  const read = useCallback((signal: AbortSignal) => service.dashboard(schoolId, signal), [service, schoolId])
  const { data, error, online, refresh } = useLiveResource(read, noPollMs)
  const queue = attention.online && !attention.error ? attention.data : null
  return <div className={styles.board}>
    <section className={styles.greeting} aria-labelledby="home-welcome" aria-busy={!data && !error}>
      <div className={styles.greetingHead}>
        <div><h1 id="home-welcome">{greeting()}, {user.trim().split(/\s+/)[0]}</h1><p>{summary(data, queue)}{data && <span className={styles.asOf}> Diperbarui {formatDayTime(data.as_of)}.</span>}</p></div>
        <div className={styles.actions}>
          <ButtonLink tone="secondary" to={`${base}/sessions`} className={styles.secondary}><Icon name="monitor" size={16} />Lihat sesi</ButtonLink>
          <ButtonLink to={`${base}/missions/new`} className={styles.primary}><Icon name="plus" size={16} />Buat misi</ButtonLink>
        </div>
      </div>
      <LiveFeedback error={error} online={online} refresh={refresh} />
      {!data && !error && <div className={styles.skeleton} aria-hidden="true">{Array.from({ length: 4 }, (_, index) => <div key={index} />)}</div>}
      {data && <Week week={data.this_week} last={data.last_week} />}
    </section>
    <Queue resource={attention} base={base} />
    <NalaTip data={data} failed={Boolean(error)} base={base} />
    <Sessions service={service} base={base} />
    {data && <Weeks trend={data.trend} />}
  </div>
}

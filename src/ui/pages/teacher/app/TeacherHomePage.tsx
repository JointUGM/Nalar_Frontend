import { useCallback, useState } from 'react'
import { Link } from 'react-router'
import type { ApiError } from '@/domain/model/ApiError'
import type { AttentionPage, DashboardWeek, TeacherDashboard, TeacherPublication } from '@/domain/model/Teacher'
import type { TeacherService } from '@/domain/services/TeacherService'
import { cn } from '@/ui/cn'
import { ButtonLink } from '@/ui/components/button/ButtonLink'
import { Icon } from '@/ui/components/icon/Icon'
import { Loading } from '@/ui/components/loading/Loading'
import { Nala } from '@/ui/components/nala/Nala'
import type { NalaMood } from '@/ui/components/nala/Nala'
import { NalaIcon } from '@/ui/components/nala/NalaIcon'
import type { NalaIconName } from '@/ui/components/nala/NalaIcon'
import { formatDay, formatDayTime } from '@/ui/formatInstant'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { noPollMs, useLiveResource } from '@/ui/pages/live/useLiveResource'
import { attentionKind, attentionRank, describeAttention, isKnownAttention, waitedFor } from '@/ui/pages/teacher/app/attentionText'
import styles, { kindTone, statusTone } from '@/ui/pages/teacher/TeacherHome.styles'

interface AttentionResource { data: AttentionPage | null; error: ApiError | null; online: boolean; refresh: () => void }
const number = new Intl.NumberFormat('id-ID')
const shortDay = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', timeZone: 'Asia/Jakarta' })
const clock = new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' })
const jakartaHour = new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hourCycle: 'h23', timeZone: 'Asia/Jakarta' })
const series = [['mastered', 'Paham'], ['developing', 'Berkembang'], ['misconception', 'Miskonsepsi']] as const
const stroke = { mastered: 'stroke-primary fill-primary', developing: 'stroke-accent fill-accent', misconception: 'stroke-misconception-text fill-misconception-text' }

// School days run on WIB, whatever the computer's clock says.
function greeting(now = new Date()) {
  const hour = Number(jakartaHour.format(now))
  return hour >= 4 && hour < 11 ? 'Selamat pagi' : hour >= 11 && hour < 15 ? 'Selamat siang' : hour >= 15 && hour < 18 ? 'Selamat sore' : 'Selamat malam'
}

type Tone = 'good' | 'bad' | 'flat'
interface Chip { tone: Tone; text: string; dir?: 'up' | 'down' | 'flat' }
// `better` says which way is good news; the chip's colour judges, the arrow and words carry the direction.
function change(now: number, before: number, better: 'up' | 'down', unit = ''): Chip {
  if (now === before) return { tone: 'flat', dir: 'flat', text: 'Sama dengan minggu lalu' }
  const up = now > before
  return { tone: up === (better === 'up') ? 'good' : 'bad', dir: up ? 'up' : 'down', text: `${up ? '+' : '−'}${number.format(Math.abs(now - before))}${unit} vs minggu lalu` }
}

function Kpis({ week, last }: { week: DashboardWeek; last: DashboardWeek }) {
  const rate = week.changed_mind_rate === null ? null : Math.round(week.changed_mind_rate * 100)
  const before = last.changed_mind_rate === null ? null : Math.round(last.changed_mind_rate * 100)
  const cells: { icon: NalaIconName; label: string; value: string; empty?: boolean; chip: Chip; caption: string }[] = [
    { icon: 'changed', label: 'Berubah pikiran', value: rate === null ? 'Belum ada' : `${rate}%`, empty: rate === null, chip: rate === null || before === null ? { tone: 'flat', text: 'Belum ada pembanding' } : change(rate, before, 'up', ' poin'), caption: 'miskonsepsi dikoreksi saat dialog' },
    { icon: 'done', label: 'Sesi selesai', value: number.format(week.sessions_completed), chip: change(week.sessions_completed, last.sessions_completed, 'up'), caption: `dari ${number.format(week.students)} siswa` },
    { icon: 'idea', label: 'Miskonsepsi aktif', value: number.format(week.active_misconceptions), chip: change(week.active_misconceptions, last.active_misconceptions, 'down'), caption: `di ${number.format(week.concepts_with_misconceptions)} konsep` },
    { icon: week.open_flags > 0 ? 'verify' : 'done', label: 'Perlu verifikasi', value: number.format(week.open_flags), chip: week.open_flags > 0 ? { tone: 'bad', text: 'Belum ditinjau' } : { tone: 'good', text: 'Semua ditinjau' }, caption: 'sesi dengan catatan' },
  ]
  return <dl className={styles.kpis}>{cells.map((cell) => <div key={cell.label} className={styles.kpi}>
    <dt className={styles.kpiLabel}><NalaIcon name={cell.icon} size={26} />{cell.label}</dt>
    <dd className={styles.kpiValue} data-empty={Boolean(cell.empty)}>{cell.value}</dd>
    <dd className={styles.kpiChip}><span className={styles.chip} data-tone={cell.chip.tone} data-dir={cell.chip.dir}>{cell.chip.dir && <Icon name={cell.chip.dir === 'flat' ? 'minus' : 'arrowUp'} size={11} />}{cell.chip.text}</span></dd>
    <dd className={styles.kpiCaption}>{cell.caption}</dd>
  </div>)}</dl>
}

function Todo({ resource, base }: { resource: AttentionResource; base: string }) {
  const { data, error, online, refresh } = resource
  const open = data ? data.items.filter(isKnownAttention) : []
  const items = [...open].sort((a, b) => attentionRank(a) - attentionRank(b)).slice(0, 4)
  const oldest = open.reduce<string | null>((first, item) => !first || Date.parse(item.created_at) < Date.parse(first) ? item.created_at : first, null)
  return <section className={styles.todo} aria-labelledby="home-todo" aria-busy={!data && !error}>
    <div className={styles.head}>
      <div>
        <div className="flex items-baseline"><h2 id="home-todo">Perlu tindakan</h2>{data && data.counts.total > 0 && <span className={styles.count}>{number.format(data.counts.total)}<span className="sr-only"> menunggu</span></span>}</div>
        <p className={styles.lede}>Keselamatan siswa selalu di urutan pertama.{oldest && ` Paling lama menunggu ${waitedFor(oldest)}.`}</p>
      </div>
      <Link className={styles.more} to={`${base}/attention`}>Lihat semua<Icon name="chevronRight" size={14} /></Link>
    </div>
    <LiveFeedback error={error} online={online} refresh={refresh} />
    {!data && !error && <Loading label="Memuat tugas Anda…" />}
    {data && (data.counts.total === 0 ? <div className={styles.clear}><span><Icon name="check" size={18} /></span><div><h3>Tidak ada yang menunggu Anda.</h3><p>Siapkan misi berikutnya atau lihat hasil kelas.</p></div></div>
      : items.length === 0 ? <p className={styles.empty}>Buka <Link to={`${base}/attention`}>Perlu perhatian</Link> untuk melihat tugas yang tersedia.</p>
      : <ul className={styles.cards}>{items.map((item) => {
        const entry = describeAttention(item, base)
        const kind = attentionKind[item.kind]
        return <li key={`${item.kind}-${item.item_id}`} className={styles.action} data-kind={item.kind}>
          <div className={styles.actionTop}><span className={cn(styles.kind, kindTone[item.kind])}><Icon name={kind.icon} size={12} />{kind.label}</span><span className={styles.when}><Icon name="clock" size={12} />{formatDayTime(item.created_at)}</span></div>
          <h3>{entry.title}</h3>
          <p>{entry.summary}</p>
          <div className={styles.next}><strong><NalaIcon name={kind.nala} size={22} />Langkah berikutnya</strong><p>{kind.next}</p></div>
          <Link to={entry.to} className={styles.go}>{kind.action}<span className="sr-only">: {entry.title}</span><Icon name="chevronRight" size={14} /></Link>
        </li>
      })}</ul>)}
  </section>
}

// Shares of concept results per week on a fixed 0-100% scale, so a flat line means a flat class, not a zoomed axis.
function TrendChart({ weeks, label }: { weeks: { week_start: string; share: Record<typeof series[number][0], number> }[]; label: string }) {
  const left = 34, right = 312, top = 10, bottom = 128
  const x = (index: number) => weeks.length === 1 ? (left + right) / 2 : left + index * (right - left) / (weeks.length - 1)
  const y = (share: number) => bottom - share / 100 * (bottom - top)
  const last = weeks.length - 1
  return <svg viewBox="0 0 320 150" className={styles.chart} role="img" aria-label={label}>
    {[100, 50, 0].map((value) => <g key={value}>
      <line x1={left} x2={right} y1={y(value)} y2={y(value)} className="stroke-role-border" strokeDasharray={value === 0 ? undefined : '3 4'} />
      <text x={0} y={y(value) + 3.5} className="fill-text-muted text-[10px] tabular-nums">{value}%</text>
    </g>)}
    {weeks.map((week, index) => (weeks.length <= 6 || index === 0 || index === last) && <text key={week.week_start} x={x(index)} y={146} textAnchor={weeks.length === 1 ? 'middle' : index === 0 ? 'start' : index === last ? 'end' : 'middle'} className={cn('text-[10px]', index === last ? 'fill-ink font-semibold' : 'fill-text-muted')}>{shortDay.format(new Date(week.week_start))}</text>)}
    {series.map(([key]) => <g key={key} className={stroke[key]}>
      {weeks.length > 1 && <polyline points={weeks.map((week, index) => `${x(index)},${y(week.share[key])}`).join(' ')} fill="none" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />}
      {weeks.map((week, index) => <circle key={week.week_start} cx={x(index)} cy={y(week.share[key])} r={index === last ? 3.5 : 2.25} className="stroke-surface" strokeWidth="1.5" />)}
    </g>)}
  </svg>
}

// The finding is recomputed from the data, so it never goes stale after a refresh.
function Trend({ trend }: { trend: TeacherDashboard['trend'] }) {
  const weeks = trend.map((week) => ({ ...week, total: week.mastered + week.developing + week.misconception })).filter((week) => week.total > 0)
    .map((week) => ({ week_start: week.week_start, share: { mastered: Math.round(week.mastered / week.total * 100), developing: Math.round(week.developing / week.total * 100), misconception: Math.round(week.misconception / week.total * 100) } }))
  const first = weeks[0]?.share.mastered, last = weeks[weeks.length - 1]?.share.mastered
  const finding = weeks.length < 2 ? 'Komposisi hasil konsep per minggu, bukan jumlah siswa.' : last > first ? `Hasil paham naik dari ${first} ke ${last} persen.` : last < first ? `Hasil paham turun dari ${first} ke ${last} persen.` : `Hasil paham stabil di ${last} persen.`
  return <section className={styles.panel} aria-labelledby="home-trend">
    <div className={styles.head}><h2 id="home-trend">Tren pemahaman</h2><span className="text-[12px] leading-6 text-text-muted">{number.format(trend.length)} minggu</span></div>
    <p className={styles.lede}>{finding}</p>
    {weeks.length === 0 ? <p className={styles.empty}>Tren muncul setelah hasil konsep tersedia.</p> : <>
      <ul className={styles.legend}>{series.map(([key, label]) => <li key={key}><span className={styles[key]} aria-hidden="true" />{label}</li>)}</ul>
      <TrendChart weeks={weeks} label={`Tren pemahaman. ${finding}`} />
      <details className={styles.table}><summary>Lihat data sebagai tabel<Icon name="chevronDown" size={16} /></summary><div className={styles.tableScroll}>
        <table><caption>Jumlah hasil konsep per minggu, bukan jumlah siswa</caption><thead><tr><th scope="col">Minggu mulai</th>{series.map(([key, label]) => <th key={key} scope="col">{label}</th>)}</tr></thead><tbody>{trend.map((week) => <tr key={week.week_start}><th scope="row">{formatDay(week.week_start)}</th>{series.map(([key]) => <td key={key}>{number.format(week[key])}</td>)}</tr>)}</tbody></table>
      </div></details>
    </>}
  </section>
}

const isActive = (publication: TeacherPublication) => ['lobby', 'open'].includes(publication.run.status)
const tabs = [['active', 'Berlangsung'], ['scheduled', 'Terjadwal'], ['closed', 'Selesai']] as const
type SessionTab = typeof tabs[number][0]
const inTab = (publication: TeacherPublication, tab: SessionTab) => tab === 'active' ? isActive(publication) : publication.run.status === tab
const statusLabel = (status: string) => ({ lobby: 'Lobi terbuka', open: 'Berlangsung', scheduled: 'Terjadwal', closed: 'Selesai' } as Readonly<Record<string, string>>)[status] ?? status
const when = (publication: TeacherPublication) => publication.run.status === 'closed' ? publication.run.closes_at : publication.run.opens_at
const sessionPath = (publication: TeacherPublication, base: string) => `${base}/publications/${publication.id}/${publication.run.mode === 'live' && isActive(publication) ? 'monitor' : 'class-map'}`

function Sessions({ resource, base }: { resource: { data: TeacherPublication[] | null; error: ApiError | null; online: boolean; refresh: () => void }; base: string }) {
  const { data, error, online, refresh } = resource
  const [picked, setPicked] = useState<SessionTab | null>(null)
  const tab = picked ?? tabs.find(([key]) => data?.some((publication) => inTab(publication, key)))?.[0] ?? 'active'
  const rows = (data ?? []).filter((publication) => inTab(publication, tab)).sort((a, b) => {
    const order = Date.parse(when(a) ?? '') - Date.parse(when(b) ?? '')
    return Number.isNaN(order) ? 0 : tab === 'closed' ? -order : order
  }).slice(0, 4)
  return <section className={styles.panel} aria-labelledby="home-sessions" aria-busy={!data && !error}>
    <div className={cn(styles.head, 'items-center')}><h2 id="home-sessions">Sesi kelas</h2>
      {data && data.length > 0 && <div className={styles.segmented} role="group" aria-label="Tampilkan sesi">{tabs.map(([key, label]) => <button key={key} type="button" aria-pressed={tab === key} onClick={() => setPicked(key)}>{label}<span>{number.format(data.filter((publication) => inTab(publication, key)).length)}</span></button>)}</div>}
    </div>
    <LiveFeedback error={error} online={online} refresh={refresh} />
    {!data && !error && <Loading label="Memuat sesi…" />}
    {data && (data.length === 0 ? <p className={styles.empty}>Belum ada sesi kelas. <Link to={`${base}/missions`}>Terbitkan misi yang sudah ditinjau</Link> untuk memulai.</p>
      : rows.length === 0 ? <p className={styles.empty}>Tidak ada sesi {tabs.find(([key]) => key === tab)?.[1].toLowerCase()}.</p>
      : <ul className={styles.sessions}>{rows.map((publication) => {
        const { run, counts } = publication
        const at = when(publication)
        return <li key={publication.id} className="py-0.5"><Link to={sessionPath(publication, base)} state={{ publication }} className={styles.session}>
          <span className={styles.time}><strong>{at ? clock.format(new Date(at)) : run.mode === 'live' ? 'Langsung' : 'Bebas'}</strong>{at && <small>{shortDay.format(new Date(at))}</small>}</span>
          <span className={styles.sessionText}><strong>{publication.mission_title}</strong><small>Kelas {publication.class_name}, {counts.started === 0 ? 'belum ada siswa' : `${number.format(counts.completed)}/${number.format(counts.started)} selesai`}</small></span>
          <span className={cn(styles.status, statusTone[run.status] ?? statusTone.closed)}>{statusLabel(run.status)}</span>
        </Link></li>
      })}</ul>)}
    {data && data.length > 0 && <Link className={cn(styles.more, 'mt-2')} to={`${base}/sessions`}>Lihat semua sesi<Icon name="chevronRight" size={14} /></Link>}
  </section>
}

// A rule, not a model: misconceptions most students let go of come first; the footer names what is still held.
function Changed({ data, failed, base }: { data: TeacherDashboard | null; failed: boolean; base: string }) {
  const items = data ? [...data.top_changed].sort((a, b) => b.resolved - a.resolved || b.held - a.held).slice(0, 4) : []
  const held = items.filter((item) => item.held > item.resolved)
  const still = held.reduce((sum, item) => sum + item.held - item.resolved, 0)
  const mood: NalaMood = !data ? (failed ? 'oops' : 'read') : held.length > 0 ? 'think' : items.length > 0 ? 'proud' : 'hello'
  return <section className={styles.rail} aria-labelledby="home-changed" aria-busy={!data && !failed}>
    <div className={styles.railHead}>
      <div className="min-w-0"><h2 id="home-changed">Berubah pikiran minggu ini</h2><p>Miskonsepsi yang dikoreksi siswa sendiri selama dialog.</p></div>
      <span className={styles.railNala}><Nala key={mood} mood={mood} size={64} animate /></span>
    </div>
    {!data ? <p className={styles.railEmpty}>{failed ? 'Ringkasan minggu ini belum bisa dimuat.' : 'Nala sedang membaca hasil kelas Anda…'}</p>
      : items.length === 0 ? <p className={styles.railEmpty}>Daftar ini terisi setelah siswa berdialog minggu ini.</p>
      : <ol className={styles.changes}>{items.map((item, index) => <li key={item.misconception_id} className={styles.change}>
        <span aria-hidden="true">{index + 1}</span>
        <div className="min-w-0"><strong>“{item.statement}”</strong>
          <dl className={styles.split}><div><dt>Awalnya</dt><dd>{number.format(item.held)} siswa</dd></div><div data-good={item.resolved > 0}><dt>Berubah</dt><dd>{number.format(item.resolved)} siswa</dd></div></dl>
        </div>
      </li>)}</ol>}
    {held.length > 0 && <div className={styles.railFoot}>
      <p>{number.format(still)} siswa masih memegang {number.format(held.length)} miskonsepsi ini.</p>
      <ButtonLink to={`${base}/missions/new`} className={styles.railAction}>Buat misi lanjutan</ButtonLink>
    </div>}
  </section>
}

function summary(data: TeacherDashboard | null, attention: AttentionPage | null) {
  if (!data) return 'Ringkasan minggu ini, tugas yang menunggu, dan sesi kelas Anda.'
  const done = data.this_week.sessions_completed
  const week = done === 0 ? 'Belum ada sesi selesai minggu ini.' : `${number.format(done)} sesi selesai minggu ini.`
  const waiting = attention?.counts.total ? ` ${number.format(attention.counts.total)} hal menunggu tinjauan Anda.` : ''
  return week + waiting
}

export function TeacherHomePage({ service, base, schoolId, user, attention }: { service: TeacherService; base: string; schoolId: string; user: string; attention: AttentionResource }) {
  const read = useCallback((signal: AbortSignal) => service.dashboard(schoolId, signal), [service, schoolId])
  const { data, error, online, refresh } = useLiveResource(read, noPollMs)
  const readSessions = useCallback((signal: AbortSignal) => service.publications(signal), [service])
  const sessions = useLiveResource(readSessions, noPollMs)
  const queue = attention.online && !attention.error ? attention.data : null
  // A class in a live lobby or session is the one thing to jump back into; otherwise the next step is a new mission.
  const live = sessions.data?.find((publication) => publication.run.mode === 'live' && isActive(publication))
  return <div className={styles.page}>
    <div className={styles.header}>
      <div><h1>{greeting()}, {user.trim().split(/\s+/)[0]}</h1><p>{summary(data, queue)}{data && <span className={styles.asOf}> Diperbarui {formatDayTime(data.as_of)}.</span>}</p></div>
      <div className={styles.actions}>
        {live ? <>
          <ButtonLink tone="secondary" to={`${base}/missions/new`} className={styles.button}><Icon name="plus" size={16} />Buat misi</ButtonLink>
          <ButtonLink to={sessionPath(live, base)} state={{ publication: live }} className={styles.button}><Icon name="play" size={16} />Pantau sesi {live.class_name}</ButtonLink>
        </> : <>
          <ButtonLink tone="secondary" to={`${base}/sessions`} className={styles.button}><Icon name="monitor" size={16} />Lihat sesi</ButtonLink>
          <ButtonLink to={`${base}/missions/new`} className={styles.button}><Icon name="plus" size={16} />Buat misi</ButtonLink>
        </>}
      </div>
    </div>
    <section className={styles.week} aria-label="Minggu ini" aria-busy={!data && !error}>
      <LiveFeedback error={error} online={online} refresh={refresh} />
      {!data && !error && <div className={styles.skeleton} aria-hidden="true">{Array.from({ length: 4 }, (_, index) => <div key={index}><span /><span /></div>)}</div>}
      {data && <Kpis week={data.this_week} last={data.last_week} />}
    </section>
    <div className={styles.grid}>
      <Todo resource={attention} base={base} />
      <Changed data={data} failed={Boolean(error)} base={base} />
      <div className={styles.pair}>
        {data && <Trend trend={data.trend} />}
        <Sessions resource={sessions} base={base} />
      </div>
    </div>
  </div>
}

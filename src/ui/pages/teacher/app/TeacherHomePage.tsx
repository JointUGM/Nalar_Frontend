import { useCallback } from 'react'
import { Link } from 'react-router'
import type { ApiError } from '@/domain/model/ApiError'
import type { AttentionItem, AttentionPage, DashboardWeek, TeacherDashboard } from '@/domain/model/Teacher'
import type { TeacherService } from '@/domain/services/TeacherService'
import { ButtonLink } from '@/ui/components/button/ButtonLink'
import { Icon } from '@/ui/components/icon/Icon'
import { NalaIcon } from '@/ui/components/nala/NalaIcon'
import type { IconName } from '@/ui/components/icon/Icon'
import { Nala } from '@/ui/components/nala/Nala'
import { formatDay, formatDayTime } from '@/ui/formatInstant'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { noPollMs, useLiveResource } from '@/ui/pages/live/useLiveResource'
import styles from '@/ui/pages/teacher/TeacherHome.module.css'
import sections from '@/ui/pages/teacher/HomeSections.module.css'
import { Loading } from '@/ui/components/loading/Loading'

interface AttentionResource { data: AttentionPage | null; error: ApiError | null; online: boolean; refresh: () => void }
const number = new Intl.NumberFormat('id-ID')
const shortDay = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', timeZone: 'Asia/Jakarta' })
const percent = (rate: number | null) => rate === null ? '—' : `${Math.round(rate * 100)}%`
const change = (now: number, before: number, unit = '') => now === before ? 'Sama dengan minggu lalu' : `${now > before ? '+' : '−'}${number.format(Math.abs(now - before))}${unit} dari minggu lalu`
const series = [['mastered', 'Paham'], ['developing', 'Berkembang'], ['misconception', 'Miskonsepsi']] as const
const priority = { safety: 0, flag: 1, kb_review: 2, release_ready: 3 }
const taskKind = { safety: 'Pendampingan siswa', flag: 'Verifikasi sesi', kb_review: 'Tinjauan materi', release_ready: 'Rilis ringkasan' }

function kpis(week: DashboardWeek, last: DashboardWeek) {
  const rate = week.changed_mind_rate, before = last.changed_mind_rate
  return [
    { icon: 'done' as const, label: 'Sesi selesai', value: number.format(week.sessions_completed), change: change(week.sessions_completed, last.sessions_completed), caption: `Dari ${number.format(week.students)} siswa` },
    { icon: 'idea' as const, label: 'Miskonsepsi aktif', value: number.format(week.active_misconceptions), change: change(week.active_misconceptions, last.active_misconceptions), caption: `Di ${number.format(week.concepts_with_misconceptions)} konsep` },
    { icon: 'changed' as const, label: 'Berubah pikiran', value: percent(rate), change: rate === null || before === null ? 'Belum ada pembanding' : change(Math.round(rate * 100), Math.round(before * 100), ' poin'), caption: 'Mengoreksi pemahaman saat sesi' },
    { icon: 'verify' as const, label: 'Perlu verifikasi', value: number.format(week.open_flags), change: week.open_flags > 0 ? 'Belum ditinjau' : 'Tidak ada catatan terbuka', caption: 'Tidak mengubah skor penalaran' },
  ]
}

function attentionLink(item: AttentionItem, base: string): { title: string; detail: string; action: string; icon: IconName; to: string } {
  switch (item.kind) {
    case 'safety': return { title: `${item.student_name} membutuhkan pendampingan`, detail: 'Sesi dijeda untuk keselamatan. Periksa kondisi siswa sebelum melanjutkan.', action: 'Dampingi siswa', icon: 'heart', to: `${base}/publications/${item.publication_id}/sessions/${item.session_id}` }
    case 'flag': return { title: `Verifikasi sesi ${item.student_name}`, detail: 'Tinjau aktivitas dan jawaban siswa. Catatan ini tidak mengubah skor.', action: 'Tinjau sesi', icon: 'flag', to: `${base}/publications/${item.publication_id}/sessions/${item.session_id}` }
    case 'kb_review': return { title: `Tinjau materi ${item.topic_title}`, detail: `${number.format(item.pending_concepts)} konsep dan ${number.format(item.pending_misconceptions)} miskonsepsi menunggu persetujuan.`, action: 'Tinjau materi', icon: 'book', to: `${base}/knowledge-base/${item.knowledge_base_id}` }
    case 'release_ready': return { title: `Ringkasan kelas ${item.class_name} siap dirilis`, detail: `${item.mission_title} · ${number.format(item.eligible_count)} ringkasan siap ditinjau.`, action: 'Pratinjau rilis', icon: 'send', to: `${base}/publications/${item.publication_id}/release` }
  }
}

function NextSteps({ resource, base }: { resource: AttentionResource; base: string }) {
  const { data, error, online, refresh } = resource
  const items = data ? [...data.items].sort((a, b) => priority[a.kind] - priority[b.kind]).slice(0, 4) : []
  return <section className={sections.agenda} aria-labelledby="home-next" aria-busy={!data && !error}>
    <div className={sections.head}><div><h2 id="home-next">Perlu perhatian</h2><p>Tinjauan dan tindak lanjut Anda.</p></div>{data && data.counts.total > 0 && <span className={sections.count}>{number.format(data.counts.total)}</span>}</div>
    <LiveFeedback error={error} online={online} refresh={refresh} />
    {!data && !error && <Loading label="Memuat tugas Anda…" />}
    {data && (data.counts.total === 0 ? <div className={sections.clear}><Nala mood="proud" size={72} /><div><h3>Tidak ada tinjauan yang menunggu.</h3><p>Anda bisa menyiapkan misi berikutnya atau melihat hasil kelas.</p></div></div> : items.length === 0 ? <p className={sections.empty}>Buka Perlu perhatian untuk melihat tugas yang tersedia.</p> : <ul className={sections.tasks}>{items.map((item) => {
      const entry = attentionLink(item, base)
      return <li key={`${item.kind}-${item.item_id}`}><Link to={entry.to} className={sections.task} data-kind={item.kind}>
        <span className={sections.taskKind}><Icon name={entry.icon} size={14} />{taskKind[item.kind]}</span>
        <span className={sections.taskText}><strong>{entry.title}</strong><span>{entry.detail}</span></span>
        <span className={sections.taskAction}>{entry.action}<Icon name="chevronRight" size={16} /></span>
      </Link></li>
    })}</ul>)}
    <Link className={sections.allTasks} to={`${base}/attention`}>Lihat semua perhatian<Icon name="chevronRight" size={16} /></Link>
  </section>
}

function Trend({ trend }: { trend: TeacherDashboard['trend'] }) {
  const hasResults = trend.some((week) => week.mastered + week.developing + week.misconception > 0)
  return <section className={sections.trend} aria-labelledby="home-trend">
    <div className={sections.head}><div><h2 id="home-trend">Tren pemahaman</h2><p>{trend.length > 0 ? `Komposisi hasil konsep dalam ${trend.length} minggu terakhir.` : 'Komposisi pemahaman dari hasil sesi kelas Anda.'}</p></div></div>
    {!hasResults ? <p className={sections.empty}>Tren akan muncul setelah hasil konsep tersedia.</p> : <>
      <ul className={sections.legend}>{series.map(([key, label]) => <li key={key}><span className={sections[key]} aria-hidden="true" />{label}</li>)}</ul>
      <div className={sections.chart} role="img" aria-label="Komposisi paham, berkembang, dan miskonsepsi per minggu. Jumlah lengkap tersedia pada tabel di bawah.">
        {trend.map((week) => {
          const total = week.mastered + week.developing + week.misconception
          return <div className={sections.chartRow} key={week.week_start}><span className={sections.week}>{shortDay.format(new Date(week.week_start))}</span><div className={sections.stack}>{series.filter(([key]) => week[key] > 0).map(([key]) => <span key={key} className={sections[key]} style={{ width: `${total ? week[key] / total * 100 : 0}%` }} />)}</div><span className={sections.chartValue}>{total ? percent(week.mastered / total) : '—'}<span> paham</span></span></div>
        })}
      </div>
      <details className={sections.table}><summary>Lihat data tren sebagai tabel<Icon name="chevronDown" size={16} /></summary><div className={sections.tableScroll}>
        <table><caption>Jumlah hasil konsep per minggu, bukan jumlah siswa</caption><thead><tr><th scope="col">Minggu mulai</th>{series.map(([key, label]) => <th key={key} scope="col">{label}</th>)}</tr></thead><tbody>{trend.map((week) => <tr key={week.week_start}><th scope="row">{formatDay(week.week_start)}</th>{series.map(([key]) => <td key={key}>{number.format(week[key])}</td>)}</tr>)}</tbody></table>
      </div></details>
    </>}
  </section>
}

export function TeacherHomePage({ service, base, schoolId, user, attention }: { service: TeacherService; base: string; schoolId: string; user: string; attention: AttentionResource }) {
  const read = useCallback((signal: AbortSignal) => service.dashboard(schoolId, signal), [service, schoolId])
  const { data, error, online, refresh } = useLiveResource(read, noPollMs)
  const currentAttention = attention.online && !attention.error ? attention.data : null
  const needsSupport = Boolean(currentAttention?.counts.safety)
  const welcomeMessage = needsSupport ? 'Dahulukan pendampingan siswa, ya.' : currentAttention?.counts.total === 0 ? 'Siap menyiapkan misi berikutnya?' : 'Mari lihat cerita belajar kelas Anda.'
  return <div className={styles.content}>
    <section className={styles.welcome} aria-labelledby="home-welcome">
      <div className={styles.welcomeCopy}><h1 id="home-welcome">Selamat datang, {user.trim().split(/\s+/)[0]}</h1><p>Setiap kelas punya cerita belajar.<br />Temukan perkembangannya, siapkan langkah berikutnya.</p><div className={styles.welcomeActions}><ButtonLink className={styles.start} to={`${base}/missions/new`}><Icon name="plus" size={18} />Buat misi</ButtonLink><ButtonLink tone="secondary" className={styles.sessions} to={`${base}/sessions`}><Icon name="monitor" size={18} />Lihat sesi</ButtonLink></div></div>
      <div className={styles.nalaWelcome}><p className={styles.speech}>{welcomeMessage}</p><div className={styles.mascot}><Nala mood={needsSupport ? 'calm' : 'hello'} size={204} /></div></div>
    </section>
    <section className={styles.summary} aria-labelledby="home-week" aria-busy={!data && !error}>
      <div className={styles.sectionHead}><h2 id="home-week">Pembelajaran minggu ini</h2>{data && <span>Diperbarui {formatDayTime(data.as_of)}</span>}</div>
      <LiveFeedback error={error} online={online} refresh={refresh} />
      {!data && !error && <div className={styles.loading}><Loading label="Memuat ringkasan…" /><div className={styles.skeleton} aria-hidden="true">{Array.from({ length: 4 }, (_, index) => <div key={index} />)}</div></div>}
      {data && <>
        <ul className={styles.kpis} aria-label="Ringkasan minggu ini">{kpis(data.this_week, data.last_week).map((kpi) => <li key={kpi.label}><span className={styles.label}><NalaIcon name={kpi.icon} />{kpi.label}</span><strong className={styles.value}>{kpi.value}</strong><span className={styles.comparison}>{kpi.change}</span><span className={styles.caption}>{kpi.caption}</span></li>)}</ul>
        {data.this_week.sessions_completed === 0 && <div className={styles.empty}><div><strong>Belum ada sesi selesai minggu ini.</strong><p>Hasil akan terisi setelah siswa menyelesaikan misi dan evaluasi tersedia.</p></div><Link to={`${base}/sessions`}>Lihat sesi<Icon name="chevronRight" size={16} /></Link></div>}
      </>}
    </section>
    <div className={styles.workbench} data-has-insights={Boolean(data)}>
    <div className={styles.insights}>
    {data && <>
      <Trend trend={data.trend} />
      <section className={sections.changedPanel} aria-labelledby="home-changed"><div className={sections.head}><div><h2 id="home-changed">Berubah pikiran minggu ini</h2><p>Miskonsepsi yang siswa koreksi sendiri saat berdialog.</p></div>{data.top_changed.length > 0 && <Nala mood="proud" size={64} />}</div>
        {data.top_changed.length === 0 ? <p className={sections.empty}>Belum ada perubahan pikiran minggu ini.</p> : <ol className={sections.changed}>{data.top_changed.map((item) => <li key={item.misconception_id}><span className={sections.conceptIcon}><NalaIcon name="idea" size={44} /></span><div><h3>“{item.statement}”</h3><p><strong><Icon name="check" size={14} />{number.format(item.resolved)} siswa berubah pikiran</strong><span>dari {number.format(item.held)} siswa yang awalnya memegang miskonsepsi ini.</span></p></div></li>)}</ol>}
        <Link className={sections.link} to={`${base}/sessions`}>Jelajahi hasil kelas<Icon name="chevronRight" size={16} /></Link>
      </section>
    </>}
    </div>
    <div className={styles.rail}>
    <NextSteps resource={attention} base={base} />
    <section className={styles.prepare} aria-labelledby="home-prepare"><div className={styles.prepareHeading}><h2 id="home-prepare">Misi yang baik dimulai dari materi.</h2><Nala mood="think" size={80} /></div><p>Tinjau konsep dan miskonsepsi sebelum menyusun misi untuk kelas Anda.</p><Link to={`${base}/knowledge-base`}>Buka basis pengetahuan<Icon name="chevronRight" size={16} /></Link></section>
    </div>
    </div>
  </div>
}

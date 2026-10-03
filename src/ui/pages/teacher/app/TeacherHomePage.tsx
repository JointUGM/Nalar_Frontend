import { useCallback } from 'react'
import { Link } from 'react-router'
import type { DashboardWeek, TeacherDashboard } from '@/domain/model/Teacher'
import type { TeacherService } from '@/domain/services/TeacherService'
import { ButtonLink } from '@/ui/components/button/ButtonLink'
import { Icon } from '@/ui/components/icon/Icon'
import { formatDay } from '@/ui/formatInstant'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { noPollMs, useLiveResource } from '@/ui/pages/live/useLiveResource'
import styles from '@/ui/pages/teacher/TeacherHome.module.css'
import sections from '@/ui/pages/teacher/HomeSections.module.css'

const percent = (rate: number | null) => rate === null ? '—' : `${Math.round(rate * 100)}%`
const change = (now: number, before: number, unit = '') => now === before ? 'Sama dengan minggu lalu' : `${now > before ? '+' : '−'}${Math.abs(now - before)}${unit} dari minggu lalu`
const series = [['mastered', 'Paham'], ['developing', 'Berkembang'], ['misconception', 'Miskonsepsi']] as const
// The chart plots each outcome as a share of all concept results that week, 0% at the bottom and 100% at the top.
const point = (week: number, share: number) => ({ x: 36 + week * 80, y: 130 - share * 120 })

function kpis(week: DashboardWeek, last: DashboardWeek) {
  const rate = week.changed_mind_rate, before = last.changed_mind_rate
  return [
    { label: 'Sesi selesai', value: String(week.sessions_completed), chip: change(week.sessions_completed, last.sessions_completed), tone: 'success', caption: `Dari ${week.students} siswa` },
    { label: 'Miskonsepsi aktif', value: String(week.active_misconceptions), chip: change(week.active_misconceptions, last.active_misconceptions), tone: 'misconception', caption: `Di ${week.concepts_with_misconceptions} konsep` },
    { label: 'Berubah pikiran', value: percent(rate), chip: rate === null || before === null ? 'Belum ada pembanding' : change(Math.round(rate * 100), Math.round(before * 100), ' poin'), tone: 'success', caption: 'Saat sesi, tanpa diberi tahu' },
    { label: 'Perlu verifikasi', value: String(week.open_flags), chip: 'Belum ditinjau', tone: 'verification', caption: 'Tidak mengubah skor' },
  ] as const
}

function Trend({ trend }: { trend: TeacherDashboard['trend'] }) {
  const shares = trend.map((week) => { const total = week.mastered + week.developing + week.misconception; return { week, total, share: (key: typeof series[number][0]) => total ? week[key] / total : 0 } })
  return <section className={sections.card} aria-labelledby="home-trend">
    <div className={sections.head}><h2 id="home-trend" className={sections.title}><Icon name="graph" size={16} />Tren pemahaman</h2><span className={sections.range}>{trend.length} minggu terakhir</span></div>
    <ul className={sections.legend}>{series.map(([key, label]) => <li key={key}><svg width="22" height="8" viewBox="0 0 22 8" aria-hidden="true"><line x1="1" y1="4" x2="21" y2="4" className={sections[key === 'mastered' ? 'understood' : key]} /></svg>{label}</li>)}</ul>
    <svg viewBox="0 0 320 150" role="img" aria-label="Grafik garis bagian hasil konsep per minggu untuk paham, berkembang, dan miskonsepsi. Data lengkap ada pada tabel di bawah." className={sections.chart}>
      <g className={sections.axis}>
        {[['100%', 14], ['67%', 54], ['33%', 94], ['0%', 134]].map(([text, y]) => <text key={text} x="0" y={y}>{text}</text>)}
        {shares.map(({ week }, index) => <text key={week.week_start} x={point(index, 0).x} y="148">{formatDay(week.week_start)}</text>)}
      </g>
      <path d={[10, 50, 90, 130].map((y) => `M28 ${y}H320`).join('')} className={sections.grid} />
      {series.map(([key]) => <g key={key} className={sections[key === 'mastered' ? 'understood' : key]}>
        <polyline points={shares.map(({ share }, index) => { const at = point(index, share(key)); return `${at.x},${at.y}` }).join(' ')} />
        {shares.map(({ share }, index) => { const at = point(index, share(key)); return <circle key={index} cx={at.x} cy={at.y} r="2.5" /> })}
      </g>)}
    </svg>
    <details className={sections.table}>
      <summary>Lihat data tren sebagai tabel</summary>
      <table>
        <caption>Jumlah hasil konsep per minggu</caption>
        <thead><tr><th scope="col">Minggu mulai</th>{series.map(([key, label]) => <th key={key} scope="col">{label}</th>)}</tr></thead>
        <tbody>{trend.map((week) => <tr key={week.week_start}><th scope="row">{formatDay(week.week_start)}</th>{series.map(([key]) => <td key={key}>{week[key]}</td>)}</tr>)}</tbody>
      </table>
    </details>
  </section>
}

export function TeacherHomePage({ service, base, schoolId, user }: { service: TeacherService; base: string; schoolId: string; user: string }) {
  const read = useCallback((signal: AbortSignal) => service.dashboard(schoolId, signal), [service, schoolId])
  const { data, error, online, refresh } = useLiveResource(read, noPollMs)
  return <div className={styles.content}>
    <div className={styles.header}>
      <div><h1>Selamat datang, {user.split(' ')[0]}</h1><p>{data ? `Minggu ini, dihitung sampai ${formatDay(data.as_of)}` : 'Ringkasan minggu ini'}</p></div>
      <div className={styles.actions}><ButtonLink className={styles.start} to={`${base}/sessions`}><Icon name="monitor" size={14} />Sesi dan hasil</ButtonLink></div>
    </div>
    <LiveFeedback error={error} online={online} refresh={refresh} />
    {!data && !error && <p role="status">Memuat ringkasan…</p>}
    {data && <>
      <ul className={styles.kpis} aria-label="Ringkasan minggu ini">{kpis(data.this_week, data.last_week).map((kpi) => <li key={kpi.label}>
        <span className={styles.label}>{kpi.label}</span>
        <div className={styles.value}><strong>{kpi.value}</strong></div>
        <span className={[styles.chip, styles[kpi.tone]].join(' ')}>{kpi.chip}</span>
        <small>{kpi.caption}</small>
      </li>)}</ul>
      <div className={styles.insights}>
        <div className={styles.primary}><Trend trend={data.trend} /></div>
        <section className={[sections.card, sections.flush].join(' ')} aria-labelledby="home-changed">
          <div className={sections.changedHead}><h2 id="home-changed" className={sections.title}><Icon name="idea" size={16} />Berubah pikiran minggu ini</h2><p className={sections.muted}>Siswa yang mengoreksi sendiri miskonsepsinya selama sesi.</p></div>
          {data.top_changed.length === 0 ? <p className={sections.muted}>Belum ada perubahan pikiran minggu ini.</p> : <ol className={sections.changed} role="list">{data.top_changed.map((item, index) => <li key={item.misconception_id}>
            <div className={sections.changedTitle}><span className={sections.rank} aria-hidden="true">{index + 1}</span><div><h3>“{item.statement}”</h3></div></div>
            <dl className={sections.stats}>
              <div><dt>Awalnya</dt><dd><span className={[sections.mark, sections.urgent].join(' ')} aria-hidden="true"><Icon name="users" size={9} /></span>{item.held} siswa</dd></div>
              <div><dt>Berubah</dt><dd className={sections.good}><span className={[sections.mark, sections.success].join(' ')} aria-hidden="true"><Icon name="arrowUp" size={9} /></span>{item.resolved} siswa</dd></div>
            </dl>
          </li>)}</ol>}
          <p className={sections.muted}><Link to={`${base}/attention`}>Lihat yang perlu perhatian</Link></p>
        </section>
      </div>
    </>}
  </div>
}

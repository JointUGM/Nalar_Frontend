import { useCallback } from 'react'
import { TeacherPageHead } from '@/ui/components/teacher-shell/TeacherPageHead'
import { Link, useLocation, useParams } from 'react-router'
import { orderByPrerequisites } from '@/domain/model/Teacher'
import type { TeacherPublication } from '@/domain/model/Teacher'
import type { TeacherService } from '@/domain/services/TeacherService'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Icon } from '@/ui/components/icon/Icon'
import { Nala } from '@/ui/components/nala/Nala'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { useLiveResource } from '@/ui/pages/live/useLiveResource'
import { CsvDownload } from '@/ui/components/csv-download/CsvDownload'
import styles from '@/ui/pages/teacher/TeacherClassMap.styles'
import { Loading } from '@/ui/components/loading/Loading'

// Evaluations and the saved insight arrive after the sessions end, so the map refreshes on its own.
const mapPollMs = () => 15_000
const perRow = 3

export function TeacherClassMapPage({ service, base }: { service: TeacherService; base: string }) {
  const { publicationId = '' } = useParams()
  const location = useLocation()
  const known = location.state?.publication as TeacherPublication | undefined
  const subtitle = known?.id === publicationId ? `${known.class_name} · ${known.mission_title}` : 'Hasil kelas'
  const read = useCallback((signal: AbortSignal) => service.classMap(publicationId, signal), [service, publicationId])
  const { data, error, online, refresh } = useLiveResource(read, mapPollMs)
  const rows = data?.concepts.flatMap((concept) => concept.misconceptions.map((item) => ({ ...item, concept: concept.name }))).filter((item) => item.count > 0) ?? []
  const lines = Math.ceil((data?.concepts.length ?? 0) / perRow)
  // Prerequisites come first, then each concept gets a grid slot (as percentages of the map) and the edges join the slots.
  const ordered = data ? orderByPrerequisites(data.concepts, data.prerequisites) : []
  const slot = (index: number) => { const inRow = Math.min(perRow, ordered.length - Math.floor(index / perRow) * perRow); return { x: ((index % perRow) + 0.5) / inRow * 100, y: (Math.floor(index / perRow) + 0.5) / lines * 100 } }
  const edges = (data?.prerequisites ?? []).flatMap((edge) => {
    const from = ordered.findIndex((concept) => concept.concept_id === edge.prerequisite_id), to = ordered.findIndex((concept) => concept.concept_id === edge.concept_id)
    return from < 0 || to < 0 || from === to ? [] : [{ key: `${edge.prerequisite_id}-${edge.concept_id}`, from: slot(from), to: slot(to) }]
  })

  return <div className={styles.content}>
    <TeacherPageHead crumb={<><Link to={`${base}/sessions`}>Sesi dan hasil</Link><Icon name="chevronRight" size={14} /></>} title="Peta kelas" subtitle={<>{subtitle}{data ? ` · ${data.denominator} siswa dihitung` : ''}</>} />
    <div className={styles.header}>
      <div className={styles.actions}><CsvDownload label="Unduh nilai (CSV)" filename="nalar-nilai-kelas.csv" read={(signal) => service.exportPublication(publicationId, signal)} /><Link className={styles.release} to={`${base}/publications/${publicationId}/release`} state={location.state}><Icon name="send" size={14} />Rilis ke orang tua</Link></div>
    </div>
    <LiveFeedback error={error} online={online} refresh={refresh} />
    {!data && !error && <Loading label="Memuat peta kelas…" />}
    {data && data.denominator === 0 && <Feedback title="Belum ada hasil untuk dipetakan" announce>Peta muncul setelah ada sesi yang selesai dan dinilai.{data.incomplete_count > 0 ? ` ${data.incomplete_count} siswa belum selesai atau belum dinilai.` : ''}</Feedback>}
    {data && data.denominator > 0 && <div className={styles.grid}>
      <section className={styles.main} aria-labelledby="map-title">
        <div className={styles.cardHead}>
          <h2 id="map-title">Konsep target</h2>
          <ul className={styles.legend} aria-label="Keterangan warna"><li data-kind="understood">Paham</li><li data-kind="developing">Berkembang</li><li data-kind="unseen">Belum teramati</li></ul>
        </div>
        <ul className={styles.concepts}>{ordered.map((concept) => <li key={concept.concept_id}>
          <strong>{concept.name}</strong>
          <span className={styles.bar} aria-hidden="true"><span style={{ flexGrow: concept.mastered_count }} /><span style={{ flexGrow: concept.developing_count }} /><span style={{ flexGrow: concept.not_observed_count }} /></span>
          <small>{concept.mastered_count} paham · {concept.developing_count} berkembang · {concept.not_observed_count} belum teramati</small>
        </li>)}</ul>
        {edges.length > 0 && <>
          <p className={styles.system}>Garis menghubungkan konsep prasyarat dengan konsep lanjutannya. Konsep yang dipelajari lebih dulu ada di kiri atau atas.</p>
          <div className={styles.mapRegion} role="region" aria-label="Urutan prasyarat (dapat digulir)" tabIndex={0}>
            <div className={styles.map}>
              {/* The API gives no layout, so concepts sit on an even grid, three to a row. */}
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" data-testid="map-edges">{edges.map((edge) => <path key={edge.key} d={`M${edge.from.x} ${edge.from.y}L${edge.to.x} ${edge.to.y}`} />)}</svg>
              <ul aria-hidden="true">{ordered.map((concept, index) => { const { x, y } = slot(index); return <li key={concept.concept_id} style={{ left: `${x}%`, top: `${y}%` }}>{concept.name}</li> })}</ul>
            </div>
          </div>
        </>}
        <div className={styles.table}>
          <h3 id="mis-title">Miskonsepsi <span>{rows.length}</span></h3>
          {rows.length === 0 ? <p>Tidak ada miskonsepsi yang teramati pada sesi yang dihitung.</p> : <div className={styles.tableRegion} role="region" aria-labelledby="mis-title" tabIndex={0}>
            <table>
              <caption>Miskonsepsi di kelas, jumlah siswa, dan yang berubah selama sesi</caption>
              <thead><tr><th scope="col">Miskonsepsi</th><th scope="col">Siswa</th><th scope="col">Berubah pikiran</th><th scope="col">Konsep</th></tr></thead>
              <tbody>{rows.map((row) => <tr key={row.misconception_id}>
                <th scope="row">“{row.statement}”</th>
                <td><strong>{row.count}</strong>{row.students.length > 0 && <ul className={styles.chips}>{row.students.map((holder) => <li key={holder.session_id}><Link to={`${base}/publications/${publicationId}/sessions/${holder.session_id}`}>{holder.name}</Link></li>)}</ul>}</td>
                <td><span className={styles.progress}><span aria-hidden="true"><i style={{ inlineSize: `${row.resolved_count / row.count * 100}%` }} /></span>{row.resolved_count} dari {row.count}</span></td>
                <td>{row.concept}</td>
              </tr>)}</tbody>
            </table>
          </div>}
        </div>
      </section>
      <div className={styles.rail}>
        <dl className={styles.kpis}>
          <div><dt>Siswa dihitung</dt><dd>{data.denominator}</dd></div>
          <div><dt>Belum selesai</dt><dd>{data.incomplete_count}</dd></div>
          <div><dt>Konsep</dt><dd>{data.concepts.length}</dd></div>
          <div><dt>Miskonsepsi</dt><dd>{rows.length}</dd></div>
        </dl>
        <section className={styles.card} aria-labelledby="happening-title">
          <h2 id="happening-title"><Nala mood="search" size={40} head />Penjelasan Nala</h2>
          <p className={styles.story}>{data.insight ? data.insight.narrative : 'Penjelasan ditulis setelah semua sesi selesai dan dinilai.'}</p>
          <p className={styles.footnote}>Angka dihitung langsung dari data sesi. Nala hanya menjelaskan polanya.</p>
        </section>
        {data.insight && data.insight.suggestions.length > 0 && <section className={styles.card} aria-labelledby="suggest-title">
          <h2 id="suggest-title">Saran pelajaran berikutnya</h2>
          <ul className={styles.suggestions}>{data.insight.suggestions.map((suggestion, index) => <li key={index}>{suggestion}</li>)}</ul>
        </section>}
      </div>
    </div>}
  </div>
}

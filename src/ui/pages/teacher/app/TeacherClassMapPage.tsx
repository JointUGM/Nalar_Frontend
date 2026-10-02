import { useCallback } from 'react'
import { Link, useLocation, useParams } from 'react-router'
import type { TeacherPublication } from '@/domain/model/Teacher'
import type { TeacherService } from '@/domain/services/TeacherService'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Icon } from '@/ui/components/icon/Icon'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { useLiveResource } from '@/ui/pages/live/useLiveResource'
import styles from '@/ui/pages/teacher/TeacherClassMap.module.css'

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

  return <div className={styles.content}>
    <Link className={styles.back} to={base}><Icon name="chevronLeft" size={14} />Sesi dan hasil</Link>
    <div className={styles.header}>
      <div><h1>Peta miskonsepsi kelas</h1><p>{subtitle}{data ? ` · ${data.denominator} siswa dihitung` : ''}</p></div>
      <div className={styles.actions}><Link className={styles.release} to={`${base}/publications/${publicationId}/release`} state={location.state}><Icon name="send" size={14} />Rilis ke orang tua</Link></div>
    </div>
    <LiveFeedback error={error} online={online} refresh={refresh} />
    {!data && !error && <p role="status">Memuat peta kelas…</p>}
    {data && data.denominator === 0 && <Feedback title="Belum ada hasil untuk dipetakan" announce>Peta muncul setelah ada sesi yang selesai dan dinilai.{data.incomplete_count > 0 ? ` ${data.incomplete_count} siswa belum selesai atau belum dinilai.` : ''}</Feedback>}
    {data && data.denominator > 0 && <>
      <dl className={styles.kpis}>
        <div><dt>SISWA DIHITUNG</dt><dd><strong>{data.denominator}</strong></dd></div>
        <div><dt>BELUM SELESAI</dt><dd><strong>{data.incomplete_count}</strong></dd></div>
        <div><dt>KONSEP</dt><dd><strong>{data.concepts.length}</strong></dd></div>
        <div><dt>MISKONSEPSI DITEMUKAN</dt><dd><strong>{rows.length}</strong></dd></div>
      </dl>

      <div className={styles.grid}>
        <section className={styles.card} aria-labelledby="map-title">
          <div className={styles.cardHead}>
            <h2 id="map-title"><Icon name="graph" size={16} />Pemahaman per konsep</h2>
            <ul className={styles.legend} aria-label="Keterangan warna"><li data-kind="understood">Paham</li><li data-kind="developing">Berkembang</li></ul>
          </div>
          <p className={styles.system}><strong>DIHITUNG SISTEM</strong> Semua angka dihitung dari data sesi. AI hanya menulis penjelasan.</p>
          <div className={styles.mapRegion} role="region" aria-label="Pemahaman per konsep (dapat digulir)" tabIndex={0}>
            <div className={styles.map}>
              {/* The API gives no layout, so concepts sit on an even grid, three to a row. */}
              <ul>{data.concepts.map((concept, index) => {
                const inRow = Math.min(perRow, data.concepts.length - Math.floor(index / perRow) * perRow)
                return <li key={concept.concept_id} style={{ left: `${((index % perRow) + 0.5) / inRow * 100}%`, top: `${(Math.floor(index / perRow) + 0.5) / lines * 100}%` }}>
                  <strong>{concept.name}</strong>
                  <span className={styles.bar} aria-hidden="true"><span style={{ inlineSize: `${concept.mastered_count / data.denominator * 100}%` }} /><span style={{ inlineSize: `${concept.developing_count / data.denominator * 100}%` }} /></span>
                  <small>{concept.mastered_count} paham · {concept.developing_count} berkembang · {concept.not_observed_count} belum teramati</small>
                </li>
              })}</ul>
            </div>
          </div>
        </section>
        <section className={styles.card} aria-labelledby="happening-title">
          <h2 id="happening-title">Yang terjadi di kelas</h2>
          {data.insight ? <p className={styles.story}>{data.insight.narrative}</p> : <p className={styles.story}>Penjelasan ditulis setelah semua sesi selesai dan dinilai.</p>}
        </section>
      </div>

      <section className={styles.table} aria-labelledby="mis-title">
        <h2 id="mis-title">Miskonsepsi <span>{rows.length}</span></h2>
        {rows.length === 0 ? <p>Tidak ada miskonsepsi yang teramati pada sesi yang dihitung.</p> : <div className={styles.tableRegion} role="region" aria-label="Tabel miskonsepsi (dapat digulir)" tabIndex={0}>
          <table>
            <caption>Miskonsepsi di kelas, jumlah siswa, dan yang berubah selama sesi</caption>
            <thead><tr><th scope="col">Miskonsepsi</th><th scope="col">Siswa</th><th scope="col">Berubah selama sesi</th><th scope="col">Konsep</th></tr></thead>
            <tbody>{rows.map((row) => <tr key={row.misconception_id}>
              <th scope="row">“{row.statement}”</th>
              <td>{row.count}</td>
              <td><span className={styles.progress}><span aria-hidden="true"><i style={{ inlineSize: `${row.resolved_count / row.count * 100}%` }} /></span>{row.resolved_count} dari {row.count}</span></td>
              <td>{row.concept}</td>
            </tr>)}</tbody>
          </table>
        </div>}
      </section>
    </>}
  </div>
}

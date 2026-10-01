import { Link } from 'react-router'
import { Button } from '@/ui/components/button/Button'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Icon } from '@/ui/components/icon/Icon'
import { TeacherShell } from '@/ui/components/teacher-shell/TeacherShell'
import { teacherUser } from './teacherHomeExamples'
import { missionsPath } from './teacherMissionExamples'
import { useTeacherClassMapViewModel } from './useTeacherClassMapViewModel'
import styles from './TeacherClassMap.module.css'

// SVG user units equal the map's 520x360 box, so a node's x/y percent maps straight onto the line ends.
const width = 520
const height = 360

export function TeacherClassMap() {
  const view = useTeacherClassMapViewModel()
  const { mission, klass, example, lead } = view
  if (!mission || !klass) return <TeacherShell title="Hasil kelas / Peta miskonsepsi" user={teacherUser}><div className={styles.content}>
    <Feedback title="Contoh peta kelas belum tersedia" announce>Buka peta kelas dari halaman pemantauan sebuah misi contoh.</Feedback>
    <Link className={styles.back} to={missionsPath}>Kembali ke daftar misi</Link>
  </div></TeacherShell>
  const point = (id: string) => { const node = example.concepts.find((item) => item.id === id); return node ? { x: node.x * width / 100, y: node.y * height / 100 } : null }
  const named = (id: string) => example.concepts.find((item) => item.id === id)?.name ?? id

  return <TeacherShell title="Hasil kelas / Peta miskonsepsi" user={teacherUser}><div className={styles.content}>
    <div className={styles.header}>
      <div><h1>Peta miskonsepsi kelas</h1><p>{klass.name} · {mission.title} · {example.total} dari {example.total} siswa selesai</p></div>
      <div className={styles.actions}>
        <Button tone="secondary" disabled title="Ekspor belum tersedia di pratinjau"><Icon name="file" size={14} />Ekspor catatan</Button>
        <Link className={styles.release} to={`${missionsPath}/${mission.id}/class-map/release?kelas=${encodeURIComponent(klass.name)}`}><Icon name="send" size={14} />Rilis ke orang tua</Link>
      </div>
    </div>
    <p className={styles.note}>Pratinjau lokal · angka adalah contoh dari sampel (kelas contoh berisi {example.total} siswa), bukan hasil sesi nyata. Tidak ada yang dihitung, disimpulkan, atau dibuat oleh AI di halaman ini.</p>

    <dl className={styles.kpis}>{view.kpis.map((item) => <div key={item.label}>
      <dt>{item.label}</dt><dd><strong>{item.value}</strong><span data-tone={item.tone}>{item.chip}</span></dd>
    </div>)}</dl>

    <div className={styles.grid}>
      <section className={styles.card} aria-labelledby="map-title">
        <div className={styles.cardHead}>
          <h2 id="map-title"><Icon name="graph" size={16} />Pemahaman per konsep</h2>
          <ul className={styles.legend} aria-label="Keterangan warna"><li data-kind="understood">Paham</li><li data-kind="developing">Berkembang</li><li data-kind="misconception">Miskonsepsi</li></ul>
        </div>
        <p className={styles.system}><strong>DIHITUNG SISTEM</strong> Semua angka dari data sesi (contoh). AI hanya menulis penjelasan.</p>
        <div className={styles.mapRegion} role="region" aria-label="Peta pemahaman per konsep (dapat digulir)" tabIndex={0}>
          <div className={styles.map}>
            <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true">
              {example.leadsTo.map(([from, to]) => { const a = point(from), b = point(to); return a && b && <path key={`${from}-${to}`} d={`M${a.x} ${a.y}L${b.x} ${b.y}`} /> })}
            </svg>
            <ul>{view.nodes.map((node) => <li key={node.id} style={{ left: `${node.x}%`, top: `${node.y}%` }}>
              <strong>{node.name}</strong>
              <span className={styles.bar} aria-hidden="true">{node.shares.map((share, index) => <span key={index} style={{ inlineSize: `${share}%` }} />)}</span>
              <small aria-hidden="true">{node.label}</small>
              <span className={styles.hidden}>{node.text}</span>
            </li>)}</ul>
          </div>
        </div>
        <ul className={styles.hidden} aria-label="Hubungan antar konsep">{example.leadsTo.map(([from, to]) => <li key={`${from}-${to}`}>{named(from)} berhubungan dengan {named(to)}</li>)}</ul>
      </section>
      <section className={styles.card} aria-labelledby="happening-title">
        <h2 id="happening-title">Yang terjadi di kelas</h2>
        <p className={styles.story}><b data-kind="held">{lead.held}</b> dari <b>{example.total}</b> siswa awalnya berpikir {example.summary.idea}. <b data-kind="changed">{lead.changed}</b> di antaranya berubah pikiran setelah memikirkan {example.summary.example}.</p>
        <p className={styles.eyebrow}>SARAN UNTUK PERTEMUAN BERIKUTNYA (CONTOH)</p>
        <ul className={styles.suggestions}>{example.suggestions.map((text) => <li key={text}>{text}</li>)}</ul>
      </section>
    </div>

    <section className={styles.table} aria-labelledby="mis-title">
      <h2 id="mis-title">Miskonsepsi <span>{view.rows.length}</span></h2>
      <div className={styles.tableRegion} role="region" aria-label="Tabel miskonsepsi (dapat digulir)" tabIndex={0}>
        <table>
          <caption>Miskonsepsi di kelas, jumlah siswa, dan yang berubah selama sesi</caption>
          <thead><tr><th scope="col">Miskonsepsi</th><th scope="col">Siswa</th><th scope="col">Berubah selama sesi</th><th scope="col">Konsep</th><th scope="col"><span className={styles.hidden}>Tindakan</span></th></tr></thead>
          <tbody>{view.rows.map((row) => <tr key={row.name}>
            <th scope="row">“{row.name}”</th>
            <td className={styles.held}>{row.held}</td>
            <td><span className={styles.progress}><span aria-hidden="true"><i style={{ inlineSize: `${row.share}%` }} /></span>{row.changed} dari {row.held}</span></td>
            <td>{row.concept}</td>
            <td><Button tone="secondary" disabled title="Laporan siswa belum tersedia di pratinjau" aria-label={`Lihat siswa: ${row.name}`}>Lihat siswa</Button></td>
          </tr>)}</tbody>
        </table>
      </div>
    </section>
  </div></TeacherShell>
}

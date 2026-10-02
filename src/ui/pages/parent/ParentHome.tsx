import { Button } from '@/ui/components/button/Button'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Icon } from '@/ui/components/icon/Icon'
import { Nala } from '@/ui/components/nala/Nala'
import { Sparkline } from '@/ui/components/sparkline/Sparkline'
import { week } from './parentExamples'
import { useParentHomeViewModel } from './useParentHomeViewModel'
import type { HomeScenario } from './useParentHomeViewModel'
import styles from './ParentHome.module.css'

const scenarios: readonly (readonly [HomeScenario, string])[] = [['normal', 'Normal'], ['loading', 'Sedang memuat'], ['error', 'Gagal memuat']]
const unavailable = 'Belum tersedia di pratinjau'

export function ParentHome() {
  const view = useParentHomeViewModel()
  const { child, news } = view
  if (!child) return <div className={styles.content}>
    <h1>Belum ada anak yang tertaut</h1>
    <Feedback title="Akunmu belum tertaut ke anak">Hubungi wali kelas atau admin sekolah supaya akunmu bisa melihat kabar anakmu.</Feedback>
  </div>

  const first = child.name.split(' ')[0]
  const loading = view.scenario === 'loading'
  return <div className={styles.content} aria-busy={loading}>
    <div className={styles.header}>
      <div><h1>Kabar {first} minggu ini</h1><p>{child.detail} · {week}</p></div>
    </div>
    <label className={styles.scenario}>Keadaan halaman (pratinjau)
      <select value={view.scenario} onChange={(event) => view.setScenario(scenarios.find(([value]) => value === event.target.value)?.[0] ?? 'normal')}>{scenarios.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
    </label>

    {loading && <>
      <p role="status" className={styles.loading}>Memuat kabar {first}…</p>
      <div className={styles.skeleton} aria-hidden="true"><span /><span /><span /></div>
    </>}
    {view.scenario === 'error' && <div className={styles.error}>
      <Feedback tone="danger" title="Kabar belum bisa dimuat" announce>Coba lagi sebentar lagi. Ini hanya contoh kegagalan di pratinjau.</Feedback>
      <Button tone="secondary" onClick={view.retry}>Coba lagi</Button>
    </div>}

    {view.scenario === 'normal' && !news && <section className={styles.empty} aria-labelledby="empty-title">
      <Nala mood="calm" size={72} />
      <div>
        <h2 id="empty-title">Belum ada kabar dari guru {first}</h2>
        <p>Ringkasan muncul di sini setelah guru merilis hasil misi.</p>
        <p className={styles.email}><Icon name="bell" size={14} />Email mingguan: aktif</p>
      </div>
    </section>}

    {view.scenario === 'normal' && news && <>
      <ul className={styles.kpis} aria-label={`Ringkasan ${first}`}>{news.kpis.map((kpi) => <li key={kpi.label}>
        <span className={styles.label}>{kpi.label}</span>
        <span className={styles.value}><strong>{kpi.value}</strong><Sparkline trend={kpi.trend} label={`Tren ${kpi.label.toLowerCase()}`} /></span>
        <small>{kpi.caption}</small>
      </li>)}</ul>

      <div className={styles.grid}>
        <section className={styles.card} aria-labelledby="latest-title">
          <div className={styles.cardHead}><h2 id="latest-title"><Icon name="file" size={16} />Ringkasan terbaru dari guru</h2><span className={styles.released}><Icon name="check" size={12} />{news.summary.released}</span></div>
          <div className={styles.summary}>
            <p className={styles.meta}><span>{news.summary.subject}</span>Dari {news.summary.teacher}</p>
            <h3>{news.summary.mission}</h3>
            <p className={styles.text}>{news.summary.text}</p>
            <div className={styles.tryHome}><strong><Icon name="idea" size={14} />Untuk dicoba di rumah</strong><p>{news.summary.tryAtHome}</p></div>
            <Button tone="secondary" disabled title={unavailable}>Baca refleksi lengkap</Button>
          </div>
        </section>

        <section className={styles.card} aria-labelledby="concepts-title">
          <div className={styles.cardHead}><h2 id="concepts-title"><Icon name="layers" size={16} />Perkembangan konsep</h2><span className={styles.released}>IPA · semester ini</span></div>
          <div className={styles.region} role="region" aria-label="Daftar konsep (dapat digulir)" tabIndex={0}>
            <table>
              <thead><tr><th scope="col">Konsep</th><th scope="col">Status</th><th scope="col">Dari misi</th></tr></thead>
              <tbody>{news.concepts.map((concept) => <tr key={concept.name}>
                <th scope="row">{concept.name}</th>
                <td><span className={styles.status} data-status={concept.status === 'Sudah dipahami' ? 'done' : 'growing'}>{concept.status}</span></td>
                <td>{concept.from}</td>
              </tr>)}</tbody>
            </table>
          </div>
        </section>
      </div>

      <section className={styles.talk} aria-labelledby="talk-title">
        <div className={styles.talkHead}>
          <h2 id="talk-title"><Nala mood="ask" size={24} head />Obrolan di rumah</h2>
          <p>Pertanyaan dari refleksi {first}. Tidak perlu tahu jawabannya, cukup tanyakan alasannya.</p>
        </div>
        <ol>{news.talk.map((item) => <li key={item.question}><div><strong>{item.question}</strong><small>{item.from}</small></div></li>)}</ol>
        <Button tone="secondary" disabled title={unavailable}>Semua refleksi</Button>
      </section>
    </>}
  </div>
}

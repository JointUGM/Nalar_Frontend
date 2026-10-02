import { Link } from 'react-router'
import { Button } from '@/ui/components/button/Button'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Icon } from '@/ui/components/icon/Icon'
import { reflectionPath } from './parentExamples'
import { useParentReflectionsViewModel } from './useParentReflectionsViewModel'
import type { ReflectionsScenario } from './useParentReflectionsViewModel'
import styles from './ParentReflections.module.css'

const scenarios: readonly (readonly [ReflectionsScenario, string])[] = [['normal', 'Normal'], ['loading', 'Sedang memuat'], ['error', 'Gagal memuat']]

export function ParentReflections() {
  const view = useParentReflectionsViewModel()
  const { child } = view
  if (!child) return <div className={styles.content}>
    <h1>Refleksi</h1>
    <Feedback title="Akunmu belum tertaut ke anak">Hubungi wali kelas atau admin sekolah supaya akunmu bisa melihat refleksi anakmu.</Feedback>
  </div>

  const first = child.name.split(' ')[0]
  const loading = view.scenario === 'loading'
  const shown = view.scenario === 'normal'
  const noMatch = shown && view.total > 0 && view.items.length === 0
  return <div className={styles.content} aria-busy={loading}>
    <div className={styles.header}>
      <div><h1>Refleksi {first}</h1><p>Ditulis setelah setiap misi, dirilis oleh guru</p></div>
      <label className={styles.search}><Icon name="search" size={14} /><span className={styles.hidden}>Cari refleksi</span>
        <input type="search" value={view.query} placeholder="Cari refleksi" autoComplete="off" disabled={!shown || view.total === 0} onChange={(event) => view.setQuery(event.target.value)} />
      </label>
    </div>
    <label className={styles.scenario}>Keadaan halaman (pratinjau)
      <select value={view.scenario} onChange={(event) => view.setScenario(scenarios.find(([value]) => value === event.target.value)?.[0] ?? 'normal')}>{scenarios.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
    </label>

    {loading && <>
      <p role="status" className={styles.loading}>Memuat refleksi {first}…</p>
      <div className={styles.skeleton} aria-hidden="true"><span /><span /><span /></div>
    </>}
    {view.scenario === 'error' && <div className={styles.error}>
      <Feedback tone="danger" title="Refleksi belum bisa dimuat" announce>Coba lagi sebentar lagi. Ini hanya contoh kegagalan di pratinjau.</Feedback>
      <Button tone="secondary" onClick={view.retry}>Coba lagi</Button>
    </div>}
    {shown && view.total === 0 && <p className={styles.none}>Belum ada refleksi yang dirilis untuk {first}.</p>}
    {noMatch && <div className={styles.error}>
      <Feedback title="Tidak ada refleksi yang cocok" announce>Coba kata lain, misalnya judul misi.</Feedback>
      <Button tone="secondary" onClick={() => view.setQuery('')}>Hapus pencarian</Button>
    </div>}
    {shown && view.items.length > 0 && <div className={styles.region} role="region" aria-label="Daftar refleksi (dapat digulir)" tabIndex={0}>
      <table>
        <caption className={styles.hidden}>Refleksi {first} yang sudah dirilis</caption>
        <thead><tr><th scope="col">Tanggal</th><th scope="col">Misi</th><th scope="col">Ringkasan</th><th scope="col"><span className={styles.hidden}>Baca</span></th></tr></thead>
        <tbody>{view.items.map((item) => <tr key={item.id}>
          <td data-label="Tanggal">{item.date}</td>
          <th scope="row"><strong>{item.title}</strong><small>{item.subject}</small></th>
          <td data-label="Ringkasan" className={styles.excerpt}>{item.excerpt}</td>
          <td className={styles.action}><Link to={reflectionPath(item.id)} aria-label={`Baca refleksi: ${item.title}`}>Baca<Icon name="chevronRight" size={14} /></Link></td>
        </tr>)}</tbody>
      </table>
    </div>}
  </div>
}

import { useCallback } from 'react'
import { Link } from 'react-router'
import type { TeacherService } from '@/domain/services/TeacherService'
import { Loading } from '@/ui/components/loading/Loading'
import { noPollMs, useLiveResource } from '@/ui/pages/live/useLiveResource'
import styles from '@/ui/pages/teacher/MisconceptionTrail.styles'

// Jejak Perbaikan (step 5): who stopped showing a misconception between two missions. Counted by the database; separate from
// the "Berubah pikiran" column, which only covers one session. A card that cannot load never disturbs the map.
export function MisconceptionTrailCard({ service, publicationId, base }: { service: TeacherService; publicationId: string; base: string }) {
  const read = useCallback((signal: AbortSignal) => service.misconceptionTrail(publicationId, signal), [service, publicationId])
  const { data, error } = useLiveResource(read, noPollMs)
  if (error) return null
  if (!data) return <section className={styles.card} aria-busy="true"><Loading label="Memuat jejak perbaikan…" /></section>
  const { to, from } = data
  return <section className={styles.card} aria-labelledby="trail-title">
    <h2 id="trail-title">Jejak perbaikan sejak misi sebelumnya</h2>
    {!from ? <p className={styles.lead}>Belum ada misi sebelumnya dengan konsep yang sama untuk kelas ini. <Link className={styles.link} to={`${base}/missions/new`} state={{ followUpOf: to.publication_id }}>Buat misi lanjutan</Link> agar perubahan antar misi bisa terlihat.</p> : <>
      <p className={styles.lead}>Dibandingkan dengan “{from.mission_title}” (versi {from.mission_version}, {from.denominator} siswa dihitung). Ini membandingkan dua misi, berbeda dari kolom “Berubah pikiran” yang hanya melihat satu sesi.</p>
      {data.items.length === 0 && data.not_retested.length === 0 && <p className={styles.lead}>Tidak ada siswa yang memegang miskonsepsi pada misi sebelumnya.</p>}
      <ul className={styles.items}>{data.items.map((item) => <li key={item.misconception_id} className={styles.item}>
        <strong>“{item.statement}” · {item.concept_name}</strong>
        <p className={styles.sentence}>Dari {item.held_count} siswa yang memegangnya di “{from.mission_title}”, {item.resolved_count} tidak lagi menunjukkannya di “{to.mission_title}”.</p>
        <span className={styles.bar} aria-hidden="true"><span style={{ flexGrow: item.resolved_count }} /><span style={{ flexGrow: item.still_held_count }} /><span style={{ flexGrow: item.not_observed_count }} /></span>
        <p className={styles.detail}>
          {item.resolved_count} tidak lagi menunjukkannya{item.resolved_count > 0 && ` (${item.resolved_breakdown.mastered} paham, ${item.resolved_breakdown.developing} berkembang, ${item.resolved_breakdown.other_misconception} miskonsepsi lain)`} · {item.still_held_count} masih menunjukkannya · {item.not_observed_count} belum teramati
        </p>
        {item.students_still_holding.length > 0 && <ul className={styles.chips} aria-label="Siswa yang masih menunjukkannya">{item.students_still_holding.map((holder) => <li key={holder.session_id}><Link to={`${base}/publications/${to.publication_id}/sessions/${holder.session_id}`}>{holder.name}</Link></li>)}</ul>}
      </li>)}</ul>
      {data.not_retested.length > 0 && <div className={styles.invite}>
        <b>Tidak diuji ulang di misi ini</b>
        <ul>{data.not_retested.map((item) => <li key={item.misconception_id}>“{item.statement}” ({item.held_count} siswa memegangnya sebelumnya)</li>)}</ul>
        Sertakan di misi berikutnya agar perubahannya bisa dilihat. <Link className={styles.link} to={`${base}/missions/new`} state={{ followUpOf: to.publication_id }}>Buat misi lanjutan</Link>
      </div>}
      <p className={styles.note}>“Tidak lagi menunjukkan” berarti miskonsepsi itu tidak muncul di misi ini, bukan jaminan siswa sudah paham. Belum teramati tidak dihitung sebagai perbaikan.</p>
    </>}
  </section>
}

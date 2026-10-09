import { useCallback } from 'react'
import type { ReactNode } from 'react'
import type { SchoolAdminUseCases } from '@/application/school-admin-use-cases'
import { rosterImportEnded } from '@/domain/model/SchoolAdmin'
import type { RosterImport } from '@/domain/model/SchoolAdmin'
import { ButtonLink } from '@/ui/components/button/ButtonLink'
import { Nala } from '@/ui/components/nala/Nala'
import type { NalaMood } from '@/ui/components/nala/Nala'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { useLiveResource } from '@/ui/pages/live/useLiveResource'
import styles from '@/ui/pages/school-admin/ImportFlow.styles'
import { ErrorsDownload } from './ImportHistory'
import { ImportSteps } from './ImportSteps'

const importPollMs = (item: RosterImport | null) => item && rosterImportEnded(item) ? null : 3000

// Nala is the one companion in this view: she reads while Nalar checks, then reacts to how the import ended.
function Verdict({ mood, title, children, actions }: { mood: NalaMood; title: string; children: ReactNode; actions?: ReactNode }) {
  return <div className={styles.verdict}>
    <span className={styles.halo}><Nala mood={mood} size={96} animate /></span>
    <div className="min-w-0">
      <h2 id="import-result" className={styles.verdictTitle}>{title}</h2>
      {children}
      {actions && <div className={styles.verdictActions}>{actions}</div>}
    </div>
  </div>
}

// Follows one import until the backend has checked and saved every row.
export function ImportResult({ service, importId, base }: { service: SchoolAdminUseCases; importId: string; base: string }) {
  const read = useCallback((signal: AbortSignal) => service.rosterImport(importId, signal), [service, importId])
  const { data, error, online, refresh } = useLiveResource(read, importPollMs)
  if (!data) return <><ImportSteps at={1} /><LiveFeedback error={error} online={online} refresh={refresh} loading={!error} /></>
  if (!rosterImportEnded(data)) return <>
    <ImportSteps at={1} />
    <section className={styles.panel} aria-labelledby="import-result">
      <Verdict mood="read" title="Memeriksa berkas Anda"><p role="status" className={styles.verdictText}>Nalar membaca dan menyimpan baris satu per satu. Halaman ini memperbarui sendiri, dan hasilnya juga tersimpan di riwayat impor.</p></Verdict>
    </section>
  </>

  const saved = data.rows_succeeded ?? 0
  const failed = data.rows_failed ?? data.errors.length
  const unusable = data.status === 'failed'
  const [mood, title, text]: readonly [NalaMood, string, string] = unusable
    ? ['oops', 'Impor tidak berhasil', 'Berkas belum bisa diproses. Periksa masalah di bawah, perbaiki berkas, lalu unggah lagi.']
    : failed > 0
      ? ['calm', 'Impor selesai, sebagian perlu diperbaiki', `${saved} baris sudah tersimpan. ${failed} baris belum masuk: perbaiki di berkas, lalu unggah lagi.`]
      : ['proud', 'Impor selesai', `${saved} baris berhasil disimpan. Berikutnya, kirim undangan agar mereka bisa masuk.`]
  return <>
    <ImportSteps at={2} />
    <section className={styles.panel} aria-labelledby="import-result">
      <Verdict mood={mood} title={title} actions={<>
        {saved > 0 && <ButtonLink to={base}>Kirim undangan ke akun baru</ButtonLink>}
        {failed > 0 && <ErrorsDownload service={service} importId={importId} />}
        <ButtonLink to={`${base}/import`} tone="ghost">Kembali ke riwayat impor</ButtonLink>
      </>}><p className={styles.verdictText}>{text}</p></Verdict>
      <dl className={styles.counts}>
        <div className={styles.count}><dt className={styles.countLabel}>Baris di berkas</dt><dd className={styles.countValue}>{data.rows_total ?? '-'}</dd></div>
        <div className={styles.count}><dt className={styles.countLabel}>Berhasil disimpan</dt><dd className={styles.countValue} data-tone="success">{saved}</dd></div>
        <div className={styles.count}><dt className={styles.countLabel}>Perlu diperbaiki</dt><dd className={styles.countValue} data-tone={failed > 0 ? 'danger' : undefined}>{failed}</dd></div>
      </dl>
      {data.errors.length > 0 && <div className={styles.errors}>
        <h3 className={styles.errorsTitle}>Baris yang perlu diperbaiki</h3>
        <div className={styles.region} role="region" aria-label="Baris yang perlu diperbaiki" tabIndex={0}><table className={styles.table}>
          <thead className={styles.thead}><tr><th scope="col" className={styles.th}>Baris</th><th scope="col" className={styles.th}>Kolom</th><th scope="col" className={styles.th}>Masalah</th></tr></thead>
          <tbody>{data.errors.map((item) => <tr key={`${item.row_number}-${item.field}`} className={styles.errRow}>
            <td className={`${styles.errCell} ${styles.errRowNumber}`}>{item.row_number}</td>
            <td className={`${styles.errCell} ${styles.errField}`}><code className={styles.code}>{item.field}</code></td>
            <td className={`${styles.errCell} ${styles.errMessage}`}>{item.message}</td>
          </tr>)}</tbody>
        </table></div>
      </div>}
    </section>
  </>
}

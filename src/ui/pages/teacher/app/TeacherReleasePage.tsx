import { useCallback, useRef, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router'
import { ApiError } from '@/domain/model/ApiError'
import type { TeacherPublication } from '@/domain/model/Teacher'
import type { TeacherService } from '@/domain/services/TeacherService'
import { Button } from '@/ui/components/button/Button'
import { Dialog } from '@/ui/components/dialog/Dialog'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Icon } from '@/ui/components/icon/Icon'
import { NalaIcon } from '@/ui/components/nala/NalaIcon'
import { formatDayTime } from '@/ui/formatInstant'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { useCommandSignal, useLiveResource } from '@/ui/pages/live/useLiveResource'
import liveStyles from '@/ui/pages/live/Live.module.css'
import styles from '@/ui/pages/teacher/TeacherRelease.module.css'
import { Loading } from '@/ui/components/loading/Loading'

// Summaries are written in the background after the last evaluation, so readiness can change while the page is open.
const previewPollMs = (preview: { released_at: string | null } | null) => preview?.released_at ? null : 15_000
const blockerText: Readonly<Record<string, (count: number) => string>> = {
  RUN_OPEN: () => 'Sesi masih terbuka. Tutup penerimaan lebih dulu.',
  SESSION_ACTIVE: (count) => `${count} siswa masih mengerjakan.`,
  EVALUATION_PENDING: (count) => `${count} sesi belum selesai dinilai.`,
  SUMMARIES_PENDING: (count) => `${count} ringkasan sedang disiapkan.`,
  NO_ELIGIBLE_RESULT: () => 'Belum ada hasil yang bisa dirilis.',
}

export function TeacherReleasePage({ service, base }: { service: TeacherService; base: string }) {
  const { publicationId = '' } = useParams()
  const location = useLocation()
  const known = location.state?.publication as TeacherPublication | undefined
  const subtitle = known?.id === publicationId ? `${known.class_name} · ${known.mission_title}` : 'Hasil kelas'
  const read = useCallback((signal: AbortSignal) => service.releasePreview(publicationId, signal), [service, publicationId])
  const { data, error, online, refresh } = useLiveResource(read, previewPollMs)
  const commandSignal = useCommandSignal()
  const busy = useRef(false)
  const [selected, setSelected] = useState<string | null>(null)
  const [confirming, setConfirming] = useState(false)
  const [pending, setPending] = useState(false)
  const [failure, setFailure] = useState<ApiError | null>(null)
  const released = data?.released_at ?? null
  const shown = data?.summaries.find((item) => item.student_id === selected) ?? data?.summaries[0]

  async function release() {
    if (busy.current || !data) return
    busy.current = true; setPending(true); setFailure(null)
    const signal = commandSignal()
    try {
      // The count the teacher saw goes with the request; the backend refuses if it changed meanwhile.
      await service.release(publicationId, data.eligible_count, signal)
      if (!signal?.aborted) setConfirming(false)
    } catch (cause) {
      if (!signal?.aborted) { setFailure(cause instanceof ApiError ? cause : new ApiError(0, 'UNAVAILABLE')); setConfirming(false) }
    } finally { busy.current = false; if (!signal?.aborted) { setPending(false); refresh() } }
  }

  return <div className={styles.content}>
    <Link className={styles.back} to={`${base}/publications/${publicationId}/class-map`} state={location.state}><Icon name="chevronLeft" size={14} />Peta miskonsepsi</Link>
    <div className={styles.header}>
      <div><h1>Rilis ke orang tua</h1><p>{subtitle}</p></div>
      {data && <Button disabled={!data.ready || released !== null} tone={released ? 'secondary' : 'primary'} onClick={() => setConfirming(true)}><Icon name={released ? 'check' : 'send'} size={14} />{released ? 'Sudah dirilis' : `Rilis ${data.eligible_count} ringkasan`}</Button>}
    </div>
    <LiveFeedback error={error} online={online} refresh={refresh} />
    {!data && !error && <Loading label="Memuat pratinjau rilis…" />}
    {failure && (failure.code === 'RELEASE_NOT_READY'
      ? <Feedback tone="warning" title="Rilis belum bisa dilakukan" announce>Data berubah sejak pratinjau dibuka. Periksa daftar terbaru di bawah, lalu coba lagi.</Feedback>
      : <LiveFeedback error={failure} online={online} refresh={refresh} />)}
    {data && <>
      <p role="status" className={styles.banner} data-released={released !== null}><NalaIcon name="info" />{released ? `Dirilis ${formatDayTime(released)}. Ringkasan sudah dikunci dan dapat dilihat orang tua.` : 'Orang tua belum melihat apa pun dari misi ini. Ringkasan dikunci saat Anda merilis.'}</p>
      {!released && data.blockers.length > 0 && <Feedback tone="warning" title="Belum siap dirilis">
        <ul>{data.blockers.map((blocker) => <li key={blocker.code}>{blockerText[blocker.code]?.(blocker.count) ?? `${blocker.code} (${blocker.count})`}</li>)}</ul>
      </Feedback>}

      <div className={styles.grid}>
        <section className={styles.table} aria-labelledby="release-students">
          <h2 id="release-students">Ringkasan siap <span>{data.summaries.length}</span></h2>
          {data.ineligible_count > 0 && <p>{data.ineligible_count} siswa belum selesai atau belum dinilai, dan tidak ikut dirilis.</p>}
          <div className={styles.region} role="region" aria-label="Ringkasan per siswa (dapat digulir)" tabIndex={0}>
            <table>
              <caption>Ringkasan untuk orang tua per siswa</caption>
              <thead><tr><th scope="col">SISWA</th><th scope="col">STATUS</th></tr></thead>
              <tbody>{data.summaries.map((row) => <tr key={row.student_id} data-selected={shown?.student_id === row.student_id}>
                <th scope="row"><button type="button" aria-pressed={shown?.student_id === row.student_id} onClick={() => setSelected(row.student_id)}>{row.name}</button></th>
                <td><span data-ready="true">{released ? 'Dirilis' : 'Siap'}</span></td>
              </tr>)}</tbody>
            </table>
          </div>
        </section>
        <aside className={styles.preview} aria-labelledby="release-preview">
          <h2 id="release-preview">PRATINJAU YANG DILIHAT ORANG TUA</h2>
          <div aria-live="polite">{shown
            ? <><div className={styles.who}><span aria-hidden="true">{shown.name.trim().charAt(0).toLocaleUpperCase('id-ID')}</span><div><strong>{shown.name}</strong></div></div><p>{shown.summary_text}</p></>
            : <p>Belum ada ringkasan untuk ditampilkan.</p>}</div>
          <p className={styles.lock}><NalaIcon name="lock" />Tanpa skor dan catatan verifikasi · dikunci saat dirilis</p>
        </aside>
      </div>

      <Dialog open={confirming} title={`Rilis ${data.eligible_count} ringkasan?`} description="Orang tua yang tertaut langsung dapat melihat ringkasan dan refleksi anaknya. Ringkasan tidak dapat diubah setelah dirilis." onClose={() => { if (!pending) setConfirming(false) }} dismissible={!pending}>
        <div className={liveStyles.actions}><Button tone="secondary" disabled={pending} onClick={() => setConfirming(false)}>Batal</Button><Button pending={pending} pendingLabel="Merilis…" onClick={() => { void release() }}>Rilis sekarang</Button></div>
      </Dialog>
    </>}
  </div>
}

import { useCallback, useRef, useState } from 'react'
import { TeacherPageHead } from '@/ui/components/teacher-shell/TeacherPageHead'
import { Link, useLocation, useParams } from 'react-router'
import { ApiError } from '@/domain/model/ApiError'
import type { TeacherPublication } from '@/domain/model/Teacher'
import type { TeacherService } from '@/domain/services/TeacherService'
import { Button } from '@/ui/components/button/Button'
import { Dialog } from '@/ui/components/dialog/Dialog'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Icon } from '@/ui/components/icon/Icon'
import { Nala } from '@/ui/components/nala/Nala'
import { NalaIcon } from '@/ui/components/nala/NalaIcon'
import { formatDayTime } from '@/ui/formatInstant'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { useCommandSignal, useLiveResource } from '@/ui/pages/live/useLiveResource'
import liveStyles from '@/ui/pages/live/Live.styles'
import styles from '@/ui/pages/teacher/TeacherRelease.styles'
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
    <TeacherPageHead crumb={<><Link to={`${base}/publications/${publicationId}/class-map`} state={location.state}>Peta kelas</Link><Icon name="chevronRight" size={14} /></>} title="Rilis ke orang tua" subtitle={subtitle} />
    <LiveFeedback error={error} online={online} refresh={refresh} />
    {!data && !error && <Loading label="Memuat pratinjau rilis…" />}
    {failure && (failure.code === 'RELEASE_NOT_READY'
      ? <Feedback tone="warning" title="Rilis belum bisa dilakukan" announce>Data berubah sejak pratinjau dibuka. Periksa daftar terbaru di bawah, lalu coba lagi.</Feedback>
      : <LiveFeedback error={failure} online={online} refresh={refresh} />)}
    {data && <>
      <div className={styles.grid}>
        <div className={styles.rail}>
          <section className={styles.card} aria-labelledby="release-ready">
            <h2 id="release-ready">Kesiapan rilis</h2>
            <p role="status" className={styles.check} data-released={released !== null}><span aria-hidden="true"><Icon name="check" size={14} /></span>{released ? `Dirilis ${formatDayTime(released)}. Ringkasan sudah dikunci.` : 'Orang tua belum melihat apa pun dari misi ini.'}</p>
            {!released && data.blockers.length === 0 && <p className={styles.check}><span aria-hidden="true"><Icon name="check" size={14} /></span>Semua ringkasan sudah dinilai</p>}
            {!released && data.blockers.length > 0 && <Feedback tone="warning" title="Belum siap dirilis">
              <ul>{data.blockers.map((blocker) => <li key={blocker.code}>{blockerText[blocker.code]?.(blocker.count) ?? `${blocker.code} (${blocker.count})`}</li>)}</ul>
            </Feedback>}
            {data.ineligible_count > 0 && <p className={styles.note}>{data.ineligible_count} siswa belum selesai atau belum dinilai, dan tidak ikut dirilis.</p>}
          </section>
          <section className={styles.release} aria-label="Rilis">
            <p><strong>{data.eligible_count}</strong>ringkasan siap</p>
            <p>Setelah dirilis, ringkasan dibekukan dan langsung terlihat oleh orang tua yang terhubung. Skor dan catatan verifikasi tidak ikut terkirim.</p>
            <Button disabled={!data.ready || released !== null} onClick={() => setConfirming(true)}><Icon name={released ? 'check' : 'send'} size={16} />{released ? 'Sudah dirilis' : `Rilis ${data.eligible_count} ringkasan`}</Button>
          </section>
        </div>
        <section className={styles.main} aria-labelledby="release-students">
          <div className={styles.list}>
            <h2 id="release-students">Pratinjau per siswa <span>{data.summaries.length}</span></h2>
            <ul>{data.summaries.map((row) => <li key={row.student_id}><button type="button" aria-pressed={shown?.student_id === row.student_id} onClick={() => setSelected(row.student_id)}>{row.name}<span>{released ? 'Dirilis' : 'Siap'}</span></button></li>)}</ul>
          </div>
          <div className={styles.preview} aria-live="polite">
            <div className={styles.who}><Nala mood="read" size={40} head /><div><span>Yang dilihat orang tua</span><strong>{shown ? `Ringkasan ${shown.name}` : 'Belum ada ringkasan'}</strong></div></div>
            <p>{shown ? shown.summary_text : 'Belum ada ringkasan untuk ditampilkan.'}</p>
            <p className={styles.lock}><NalaIcon name="lock" />Tanpa skor dan catatan verifikasi · dikunci saat dirilis</p>
          </div>
        </section>
      </div>

      <Dialog open={confirming} title={`Rilis ${data.eligible_count} ringkasan?`} description="Orang tua yang tertaut langsung dapat melihat ringkasan dan refleksi anaknya. Ringkasan tidak dapat diubah setelah dirilis." onClose={() => { if (!pending) setConfirming(false) }} dismissible={!pending}>
        <div className={liveStyles.actions}><Button tone="secondary" disabled={pending} onClick={() => setConfirming(false)}>Batal</Button><Button pending={pending} pendingLabel="Merilis…" onClick={() => { void release() }}>Rilis sekarang</Button></div>
      </Dialog>
    </>}
  </div>
}

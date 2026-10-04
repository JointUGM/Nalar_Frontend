import { useRef } from 'react'
import type { CSSProperties } from 'react'
import { Icon } from '@/ui/components/icon/Icon'
import { FINISHED, JOIN_CODE, JOINED, SEATS, TOTAL_PROMPTS } from '@/ui/pages/landing/landingContent'
import type { Seat } from '@/ui/pages/landing/landingContent'
import { useInViewOnce, usePrefersReducedMotion } from '@/ui/pages/landing/useLandingMotion'
import { LIVE_TICKS, useProjectorSequence } from '@/ui/pages/landing/useProjectorSequence'
import shared from '@/ui/pages/landing/Landing.module.css'
import styles from './ProjectorSection.module.css'

type SeatState = 'empty' | 'waiting' | 'active' | 'done'

function seatView(seat: Seat, joined: number, live: boolean, tick: number): { state: SeatState; prompt: number } {
  if (seat.joins === null || seat.joins >= joined) return { state: 'empty', prompt: 0 }
  if (!live) return { state: 'waiting', prompt: 0 }
  const prompt = Math.max(1, Math.ceil((tick / LIVE_TICKS) * seat.reached))
  return { state: tick === LIVE_TICKS && seat.reached === TOTAL_PROMPTS ? 'done' : 'active', prompt }
}

function Projector() {
  const ref = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()
  const inView = useInViewOnce(ref, '0px 0px -25% 0px')
  const { phase, joined, tick, replay } = useProjectorSequence(inView, reduced)
  const live = phase === 'live' || phase === 'settled'
  const views = SEATS.map((seat) => seatView(seat, joined, live, tick))
  const done = views.filter((view) => view.state === 'done').length
  const answering = views.filter((view) => view.state === 'active').length

  return <figure ref={ref} className={styles.projector} data-phase={phase}>
    <div className={styles.screen}>
      <p className="sr-only">
        Contoh layar proyektor guru: {JOINED} siswa bergabung dengan kode {JOIN_CODE.split('').join(' ')}, guru menekan Mulai sesi,
        lalu layar menampilkan pertanyaan yang sedang dijawab tiap siswa. Akhirnya {FINISHED} siswa selesai dan sisanya masih menjawab.
      </p>
      <div className={styles.bar} aria-hidden="true">
        <p className={styles.mission}><span>VIII B</span>Kenapa kelereng berhenti?</p>
        <p className={styles.status}>
          <span className={styles.statusLobby}>Mulai sesi</span>
          <span className={styles.statusLive}><span className={styles.liveDot} />Sesi berjalan</span>
        </p>
      </div>

      <div className={styles.stage} aria-hidden="true">
        <div className={styles.join}>
          <p className={styles.joinHint}>Buka nalar, lalu ketik kode ini</p>
          <p className={styles.code}>{JOIN_CODE.split('').map((char, index) => <span key={index} style={{ '--i': index } as CSSProperties}>{char}</span>)}</p>
        </div>
        <div className={styles.summary}>
          <p className={styles.summaryTitle}>Penerimaan ditutup. Siswa yang sudah masuk tetap menyelesaikan sesinya.</p>
          <dl className={styles.tally}>
            <div><dt>selesai</dt><dd>{done}</dd></div>
            <div><dt>sedang menjawab</dt><dd>{answering}</dd></div>
          </dl>
        </div>
      </div>

      <ol className={styles.seats} aria-hidden="true">
        {SEATS.map((seat, index) => {
          const view = views[index]
          return <li key={seat.initials + index} className={styles.seat} data-state={view.state}>
            <span className={styles.initials}>{seat.joins === null ? '' : seat.initials}</span>
            <span className={styles.pips}>
              {Array.from({ length: TOTAL_PROMPTS }, (_, step) => <span key={step} data-on={step < view.prompt} />)}
            </span>
          </li>
        })}
      </ol>

      <div className={styles.foot}>
        <p aria-hidden="true">{live ? `${JOINED} siswa di sesi ini` : `${joined} siswa menunggu`}</p>
        {!reduced && <button type="button" className={styles.replay} onClick={replay} disabled={phase !== 'settled'}>
          <Icon name="refresh" size={16} />Putar ulang
        </button>}
      </div>
    </div>
    <figcaption className={styles.caption}>Contoh layar proyektor guru. Kode, kelas, dan inisial siswa fiktif.</figcaption>
  </figure>
}

export function ProjectorSection() {
  return <section id="kelas" className={styles.hero} aria-labelledby="kelas-title">
    <div className={shared.wrap}>
      <div className={styles.grid} data-reveal>
        <h2 id="kelas-title" className={`${shared.h2} ${styles.title}`}>Satu kode di proyektor. Seluruh kelas mulai bersama.</h2>
        <div className={styles.aside} data-reveal>
          <p className={styles.lead}>Guru membuka lobi, siswa masuk dengan kode enam huruf, lalu sesi dimulai serentak. Satu jam pelajaran cukup untuk seluruh kelas.</p>
        </div>
        <Projector />
      </div>
    </div>
  </section>
}

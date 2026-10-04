import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { Link } from 'react-router'
import { Icon } from '@/ui/components/icon/Icon'
import { Nala } from '@/ui/components/nala/Nala'
import { CLASS_TOTAL, HERO_LINES, HERO_SCENES, MISCONCEPTIONS, TOTAL_PROMPTS } from '@/ui/pages/landing/landingContent'
import { usePrefersReducedMotion } from '@/ui/pages/landing/useLandingMotion'
import shared from '@/ui/pages/landing/Landing.module.css'
import styles from './NalaHero.module.css'

const lead = MISCONCEPTIONS[0]
const lastScene = HERO_SCENES.length - 1

/** Plays while the stage is on screen and the tab is visible. */
function useOnScreen(ref: RefObject<HTMLElement | null>): boolean {
  const [visible, setVisible] = useState(true)
  const [tabVisible, setTabVisible] = useState(true)
  useEffect(() => {
    const element = ref.current
    if (!element || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(([entry]) => setVisible(Boolean(entry?.isIntersecting)), { threshold: 0.15 })
    observer.observe(element)
    const onVisibility = () => setTabVisible(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', onVisibility)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', onVisibility) }
  }, [ref])
  return visible && tabVisible
}

/** Layers drift toward the pointer by their depth, eased every frame without touching React state. */
function useParallax(ref: RefObject<HTMLElement | null>, enabled: boolean) {
  useEffect(() => {
    const stage = ref.current
    if (!stage || !enabled || typeof window.matchMedia !== 'function' || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const layers = [...stage.querySelectorAll<HTMLElement>('[data-depth]')].map((element) => ({ element, depth: Number(element.dataset.depth) }))
    const target = { x: 0, y: 0 }
    const current = { x: 0, y: 0 }
    let frame = 0
    const tick = () => {
      current.x += (target.x - current.x) * 0.08
      current.y += (target.y - current.y) * 0.08
      for (const { element, depth } of layers) element.style.transform = `translate3d(${(current.x * depth).toFixed(2)}px, ${(current.y * depth).toFixed(2)}px, 0)`
      // The parallax offset is opposite to the pointer, so the pupils look along its negation.
      stage.style.setProperty('--gaze-x', `${(-current.x / 3).toFixed(2)}px`)
      stage.style.setProperty('--gaze-y', `${(-current.y / 3).toFixed(2)}px`)
      frame = Math.abs(target.x - current.x) + Math.abs(target.y - current.y) > 0.05 ? requestAnimationFrame(tick) : 0
    }
    const onMove = (event: PointerEvent) => {
      const box = stage.getBoundingClientRect()
      target.x = ((event.clientX - box.left) / box.width - 0.5) * -18
      target.y = ((event.clientY - box.top) / box.height - 0.5) * -12
      if (!frame) frame = requestAnimationFrame(tick)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(frame)
      for (const { element } of layers) element.style.transform = ''
      stage.style.removeProperty('--gaze-x')
      stage.style.removeProperty('--gaze-y')
    }
  }, [ref, enabled])
}

function NalaStage() {
  const stage = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()
  const onScreen = useOnScreen(stage)
  const [paused, setPaused] = useState(false)
  const [index, setIndex] = useState(0)
  const playing = onScreen && !paused && !reduced
  useParallax(stage, !reduced)

  useEffect(() => {
    if (!playing) return
    const timer = window.setTimeout(() => setIndex((value) => (value + 1) % HERO_SCENES.length), HERO_SCENES[index].ms)
    return () => window.clearTimeout(timer)
  }, [playing, index])

  const current = HERO_SCENES[reduced ? lastScene : index]
  return <figure className={styles.figure} aria-label="Animasi: Nala menyapa, mengajukan pertanyaan pembanding, siswa menjawab dengan kata-katanya sendiri, lalu guru melihat bukti dan jumlah siswa di kelas.">
    <div ref={stage} className={styles.stage} data-scene={current.scene} data-paused={!playing} aria-hidden="true">
      <div className={styles.layer} data-depth="0.45">
        {/* The NALAR mark drawn as a doorway: Nala stands in it on a warm floor, the Kunyit dot above her head. */}
        <svg className={styles.arch} viewBox="0 0 360 440" preserveAspectRatio="xMidYMax meet">
          <ellipse className={styles.floor} cx="180" cy="372" rx="168" ry="26" />
          <path className={styles.archEcho} d="M8 372V190a172 172 0 0 1 344 0V372" pathLength="100" />
          <path className={styles.archPath} d="M34 372V200a146 146 0 0 1 292 0V372" pathLength="100" />
          <circle className={styles.sun} cx="180" cy="118" r="20" />
        </svg>
      </div>

      <div className={styles.layer} data-depth="0.7">
        <div className={styles.nala}>
          <span className={styles.thinking}><span /><span /><span /></span>
          <Nala mood={current.mood} size={240} animate={!reduced} />
        </div>
      </div>

      <div className={styles.layer} data-depth="1.1">
        <div className={styles.ask}>
          <div className={styles.askHead}>
            <span className={styles.who}><Nala mood="ask" size={28} head />Nala</span>
            <span className={styles.progress}>
              {Array.from({ length: TOTAL_PROMPTS }, (_, step) => <i key={step} data-on={step < 2} />)}
              <b>Pertanyaan 2 dari {TOTAL_PROMPTS}</b>
            </span>
          </div>
          <div className={styles.lines}>
            <p className={styles.greeting}>{HERO_LINES.greeting}</p>
            <p className={styles.probe}>{HERO_LINES.probe}</p>
          </div>
        </div>
      </div>

      <div className={styles.layer} data-depth="1.4">
        <div className={styles.answer}>
          <span className={styles.answerWho}>Siswa</span>
          <p>{HERO_LINES.answer}</p>
        </div>
      </div>

      <div className={styles.layer} data-depth="1.25">
        <div className={styles.count}>
          <span className={styles.countNumber}>{lead.count}</span>
          <span><strong>dari {CLASS_TOTAL} siswa</strong>masih berpikir “gaya bisa habis”</span>
        </div>
      </div>

      <div className={styles.layer} data-depth="1.7">
        <div className={styles.evidence}>
          <div className={styles.evidenceHead}><span>Mekanisme</span><b>3<small>/4</small></b></div>
          <p>“<mark>{HERO_LINES.evidence}</mark>”</p>
          <span className={styles.evidenceFoot}>Bukti dari jawaban ke-2, berubah pikiran</span>
        </div>
      </div>
    </div>
    <div className={styles.meta}>
      <figcaption className={styles.caption}>Contoh percakapan dan data fiktif.</figcaption>
      {!reduced && <button type="button" className={styles.pause} aria-pressed={paused} onClick={() => setPaused((value) => !value)}>
        <Icon name={paused ? 'play' : 'pause'} size={14} />{paused ? 'Putar animasi' : 'Jeda animasi'}
      </button>}
    </div>
  </figure>
}

export function NalaHero() {
  return <section id="beranda" className={styles.hero} aria-labelledby="hero-title">
    <div className={`${shared.wrap} ${styles.grid}`}>
      <div className={styles.copy}>
        <h1 id="hero-title" className={styles.title}>Ukur cara siswa <span className={styles.mark}>berpikir</span>, bukan hanya jawabannya.</h1>
        <p className={styles.lead}>Nala tidak pernah memberi jawaban. Ia hanya bertanya: kenapa, bagaimana jika, coba buktikan. Guru mendapat bukti penalaran seluruh kelas.</p>
        <div className={styles.actions}>
          <Link to="/login" className={shared.primary}>Masuk ke NALAR<Icon name="arrow" size={18} /></Link>
          <a href="#cara-kerja" className={styles.ghost}>Lihat cara kerja<Icon name="chevronRight" size={16} /></a>
        </div>
      </div>
      <NalaStage />
    </div>
  </section>
}

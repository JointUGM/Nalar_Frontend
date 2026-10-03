import { useCallback } from 'react'
import type { Ref } from 'react'
import type { LiveService } from '@/domain/services/LiveService'
import type { LiveReflection } from '@/domain/model/Live'
import { ButtonLink } from '@/ui/components/button/ButtonLink'
import { Icon } from '@/ui/components/icon/Icon'
import { Nala } from '@/ui/components/nala/Nala'
import { LiveFeedback } from './LiveFrame'
import { useLiveResource } from './useLiveResource'
import styles from '@/ui/pages/student/SessionFinish.module.css'

const reflectionPollMs = (data: LiveReflection | null) => data ? null : 3000

// The finish screen: no score or verdict, only the student's own warm-up guess and the reflection once it is written.
export function LiveStudentFinish({ service, sessionId, base, ready, heading }: { service: LiveService; sessionId: string; base: string; ready: boolean; heading: Ref<HTMLHeadingElement> }) {
  return <div className={styles.page}>
    <header className={styles.head}>
      <Nala mood="proud" size={150} />
      <span className={styles.done}><Icon name="check" size={14} />Misi selesai</span>
      <h1 ref={heading} tabIndex={-1}>Selesai. Kamu sudah berpikir keras hari ini.</h1>
    </header>
    {ready ? <Reflection service={service} sessionId={sessionId} /> : <p role="status" className={styles.wait}>Menyiapkan refleksimu… Layar ini berganti sendiri.</p>}
    <div className={styles.actions}><ButtonLink tone="ghost" to={base}>Kembali ke Misi saya</ButtonLink></div>
  </div>
}

function Reflection({ service, sessionId }: { service: LiveService; sessionId: string }) {
  const read = useCallback((signal: AbortSignal) => service.reflection(sessionId, signal), [service, sessionId])
  const { data, error, online, refresh } = useLiveResource(read, reflectionPollMs)
  if (!data) return <LiveFeedback error={error} online={online} refresh={refresh} loading={!error} />
  return <div className={styles.cards}>
    {data.opening_guess && <section className={[styles.card, styles.guess].join(' ')} aria-labelledby="finish-guess">
      <h2 id="finish-guess">Tebakan awalmu</h2>
      <p className={styles.pick}>{data.opening_guess.text}</p>
      <p className={styles.caption}>Ini dugaanmu sebelum sesi dimulai.</p>
    </section>}
    <section className={[styles.card, styles.answer].join(' ')} aria-labelledby="finish-reflection">
      <h2 id="finish-reflection">Refleksimu · {data.mission_title}</h2>
      <p className={styles.words}>{data.content}</p>
    </section>
  </div>
}

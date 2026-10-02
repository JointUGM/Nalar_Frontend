import { ButtonLink } from '@/ui/components/button/ButtonLink'
import { Icon } from '@/ui/components/icon/Icon'
import { Nala } from '@/ui/components/nala/Nala'
import { finishExample, homePath, lobbyExample, reflectionPath, warmLetters } from './studentExamples'
import { useSessionFinishViewModel } from './useSessionFinishViewModel'
import styles from './SessionFinish.module.css'

interface SessionFinishProps { missionId: string; steps: number; lastAnswer: string; warmPick: number | null }

export function SessionFinish({ missionId, steps, lastAnswer, warmPick }: SessionFinishProps) {
  const { percent, ready } = useSessionFinishViewModel()
  const guess = warmPick === null ? null : lobbyExample.warmOptions[warmPick]
  return <div className={styles.page}>
    <p className={styles.note}>Pratinjau lokal · jawabanmu tidak dikirim ke mana pun; refleksi di bawah ini contoh tetap, angka perjalanannya juga contoh.</p>
    <header className={styles.head}>
      <Nala mood="proud" size={150} />
      <span className={styles.done}><Icon name="check" size={14} />Misi selesai</span>
      <h1>Selesai. Kamu sudah berpikir keras hari ini.</h1>
    </header>
    <div className={styles.cards}>
      <section className={[styles.card, styles.guess].join(' ')} aria-labelledby="finish-guess">
        <h2 id="finish-guess">Tebakan awalmu</h2>
        {guess === null || warmPick === null
          ? <p className={styles.skipped}>Kamu melewatkan pemanasan tadi.</p>
          : <p className={styles.pick}><span aria-hidden="true">{warmLetters[warmPick]}</span>{guess}</p>}
        <p className={styles.caption}>Sebelum sesi, kamu menebak apa yang terjadi di lantai yang sangat licin.</p>
      </section>
      <section className={[styles.card, styles.answer].join(' ')} aria-labelledby="finish-answer">
        <h2 id="finish-answer">Sekarang kamu bisa menjelaskannya</h2>
        <p className={styles.words}>“{lastAnswer}”</p>
      </section>
      <section className={[styles.card, styles.journey].join(' ')} aria-labelledby="finish-journey">
        <h2 id="finish-journey">Perjalananmu</h2>
        <dl>
          <div><dt>langkah kamu jawab</dt><dd>{steps}</dd></div>
          <div><dt>kali berubah pikiran</dt><dd>{finishExample.shifts}</dd></div>
          <div><dt>menit berpikir</dt><dd>{finishExample.minutes}</dd></div>
        </dl>
      </section>
    </div>
    <div className={styles.actions}>
      {ready
        ? <ButtonLink className={styles.reflection} to={reflectionPath(missionId)}>Lihat refleksimu<Icon name="chevronRight" size={20} /></ButtonLink>
        : <div role="status" className={styles.wait}>Menyiapkan refleksimu…<span aria-hidden="true"><i style={{ inlineSize: `${percent}%` }} /></span></div>}
      <ButtonLink tone="ghost" to={homePath}>Ke beranda</ButtonLink>
    </div>
  </div>
}

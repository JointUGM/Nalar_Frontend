import { Nala, type NalaMood } from '@/ui/components/nala/Nala'
import styles from './NalaLoginMotion.styles'

export function NalaLoginMotion({ mood, message }: { mood: NalaMood; message: string }) {
  return <div className={styles.scene} data-mood={mood}>
    <div className={styles.speech} key={message}>
      <p className={styles.srOnly}>{message}</p>
      <p className={styles.words} aria-hidden="true">{message.split(' ').map((word, index) => <span className={styles.word} key={index} style={{ animationDelay: `${index * 65}ms` }}>{word}{' '}</span>)}</p>
    </div>
    <div className={styles.artwork} aria-hidden="true">
    <svg className={styles.trail} viewBox="0 0 450 360" fill="none">
      <path d="M54 151C-2 47 162 7 288 31C397 49 437 152 398 247C367 324 209 360 88 310" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 9" strokeLinecap="round" />
    </svg>
    <div className={styles.character}><Nala mood={mood} size={340} expressive /></div>

    <svg className={`${styles.object} ${styles.book}`} width="70" height="58" viewBox="0 0 70 58" fill="none">
      <path d="M6 10Q20 5 35 13Q50 5 64 10V47Q49 42 35 50Q21 42 6 47Z" fill="var(--color-accent)" />
      <path d="M10 6Q22 3 35 10Q48 3 60 6V41Q47 38 35 45Q23 38 10 41Z" fill="var(--color-surface)" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M35 10V45M17 16Q24 15 29 18M17 24Q24 23 29 26M17 32Q23 31 27 33M41 18Q48 15 53 16M41 26Q48 23 53 24M41 33Q47 30 53 32" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" />
    </svg>
    <svg className={`${styles.object} ${styles.bulb}`} width="50" height="66" viewBox="0 0 50 66" fill="none">
      <path d="M14 38C3 28 8 9 25 9S47 28 36 38L33 46H17Z" fill="var(--color-warning-bg)" stroke="var(--color-warning-text)" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M21 43V28L16 24M29 43V28L34 24M17 49H33M19 55H31M22 60H28" stroke="var(--color-warning-text)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M25 2V5M3 12L6 14M47 12L44 14" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
    <svg className={`${styles.object} ${styles.pencil}`} width="30" height="88" viewBox="0 0 30 88" fill="none">
      <path d="M6 20H24V65L15 82L6 65Z" fill="var(--color-accent)" stroke="var(--color-ink)" strokeWidth="2" strokeLinejoin="round" />
      <path d="M6 20V10Q6 5 11 5H19Q24 5 24 10V20Z" fill="#E7794A" stroke="var(--color-ink)" strokeWidth="2" />
      <path d="M6 20H24V27H6Z" fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth="2" />
      <path d="M6 65L15 82L24 65L19 68L15 65L11 68Z" fill="#FCEFD2" stroke="var(--color-ink)" strokeWidth="2" strokeLinejoin="round" />
      <path d="M15 32V59M12 77L15 82L18 77" stroke="var(--color-ink)" strokeWidth="2" strokeLinecap="round" />
    </svg>
    <svg className={`${styles.object} ${styles.atom}`} width="60" height="58" viewBox="0 0 60 58" fill="none" stroke="currentColor" strokeWidth="2">
      <ellipse cx="30" cy="29" rx="27" ry="10" transform="rotate(-35 30 29)" />
      <ellipse cx="30" cy="29" rx="27" ry="10" transform="rotate(35 30 29)" />
      <ellipse cx="30" cy="29" rx="10" ry="27" />
      <circle cx="30" cy="29" r="4" fill="var(--color-accent)" stroke="none" />
    </svg>
    <svg className={`${styles.object} ${styles.question}`} width="40" height="52" viewBox="0 0 40 52" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round">
      <path d="M9 15C9 2 32 3 32 15C32 24 21 24 21 33" />
      <circle cx="21" cy="44" r="2.5" fill="currentColor" stroke="none" />
    </svg>
    <svg className={`${styles.object} ${styles.spark}`} width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
      <path d="M14 2L17 11L26 14L17 17L14 26L11 17L2 14L11 11Z" />
    </svg>
    </div>
  </div>
}

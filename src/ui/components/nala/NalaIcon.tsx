import type { CSSProperties } from 'react'
import { iconPaths, type IconName } from '@/ui/components/icon/iconPaths'

// An icon-grade Nala: the supplied mascot simplified to a head that stays readable from 28px (labels) to 44px (tiles).
// The expression carries the feeling; the corner badge (drawn from the shared icon geometry) carries the meaning.
type Eyes = 'open' | 'happy' | 'soft' | 'up' | 'down' | 'wow'
type Brows = 'curious' | 'worried'
type Tone = 'primary' | 'success' | 'accent' | 'danger' | 'muted' | 'misconception'
interface Variant { eyes: Eyes; brows?: Brows; badge: IconName; tone: Tone }

const variants = {
  done: { eyes: 'happy', badge: 'check', tone: 'success' },
  idea: { eyes: 'up', badge: 'idea', tone: 'accent' },
  changed: { eyes: 'wow', badge: 'refresh', tone: 'primary' },
  verify: { eyes: 'open', brows: 'curious', badge: 'search', tone: 'muted' },
  book: { eyes: 'down', badge: 'book', tone: 'accent' },
  file: { eyes: 'down', badge: 'file', tone: 'primary' },
  info: { eyes: 'open', brows: 'curious', badge: 'info', tone: 'primary' },
  lock: { eyes: 'soft', badge: 'lock', tone: 'accent' },
  care: { eyes: 'soft', badge: 'heart', tone: 'danger' },
  send: { eyes: 'happy', badge: 'send', tone: 'success' },
  message: { eyes: 'open', badge: 'message', tone: 'primary' },
  graph: { eyes: 'up', badge: 'graph', tone: 'primary' },
  calendar: { eyes: 'open', badge: 'calendar', tone: 'primary' },
  mail: { eyes: 'happy', badge: 'bell', tone: 'accent' },
  account: { eyes: 'happy', badge: 'users', tone: 'primary' },
  live: { eyes: 'wow', badge: 'monitor', tone: 'primary' },
  alert: { eyes: 'open', brows: 'worried', badge: 'alert', tone: 'misconception' },
  time: { eyes: 'open', badge: 'clock', tone: 'accent' },
} satisfies Record<string, Variant>

export type NalaIconName = keyof typeof variants

const brand = { body: '#2447D1', face: '#FCEFD2', ink: '#15213B', beak: '#E7794A', iris: '#F2B23A' }
const tones: Record<Tone, { fill: string; glyph: string }> = {
  primary: { fill: 'var(--color-primary)', glyph: 'var(--color-surface)' },
  success: { fill: 'var(--color-success-text)', glyph: 'var(--color-surface)' },
  accent: { fill: brand.iris, glyph: brand.ink },
  danger: { fill: 'var(--color-danger-text)', glyph: 'var(--color-surface)' },
  muted: { fill: 'var(--color-text-secondary)', glyph: 'var(--color-surface)' },
  misconception: { fill: 'var(--color-misconception-text)', glyph: 'var(--color-surface)' },
}
const look: Record<'open' | 'up' | 'down' | 'wow', readonly [number, number]> = { open: [0, .3], up: [.4, -1], down: [0, 1.1], wow: [0, 0] }
const head = 'M5 10.5C5 7 7 5.5 9.5 6.5L13 8.2C15 7.6 17 7.6 19 8.2L22.5 6.5C25 5.5 27 7 27 10.5V19C27 25.5 22.5 29 16 29S5 25.5 5 19Z'
const line = { fill: 'none', stroke: brand.ink, strokeWidth: 1.7, strokeLinecap: 'round' as const }

function Eyes({ eyes }: { eyes: Eyes }) {
  if (eyes === 'happy') return <g {...line}><path d="M9.2 16.6Q11.8 13.2 14.4 16.6" /><path d="M17.6 16.6Q20.2 13.2 22.8 16.6" /></g>
  if (eyes === 'soft') return <g {...line}><path d="M9.4 15.4Q11.8 17.8 14.2 15.4" /><path d="M17.8 15.4Q20.2 17.8 22.6 15.4" /></g>
  const [dx, dy] = look[eyes], r = eyes === 'wow' ? 3.9 : 3.5
  return <>{[11.8, 20.2].map((cx) => <g key={cx}>
    <circle cx={cx} cy="15.5" r={r} fill="#FFFFFF" />
    <circle cx={cx + dx} cy={15.5 + dy} r={eyes === 'wow' ? 2.4 : 2.1} fill={brand.ink} />
    <circle cx={cx + dx - .8} cy={15.5 + dy - .8} r=".75" fill="#FFFFFF" />
  </g>)}</>
}

/** Decorative: the adjacent text always says what it means. Set `--nala-ring` on a tinted parent so the badge ring matches it. */
export function NalaIcon({ name, size = 28 }: { name: NalaIconName; size?: number }) {
  const v: Variant = variants[name]
  const tone = tones[v.tone]
  return <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" focusable="false" style={{ display: 'block', flexShrink: 0, overflow: 'visible' }}>
    <path d={head} fill={brand.body} />
    <circle cx="11.8" cy="15.5" r="5" fill={brand.face} />
    <circle cx="20.2" cy="15.5" r="5" fill={brand.face} />
    <Eyes eyes={v.eyes} />
    {v.brows === 'curious' && <g {...line} strokeWidth={1.5}><path d="M9 10.6Q11.8 9.8 14.4 10.5" /><path d="M17.6 9.9Q20.2 8.2 23 9.5" /></g>}
    {v.brows === 'worried' && <g {...line} strokeWidth={1.5}><path d="M9 10.4Q11.8 10.6 14.3 9.3" /><path d="M17.7 9.3Q20.2 10.6 23 10.4" /></g>}
    <path d="M14.6 19.7Q16 19 17.4 19.7Q16.8 21.7 16 22.3Q15.2 21.7 14.6 19.7Z" fill={brand.beak} />
    <circle cx="25" cy="25" r="7.6" style={{ fill: tone.fill, stroke: 'var(--nala-ring, var(--color-surface))', strokeWidth: 1.8 } as CSSProperties} />
    <svg x="19.4" y="19.4" width="11.2" height="11.2" viewBox="0 0 24 24" fill="none" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: tone.glyph }}>{iconPaths[v.badge]}</svg>
  </svg>
}

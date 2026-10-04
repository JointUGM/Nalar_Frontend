import type { CSSProperties } from 'react'
import styles from './Nala.module.css'

export type NalaMood = 'hello' | 'ask' | 'think' | 'wow' | 'proud' | 'calm'

interface Pose { look: readonly [number, number]; beak: 'smile' | 'closed' | 'o'; wl: keyof typeof leftWing; wr: keyof typeof rightWing; brows: readonly [string, string] | null; tilt: number; eyes: 'open' | 'big' | 'happy' | 'soft' }

// Geometry of the six supplied Nala poses. Static by default, because the design guide rules out looping mascot motion
// inside the product, so the wave is drawn at its mid position. `animate` adds the reference motion for the public page:
// parts ease between poses instead of snapping, the body breathes, and the pupils follow `--gaze-x`/`--gaze-y` when set.
const colors = { body: '#2447D1', dark: '#1B38AB', face: '#FCEFD2', belly: '#FFF4DE', eye: '#F2B23A', beak: '#E7794A', mouth: '#D2521F', ink: '#15213B', cheek: '#F4A98A' }
const leftWing = { rest: 0, wave: 150, up: 147, out: 65, hug: -33 }
const rightWing = { rest: 0, up: -147, out: -65, hug: 33, chin: 0 }
const poses: Record<NalaMood, Pose> = {
  hello: { look: [0, 0], beak: 'smile', wl: 'wave', wr: 'rest', brows: null, tilt: 0, eyes: 'open' },
  ask: { look: [4, -3], beak: 'closed', wl: 'rest', wr: 'rest', brows: ['M62 66 Q76 62 90 66', 'M110 62 Q124 53 138 60'], tilt: -7, eyes: 'open' },
  think: { look: [-3, 5], beak: 'closed', wl: 'rest', wr: 'chin', brows: ['M62 68 Q76 61 90 65', 'M110 65 Q124 61 138 68'], tilt: 4, eyes: 'open' },
  wow: { look: [0, 0], beak: 'o', wl: 'out', wr: 'out', brows: ['M62 60 Q76 51 90 59', 'M110 59 Q124 51 138 60'], tilt: 0, eyes: 'big' },
  proud: { look: [0, 0], beak: 'smile', wl: 'up', wr: 'up', brows: null, tilt: 0, eyes: 'happy' },
  calm: { look: [0, 0], beak: 'closed', wl: 'hug', wr: 'hug', brows: null, tilt: 0, eyes: 'soft' },
}
const motion: Record<NalaMood, 'breathe' | 'jump' | null> = { hello: 'breathe', ask: 'breathe', think: 'breathe', wow: 'jump', proud: 'jump', calm: null }
const body = 'M100 58 C84 50 66 40 52 36 C40 33 34 42 34 54 C30 74 28 100 28 126 C28 174 60 204 100 204 C140 204 172 174 172 126 C172 100 170 74 166 54 C166 42 160 33 148 36 C134 40 116 50 100 58 Z'
const wingPath = { left: 'M34 136 C22 146 20 172 30 186 C38 196 52 192 52 176 C52 160 48 142 42 138 C40 136 37 135 34 136 Z', right: 'M166 136 C178 146 180 172 170 186 C162 196 148 192 148 176 C148 160 152 142 158 138 C160 136 163 135 166 136 Z', chin: 'M168 140 C170 156 156 164 134 154 C122 150 120 140 128 138 C142 136 152 134 160 132 C164 131 168 134 168 140 Z' }

// Rotations and offsets are CSS transforms in view-box units, so an animated Nala can ease from one pose to the next.
const turn = (deg: number, x: number, y: number): CSSProperties => ({ transformBox: 'view-box', transformOrigin: `${x}px ${y}px`, transform: `rotate(${deg}deg)` })
const shift = (dx: number, dy: number): CSSProperties => ({ transform: `translate(${dx}px, ${dy}px)` })

function Eye({ cx, pose, animate }: { cx: number; pose: Pose; animate: boolean }) {
  const big = pose.eyes === 'big'
  const [dx, dy] = pose.look
  const part = animate ? styles.part : undefined
  return <>
    <circle cx={cx} cy="98" r="22" fill="#FFFFFF" />
    <g className={animate ? styles.gaze : undefined}>
      <circle cx={cx} cy="98" r={big ? 16 : 14} fill={colors.eye} className={part} style={shift(dx * 0.5, dy * 0.5)} />
      <g className={part} style={shift(dx, dy)}>
        <circle cx={cx} cy="98" r={big ? 11 : 9} fill={colors.ink} />
        <circle cx={cx - 4} cy="94" r="3.5" fill="#FFFFFF" />
      </g>
    </g>
  </>
}

/** The NALAR mascot. Decorative by default (hidden from assistive technology); pass `label` when it carries meaning. */
export function Nala({ mood = 'hello', size = 120, head = false, label, animate = false }: { mood?: NalaMood; size?: number; head?: boolean; label?: string; animate?: boolean }) {
  const pose = poses[mood]
  const stroke = { fill: 'none', stroke: colors.ink, strokeWidth: 6, strokeLinecap: 'round' as const }
  const part = animate ? styles.part : undefined
  const openEyes = pose.eyes === 'open' || pose.eyes === 'big'
  const eyes = pose.eyes === 'happy' ? <g {...stroke}><path d="M60 104 Q76 84 92 104" /><path d="M108 104 Q124 84 140 104" /></g>
    : pose.eyes === 'soft' ? <g {...stroke}><path d="M62 98 Q76 109 90 98" /><path d="M110 98 Q124 109 138 98" /></g>
    : <g><Eye cx={76} pose={pose} animate={animate} /><Eye cx={124} pose={pose} animate={animate} /></g>
  const beak = <path d="M91 115 Q100 110 109 115 Q105 128 100 132 Q95 128 91 115Z" fill={colors.beak} />

  return <svg width={size} height={(head ? size * 126 / 156 : size * 262 / 260).toFixed(1)} viewBox={head ? '22 24 156 126' : '-30 -12 260 262'} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true} style={{ display: 'block', overflow: head ? 'hidden' : 'visible', flexShrink: 0 }}>
    {!head && <ellipse cx="100" cy="212" rx="56" ry="6" fill={colors.ink} opacity="0.08" className={animate && motion[mood] ? styles[`shadow-${motion[mood]}`] : undefined} />}
    {/* A new mood restarts the hop because each mood names its own copy of the keyframes. */}
    <g className={animate ? `${styles.hop} ${styles[`hop-${mood}`]}` : undefined}>
      <g className={animate && motion[mood] ? styles[motion[mood]] : undefined}>
        <g className={part} style={turn(pose.tilt, 100, 130)}>
          <path d={body} fill={colors.body} stroke={colors.body} strokeWidth="6" strokeLinejoin="round" />
          <ellipse cx="100" cy="166" rx="44" ry="34" fill={colors.belly} />
          <path d="M91 182V173a9 9 0 0 1 18 0V182" fill="none" stroke={colors.body} strokeWidth="5" strokeLinecap="round" />
          <circle cx="100" cy="177" r="3" fill={colors.eye} />
          <circle cx="76" cy="98" r="32" fill={colors.face} />
          <circle cx="124" cy="98" r="32" fill={colors.face} />
          <ellipse cx="58" cy="122" rx="9" ry="5.5" fill={colors.cheek} />
          <ellipse cx="142" cy="122" rx="9" ry="5.5" fill={colors.cheek} />
          {/* A changed expression opens like a blink, which hides the swap of eye shapes. */}
          <g key={animate ? pose.eyes : undefined} className={animate ? [styles.eyes, openEyes && styles.blink].filter(Boolean).join(' ') : undefined}>{eyes}</g>
          {pose.brows && <g key={animate ? mood : undefined} {...stroke} strokeWidth={5} className={animate ? styles.brows : undefined}><path d={pose.brows[0]} /><path d={pose.brows[1]} /></g>}
          {pose.beak === 'smile' && <path d="M93 124 Q100 138 107 124Z" fill={colors.mouth} className={animate ? styles.fade : undefined} />}
          {pose.beak === 'o' && <ellipse cx="100" cy="127" rx="8" ry="9" fill={colors.mouth} className={animate ? styles.fade : undefined} />}
          {beak}
          <ellipse cx="84" cy="203" rx="13" ry="6" fill={colors.eye} />
          <ellipse cx="116" cy="203" rx="13" ry="6" fill={colors.eye} />
          {!head && <>
            <g className={part} style={turn(leftWing[pose.wl], 38, 138)}>
              <path d={wingPath.left} fill={colors.dark} stroke={colors.dark} strokeWidth="4" strokeLinejoin="round" className={animate && pose.wl === 'wave' ? styles.wave : undefined} />
            </g>
            <g className={part} style={turn(rightWing[pose.wr], 162, 138)}>
              <path d={pose.wr === 'chin' ? wingPath.chin : wingPath.right} fill={colors.dark} stroke={colors.dark} strokeWidth="4" strokeLinejoin="round" />
            </g>
          </>}
        </g>
      </g>
    </g>
  </svg>
}

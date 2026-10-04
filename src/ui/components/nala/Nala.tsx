import styles from './Nala.module.css'

export type NalaMood = 'hello' | 'ask' | 'think' | 'wow' | 'proud' | 'calm' | 'read' | 'search' | 'oops'

interface Pose { look: readonly [number, number]; beak: 'smile' | 'closed' | 'o'; wl: keyof typeof leftWing; wr: keyof typeof rightWing; brows: readonly [string, string] | null; tilt: number; eyes: 'open' | 'big' | 'happy' | 'soft'; prop?: 'book' | 'lens' | 'sweat'; motion: 'wave' | 'jump' | 'bob' | 'none' }

// Geometry of the six supplied Nala poses plus three teacher-workspace poses drawn from the same parts (read, search, oops).
// The supplied reference loops its bob/jump/wave; the design guide rules out looping mascot motion, so `animate` plays
// the pose's motion once on mount and reduced motion removes it.
const colors = { body: '#2447D1', dark: '#1B38AB', face: '#FCEFD2', belly: '#FFF4DE', eye: '#F2B23A', beak: '#E7794A', mouth: '#D2521F', ink: '#15213B', cheek: '#F4A98A', page: '#FFFFFF', drop: '#9CC3FF' }
const leftWing = { rest: 0, wave: 150, up: 147, out: 65, hug: -33, shrug: 40 }
const rightWing = { rest: 0, up: -147, out: -65, hug: 33, chin: 0, shrug: -40 }
const poses: Record<NalaMood, Pose> = {
  hello: { look: [0, 0], beak: 'smile', wl: 'wave', wr: 'rest', brows: null, tilt: 0, eyes: 'open', motion: 'wave' },
  ask: { look: [4, -3], beak: 'closed', wl: 'rest', wr: 'rest', brows: ['M62 66 Q76 62 90 66', 'M110 62 Q124 53 138 60'], tilt: -7, eyes: 'open', motion: 'bob' },
  think: { look: [-3, 5], beak: 'closed', wl: 'rest', wr: 'chin', brows: ['M62 68 Q76 61 90 65', 'M110 65 Q124 61 138 68'], tilt: 4, eyes: 'open', motion: 'bob' },
  wow: { look: [0, 0], beak: 'o', wl: 'out', wr: 'out', brows: ['M62 60 Q76 51 90 59', 'M110 59 Q124 51 138 60'], tilt: 0, eyes: 'big', motion: 'jump' },
  proud: { look: [0, 0], beak: 'smile', wl: 'up', wr: 'up', brows: null, tilt: 0, eyes: 'happy', motion: 'jump' },
  calm: { look: [0, 0], beak: 'closed', wl: 'hug', wr: 'hug', brows: null, tilt: 0, eyes: 'soft', motion: 'none' },
  read: { look: [0, 7], beak: 'smile', wl: 'hug', wr: 'hug', brows: null, tilt: 0, eyes: 'open', prop: 'book', motion: 'bob' },
  search: { look: [5, -2], beak: 'closed', wl: 'rest', wr: 'rest', brows: ['M62 68 Q76 64 90 68', 'M110 60 Q124 51 138 58'], tilt: -5, eyes: 'open', prop: 'lens', motion: 'bob' },
  oops: { look: [0, 2], beak: 'o', wl: 'shrug', wr: 'shrug', brows: ['M62 68 Q76 64 90 58', 'M110 58 Q124 64 138 68'], tilt: 4, eyes: 'open', prop: 'sweat', motion: 'bob' },
}
const body = 'M100 58 C84 50 66 40 52 36 C40 33 34 42 34 54 C30 74 28 100 28 126 C28 174 60 204 100 204 C140 204 172 174 172 126 C172 100 170 74 166 54 C166 42 160 33 148 36 C134 40 116 50 100 58 Z'
const wingPath = { left: 'M34 136 C22 146 20 172 30 186 C38 196 52 192 52 176 C52 160 48 142 42 138 C40 136 37 135 34 136 Z', right: 'M166 136 C178 146 180 172 170 186 C162 196 148 192 148 176 C148 160 152 142 158 138 C160 136 163 135 166 136 Z', chin: 'M168 140 C170 156 156 164 134 154 C122 150 120 140 128 138 C142 136 152 134 160 132 C164 131 168 134 168 140 Z' }

function Eye({ cx, pose }: { cx: number; pose: Pose }) {
  const big = pose.eyes === 'big'
  const [dx, dy] = pose.look
  return <>
    <circle cx={cx} cy="98" r="22" fill="#FFFFFF" />
    <g data-nala-part="gaze">
      <circle cx={cx + dx * 0.5} cy={98 + dy * 0.5} r={big ? 16 : 14} fill={colors.eye} />
      <circle cx={cx + dx} cy={98 + dy} r={big ? 11 : 9} fill={colors.ink} />
      <circle cx={cx + dx - 4} cy={98 + dy - 4} r="3.5" fill="#FFFFFF" />
    </g>
  </>
}

// An open book held up in front of the belly; the hugging wings sit behind it, so they read as holding it.
const book = <g>
  <path d="M50 142 Q76 134 100 148 Q124 134 150 142 L150 190 Q124 182 100 196 Q76 182 50 190 Z" fill={colors.eye} />
  <path d="M55 138 Q78 131 100 143 L100 189 Q78 177 55 184 Z M100 143 Q122 131 145 138 L145 184 Q122 177 100 189 Z" fill={colors.page} />
  <path d="M65 150 Q78 146 90 152 M65 160 Q78 156 90 162 M65 170 Q74 167 84 171 M110 152 Q122 146 135 150 M110 162 Q122 156 135 160 M110 171 Q122 166 130 169" fill="none" stroke={colors.body} strokeWidth="3" strokeLinecap="round" opacity=".4" />
</g>

/** The NALAR mascot. Decorative by default (hidden from assistive technology); pass `label` when it carries meaning. */
export function Nala({ mood = 'hello', size = 120, head = false, label, animate = false, expressive = false }: { mood?: NalaMood; size?: number; head?: boolean; label?: string; animate?: boolean; expressive?: boolean }) {
  const pose = poses[mood]
  const stroke = { fill: 'none', stroke: colors.ink, strokeWidth: 6, strokeLinecap: 'round' as const }
  const beak = <path d="M91 115 Q100 110 109 115 Q105 128 100 132 Q95 128 91 115Z" fill={colors.beak} />
  const play = (name: string) => animate ? styles[name] : undefined
  return <svg className={play('enter')} width={size} height={(head ? size * 126 / 156 : size * 262 / 260).toFixed(1)} viewBox={head ? '22 24 156 126' : '-30 -12 260 262'} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true} style={{ display: 'block', overflow: head ? 'hidden' : 'visible', flexShrink: 0 }}>
    {!head && <ellipse data-nala-part="shadow" cx="100" cy="212" rx="56" ry="6" fill={colors.ink} opacity="0.08" />}
    <g data-nala-part="body" className={head ? undefined : play(pose.motion)}>
      <g transform={`rotate(${pose.tilt} 100 130)`}>
        <path d={body} fill={colors.body} stroke={colors.body} strokeWidth="6" strokeLinejoin="round" />
        <ellipse cx="100" cy="166" rx="44" ry="34" fill={colors.belly} />
        <path d="M91 182V173a9 9 0 0 1 18 0V182" fill="none" stroke={colors.body} strokeWidth="5" strokeLinecap="round" />
        <circle cx="100" cy="177" r="3" fill={colors.eye} />
        <g data-nala-part="face">
        <circle cx="76" cy="98" r="32" fill={colors.face} />
        <circle cx="124" cy="98" r="32" fill={colors.face} />
        <g data-nala-part="cheeks"><ellipse cx="58" cy="122" rx="9" ry="5.5" fill={colors.cheek} />
        <ellipse cx="142" cy="122" rx="9" ry="5.5" fill={colors.cheek} /></g>
        {pose.eyes === 'happy' ? <g {...stroke}><path d="M60 104 Q76 84 92 104" /><path d="M108 104 Q124 84 140 104" /></g>
          : pose.eyes === 'soft' ? <g {...stroke}><path d="M62 98 Q76 109 90 98" /><path d="M110 98 Q124 109 138 98" /></g>
          : <g data-nala-part="eyes" className={play('blink')}><Eye cx={76} pose={pose} /><Eye cx={124} pose={pose} /></g>}
        {expressive && pose.eyes === 'open' && <g data-nala-part="smile-eyes" {...stroke} strokeWidth={5} opacity="0"><path d="M62 101 Q76 84 90 101" /><path d="M110 101 Q124 84 138 101" /></g>}
        {pose.brows && <g data-nala-part="brows" {...stroke} strokeWidth={5}><path d={pose.brows[0]} /><path d={pose.brows[1]} /></g>}
        {expressive && !pose.brows && <g data-nala-part="brows" {...stroke} strokeWidth={4}><path d="M65 65Q76 61 87 65M113 65Q124 61 135 65" /></g>}
        {expressive ? <>
          <ellipse data-nala-part="mouth" cx="100" cy="125" rx="7" ry="8" fill={colors.mouth} />
          <path d="M91 115Q100 110 109 115L100 124Z" fill={colors.beak} />
          <path data-nala-part="jaw" d="M94 126Q100 131 106 126Q103 136 100 138Q97 136 94 126Z" fill={colors.beak} />
        </> : <>
          {pose.beak === 'smile' && <path d="M93 124 Q100 138 107 124Z" fill={colors.mouth} />}
          {pose.beak === 'o' && <ellipse cx="100" cy="127" rx="8" ry="9" fill={colors.mouth} />}
          {beak}
        </>}
        </g>
        <ellipse cx="84" cy="203" rx="13" ry="6" fill={colors.eye} />
        <ellipse cx="116" cy="203" rx="13" ry="6" fill={colors.eye} />
        {pose.prop === 'lens' && <g>
          <path d="M143 118 L166 145" stroke={colors.ink} strokeWidth="7" strokeLinecap="round" />
          <circle cx="124" cy="98" r="27" fill={colors.page} fillOpacity=".28" stroke={colors.ink} strokeWidth="6" />
        </g>}
        {pose.prop === 'sweat' && <path d="M180 62 C186 71 189 77 186 83 C183 88 175 86 175 80 C175 75 178 69 180 62 Z" fill={colors.drop} />}
        {!head && <>
          <g data-nala-part="left-wing" className={pose.wl === 'wave' ? play('wave') : undefined}><path d={wingPath.left} fill={colors.dark} stroke={colors.dark} strokeWidth="4" strokeLinejoin="round" transform={`rotate(${leftWing[pose.wl]} 38 138)`} /></g>
          <g data-nala-part="right-wing"><path d={pose.wr === 'chin' ? wingPath.chin : wingPath.right} fill={colors.dark} stroke={colors.dark} strokeWidth="4" strokeLinejoin="round" transform={`rotate(${rightWing[pose.wr]} 162 138)`} /></g>
          {pose.prop === 'book' && book}
        </>}
      </g>
    </g>
  </svg>
}

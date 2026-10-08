import { useState } from 'react'
import { cn } from '@/ui/cn'

export type MascotPose = 'waving' | 'thinking' | 'asking' | 'proud' | 'calm' | 'teacher'

export interface NalaMascotProps {
  pose?: MascotPose
  size?: number
  floating?: boolean
  interactive?: boolean
  speechBubble?: string | null
  onMascotClick?: () => void
  className?: string
  alt?: string
}

export function NalaMascot({
  pose = 'waving',
  size = 220,
  floating = true,
  interactive = false,
  speechBubble,
  onMascotClick,
  className = '',
  alt = 'Nala, maskot asisten penalaran NALAR',
}: NalaMascotProps) {
  const [internalBubble, setInternalBubble] = useState<string | null>(null)

  const activeBubble = speechBubble !== undefined ? speechBubble : internalBubble

  const handleClick = () => {
    if (interactive && speechBubble === undefined) {
      const quotes: Record<MascotPose, string[]> = {
        waving: [
          'Halo! Aku Nala 👋 Siap berdialog?',
          'Semangat belajar! Ayo kita uji logikamu.',
          'Hai! Siap menalar bersama hari ini?',
        ],
        thinking: [
          'Hmm… apa alasan di balik jawaban itu?',
          'Mari kita telaah langkah argumenmu…',
          'Bagaimana jika situasinya kita balik?',
        ],
        asking: [
          'Apa yang membuatmu yakin dengan hal itu?',
          'Gaya apa saja yang bekerja di sini?',
          'Bisa jelaskan polanya dengan kata-katamu?',
        ],
        proud: [
          'Hebat! Logikamu sangat runtut! 🌟',
          'Penalaran mandiri yang luar biasa! ✨',
          'Keren, kamu menemukan polanya sendiri!',
        ],
        calm: [
          'Tenang, tidak ada jawaban salah di sini.',
          'Tarik napas, susun alur pikiranmu.',
          'Fokus pada alasan di balik idemu.',
        ],
        teacher: [
          'Kendali penuh ada pada Ibu/Bapak Guru.',
          'Nala mencatat bukti kutipan verbatim.',
          'Peta kelas siap memberi wawasan nyata.',
        ],
      }
      const list = quotes[pose] || quotes.waving
      const next = list[Math.floor(Math.random() * list.length)]
      setInternalBubble(next)
    }
    if (onMascotClick) {
      onMascotClick()
    }
  }

  // Dynamic right wing based on pose
  const renderRightWing = () => {
    if (pose === 'waving') {
      return (
        <g className="origin-[164px_136px] animate-mascot-wave group-hover/mascot:[animation-duration:1.4s] motion-reduce:animate-none">
          {/* Raised waving wing */}
          <path
            d="M164 136 C184 122 204 96 200 70 C196 52 178 56 168 76 C158 96 152 118 156 136 Z"
            fill="#1B38AB"
            stroke="#1B38AB"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          {/* Motion rays / breeze next to waving wing in brand amber */}
          <g className="animate-mascot-rays motion-reduce:animate-none" stroke="#F2B23A" strokeWidth="3" strokeLinecap="round">
            <path d="M210 60 Q216 68 212 78" fill="none" />
            <path d="M218 52 Q226 62 222 74" fill="none" />
            <path d="M202 46 Q208 52 206 58" fill="none" />
          </g>
        </g>
      )
    }

    if (pose === 'thinking') {
      return (
        <g>
          {/* Right wing curled to chin */}
          <path
            d="M164 136 C172 120 158 100 138 98 C124 96 118 108 124 118 C132 130 148 140 164 136 Z"
            fill="#1B38AB"
            stroke="#1B38AB"
            strokeWidth="4"
            strokeLinejoin="round"
          />
        </g>
      )
    }

    if (pose === 'proud') {
      return (
        <g>
          {/* Wing on hip */}
          <path
            d="M164 136 C182 144 188 162 182 174 C174 186 160 182 152 168 C148 158 154 142 164 136 Z"
            fill="#1B38AB"
            stroke="#1B38AB"
            strokeWidth="4"
            strokeLinejoin="round"
          />
        </g>
      )
    }

    if (pose === 'teacher') {
      return (
        <g>
          {/* Holding pointer */}
          <path
            d="M164 136 C178 130 190 114 186 98 C180 88 168 96 162 112 C158 124 158 132 164 136 Z"
            fill="#1B38AB"
            stroke="#1B38AB"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          {/* Pointer stick in brand colors */}
          <line x1="184" y1="94" x2="216" y2="46" stroke="#2447D1" strokeWidth="4" strokeLinecap="round" />
          <circle cx="216" cy="46" r="4.5" fill="#F2B23A" />
        </g>
      )
    }

    // Default resting right wing
    return (
      <path
        d="M166 136 C178 146 180 172 170 186 C162 196 148 192 148 176 C148 160 152 142 158 138 C160 136 163 135 166 136 Z"
        fill="#1B38AB"
        stroke="#1B38AB"
        strokeWidth="4"
        strokeLinejoin="round"
      />
    )
  }

  // Left wing
  const renderLeftWing = () => {
    if (pose === 'proud') {
      return (
        <path
          d="M36 136 C18 144 12 162 18 174 C26 186 40 182 48 168 C52 158 46 142 36 136 Z"
          fill="#1B38AB"
          stroke="#1B38AB"
          strokeWidth="4"
          strokeLinejoin="round"
        />
      )
    }

    if (pose === 'teacher') {
      return (
        <g>
          {/* Left wing holding clipboard */}
          <path
            d="M36 136 C24 142 20 160 28 176 C36 184 48 180 48 168 C48 156 46 144 36 136 Z"
            fill="#1B38AB"
            stroke="#1B38AB"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          {/* Mini clipboard */}
          <rect x="14" y="150" width="22" height="30" rx="3" fill="#FFFFFF" stroke="#15213B" strokeWidth="2.5" />
          <rect x="20" y="146" width="10" height="6" rx="2" fill="#F2B23A" />
          <path d="M18 160h14M18 166h10M18 172h12" stroke="#2447D1" strokeWidth="2" strokeLinecap="round" />
        </g>
      )
    }

    return (
      <path
        d="M34 136 C22 146 20 172 30 186 C38 196 52 192 52 176 C52 160 48 142 42 138 C40 136 37 135 34 136 Z"
        fill="#1B38AB"
        stroke="#1B38AB"
        strokeWidth="4"
        strokeLinejoin="round"
      />
    )
  }

  // Eyes and brows based on pose
  const renderEyes = () => {
    if (pose === 'proud') {
      return (
        <g>
          {/* Happy closed crescent eyes */}
          <path d="M66 100 Q76 86 86 100" fill="none" stroke="#15213B" strokeWidth="5.5" strokeLinecap="round" />
          <path d="M114 100 Q124 86 134 100" fill="none" stroke="#15213B" strokeWidth="5.5" strokeLinecap="round" />
          {/* Happy arched brows */}
          <path d="M62 70 Q76 60 90 70" fill="none" stroke="#15213B" strokeWidth="5" strokeLinecap="round" />
          <path d="M110 70 Q124 60 138 70" fill="none" stroke="#15213B" strokeWidth="5" strokeLinecap="round" />
        </g>
      )
    }

    if (pose === 'thinking') {
      return (
        <g className="origin-[100px_98px] animate-mascot-blink motion-reduce:animate-none">
          {/* Eye whites */}
          <circle cx="76" cy="98" r="22" fill="#FFFFFF" />
          <circle cx="124" cy="98" r="22" fill="#FFFFFF" />
          {/* Irises shifted up-right */}
          <circle cx="82" cy="93" r="14" fill="#F2B23A" />
          <circle cx="130" cy="93" r="14" fill="#F2B23A" />
          {/* Pupils */}
          <circle cx="84" cy="91" r="9" fill="#15213B" />
          <circle cx="132" cy="91" r="9" fill="#15213B" />
          {/* Eye glint */}
          <circle cx="80" cy="87" r="3.5" fill="#FFFFFF" />
          <circle cx="128" cy="87" r="3.5" fill="#FFFFFF" />
          {/* Quizzical eyebrows */}
          <path d="M62 66 Q76 66 90 70" fill="none" stroke="#15213B" strokeWidth="5" strokeLinecap="round" />
          <path d="M110 60 Q124 50 138 56" fill="none" stroke="#15213B" strokeWidth="5.5" strokeLinecap="round" />
        </g>
      )
    }

    // Default eyes with blinking
    return (
      <g className="origin-[100px_98px] animate-mascot-blink motion-reduce:animate-none">
        <circle cx="76" cy="98" r="22" fill="#FFFFFF" />
        <circle cx="124" cy="98" r="22" fill="#FFFFFF" />
        <circle cx="78" cy="96.5" r="14" fill="#F2B23A" />
        <circle cx="126" cy="96.5" r="14" fill="#F2B23A" />
        <circle cx="80" cy="95" r="9" fill="#15213B" />
        <circle cx="128" cy="95" r="9" fill="#15213B" />
        <circle cx="76" cy="91" r="3.5" fill="#FFFFFF" />
        <circle cx="124" cy="91" r="3.5" fill="#FFFFFF" />
        {/* Eyebrows */}
        <path d="M62 66 Q76 62 90 66" fill="none" stroke="#15213B" strokeWidth="5" strokeLinecap="round" />
        <path d="M110 62 Q124 53 138 60" fill="none" stroke="#15213B" strokeWidth="5" strokeLinecap="round" />
      </g>
    )
  }

  // Accessories / Overlays
  const renderAccessories = () => {
    // If speech bubble is active, don't render overlapping head accessories (thinking dots / question mark)
    if (activeBubble) {
      if (pose === 'teacher') {
        return (
          <g>
            {/* Teacher glasses in brand amber */}
            <circle cx="76" cy="98" r="24" stroke="#F2B23A" strokeWidth="3.5" fill="none" opacity="0.95" />
            <circle cx="124" cy="98" r="24" stroke="#F2B23A" strokeWidth="3.5" fill="none" opacity="0.95" />
            <path d="M100 98 L100 98" stroke="#F2B23A" strokeWidth="4" strokeLinecap="round" />
            <path d="M52 96 L42 92" stroke="#F2B23A" strokeWidth="3" strokeLinecap="round" />
            <path d="M148 96 L158 92" stroke="#F2B23A" strokeWidth="3" strokeLinecap="round" />
          </g>
        )
      }
      return null
    }

    if (pose === 'thinking') {
      return (
        <g>
          {/* Animated thought bubbles in theme colors */}
          <circle cx="170" cy="40" r="4" fill="#F2B23A" className="animate-mascot-dot motion-reduce:animate-none" />
          <circle cx="184" cy="28" r="7" fill="#F2B23A" className="animate-mascot-dot [animation-delay:.3s] motion-reduce:animate-none" />
          <circle cx="204" cy="12" r="11" fill="#2447D1" className="animate-mascot-dot [animation-delay:.6s] motion-reduce:animate-none" />
        </g>
      )
    }

    if (pose === 'asking') {
      return (
        <g>
          {/* Question mark above head in brand blue/amber */}
          <g transform="translate(150, 4) scale(0.9)">
            <circle cx="16" cy="16" r="20" fill="#E7ECFB" stroke="#2447D1" strokeWidth="3" />
            <text x="16" y="24" textAnchor="middle" fill="#2447D1" fontSize="24" fontWeight="800" fontFamily="system-ui">?</text>
          </g>
        </g>
      )
    }

    if (pose === 'proud') {
      return (
        <g>
          {/* Sparkle stars */}
          <path d="M40 50 L43 57 L50 60 L43 63 L40 70 L37 63 L30 60 L37 57 Z" fill="#F2B23A" className="origin-[40px_60px] animate-mascot-star motion-reduce:animate-none" />
          <path d="M175 40 L178 47 L185 50 L178 53 L175 60 L172 53 L165 50 L172 47 Z" fill="#2447D1" className="origin-[170px_50px] animate-mascot-star [animation-delay:.4s] [animation-duration:2.4s] motion-reduce:animate-none" />
          <path d="M195 105 L197 110 L202 112 L197 114 L195 119 L193 114 L188 112 L193 110 Z" fill="#F2B23A" className="origin-[190px_110px] animate-mascot-star [animation-delay:.8s] [animation-duration:2.2s] motion-reduce:animate-none" />
        </g>
      )
    }

    if (pose === 'teacher') {
      return (
        <g>
          {/* Teacher glasses in brand amber */}
          <circle cx="76" cy="98" r="24" stroke="#F2B23A" strokeWidth="3.5" fill="none" opacity="0.95" />
          <circle cx="124" cy="98" r="24" stroke="#F2B23A" strokeWidth="3.5" fill="none" opacity="0.95" />
          <path d="M100 98 L100 98" stroke="#F2B23A" strokeWidth="4" strokeLinecap="round" />
          <path d="M52 96 L42 92" stroke="#F2B23A" strokeWidth="3" strokeLinecap="round" />
          <path d="M148 96 L158 92" stroke="#F2B23A" strokeWidth="3" strokeLinecap="round" />
        </g>
      )
    }

    return null
  }

  const containerClasses = cn(
    'relative inline-flex flex-col items-center justify-center select-none',
    floating && 'animate-mascot-float motion-reduce:animate-none',
    interactive && 'group/mascot cursor-pointer',
    className,
  )

  return (
    <div
      className={containerClasses}
      onClick={handleClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={interactive ? (e) => (e.key === 'Enter' || e.key === ' ') && handleClick() : undefined}
      aria-label={alt}
      title={interactive ? 'Klik untuk sapaan Nala!' : alt}
    >
      {/* Dynamic Speech Bubble: clean and concise */}
      {activeBubble && (
        <div key={activeBubble} className="absolute bottom-[calc(100%-2px)] left-1/2 z-10 w-max max-w-[250px] -translate-x-1/2 animate-mascot-bubble rounded-[14px] border border-border bg-white px-4 py-[9px] text-center font-ui text-sm leading-[1.38] font-semibold whitespace-normal text-ink shadow-[0_8px_24px_rgb(21_33_59/9%)] before:absolute before:top-[calc(100%+1px)] before:left-1/2 before:-z-1 before:-translate-x-1/2 before:border-x-[7px] before:border-t-[7px] before:border-b-0 before:border-solid before:border-x-transparent before:border-t-border before:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-x-[6px] after:border-t-[6px] after:border-b-0 after:border-solid after:border-x-transparent after:border-t-white after:content-[''] motion-reduce:animate-none" role="status" aria-live="polite">
          {activeBubble}
        </div>
      )}

      {/* Main SVG Graphic */}
      <svg
        className="block overflow-visible transition-transform duration-250 ease-[cubic-bezier(.34,1.56,.64,1)] group-hover/mascot:-translate-y-1 group-hover/mascot:scale-[1.02] group-active/mascot:translate-y-0.5 group-active/mascot:scale-[.98]"
        width={size}
        height={(size * 262) / 260}
        viewBox="-30 -12 260 262"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Soft ground shadow */}
        <ellipse cx="100" cy="214" rx="58" ry="7" fill="#15213B" opacity="0.09" />

        <g transform="rotate(-6 100 130)">
          {/* Main Body - Nalar signature Cobalt Blue */}
          <path
            d="M100 58 C84 50 66 40 52 36 C40 33 34 42 34 54 C30 74 28 100 28 126 C28 174 60 204 100 204 C140 204 172 174 172 126 C172 100 170 74 166 54 C166 42 160 33 148 36 C134 40 116 50 100 58 Z"
            fill="#2447D1"
            stroke="#2447D1"
            strokeWidth="6"
            strokeLinejoin="round"
          />

          {/* Tummy patch */}
          <ellipse cx="100" cy="166" rx="44" ry="34" fill="#FFF4DE" />

          {/* Brand mark arch on chest */}
          <path
            d="M91 182V173a9 9 0 0 1 18 0V182"
            fill="none"
            stroke="#2447D1"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <circle cx="100" cy="177" r="3" fill="#F2B23A" />

          {/* Eye sockets */}
          <circle cx="76" cy="98" r="32" fill="#FCEFD2" />
          <circle cx="124" cy="98" r="32" fill="#FCEFD2" />

          {/* Blush cheeks */}
          <g className="transition-opacity duration-200 group-hover/mascot:scale-108 group-hover/mascot:opacity-100" fill="#F4A98A">
            <ellipse cx="58" cy="122" rx="9" ry="5.5" />
            <ellipse cx="142" cy="122" rx="9" ry="5.5" />
          </g>

          {/* Eyes rendering */}
          {renderEyes()}

          {/* Beak / Nose */}
          <path d="M91 115 Q100 110 109 115 Q105 128 100 132 Q95 128 91 115Z" fill="#E7794A" />

          {/* Feet in brand amber */}
          <ellipse cx="84" cy="203" rx="13" ry="6" fill="#F2B23A" />
          <ellipse cx="116" cy="203" rx="13" ry="6" fill="#F2B23A" />

          {/* Wings */}
          {renderLeftWing()}
          {renderRightWing()}

          {/* Accessories */}
          {renderAccessories()}
        </g>
      </svg>
    </div>
  )
}

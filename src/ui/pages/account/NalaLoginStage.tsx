import { useState, useEffect } from 'react'
import { NalaMascot, type MascotPose } from '@/ui/components/mascot/NalaMascot'
import styles from './NalaLoginStage.styles'

const NALA_EXPRESSIONS: { pose: MascotPose; speech: string }[] = [
  {
    pose: 'waving',
    speech: 'Halo! Aku Nala 👋 Siap berdialog?',
  },
  {
    pose: 'thinking',
    speech: 'Hmm… apa alasan di balik argumenmu? 🤔',
  },
  {
    pose: 'asking',
    speech: 'Apa yang membuatmu yakin dengan hal itu? ❓',
  },
  {
    pose: 'proud',
    speech: 'Penalaranmu runtut dan mandiri! 🌟',
  },
  {
    pose: 'calm',
    speech: 'Tenang, fokus pada alur logikamu ya 🧘',
  },
]

export function NalaLoginStage() {
  const [expressionIndex, setExpressionIndex] = useState(0)

  // Otomatis berganti ekspresi Nala setiap 4.5 detik (identik dengan landing page)
  useEffect(() => {
    const timer = setInterval(() => {
      setExpressionIndex((prev) => (prev + 1) % NALA_EXPRESSIONS.length)
    }, 4500)
    return () => clearInterval(timer)
  }, [])

  const handleNextExpression = () => {
    setExpressionIndex((prev) => (prev + 1) % NALA_EXPRESSIONS.length)
  }

  const current = NALA_EXPRESSIONS[expressionIndex]

  return (
    <div className={styles.stageContainer} aria-label="Ilustrasi Maskot Nala">
      {/* ── 1. Deep Blue Cyber Network Wave (Partial on Right Side) ── */}
      <div className={styles.blueNetworkWave} aria-hidden="true">
        <svg
          className={styles.blueWaveSvg}
          viewBox="0 0 450 700"
          fill="none"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="blueWaveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284C7" />
              <stop offset="40%" stopColor="#006fee" />
              <stop offset="100%" stopColor="#1D4ED8" />
            </linearGradient>
            <filter id="glowCyan" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Dynamic flowing organic wave (partial blue wave on the right) */}
          <path
            d="M100 0 C210 110 240 220 180 340 C120 460 170 580 260 700 L450 700 L450 0 Z"
            fill="url(#blueWaveGrad)"
          />

          {/* Interconnected circuit paths */}
          <g stroke="#5EE0FF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.65">
            <path d="M230 70 L290 70 L330 110 L410 110" />
            <path d="M280 160 L330 210 L370 210 L420 260" />
            <path d="M190 280 L240 280 L290 330 L360 330 L400 370" />
            <path d="M220 410 L270 460 L340 460 L390 510" />
            <path d="M250 540 L310 540 L360 590 L420 590" />
            <path d="M300 630 L350 680 L430 680" />
          </g>

          {/* Circuit nodes with pulse glow */}
          <g fill="#E0F2FE" filter="url(#glowCyan)">
            <circle cx="230" cy="70" r="4.5" className={styles.circuitNode} />
            <circle cx="290" cy="70" r="3.5" />
            <circle cx="330" cy="110" r="4.5" className={styles.circuitNode} />
            <circle cx="410" cy="110" r="4" />
            <circle cx="280" cy="160" r="3.5" />
            <circle cx="330" cy="210" r="4.5" className={styles.circuitNode} />
            <circle cx="370" cy="210" r="4" />
            <circle cx="420" cy="260" r="4.5" className={styles.circuitNode} />
            <circle cx="190" cy="280" r="4" />
            <circle cx="240" cy="280" r="4.5" className={styles.circuitNode} />
            <circle cx="290" cy="330" r="3.5" />
            <circle cx="360" cy="330" r="4.5" className={styles.circuitNode} />
            <circle cx="400" cy="370" r="4" />
            <circle cx="220" cy="410" r="4" />
            <circle cx="270" cy="460" r="4.5" className={styles.circuitNode} />
            <circle cx="340" cy="460" r="3.5" />
            <circle cx="390" cy="510" r="4.5" className={styles.circuitNode} />
            <circle cx="250" cy="540" r="4" />
            <circle cx="310" cy="540" r="4.5" className={styles.circuitNode} />
            <circle cx="360" cy="590" r="4" />
            <circle cx="420" cy="590" r="4.5" className={styles.circuitNode} />
          </g>
        </svg>
      </div>

      {/* ── 2. Center Stage: Nala Mascot & Floating Badges (No Box, Full Screen) ── */}
      <div className={styles.centerStage}>
        {/* ── Floating Badges (Harmonized with Nalar Palette) ── */}

        {/* Badge 1: Top-Right Lightning Bolt Circle: Nalar Amber Accent (#F2B23A) */}
        <div className={styles.badgeLightning} aria-hidden="true" title="Percikan Ide & Penalaran">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="#FFFFFF" stroke="#FFFFFF" />
          </svg>
        </div>

        {/* Badge 2: Top-Left Folder in Nalar Cobalt Blue */}
        <div className={styles.badgeFolder} aria-hidden="true" title="Bahan Ajar & Catatan Guru">
          <svg width="68" height="60" viewBox="0 0 68 60" fill="none">
            {/* White document sheets inside */}
            <rect x="20" y="4" width="32" height="42" rx="4" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
            <line x1="26" y1="12" x2="44" y2="12" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
            <line x1="26" y1="18" x2="40" y2="18" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
            <line x1="26" y1="24" x2="36" y2="24" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
            {/* Folder body */}
            <path
              d="M6 16 L22 16 L26 22 L62 22 C64.2 22 66 23.8 66 26 L66 52 C66 54.2 64.2 56 62 56 L6 56 C3.8 56 2 54.2 2 52 L2 20 C2 17.8 3.8 16 6 16 Z"
              fill="#2447D1"
            />
            {/* Folder front flap */}
            <path
              d="M2 28 L66 28 L64 52 C64 54.2 62.2 56 60 56 L8 56 C5.8 56 4 54.2 4 52 Z"
              fill="#1B38AB"
            />
          </svg>
        </div>

        {/* Badge 3: Left Glossy Emerald Shield */}
        <div className={styles.badgeShieldLeft} aria-hidden="true" title="Perisai Keamanan Sokratik">
          <svg width="50" height="60" viewBox="0 0 52 62" fill="none">
            <path d="M26 2 L48 10 C48 35 38 52 26 60 C14 52 4 35 4 10 Z" fill="#10B981" stroke="#34D399" strokeWidth="2.5" />
            <path d="M26 8 L42 15 C42 34 34 47 26 53 C18 47 10 34 10 15 Z" fill="#185D46" />
            <path d="M26 8 L42 15 C42 34 34 47 26 53 L26 8 Z" fill="#1F7A5C" />
            <path d="M26 22 L27.5 26.5 L32 28 L27.5 29.5 L26 34 L24.5 29.5 L20 28 L24.5 26.5 Z" fill="#DFF1E9" opacity="0.95" />
          </svg>
        </div>

        {/* Badge 4: Right Glossy Emerald Shield */}
        <div className={styles.badgeShieldRight} aria-hidden="true" title="Perisai Kritis">
          <svg width="54" height="64" viewBox="0 0 52 62" fill="none">
            <path d="M26 2 L48 10 C48 35 38 52 26 60 C14 52 4 35 4 10 Z" fill="#10B981" stroke="#34D399" strokeWidth="2.5" />
            <path d="M26 8 L42 15 C42 34 34 47 26 53 C18 47 10 34 10 15 Z" fill="#185D46" />
            <path d="M26 8 L42 15 C42 34 34 47 26 53 L26 8 Z" fill="#1F7A5C" />
            <path d="M26 22 L27.5 26.5 L32 28 L27.5 29.5 L26 34 L24.5 29.5 L20 28 L24.5 26.5 Z" fill="#DFF1E9" opacity="0.95" />
          </svg>
        </div>

        {/* Badge 5: Bottom-Left Green Plant */}
        <div className={styles.badgePlant} aria-hidden="true" title="Pertumbuhan Penalaran Mandiri">
          <svg width="60" height="70" viewBox="0 0 60 70" fill="none">
            <rect x="18" y="60" width="24" height="6" rx="3" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
            <path d="M30 60 Q30 35 15 25" stroke="#10B981" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M30 60 Q35 40 45 32" stroke="#10B981" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M15 25 C6 24 2 12 14 6 C26 0 24 16 15 25 Z" fill="#22C55E" />
            <path d="M15 25 C14 16 18 10 22 7" stroke="#15803D" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M45 32 C54 30 56 18 46 14 C36 10 38 24 45 32 Z" fill="#10B981" />
            <path d="M45 32 C43 24 41 18 39 15" stroke="#047857" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M30 46 C28 38 32 32 30 26 C33 30 34 38 30 46 Z" fill="#86EFAC" />
          </svg>
        </div>

        {/* Badge 6: Glowing Socratic Hero Shield in Nalar Brand Blue & Amber Accent */}
        <div className={styles.badgeHeroShield} aria-hidden="true" title="Perisai Sokratik Berpikir Kritis">
          <svg width="68" height="82" viewBox="0 0 100 120" fill="none">
            <defs>
              <linearGradient id="socraticShieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4F75FE" />
                <stop offset="50%" stopColor="#2447D1" />
                <stop offset="100%" stopColor="#1B38AB" />
              </linearGradient>
              <linearGradient id="innerPlateGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1E3360" />
                <stop offset="100%" stopColor="#15213B" />
              </linearGradient>
            </defs>
            {/* Outer Shield Frame */}
            <path
              d="M50 6 L88 22 C88 66 74 94 50 106 C26 94 12 66 12 22 Z"
              fill="url(#socraticShieldGrad)"
              stroke="#C7D7FD"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Inner Plate */}
            <path
              d="M50 13 L81 26 C81 62 69 86 50 97 C31 86 19 62 19 26 Z"
              fill="url(#innerPlateGrad)"
              stroke="#2447D1"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            {/* Rivets */}
            <circle cx="50" cy="10" r="1.8" fill="#BAE6FD" />
            <circle cx="69" cy="18" r="1.8" fill="#BAE6FD" />
            <circle cx="84" cy="27" r="1.8" fill="#BAE6FD" />
            <circle cx="31" cy="18" r="1.8" fill="#BAE6FD" />
            <circle cx="16" cy="27" r="1.8" fill="#BAE6FD" />
            {/* 4-Point Radiant Star with Nalar Amber Glow */}
            <g className={styles.shieldStar}>
              <circle cx="50" cy="54" r="16" fill="#F2B23A" opacity="0.25" />
              <path
                d="M50 36 Q50 54 63 54 Q50 54 50 72 Q50 54 37 54 Q50 54 50 36 Z"
                fill="#FFFFFF"
              />
            </g>
          </svg>
        </div>

        {/* ── 3. Exact Mascot Nala from Landing Page (Full Stage, No Box) ── */}
        <div className={styles.mascotStageWrap}>
          <NalaMascot
            pose={current.pose}
            size={370}
            floating={true}
            interactive={true}
            speechBubble={current.speech}
            onMascotClick={handleNextExpression}
            alt="Nala, maskot asisten penalaran NALAR"
          />
        </div>


      </div>
    </div>
  )
}

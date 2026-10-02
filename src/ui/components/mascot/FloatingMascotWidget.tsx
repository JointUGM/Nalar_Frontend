import { useState } from 'react'
import { Link } from 'react-router'
import { NalaMascot } from './NalaMascot'
import styles from './FloatingMascotWidget.module.css'

export function FloatingMascotWidget() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <aside className={styles.widgetWrapper} aria-label="Asisten Nala Cepat">
      {isOpen && (
        <div className={styles.popoverCard} role="dialog" aria-modal="false" aria-label="Sapa Nala">
          <div className={styles.cardHeader}>
            <div className={styles.cardHeadInfo}>
              <NalaMascot pose="waving" size={36} floating={false} />
              <div>
                <h4 className={styles.cardHeadName}>Nala AI</h4>
                <p className={styles.cardHeadRole}>Asisten Penalaran Siswa</p>
              </div>
            </div>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={() => setIsOpen(false)}
              aria-label="Tutup jendela sapaan Nala"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className={styles.cardBubble}>
            <p>
              Halo! Aku Nala 👋 Di NALAR, aku memandu siswa SMP berpikir mendalam lewat pertanyaan sokratik, tanpa pernah membocorkan jawaban.
            </p>
          </div>

          <nav className={styles.cardActions} aria-label="Aksi bantuan Nala">
            <a href="#dialog" className={styles.actionLink} onClick={() => setIsOpen(false)}>
              <span>Cobain dialog sokratik</span>
              <span aria-hidden="true">→</span>
            </a>
            <a href="#cara-kerja" className={styles.actionLink} onClick={() => setIsOpen(false)}>
              <span>Alur kerja 1 jam pelajaran</span>
              <span aria-hidden="true">→</span>
            </a>
            <Link to="/login" className={`${styles.actionLink} ${styles.actionPrimary}`} onClick={() => setIsOpen(false)}>
              <span>Masuk ke akun NALAR</span>
              <span aria-hidden="true">→</span>
            </Link>
          </nav>
        </div>
      )}

      <button
        type="button"
        className={styles.triggerBtn}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Tutup bantuan Nala' : 'Sapa Nala, asisten penalaran'}
      >
        <div className={styles.triggerIconWrap}>
          <NalaMascot pose="waving" size={32} floating={false} />
        </div>
        <div className={styles.triggerText}>
          <span className={styles.triggerTitle}>Tanya Nala</span>
          <span className={styles.triggerSub}>Asisten Penalaran</span>
        </div>
      </button>
    </aside>
  )
}

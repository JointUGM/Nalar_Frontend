import { Link } from 'react-router'
import { Button } from '@/ui/components/button/Button'
import { Feedback } from '@/ui/components/feedback/Feedback'
import { Icon } from '@/ui/components/icon/Icon'
import { Nala } from '@/ui/components/nala/Nala'
import { reflectionsPath } from './parentExamples'
import { useParentReflectionViewModel } from './useParentReflectionViewModel'
import styles from './ParentReflection.module.css'

export function ParentReflection() {
  const { child, reflection } = useParentReflectionViewModel()
  if (!child || !reflection) return <div className={styles.content}>
    <Feedback title="Refleksi ini tidak tersedia" announce>Pilih refleksi dari daftar refleksi yang sudah dirilis.</Feedback>
    <Link className={styles.back} to={reflectionsPath}>Kembali ke semua refleksi</Link>
  </div>

  const first = child.name.split(' ')[0]
  const { detail } = reflection
  return <div className={styles.content}>
    <div className={styles.header}>
      <div>
        <div className={styles.titleRow}><h1>{reflection.title}</h1><span>{reflection.subject.split(' · ')[0]}</span></div>
        <p>{detail?.released ?? `${reflection.date} · ${reflection.subject}`}</p>
      </div>
      <div className={styles.actions}>
        <Link className={styles.back} to={reflectionsPath}><Icon name="chevronLeft" size={14} />Semua refleksi</Link>
        <Button tone="secondary" onClick={() => window.print()}>Cetak</Button>
      </div>
    </div>
    {!detail && <p className={styles.note}>Pratinjau lokal · contoh ini hanya punya ringkasan; tulisan lengkap tersedia untuk “Kenapa kelereng berhenti?”.</p>}

    <div className={styles.grid}>
      <div className={styles.main}>
        <section className={styles.card} aria-labelledby="good-title">
          <h2 id="good-title"><Icon name="check" size={16} />Yang {first} lakukan dengan baik</h2>
          <p>{detail?.good ?? reflection.excerpt}</p>
        </section>
        {detail && <section className={styles.card} aria-labelledby="shift-title">
          <h2 id="shift-title"><Icon name="refresh" size={16} />Saat {first} berubah pikiran</h2>
          <p>{detail.shift}</p>
        </section>}
        {detail && <section className={styles.card} aria-labelledby="concepts-title">
          <h2 id="concepts-title"><Icon name="layers" size={16} />Konsep di misi ini</h2>
          <div className={styles.concepts}>
            <div><h3>Sudah dipahami</h3><ul>{detail.understood.map((name) => <li key={name} data-status="done">{name}</li>)}</ul></div>
            <div><h3>Masih berkembang</h3><ul>{detail.growing.map((name) => <li key={name} data-status="growing">{name}</li>)}</ul></div>
          </div>
        </section>}
      </div>
      <section className={[styles.card, styles.ask].join(' ')} aria-labelledby="ask-title">
        <h2 id="ask-title"><Nala mood="ask" size={24} head />Pertanyaan untuk {first}</h2>
        <p className={styles.question}>{reflection.question}</p>
        {detail && <div className={styles.tryHome}><h3>Untuk dicoba di rumah</h3><p>{detail.tryAtHome}</p></div>}
      </section>
    </div>
  </div>
}

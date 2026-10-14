import type { CSSProperties } from 'react'
import { Icon } from '@/ui/components/icon/Icon'
import { VISIBILITY } from '@/ui/pages/landing/landingContent'
import type { Access } from '@/ui/pages/landing/landingContent'
import shared from '@/ui/pages/landing/Landing.styles'
import styles from './AccessTable.styles'

const labels: Record<Access, string> = { ya: 'Ya', tidak: 'Tidak' }
const icons = { ya: 'check', tidak: 'minus' } as const

function Cell({ access }: { access: Access }) {
  return <td className={styles.cell} data-access={access}><span><Icon name={icons[access]} size={16} />{labels[access]}</span></td>
}

export function AccessTable() {
  return <section className={shared.section} aria-labelledby="akses-title">
    <div className={shared.wrap}>
      <div className={shared.head} data-reveal>
        <h2 id="akses-title" className={shared.h2}>Setiap orang hanya melihat bagiannya.</h2>
        <p className={shared.lead}>Siswa tidak pernah melihat skor. Admin sekolah mengelola orang dan kelas, tanpa akses ke laporan penalaran.</p>
      </div>
      <div className={styles.reveal} data-reveal>
        <table className={styles.table}>
          <caption className="sr-only">Siapa melihat apa di NALAR</caption>
          <thead>
            <tr><th scope="col"><span className="sr-only">Isi</span></th><th scope="col">Siswa</th><th scope="col">Guru</th></tr>
          </thead>
          <tbody>
            {VISIBILITY.map((row, index) => <tr key={row.item} style={{ '--i': index } as CSSProperties}>
              <th scope="row">{row.item}</th>
              <Cell access={row.siswa} />
              <Cell access={row.guru} />
            </tr>)}
          </tbody>
        </table>
      </div>
    </div>
  </section>
}

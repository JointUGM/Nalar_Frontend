import { useState } from 'react'
import { Link } from 'react-router'
import { Dialog } from '@/ui/components/dialog/Dialog'
import { Icon } from '@/ui/components/icon/Icon'
import styles from './Landing.module.css'

/** The page links as a drawer, for widths where the header has no room for them. */
export function LandingMenu({ links }: { links: readonly (readonly [string, string])[] }) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)
  return <>
    <button type="button" className={styles.menuButton} aria-label="Buka menu" aria-expanded={open} onClick={() => setOpen(true)}><Icon name="menu" /></button>
    <Dialog open={open} onClose={close} title="Menu" description="Bagian halaman dan masuk" presentation="drawer">
      <nav className={styles.drawerNav} aria-label="Bagian halaman">
        {links.map(([id, label]) => <a key={id} href={`#${id}`} onClick={close}>{label}</a>)}
        <Link className={styles.login} to="/login" onClick={close}>Masuk</Link>
      </nav>
    </Dialog>
  </>
}

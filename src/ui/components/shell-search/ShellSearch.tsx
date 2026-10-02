import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Icon } from '@/ui/components/icon/Icon'
import styles from './ShellSearch.module.css'

export interface SearchTarget { label: string; hint: string; to: string }

/** Quick-jump search for a shell top bar: filters `targets` as you type; Enter opens the first match. */
export function ShellSearch({ className, label, placeholder, targets }: { className: string; label: string; placeholder: string; targets: readonly SearchTarget[] }) {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const needle = query.trim().toLocaleLowerCase('id-ID')
  const matches = needle ? targets.filter((target) => `${target.label} ${target.hint}`.toLocaleLowerCase('id-ID').includes(needle)).slice(0, 6) : []
  const open = (target: SearchTarget) => { setQuery(''); navigate(target.to, { state: { focusPlatformContent: true } }) }
  return <div className={[className, styles.root].join(' ')}>
    <Icon name="search" size={14} />
    <input type="search" aria-label={label} placeholder={placeholder} value={query} onChange={(event) => setQuery(event.target.value)}
      onKeyDown={(event) => { if (event.key === 'Enter' && matches[0]) open(matches[0]); else if (event.key === 'Escape') setQuery('') }} />
    {needle && <ul className={styles.results} aria-label="Hasil pencarian">
      {matches.length ? matches.map((target) => <li key={target.to}><button type="button" onClick={() => open(target)}><strong>{target.label}</strong><small>{target.hint}</small></button></li>) : <li className={styles.empty}>Tidak ada hasil untuk “{query.trim()}”.</li>}
    </ul>}
  </div>
}

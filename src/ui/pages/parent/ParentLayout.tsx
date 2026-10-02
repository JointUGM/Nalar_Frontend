import { matchPath, Outlet, useLocation } from 'react-router'
import { ParentContextProvider } from '@/ui/components/parent-shell/ParentContextProvider'
import { ParentShell } from '@/ui/components/parent-shell/ParentShell'
import { useParentContext } from '@/ui/components/parent-shell/useParentContext'
import type { LinkedChildren } from '@/ui/components/parent-shell/ParentContext'
import { childrenExample, homePath, news, parentUser, reflectionPath, reflections, reflectionsPath } from './parentExamples'
import styles from './ParentLayout.module.css'

const linkedOptions: readonly (readonly [LinkedChildren, string])[] = [['two', 'Dua anak'], ['one', 'Satu anak'], ['none', 'Belum ada anak tertaut']]
const titles: Readonly<Record<string, string>> = { [homePath]: 'Ringkasan', [reflectionsPath]: 'Refleksi' }

function Frame() {
  const { linked, setLinked, child } = useParentContext()
  const { pathname } = useLocation()
  const open = matchPath(reflectionPath(':id'), pathname)?.params.id
  const openTitle = child && open ? reflections[child.id]?.find((item) => item.id === open)?.title : undefined
  const unread = child !== null && news[child.id] !== undefined
  const nav = [
    { label: 'Ringkasan', icon: 'home', to: homePath, badge: unread ? '1 baru' : undefined },
    { label: 'Refleksi', icon: 'message', to: reflectionsPath },
    { label: 'Pengaturan', icon: 'sliders' },
  ] as const
  return <ParentShell title={openTitle ? `Refleksi / ${openTitle}` : titles[pathname] ?? 'Orang tua'} user={parentUser} nav={nav}>
    <label className={styles.scenario}>Anak yang tertaut (pratinjau)
      <select value={linked} onChange={(event) => setLinked(linkedOptions.find(([value]) => value === event.target.value)?.[0] ?? 'two')}>{linkedOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
    </label>
    {/* Switching child remounts the page, so nothing the parent opened for one child is still on screen for the next. */}
    <Outlet key={child?.id ?? 'none'} />
  </ParentShell>
}

export function ParentLayout() {
  return <ParentContextProvider all={childrenExample}><Frame /></ParentContextProvider>
}

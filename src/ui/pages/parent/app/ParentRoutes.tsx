import { useCallback, useMemo } from 'react'
import { Loading } from '@/ui/components/loading/Loading'
import { Navigate, Route, Routes, useLocation } from 'react-router'
import type { Identity } from '@/domain/model/Identity'
import type { ParentService } from '@/domain/services/ParentService'
import type { ParentChild } from '@/ui/components/parent-shell/ParentContext'
import { ParentContextProvider } from '@/ui/components/parent-shell/ParentContextProvider'
import { ParentShell } from '@/ui/components/parent-shell/ParentShell'
import { useParentContext } from '@/ui/components/parent-shell/useParentContext'
import { LiveFeedback } from '@/ui/pages/live/LiveFrame'
import { noPollMs, useLiveResource } from '@/ui/pages/live/useLiveResource'
import boundary from '@/ui/RouteBoundary.module.css'
import { ParentHomePage } from './ParentHomePage'
import { ParentReflectionPage } from './ParentReflectionPage'
import { ParentReflectionsPage } from './ParentReflectionsPage'
import { ParentSettingsPage } from './ParentSettingsPage'
import { parentPaths } from './parentPaths'

const nav = [
  { label: 'Ringkasan', icon: 'home', to: parentPaths.home },
  { label: 'Refleksi', icon: 'message', to: parentPaths.reflections },
  { label: 'Pengaturan', icon: 'sliders', to: parentPaths.settings },
] as const
const titles: Readonly<Record<string, string>> = { [parentPaths.home]: 'Ringkasan', [parentPaths.reflections]: 'Refleksi', [parentPaths.settings]: 'Pengaturan' }

function Frame({ service, user, email }: { service: ParentService; user: string; email: string | null }) {
  const { child } = useParentContext()
  const { pathname } = useLocation()
  return <ParentShell title={titles[pathname.replace(/\/+$/, '')] ?? (pathname.startsWith(parentPaths.reflections) ? 'Refleksi' : 'Orang tua')} user={user} nav={nav} home={parentPaths.home}>
    {/* Switching child remounts the page, so nothing read for one child is still on screen for the next. */}
    <Routes key={child?.id ?? 'none'}>
      <Route index element={<Navigate to={parentPaths.home} replace />} />
      <Route path="home" element={<ParentHomePage service={service} />} />
      <Route path="reflections" element={<ParentReflectionsPage service={service} />} />
      <Route path="reflections/:sessionId" element={<ParentReflectionPage service={service} />} />
      <Route path="settings" element={<ParentSettingsPage service={service} user={user} email={email} />} />
      <Route path="*" element={<h1>Halaman tidak tersedia</h1>} />
    </Routes>
  </ParentShell>
}

export function ParentRoutes({ service, identity }: { service: ParentService; identity: Identity }) {
  const read = useCallback((signal: AbortSignal) => service.children(signal), [service])
  const { data, error, online, refresh } = useLiveResource(read, noPollMs)
  const all = useMemo<ParentChild[]>(() => (data ?? []).map((item, index) => ({
    id: item.student_id, name: item.name, initials: item.name.trim().charAt(0).toLocaleUpperCase('id-ID') || '?',
    detail: item.school_name, klass: item.class_name ?? '', tone: index % 2 ? 'info' : 'warm', lastSeenAt: item.last_seen_at,
  })), [data])
  if (!data && !error) return <Loading variant="screen" label="Membuka halaman orang tua…" />
  if (!data) return <main className={boundary.page}>
    <h1>Halaman orang tua belum dapat dibuka</h1>
    <LiveFeedback error={error} online={online} refresh={refresh} />
  </main>
  return <ParentContextProvider all={all}><Frame service={service} user={identity.fullName} email={identity.email ?? null} /></ParentContextProvider>
}

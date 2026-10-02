import { useCallback, useMemo } from 'react'
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

function Frame({ service, user }: { service: ParentService; user: string }) {
  const { child } = useParentContext()
  const { pathname } = useLocation()
  return <ParentShell title={titles[pathname.replace(/\/+$/, '')] ?? (pathname.startsWith(parentPaths.reflections) ? 'Refleksi' : 'Orang tua')} user={user} nav={nav} home={parentPaths.home} review={false}>
    {/* Switching child remounts the page, so nothing read for one child is still on screen for the next. */}
    <Routes key={child?.id ?? 'none'}>
      <Route index element={<Navigate to={parentPaths.home} replace />} />
      <Route path="home" element={<ParentHomePage service={service} />} />
      <Route path="reflections" element={<ParentReflectionsPage service={service} />} />
      <Route path="reflections/:sessionId" element={<ParentReflectionPage service={service} />} />
      <Route path="settings" element={<ParentSettingsPage service={service} user={user} />} />
      <Route path="*" element={<h1>Halaman tidak tersedia</h1>} />
    </Routes>
  </ParentShell>
}

export function ParentRoutes({ service, identity }: { service: ParentService; identity: Identity }) {
  const read = useCallback((signal: AbortSignal) => service.children(signal), [service])
  const { data, error, online, refresh } = useLiveResource(read, noPollMs)
  const all = useMemo<ParentChild[]>(() => (data ?? []).map((item, index) => ({
    id: item.student_id, name: item.name, initials: item.name.trim().charAt(0).toLocaleUpperCase('id-ID') || '?',
    detail: item.school_name, klass: '', tone: index % 2 ? 'info' : 'warm',
  })), [data])
  if (!data) return <main className={boundary.page}>
    <h1>Membuka halaman orang tua…</h1>
    <LiveFeedback error={error} online={online} refresh={refresh} />
    {!error && <p role="status">Tunggu sebentar.</p>}
  </main>
  return <ParentContextProvider all={all} initialLinked="all"><Frame service={service} user={identity.fullName} /></ParentContextProvider>
}

import { createElement, lazy, StrictMode } from 'react'
import type { ReactNode } from 'react'
import type { TelemetryBatch } from './domain/model/Student'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { DependenciesProvider } from './ui/components/dependencies/DependenciesProvider'
import { AccountLoadFailure } from './ui/routes'
import './index.css'

const root = document.getElementById('root')
if (!root) throw new Error('Missing root element in index.html')

const reactRoot = createRoot(root)
function render(application: ReactNode) {
  reactRoot.render(<StrictMode>{application}</StrictMode>)
}

let dependencies: ReturnType<typeof import('./di').createDependencies> | null = null
function getDependencies() {
  if (!dependencies) dependencies = import('./di').then(({ createDependencies }) => createDependencies({
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  }))
  return dependencies
}
if (import.meta.hot) import.meta.hot.dispose(() => { if (dependencies) void dependencies.then((value) => value.dispose()) })

const accountEntry = createElement(lazy(async () => {
  try {
    const [created, { Login }] = await Promise.all([getDependencies(), import('./ui/pages/account/Login')])
    return { default: () => <Login dependencies={created.account} /> }
  } catch {
    return { default: AccountLoadFailure }
  }
}))

const privateEntry = createElement(lazy(async () => {
  try {
    const [created, { ProtectedRole }, { LiveRoutes }, dev] = await Promise.all([getDependencies(), import('./ui/pages/account/ProtectedRole'), import('./ui/pages/live/LiveRoutes'), import('./ui/devDashboards')])
    // Live pages own the projector, monitor, join, lobby and session paths; admin roles still open their example dashboard.
    const livePath = /^\/(teacher\/[^/]+\/publications\/[^/]+\/(projector|monitor)\/?$|student\/[^/]+\/(join|runs\/|sessions\/))/
    // Its own chunk, so only a parent downloads the parent pages.
    const ParentRoutes = lazy(() => import('./ui/pages/parent/app/ParentRoutes').then((module) => ({ default: module.ParentRoutes })))
    const StudentRoutes = lazy(() => import('./ui/pages/student/app/StudentRoutes').then((module) => ({ default: module.StudentRoutes })))
    const TeacherRoutes = lazy(() => import('./ui/pages/teacher/app/TeacherRoutes').then((module) => ({ default: module.TeacherRoutes })))
    const { student, teacher, knowledgeBase } = created
    // Telemetry is best effort: the session page works the same without it.
    const telemetry = student ? (sessionId: string, batch: TelemetryBatch) => student.telemetry(sessionId, batch) : undefined
    return { default: () => <ProtectedRole dependencies={created.account} dashboardFor={dev.devDashboardPath} renderRole={(identity, path) => {
      // A role with real pages is served here; the rest still open their example dashboard.
      if (created.parent && /^\/parent(\/|$)/.test(path)) return <ParentRoutes service={created.parent} identity={identity} />
      if (created.live && livePath.test(path)) return <LiveRoutes service={created.live} identity={identity} telemetry={telemetry} />
      // Every other student path is the real home or a mission start page.
      if (student && path.startsWith('/student/')) return <StudentRoutes service={student} identity={identity} />
      // Every other teacher path is a real teacher page: sessions, results, missions or the knowledge base.
      return teacher && knowledgeBase && path.startsWith('/teacher/') ? <TeacherRoutes service={teacher} kb={knowledgeBase} identity={identity} /> : null
    }} /> }
  } catch {
    return { default: AccountLoadFailure }
  }
}))

if (import.meta.env.DEV && new URLSearchParams(window.location.search).get('preview') === 'foundation') {
  void import('./ui/pages/foundation-preview/FoundationPreview').then(({ FoundationPreview }) => render(<FoundationPreview />))
} else {
  void Promise.all([import('./review-di'), import('./ui/ReviewRoutes')]).then(([{ createReviewDependencies }, { ReviewRoutes }]) => {
    render(<BrowserRouter><DependenciesProvider value={createReviewDependencies()}><ReviewRoutes accountEntry={accountEntry} privateEntry={privateEntry} /></DependenciesProvider></BrowserRouter>)
  })
}

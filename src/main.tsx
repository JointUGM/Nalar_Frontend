import { createElement, lazy, StrictMode } from 'react'
import type { ReactNode } from 'react'
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
    // Live pages own only the paths they know; every other role path opens its dashboard (the example-data review pages).
    const livePath = /^\/(teacher\/[^/]+\/publications\/|student\/[^/]+\/(join|runs\/|sessions\/))/
    return { default: () => <ProtectedRole dependencies={created.account} dashboardFor={dev.devDashboardPath} renderRole={(identity, path) => created.live && livePath.test(path) ? <LiveRoutes service={created.live} identity={identity} /> : null} /> }
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

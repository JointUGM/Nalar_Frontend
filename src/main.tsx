import { createElement, lazy, StrictMode } from 'react'
import type { ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './App'
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
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
    supabasePublishableKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
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
    const [created, { ProtectedRole }] = await Promise.all([getDependencies(), import('./ui/pages/account/ProtectedRole')])
    return { default: () => <ProtectedRole dependencies={created.account} /> }
  } catch {
    return { default: AccountLoadFailure }
  }
}))

if (import.meta.env.DEV && new URLSearchParams(window.location.search).get('preview') === 'foundation') {
  void import('./ui/pages/foundation-preview/FoundationPreview').then(({ FoundationPreview }) => render(<FoundationPreview />))
} else if (import.meta.env.DEV && (window.location.pathname === '/' || window.location.pathname.startsWith('/review/'))) {
  void Promise.all([import('./review-di'), import('./ui/ReviewRoutes')]).then(([{ createReviewDependencies }, { ReviewRoutes }]) => {
    render(<BrowserRouter><DependenciesProvider value={createReviewDependencies()}><ReviewRoutes accountEntry={accountEntry} privateEntry={privateEntry} /></DependenciesProvider></BrowserRouter>)
  })
} else {
  render(<App accountEntry={accountEntry} privateEntry={privateEntry} />)
}

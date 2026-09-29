import { StrictMode } from 'react'
import type { ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './App'
import { DependenciesProvider } from './ui/components/dependencies/DependenciesProvider'
import './index.css'

const root = document.getElementById('root')
if (!root) throw new Error('Missing root element in index.html')

const reactRoot = createRoot(root)
function render(application: ReactNode) {
  reactRoot.render(<StrictMode>{application}</StrictMode>)
}

if (import.meta.env.DEV && new URLSearchParams(window.location.search).get('preview') === 'foundation') {
  void import('./ui/pages/foundation-preview/FoundationPreview').then(({ FoundationPreview }) => render(<FoundationPreview />))
} else if (import.meta.env.DEV && (window.location.pathname === '/' || window.location.pathname.startsWith('/review/'))) {
  void Promise.all([import('./review-di'), import('./ui/ReviewRoutes')]).then(([{ createReviewDependencies }, { ReviewRoutes }]) => {
    render(<BrowserRouter><DependenciesProvider value={createReviewDependencies()}><ReviewRoutes /></DependenciesProvider></BrowserRouter>)
  })
} else {
  render(<App />)
}

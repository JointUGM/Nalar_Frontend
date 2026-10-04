import { BrowserRouter } from 'react-router'
import type { ReactNode } from 'react'
import { RouteErrorBoundary } from '@/ui/RouteErrorBoundary'
import { AppRoutes } from '@/ui/routes'

export default function App({ accountEntry, privateEntry }: { accountEntry: ReactNode; privateEntry?: ReactNode }) {
  return <BrowserRouter><RouteErrorBoundary><AppRoutes accountEntry={accountEntry} privateEntry={privateEntry} /></RouteErrorBoundary></BrowserRouter>
}

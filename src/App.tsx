import { BrowserRouter } from 'react-router'
import type { ReactNode } from 'react'
import { AppRoutes } from '@/ui/routes'

export default function App({ accountEntry }: { accountEntry: ReactNode }) {
  return <BrowserRouter><AppRoutes accountEntry={accountEntry} /></BrowserRouter>
}

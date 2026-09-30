import { BrowserRouter } from 'react-router'
import type { ReactNode } from 'react'
import { AppRoutes } from '@/ui/routes'

export default function App({ accountEntry, privateEntry }: { accountEntry: ReactNode; privateEntry?: ReactNode }) {
  return <BrowserRouter><AppRoutes accountEntry={accountEntry} privateEntry={privateEntry} /></BrowserRouter>
}

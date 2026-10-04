import { lazy, Suspense } from 'react'
import type { ReactNode } from 'react'
import { Route, Routes } from 'react-router'
import { AppRoutes } from '@/ui/routes'
import { Loading } from '@/ui/components/loading/Loading'

const AccountActivate = lazy(() => import('@/ui/pages/account/AccountActivate').then((module) => ({ default: module.AccountActivate })))
const AccountReset = lazy(() => import('@/ui/pages/account/AccountReset').then((module) => ({ default: module.AccountReset })))
const AccountPassword = lazy(() => import('@/ui/pages/account/AccountPassword').then((module) => ({ default: module.AccountPassword })))

export function ReviewRoutes({ accountEntry, activationEntry, resetEntry, privateEntry }: { accountEntry: ReactNode; activationEntry?: ReactNode; resetEntry?: ReactNode; privateEntry?: ReactNode }) {
  return <Suspense fallback={<Loading variant="screen" label="Memuat halaman…" />}><Routes>
    <Route path="/review/account/activate" element={<AccountActivate />} />
    <Route path="/review/account/reset" element={<AccountReset />} />
    <Route path="/review/account/password" element={<AccountPassword />} />
    <Route path="*" element={<AppRoutes accountEntry={accountEntry} activationEntry={activationEntry} resetEntry={resetEntry} privateEntry={privateEntry} />} />
  </Routes></Suspense>
}

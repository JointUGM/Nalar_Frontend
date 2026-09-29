import type { ReactNode } from 'react'
import type { PlatformDependencies } from './DependenciesContext'
import { DependenciesContext } from './DependenciesContext'

export function DependenciesProvider({ value, children }: { value: PlatformDependencies; children: ReactNode }) {
  return <DependenciesContext.Provider value={value}>{children}</DependenciesContext.Provider>
}

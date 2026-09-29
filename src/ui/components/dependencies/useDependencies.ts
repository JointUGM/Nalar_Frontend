import { useContext } from 'react'
import { DependenciesContext } from './DependenciesContext'

export function useDependencies() {
  const dependencies = useContext(DependenciesContext)
  if (!dependencies) throw new Error('DependenciesProvider is required')
  return dependencies
}

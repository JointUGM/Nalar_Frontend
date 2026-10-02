import { useContext } from 'react'
import { ParentContext } from './ParentContext'
import type { ParentContextValue } from './ParentContext'

export function useParentContext(): ParentContextValue {
  const value = useContext(ParentContext)
  if (!value) throw new Error('Parent pages must render inside ParentContextProvider')
  return value
}

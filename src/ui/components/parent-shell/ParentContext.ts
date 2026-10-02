import { createContext } from 'react'

export interface ParentChild {
  id: string
  name: string
  initials: string
  /** "8B · SMPN 5 Yogyakarta" */
  detail: string
  /** Class label shown beside the first name in the top bar. */
  klass: string
  tone: 'warm' | 'info'
}

/** How many children the signed-in parent has linked. A review scenario, not an account setting. */
export type LinkedChildren = 'two' | 'one' | 'none'

export interface ParentContextValue {
  linked: LinkedChildren
  setLinked: (value: LinkedChildren) => void
  linkedChildren: readonly ParentChild[]
  /** The child whose released summaries are shown; null when none is linked. */
  child: ParentChild | null
  selectChild: (id: string) => void
}

export const ParentContext = createContext<ParentContextValue | null>(null)

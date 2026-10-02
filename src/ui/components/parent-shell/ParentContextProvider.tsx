import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { ParentContext } from './ParentContext'
import type { ParentChild } from './ParentContext'

export function ParentContextProvider({ all, children }: { all: readonly ParentChild[]; children: ReactNode }) {
  const [selectedId, setSelectedId] = useState(all[0]?.id ?? '')
  const value = useMemo(() => ({
    linkedChildren: all,
    // A selection that is no longer linked falls back to the first child.
    child: all.find((item) => item.id === selectedId) ?? all[0] ?? null,
    selectChild: (id: string) => { if (all.some((item) => item.id === id)) setSelectedId(id) },
  }), [all, selectedId])
  return <ParentContext.Provider value={value}>{children}</ParentContext.Provider>
}

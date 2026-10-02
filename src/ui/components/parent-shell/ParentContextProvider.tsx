import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { ParentContext } from './ParentContext'
import type { LinkedChildren, ParentChild } from './ParentContext'

const visibleCount: Readonly<Record<LinkedChildren, number>> = { all: Infinity, two: 2, one: 1, none: 0 }

export function ParentContextProvider({ all, initialLinked = 'two', children }: { all: readonly ParentChild[]; initialLinked?: LinkedChildren; children: ReactNode }) {
  const [linked, setLinked] = useState<LinkedChildren>(initialLinked)
  const [selectedId, setSelectedId] = useState(all[0]?.id ?? '')
  const [weeklyEmail, setWeeklyEmail] = useState(true)
  const value = useMemo(() => {
    const visible = all.slice(0, visibleCount[linked])
    return {
      linked, setLinked, linkedChildren: visible, weeklyEmail, setWeeklyEmail,
      // A selection that is no longer linked falls back to the first child.
      child: visible.find((item) => item.id === selectedId) ?? visible[0] ?? null,
      selectChild: (id: string) => { if (all.some((item) => item.id === id)) setSelectedId(id) },
    }
  }, [all, linked, selectedId, weeklyEmail])
  return <ParentContext.Provider value={value}>{children}</ParentContext.Provider>
}

import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { TeacherContext } from './TeacherContext'

export function TeacherContextProvider({ schools, children }: { schools: readonly string[]; children: ReactNode }) {
  const [school, setSchool] = useState(schools[0])
  const [selection, setSelection] = useState(0)
  const [status, setStatus] = useState<'ready' | 'loading'>('ready')
  useEffect(() => {
    if (status !== 'loading') return
    const timer = setTimeout(() => setStatus('ready'), 500)
    return () => clearTimeout(timer)
  }, [status])
  const value = useMemo(() => ({
    school, selection, schools, status,
    changeSchool: (name: string) => {
      if (name === school || !schools.includes(name)) return
      setSchool(name); setSelection((count) => count + 1); setStatus('loading')
    },
  }), [school, selection, schools, status])
  return <TeacherContext.Provider value={value}>{children}</TeacherContext.Provider>
}

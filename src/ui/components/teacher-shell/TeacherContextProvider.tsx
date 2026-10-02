import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { TeacherContext } from './TeacherContext'

// With `current` and `onChange` the school comes from the caller (the signed-in teacher's path); without them it is local review state.
export function TeacherContextProvider({ schools, current, onChange, children }: { schools: readonly string[]; current?: string; onChange?: (name: string) => void; children: ReactNode }) {
  const [own, setSchool] = useState(schools[0])
  const school = current ?? own
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
      if (onChange) { onChange(name); return }
      setSchool(name); setSelection((count) => count + 1); setStatus('loading')
    },
  }), [school, selection, schools, status, onChange])
  return <TeacherContext.Provider value={value}>{children}</TeacherContext.Provider>
}

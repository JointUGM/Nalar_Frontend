import { useContext } from 'react'
import { TeacherContext } from './TeacherContext'
import type { TeacherContextValue } from './TeacherContext'

export function useTeacherContext(): TeacherContextValue {
  const value = useContext(TeacherContext)
  if (!value) throw new Error('Teacher pages must render inside TeacherContextProvider')
  return value
}

import { createContext } from 'react'

export interface TeacherContextValue {
  school: string
  /** increments on every school change so page state can reset even when the user returns to a previous school */
  selection: number
  schools: readonly string[]
  status: 'ready' | 'loading'
  changeSchool: (name: string) => void
}

export const TeacherContext = createContext<TeacherContextValue | null>(null)

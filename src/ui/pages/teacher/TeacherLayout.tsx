import { Outlet } from 'react-router'
import { TeacherContextProvider } from '@/ui/components/teacher-shell/TeacherContextProvider'
import { teacherSchools } from './teacherHomeExamples'

const schoolNames = teacherSchools.map((school) => school.name)

export function TeacherLayout() {
  return <TeacherContextProvider schools={schoolNames}><Outlet /></TeacherContextProvider>
}

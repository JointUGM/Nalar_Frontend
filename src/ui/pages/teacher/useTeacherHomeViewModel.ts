import { useState } from 'react'
import { useTeacherContext } from '@/ui/components/teacher-shell/useTeacherContext'
import { summarize, teacherSchools } from './teacherHomeExamples'

export function useTeacherHomeViewModel() {
  const { school: schoolName, selection, schools, status, changeSchool } = useTeacherContext()
  // the filter remembers which school selection it belongs to, so any school change resets it without an effect
  const [filter, setFilter] = useState({ selection, value: 'all' })
  const classFilter = filter.selection === selection ? filter.value : 'all'
  const school = teacherSchools.find((item) => item.name === schoolName) ?? teacherSchools[0]
  const scope = classFilter === 'all' ? school.classes : school.classes.filter((item) => item.name === classFilter)
  function changeClass(value: string) {
    if (value === 'all' || school.classes.some((item) => item.name === value)) setFilter({ selection, value })
  }
  return { school, schools, classFilter, status, scope: summarize(scope), total: summarize(school.classes), changeSchool, changeClass }
}

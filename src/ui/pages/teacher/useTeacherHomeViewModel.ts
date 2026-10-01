import { useEffect, useState } from 'react'
import { summarize, teacherSchools } from './teacherHomeExamples'

export function useTeacherHomeViewModel() {
  const [schoolName, setSchoolName] = useState(teacherSchools[0].name)
  const [classFilter, setClassFilter] = useState('all')
  const [status, setStatus] = useState<'ready' | 'loading'>('ready')
  useEffect(() => {
    if (status !== 'loading') return
    const timer = setTimeout(() => setStatus('ready'), 500)
    return () => clearTimeout(timer)
  }, [status])
  const school = teacherSchools.find((item) => item.name === schoolName) ?? teacherSchools[0]
  const scope = classFilter === 'all' ? school.classes : school.classes.filter((item) => item.name === classFilter)
  function changeSchool(name: string) {
    if (name === schoolName || !teacherSchools.some((item) => item.name === name)) return
    setSchoolName(name); setClassFilter('all'); setStatus('loading')
  }
  function changeClass(value: string) {
    if (value === 'all' || school.classes.some((item) => item.name === value)) setClassFilter(value)
  }
  return { school, schools: teacherSchools.map((item) => item.name), classFilter, status, scope: summarize(scope), total: summarize(school.classes), changeSchool, changeClass }
}

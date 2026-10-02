import { useState } from 'react'
import { reflections } from './studentExamples'

export type ReflectionsScenario = 'normal' | 'loading' | 'empty'
const fold = (text: string) => text.toLocaleLowerCase('id-ID')

export function useStudentReflectionsViewModel() {
  const [scenario, setScenario] = useState<ReflectionsScenario>('normal')
  const [query, setQuery] = useState('')
  const all = scenario === 'empty' ? [] : reflections
  const needle = fold(query.trim())
  const items = needle ? all.filter((item) => [item.title, item.topic, item.excerpt, item.question].some((text) => fold(text).includes(needle))) : all
  return { scenario, setScenario, query, setQuery, total: all.length, items }
}

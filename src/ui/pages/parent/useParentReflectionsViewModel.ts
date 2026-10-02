import { useState } from 'react'
import { useParentContext } from '@/ui/components/parent-shell/useParentContext'
import { reflections } from './parentExamples'

export type ReflectionsScenario = 'normal' | 'loading' | 'error'
const fold = (text: string) => text.toLocaleLowerCase('id-ID')

export function useParentReflectionsViewModel() {
  const { child } = useParentContext()
  const [scenario, setScenario] = useState<ReflectionsScenario>('normal')
  const [query, setQuery] = useState('')
  const all = child ? reflections[child.id] ?? [] : []
  const needle = fold(query.trim())
  const items = needle ? all.filter((item) => [item.title, item.subject, item.excerpt].some((text) => fold(text).includes(needle))) : all
  return { child, scenario, setScenario, query, setQuery, total: all.length, items, retry: () => setScenario('normal') }
}

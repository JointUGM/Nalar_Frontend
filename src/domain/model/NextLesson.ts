import type { ClassMap, ClassMapMisconception, MisconceptionTrail } from './Teacher'

export interface NextLessonGroup {
  item: ClassMapMisconception
  concept: string
  students: (ClassMapMisconception['students'][number] & { stillHolding: boolean })[]
}

export function nextLessonGroups(map: ClassMap, trail: MisconceptionTrail | null, publicationId: string): NextLessonGroup[] {
  const repeated = new Map(trail?.to.publication_id === publicationId
    ? trail.items.map(item => [item.misconception_id, new Set(item.students_still_holding.map(student => student.student_id))]) : [])
  const assigned = new Set<string>()
  return map.concepts.flatMap(concept => concept.misconceptions.filter(item => item.count > 0)
    .map(item => ({ item, concept: concept.name })))
    .sort((a, b) => b.item.count - a.item.count || (a.item.misconception_id < b.item.misconception_id ? -1 : a.item.misconception_id > b.item.misconception_id ? 1 : 0))
    .map(({ item, concept }) => ({ item, concept, students: item.students.flatMap(student => {
      if (assigned.has(student.student_id)) return []
      assigned.add(student.student_id)
      return [{ ...student, stillHolding: repeated.get(item.misconception_id)?.has(student.student_id) ?? false }]
    }) })).filter(group => group.students.length > 0)
}

// ponytail: one pilot threshold, not a research cut-off; the teacher still chooses. Tune after the pilot.
export const WHOLE_CLASS_SHARE = 0.5
export function suggestedMode(holders: number, denominator: number): 'whole_class' | 'small_group' {
  return denominator > 0 && holders / denominator >= WHOLE_CLASS_SHARE ? 'whole_class' : 'small_group'
}

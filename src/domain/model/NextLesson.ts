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

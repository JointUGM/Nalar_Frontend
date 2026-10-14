import { describe, expect, it } from 'vitest'
import type { ClassMap, ClassMapMisconception, MisconceptionTrail } from './Teacher'
import { nextLessonGroups } from './NextLesson'

const student = (id: string) => ({ student_id: id, name: id, session_id: `s-${id}` })
const item = (id: string, ids: string[]): ClassMapMisconception => ({
  misconception_id: id, statement: id, count: ids.length, resolved_count: 0,
  student_ids: ids, students: ids.map(student), correct_understanding: '',
  counter_examples: [], detection_cues: [], source: 'kb', citations: [],
})
const map = (items: ClassMapMisconception[]): ClassMap => ({
  denominator: 3, incomplete_count: 0, prerequisites: [], insight: null,
  concepts: [{ concept_id: 'c', name: 'Gaya', mastered_count: 0, developing_count: 0, not_observed_count: 0, misconceptions: items }],
})

describe('nextLessonGroups', () => {
  it('assigns overlapping students once using larger groups and stable ties', () => {
    const data = map([item('b', ['Ayu', 'Budi']), item('a', ['Ayu', 'Cici'])])
    const groups = nextLessonGroups(data, null, 'p')
    expect(groups.map(group => [group.item.misconception_id, group.students.map(s => s.name)])).toEqual([
      ['a', ['Ayu', 'Cici']], ['b', ['Budi']],
    ])
    expect(data.concepts[0].misconceptions[0].students).toHaveLength(2)
  })
  it('keeps new current holders while annotating the earlier cohort', () => {
    const trail: MisconceptionTrail = {
      to: { publication_id: 'p', mission_title: 'Misi', mission_version: 1, denominator: 2, class_name: '7A' },
      from: null, not_retested: [], items: [{
        concept_id: 'c', concept_name: 'Gaya', misconception_id: 'a', statement: 'a',
        held_count: 1, resolved_count: 0, resolved_breakdown: { mastered: 0, developing: 0, other_misconception: 0 },
        still_held_count: 1, not_observed_count: 0, students_still_holding: [student('Ayu')],
      }],
    }
    const data = map([item('a', ['Ayu', 'Budi'])])
    expect(nextLessonGroups(data, trail, 'p')[0].students.map(s => [s.name, s.stillHolding])).toEqual([['Ayu', true], ['Budi', false]])
    expect(nextLessonGroups(data, trail, 'other')[0].students.every(s => !s.stillHolding)).toBe(true)
  })
  it('does not create mastery or groups from empty observations', () => {
    expect(nextLessonGroups(map([]), null, 'p')).toEqual([])
  })
})
